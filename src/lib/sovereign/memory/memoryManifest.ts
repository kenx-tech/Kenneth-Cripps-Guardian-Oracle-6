import { MemoryManifest, MemoryBlock } from "../../../types/sovereign";
import { computeMerkleRoot } from "./contentAddress";

export async function createMemoryManifest(
  blocks: MemoryBlock[],
  validatorNodes: string[] = []
): Promise<MemoryManifest> {
  const cids = blocks.map(b => b.cid);
  const rootCid = await computeMerkleRoot(cids);

  return {
    manifestVersion: "1.0.0",
    rootCid,
    totalBlocks: blocks.length,
    lastUpdated: new Date().toISOString(),
    validatorNodes,
    partitionEpoch: 1,
    integrityHash: rootCid.slice(0, 16)
  };
}
