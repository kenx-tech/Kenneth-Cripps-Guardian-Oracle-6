import { nodeRegistry } from "../../../../../lib/sovereign/mesh/nodeRegistry";
import { verifyMessage } from "../../../../../lib/sovereign/identity/signatures";
import { SovereignNodeRecord } from "../../../../../types/sovereign";
import { requireAuth, extractBearerToken } from "../../../../../lib/sovereign/auth/serverAuth";
import { persistNodeToFirestoreAuth, fetchNodesFromFirestoreAuth, sovereignJournal } from "../../../../../lib/sovereign/persistence/firestoreAuthoritative";

export async function handleRegisterRoute(req: any, res: any) {
  const authToken = extractBearerToken(req) || undefined;

  if (req.method === "GET") {
    // Reconcile with authoritative Firestore nodes
    const authoritativeNodes = await fetchNodesFromFirestoreAuth(authToken);
    const nodes = authoritativeNodes.length > 0 ? authoritativeNodes : nodeRegistry.getAllNodes();
    return res.json({
      status: "success",
      count: nodes.length,
      nodes
    });
  }

  if (req.method === "POST") {
    // 1. API Authentication: Verify Firebase ID token server-side
    const authUser = await requireAuth(req, res);
    if (!authUser) {
      return; // requireAuth has already sent 401
    }

    const node = ((req.body && req.body.node) ? req.body.node : req.body) as Partial<SovereignNodeRecord>;
    if (!node || !node.id) {
      return res.status(400).json({ error: "Invalid node payload: Missing node.id" });
    }

    if (!node.id.startsWith("urn:guardian:node:")) {
      return res.status(400).json({ error: "Invalid Node URN. Must match 'urn:guardian:node:*'" });
    }

    if (!node.identity || !node.identity.publicKey) {
      return res.status(400).json({ error: "Cryptographic identity rejected: Missing public key" });
    }

    // 2. Cryptographic signature proof of private key possession
    const registeredAt = node.identity.registeredAt || new Date().toISOString();
    if (!node.identity.signatureProof) {
      return res.status(401).json({ error: "Cryptographic identity rejected: Missing signature proof of private key" });
    }

    const challengeMsg = `NODE_REGISTRATION:${node.id}:${registeredAt}`;
    const isValid = await verifyMessage(node.identity.publicKey, challengeMsg, node.identity.signatureProof);
    if (!isValid) {
      return res.status(401).json({ error: "Signature verification failed for node registration" });
    }

    // 3. Ownership check: derive strictly from verified token, never accept ownerUid from body
    const existingNode = nodeRegistry.getNode(node.id) || sovereignJournal.getNode(node.id);
    if (existingNode && (existingNode as any).ownerUid) {
      const isOwner = (existingNode as any).ownerUid === authUser.uid;
      if (!isOwner && !authUser.isSuperAdmin) {
        return res.status(403).json({ error: "Unauthorized node mutation: Node is registered to another UID" });
      }
    }

    const fullNodeRecord: SovereignNodeRecord = {
      id: node.id,
      ownerUid: authUser.uid,
      ownerEmail: authUser.email,
      identity: {
        nodeId: node.id,
        fingerprint: node.identity.fingerprint || node.id.slice(-16),
        publicKey: node.identity.publicKey,
        algorithm: node.identity.algorithm || "ECDSA-P256",
        registeredAt,
        name: node.identity.name || "Sovereign Node",
        role: authUser.isSuperAdmin ? "LEADER" : (node.identity.role || "WORKER"),
        authorityScopes: authUser.isSuperAdmin 
          ? ["ROOT_ADMIN", "MESH_OPERATOR", "INFERENCE_WORKER", "MEMORY_VALIDATOR", "TASK_DISPATCHER", "SACRED_WITNESS"]
          : (node.identity.authorityScopes || ["INFERENCE_WORKER"]),
        signatureProof: node.identity.signatureProof
      },
      hardware: node.hardware || {
        cpuCores: 4,
        memoryGb: 8,
        hasWebGpu: false,
        hasWasmSimd: true,
        platform: "Web-Agent",
        maxLocalBatchSize: 1,
        estimatedTops: 2
      },
      capabilities: node.capabilities || {
        supportedModels: ["sacred-gnostic-fallback"],
        maxContextTokens: 4096,
        quantizations: ["q4_k_m"],
        canValidateLedger: true,
        canHostMemoryShard: true,
        maxConcurrentTasks: 2,
        isAirGappedCapable: true
      },
      status: "ONLINE",
      lastHeartbeat: new Date().toISOString(),
      uptimeSeconds: 0,
      activeTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageLatencyMs: 25,
      trustScore: authUser.isSuperAdmin ? 100 : (node.trustScore ?? 95),
      version: "0.9.4",
      partitionEpoch: 1
    };

    // Update in-memory registry
    nodeRegistry.upsertNode(fullNodeRecord);

    // Persist to authoritative Firestore cloud registry
    await persistNodeToFirestoreAuth(fullNodeRecord, authToken);

    return res.json({
      status: "registered",
      nodeId: node.id,
      ownerUid: authUser.uid,
      network: "guardian-qmesh-omega",
      grantedScopes: fullNodeRecord.identity.authorityScopes,
      registeredAt: fullNodeRecord.identity.registeredAt
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
