import { memoryLedger } from "../../../../../lib/sovereign/memory/memoryLedger";
import { computeMerkleRoot, verifyBlockCID } from "../../../../../lib/sovereign/memory/contentAddress";
import { MemoryBlock } from "../../../../../types/sovereign";
import { extractBearerToken } from "../../../../../lib/sovereign/auth/serverAuth";
import { persistMemoryBlockToFirestoreAuth, fetchMemoryBlocksFromFirestoreAuth } from "../../../../../lib/sovereign/persistence/firestoreAuthoritative";

export async function handleMemorySyncRoute(req: any, res: any) {
  const authToken = extractBearerToken(req) || undefined;

  if (req.method === "GET") {
    // Reconcile with authoritative Firestore memory if available
    const authoritativeBlocks = await fetchMemoryBlocksFromFirestoreAuth(authToken);
    const blocks = authoritativeBlocks.length > 0 ? authoritativeBlocks : memoryLedger.getBlocks();
    const cids = blocks.map(b => b.cid);
    const merkleRoot = await computeMerkleRoot(cids);

    return res.json({
      status: "success",
      totalBlocks: blocks.length,
      merkleRoot,
      blocks
    });
  }

  if (req.method === "POST") {
    const { blocks } = req.body || {};
    if (!Array.isArray(blocks)) {
      return res.status(400).json({ error: "Invalid payload: 'blocks' array expected" });
    }

    const currentBlocks = memoryLedger.getBlocks();
    const existingCidSet = new Set(currentBlocks.map(b => b.cid));
    let addedCount = 0;

    for (const b of blocks as MemoryBlock[]) {
      // 1. Constrain required fields
      if (!b.cid || !b.authorNodeId || !b.blockType || b.data === undefined || !b.timestamp) {
        return res.status(400).json({
          error: "Immutable block validation failed: Missing required fields (cid, authorNodeId, blockType, data, timestamp)",
          badCid: b.cid || "unknown"
        });
      }

      // 2. Constrain size and structure
      const serialized = JSON.stringify(b);
      if (serialized.length > 1024 * 1024) {
        return res.status(400).json({
          error: "Immutable block validation failed: Block size exceeds 1MB limit",
          badCid: b.cid
        });
      }

      // 3. Cryptographic CID validation: Recompute SHA-256 and reject if mismatch
      const verification = await verifyBlockCID(b);
      if (!verification.valid) {
        return res.status(400).json({
          error: `Immutable block validation failed: Claimed CID does not match recomputed content address of payload bytes (${verification.error})`,
          badCid: b.cid,
          recomputedCid: verification.recomputedCid
        });
      }

      if (!existingCidSet.has(b.cid)) {
        currentBlocks.push(b);
        existingCidSet.add(b.cid);
        addedCount++;

        // Persist to authoritative Firestore ledger
        await persistMemoryBlockToFirestoreAuth(b, authToken);
      }
    }

    const allCids = currentBlocks.map(b => b.cid);
    const merkleRoot = await computeMerkleRoot(allCids);

    return res.json({
      status: "synced",
      receivedCount: blocks.length,
      addedCount,
      totalBlocks: currentBlocks.length,
      merkleRoot
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
