import { MemoryBlock } from "../../../types/sovereign";
import { memoryLedger } from "./memoryLedger";

export interface SyncResponse {
  receivedCount: number;
  syncedCids: string[];
  merkleRoot: string;
}

export async function replicateBlocksToPeers(
  blocks: MemoryBlock[]
): Promise<SyncResponse> {
  try {
    const res = await fetch("/api/sovereign/memory/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        receivedCount: data.receivedCount || blocks.length,
        syncedCids: blocks.map(b => b.cid),
        merkleRoot: data.merkleRoot || "bafy2bzace_replicated_root"
      };
    }
  } catch (err) {
    console.warn("Replication network sync deferred (offline):", err);
  }

  return {
    receivedCount: blocks.length,
    syncedCids: blocks.map(b => b.cid),
    merkleRoot: blocks[blocks.length - 1]?.merkleRoot || "bafy2bzace_offline_root"
  };
}

export async function fetchRemoteMemoryBlocks(): Promise<MemoryBlock[]> {
  try {
    const res = await fetch("/api/sovereign/memory/sync", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.blocks)) {
        return data.blocks;
      }
    }
  } catch {
    // Offline mode
  }
  return memoryLedger.getBlocks();
}
