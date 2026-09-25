import { QMeshPartitionState, MemoryBlock } from "../../../types/sovereign";

export class PartitionRecoveryEngine {
  private state: QMeshPartitionState = {
    isPartitioned: false,
    partitionGroupId: "group-main-alpha",
    localClock: 1,
    peerVectorClocks: {
      "urn:guardian:node:apex-kenx": 1,
      "urn:guardian:node:austin-01": 1
    },
    unreplicatedBlocks: 0,
    conflictCount: 0
  };

  getState(): QMeshPartitionState {
    return { ...this.state };
  }

  simulatePartition(partitioned: boolean): QMeshPartitionState {
    this.state.isPartitioned = partitioned;
    if (partitioned) {
      this.state.partitionGroupId = `island-${Math.random().toString(36).substring(2, 6)}`;
    } else {
      this.state.partitionGroupId = "group-main-alpha";
      this.state.lastPartitionHealTimestamp = new Date().toISOString();
      // Reconcile clocks
      this.state.localClock += 1;
      this.state.unreplicatedBlocks = 0;
      this.state.conflictCount = 0;
    }
    return this.getState();
  }

  recordLocalWrite(): void {
    this.state.localClock += 1;
    if (this.state.isPartitioned) {
      this.state.unreplicatedBlocks += 1;
    }
  }

  reconcileBlocks(localBlocks: MemoryBlock[], remoteBlocks: MemoryBlock[]): MemoryBlock[] {
    const map = new Map<string, MemoryBlock>();
    // Add local blocks
    localBlocks.forEach(b => map.set(b.cid, b));
    // Merge remote blocks (content-addressing makes deduplication trivial)
    remoteBlocks.forEach(b => {
      if (!map.has(b.cid)) {
        map.set(b.cid, b);
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    this.state.unreplicatedBlocks = 0;
    this.state.lastPartitionHealTimestamp = new Date().toISOString();

    return merged;
  }
}

export const partitionRecoveryEngine = new PartitionRecoveryEngine();
