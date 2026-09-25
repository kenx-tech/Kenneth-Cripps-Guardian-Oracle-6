import { SovereignNodeIdentity, HardwareProfile, NodeCapabilities } from "../types/sovereign";

type Listener = () => void;

interface SovereignState {
  identity: SovereignNodeIdentity | null;
  hardware: HardwareProfile | null;
  capabilities: NodeCapabilities | null;
  isInitializing: boolean;
  isAirGapped: boolean;
  lastError: string | null;
}

class SovereignStore {
  private state: SovereignState = {
    identity: null,
    hardware: null,
    capabilities: null,
    isInitializing: false,
    isAirGapped: false,
    lastError: null
  };

  private listeners = new Set<Listener>();

  getState(): SovereignState {
    return this.state;
  }

  setState(partial: Partial<SovereignState>): void {
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

export const sovereignStore = new SovereignStore();
