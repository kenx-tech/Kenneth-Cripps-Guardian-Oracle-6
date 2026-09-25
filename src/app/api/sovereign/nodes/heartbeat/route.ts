import { nodeRegistry } from "../../../../../lib/sovereign/mesh/nodeRegistry";
import { verifyMessage } from "../../../../../lib/sovereign/identity/signatures";
import { extractBearerToken } from "../../../../../lib/sovereign/auth/serverAuth";
import { sovereignJournal, persistNodeToFirestoreAuth } from "../../../../../lib/sovereign/persistence/firestoreAuthoritative";

// Nonce cache for replay attack mitigation (nonce -> expiration timestamp)
const seenNonces = new Map<string, number>();

setInterval(() => {
  const now = Date.now();
  for (const [nonce, expiresAt] of seenNonces.entries()) {
    if (expiresAt <= now) {
      seenNonces.delete(nonce);
    }
  }
}, 60000);

export async function handleHeartbeatRoute(req: any, res: any) {
  const { nodeId, timestamp, nonce, signature, status } = req.body || {};
  const authToken = extractBearerToken(req) || undefined;

  // 1. Mandatory parameter validation
  if (!nodeId) {
    return res.status(400).json({ error: "Heartbeat rejected: Missing nodeId" });
  }

  if (!timestamp) {
    return res.status(400).json({ error: "Heartbeat rejected: Missing timestamp" });
  }

  if (!nonce) {
    return res.status(400).json({ error: "Heartbeat rejected: Cryptographic nonce required for freshness" });
  }

  if (!signature) {
    return res.status(401).json({ error: "Heartbeat rejected: Cryptographic signature required" });
  }

  // 2. Anti-replay nonce freshness check
  if (seenNonces.has(nonce)) {
    return res.status(400).json({ error: "Heartbeat rejected: Nonce replay detected" });
  }

  // 3. Timestamp drift window check (5 minutes)
  const tsTime = new Date(timestamp).getTime();
  const now = Date.now();
  if (isNaN(tsTime) || Math.abs(now - tsTime) > 300000) {
    return res.status(400).json({ error: "Heartbeat rejected: Timestamp out of synchronization window (>5m)" });
  }

  // Record nonce with 10 minute expiry
  seenNonces.set(nonce, now + 600000);

  // 4. Verify node existence in authoritative registry
  let existingNode = nodeRegistry.getNode(nodeId) || sovereignJournal.getNode(nodeId);
  if (!existingNode) {
    return res.status(404).json({
      error: "Node not recognized in mesh registry. Must register via /api/sovereign/nodes/register first."
    });
  }

  // 5. Cryptographic signature verification against registered public key
  const publicKey = existingNode.identity?.publicKey;
  if (!publicKey) {
    return res.status(400).json({
      error: "Node registration has no cryptographic public key to verify heartbeat"
    });
  }

  const heartbeatMessage = `HEARTBEAT:${nodeId}:${timestamp}:${nonce}`;
  const isValid = await verifyMessage(publicKey, heartbeatMessage, signature);
  if (!isValid) {
    return res.status(401).json({
      error: "Heartbeat signature verification failed against registered node public key"
    });
  }

  // 6. Record heartbeat & update telemetry
  nodeRegistry.recordHeartbeat(nodeId);
  if (status) {
    nodeRegistry.updateStatus(nodeId, status);
  }

  // Update existingNode object with latest heartbeat
  existingNode.lastHeartbeat = timestamp;
  if (status) {
    existingNode.status = status;
  }

  // Persist to authoritative Firestore ledger
  await persistNodeToFirestoreAuth(existingNode, authToken);

  return res.json({
    status: "acknowledged",
    nodeId,
    nonce,
    verifiedWithKey: publicKey.slice(0, 16) + "...",
    receivedAt: new Date().toISOString(),
    networkStatus: "CONSENSUS_HEALTHY",
    trustScore: existingNode.trustScore || 100,
    activePeers: nodeRegistry.getAllNodes().filter(n => n.status === "ONLINE").length
  });
}
