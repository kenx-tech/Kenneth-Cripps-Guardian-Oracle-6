import { routeInference } from "../../src/lib/sovereign/inference/inferenceRouter";
import { HardwareProfile } from "../../src/types/sovereign";

export async function runInferenceRouterTest() {
  const mockHw: HardwareProfile = {
    cpuCores: 8,
    memoryGb: 16,
    hasWebGpu: true,
    hasWasmSimd: true,
    platform: "TestPlatform",
    maxLocalBatchSize: 4,
    estimatedTops: 12
  };

  const res = await routeInference(
    { prompt: "Test routing intent", model: "gnosis-nano-0.5b" },
    mockHw
  );

  return res.decision.selectedTier === "LOCAL_WEBGPU" && res.text.length > 0;
}
