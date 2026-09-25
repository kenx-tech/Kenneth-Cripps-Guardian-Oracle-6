import { bufferToHex } from "../identity/nodeIdentity";
import { MemoryBlock } from "../../../types/sovereign";

/**
 * Deterministically sorts object keys for canonical cryptographic serialization.
 */
export function canonicalJsonStringify(obj: any): string {
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalJsonStringify).join(",") + "]";
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `${JSON.stringify(k)}:${canonicalJsonStringify(obj[k])}`);
  return "{" + pairs.join(",") + "}";
}

/**
 * Computes the SHA-256 content address (IPFS CIDv1 style) of arbitrary payload bytes or objects.
 */
export async function computeContentAddress(data: any): Promise<string> {
  const serialized = typeof data === "string" ? data : canonicalJsonStringify(data);
  const buffer = new TextEncoder().encode(serialized);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", buffer);
  const hex = bufferToHex(digest);
  return `bafy2bzace${hex.slice(0, 32)}`;
}

/**
 * Recomputes the canonical CID of a memory block based strictly on its payload fields.
 */
export async function computeBlockCID(block: {
  data: any;
  authorNodeId: string;
  blockType: string;
  timestamp: string;
  previousCid: string | null;
}): Promise<string> {
  const canonicalPayload = {
    authorNodeId: block.authorNodeId,
    blockType: block.blockType,
    data: block.data,
    previousCid: block.previousCid,
    timestamp: block.timestamp
  };
  return computeContentAddress(canonicalPayload);
}

/**
 * Verifies that the claimed CID of an immutable block exactly matches the recomputed SHA-256 of its bytes.
 */
export async function verifyBlockCID(block: MemoryBlock): Promise<{
  valid: boolean;
  recomputedCid?: string;
  error?: string;
}> {
  if (!block || !block.cid) {
    return { valid: false, error: "Missing block or CID" };
  }

  // Genesis blocks are recognized architectural seeds
  if (block.cid.startsWith("bafy2bzace_genesis")) {
    return { valid: true, recomputedCid: block.cid };
  }

  try {
    const recomputedCid = await computeBlockCID({
      data: block.data,
      authorNodeId: block.authorNodeId,
      blockType: block.blockType,
      timestamp: block.timestamp,
      previousCid: block.previousCid
    });

    if (recomputedCid !== block.cid) {
      return {
        valid: false,
        recomputedCid,
        error: `CID mismatch: claimed '${block.cid}' != recomputed '${recomputedCid}'`
      };
    }

    return { valid: true, recomputedCid };
  } catch (err: any) {
    return { valid: false, error: `CID computation error: ${err.message}` };
  }
}

/**
 * Computes Merkle Root across an array of content identifiers.
 */
export async function computeMerkleRoot(cids: string[]): Promise<string> {
  if (cids.length === 0) return "bafy2bzace00000000000000000000000000000000";
  if (cids.length === 1) return cids[0];

  let currentLevel = [...cids];
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = left + right;
      const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(combined));
      nextLevel.push(`bafy2bzace${bufferToHex(digest).slice(0, 32)}`);
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}
