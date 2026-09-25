import { SovereignNodeRecord, QMeshPartitionState } from "../types/sovereign";

type Listener = () => void;

interface MeshState {
  peers: SovereignNodeRecord[];
  partitionState: QMeshPartitionState;
  lastHeartbeatTick: string | null;
  selectedNodeId: string | null;
  totalNetworkThroughput: number;
}

class MeshStore {
  private state: MeshState = {
    peers: [],
    partitionState: {
      isPartitioned: false,
      partitionGroupId: "group-main-alpha",
      localClock: 1,
      peerVectorClocks: {},
      unreplicatedBlocks: 0,
      conflictCount: 0
    },
    lastHeartbeatTick: null,
    selectedNodeId: null,
    totalNetworkThroughput: 84.5
  };

  private listeners = new Set<Listener>();

  getState(): MeshState {
    return this.state;
  }

  setState(partial: Partial<MeshState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }
}

export const meshStore = new MeshStore();
