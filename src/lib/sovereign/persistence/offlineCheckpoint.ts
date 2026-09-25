import { memoryLedger } from "../memory/memoryLedger";
import { nodeRegistry } from "../mesh/nodeRegistry";

export interface SovereignCheckpoint {
  format: "GUARDIAN_CHECKPOINT_V1";
  exportedAt: string;
  network: string;
  blocks: any[];
  knownNodes: any[];
  checksum: string;
}

export async function exportCheckpoint(): Promise<string> {
  const blocks = memoryLedger.getBlocks();
  const knownNodes = nodeRegistry.getAllNodes();

  const checkpoint: SovereignCheckpoint = {
    format: "GUARDIAN_CHECKPOINT_V1",
    exportedAt: new Date().toISOString(),
    network: "guardian-qmesh-mainnet",
    blocks,
    knownNodes,
    checksum: `chk_${Date.now()}`
  };

  return JSON.stringify(checkpoint, null, 2);
}

export function importCheckpoint(jsonString: string): { success: boolean; blockCount: number; error?: string } {
  try {
    const data: SovereignCheckpoint = JSON.parse(jsonString);
    if (data.format !== "GUARDIAN_CHECKPOINT_V1") {
      return { success: false, blockCount: 0, error: "Invalid checkpoint format" };
    }

    if (Array.isArray(data.knownNodes)) {
      data.knownNodes.forEach(n => nodeRegistry.upsertNode(n));
    }

    return { success: true, blockCount: data.blocks?.length || 0 };
  } catch (err: any) {
    return { success: false, blockCount: 0, error: err.message };
  }
}
