import { HardwareProfile, NodeExecutionTier } from "../../types/sovereign";

export type PlacementStrategy = "PRIVACY_FIRST" | "LOWEST_LATENCY" | "MAX_THROUGHPUT" | "AIR_GAPPED";

export function determineOptimalTier(
  strategy: PlacementStrategy,
  hardware: HardwareProfile,
  modelRequested: string
): NodeExecutionTier {
  if (strategy === "AIR_GAPPED" || strategy === "PRIVACY_FIRST") {
    if (hardware.hasWebGpu) return "LOCAL_WEBGPU";
    return "LOCAL_WASM";
  }

  if (strategy === "LOWEST_LATENCY") {
    if (hardware.hasWebGpu) return "LOCAL_WEBGPU";
    return "EDGE_CLOUD";
  }

  // MAX_THROUGHPUT
  return "EDGE_CLOUD";
}
