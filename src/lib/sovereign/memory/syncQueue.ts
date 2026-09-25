import { MemoryBlock } from "../../../types/sovereign";
import { replicateBlocksToPeers } from "./replication";
import { SOVEREIGN_CONFIG } from "../config";

export class SyncQueue {
  private queue: MemoryBlock[] = [];

  constructor() {
    this.loadQueue();
  }

  private loadQueue(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(SOVEREIGN_CONFIG.STORAGE_KEYS.OFFLINE_QUEUE);
      if (saved) {
        try {
          this.queue = JSON.parse(saved);
        } catch {}
      }
    }
  }

  private persistQueue(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(SOVEREIGN_CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.queue));
    }
  }

  enqueue(block: MemoryBlock): void {
    this.queue.push(block);
    this.persistQueue();
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  async flush(): Promise<number> {
    if (this.queue.length === 0) return 0;
    const toSync = [...this.queue];

    try {
      await replicateBlocksToPeers(toSync);
      this.queue = [];
      this.persistQueue();
      return toSync.length;
    } catch {
      return 0;
    }
  }
}

export const syncQueue = new SyncQueue();
