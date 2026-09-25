import { InferenceRouteDecision, NodeExecutionTier } from "../types/sovereign";

type Listener = () => void;

export interface InferenceLogEntry {
  id: string;
  prompt: string;
  response: string;
  tier: NodeExecutionTier;
  durationMs: number;
  tokensPerSec: number;
  timestamp: string;
  verifiableHash: string;
}

interface InferenceState {
  isRunning: boolean;
  activeTier: NodeExecutionTier | null;
  preferredTier: NodeExecutionTier;
  selectedModel: string;
  lastDecision: InferenceRouteDecision | null;
  history: InferenceLogEntry[];
  currentTokens: string;
}

class InferenceStore {
  private state: InferenceState = {
    isRunning: false,
    activeTier: null,
    preferredTier: "LOCAL_WEBGPU",
    selectedModel: "gnosis-nano-0.5b",
    lastDecision: null,
    history: [],
    currentTokens: ""
  };

  private listeners = new Set<Listener>();

  getState(): InferenceState {
    return this.state;
  }

  setState(partial: Partial<InferenceState>): void {
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

export const inferenceStore = new InferenceStore();
