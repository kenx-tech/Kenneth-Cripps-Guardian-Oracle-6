export interface ModelSpec {
  id: string;
  name: string;
  minTops: number;
  minMemoryGb: number;
  requiresWebGpu: boolean;
  contextWindow: number;
  tier: "LOCAL_WEBGPU" | "LOCAL_WASM" | "EDGE_CLOUD" | "SACRED_FALLBACK";
}

export const SOVEREIGN_MODELS: Record<string, ModelSpec> = {
  "gnosis-nano-0.5b": {
    id: "gnosis-nano-0.5b",
    name: "Gnosis Nano 432Hz (WebGPU)",
    minTops: 4,
    minMemoryGb: 4,
    requiresWebGpu: true,
    contextWindow: 4096,
    tier: "LOCAL_WEBGPU"
  },
  "lucifera-core-1.5b": {
    id: "lucifera-core-1.5b",
    name: "Lucifera Mother Core (WASM/GPU)",
    minTops: 6,
    minMemoryGb: 8,
    requiresWebGpu: false,
    contextWindow: 8192,
    tier: "LOCAL_WASM"
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Cloud Edge Gemini 2.5 Flash",
    minTops: 0,
    minMemoryGb: 1,
    requiresWebGpu: false,
    contextWindow: 1048576,
    tier: "EDGE_CLOUD"
  },
  "sacred-gnostic-fallback": {
    id: "sacred-gnostic-fallback",
    name: "Sacred Gnostic Deterministic Fallback",
    minTops: 0,
    minMemoryGb: 0.5,
    requiresWebGpu: false,
    contextWindow: 2048,
    tier: "SACRED_FALLBACK"
  }
};
