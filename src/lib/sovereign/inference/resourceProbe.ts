import { HardwareProfile, NodeCapabilities } from "../../../types/sovereign";

export async function probeHardware(): Promise<HardwareProfile> {
  const isBrowser = typeof window !== "undefined";
  const nav = isBrowser ? (navigator as any) : {};

  let hasWebGpu = false;
  let gpuRenderer: string | undefined = undefined;

  if (isBrowser && "gpu" in nav && nav.gpu) {
    try {
      const adapter = await nav.gpu.requestAdapter();
      if (adapter) {
        hasWebGpu = true;
        const info = await adapter.requestAdapterInfo?.().catch(() => null);
        gpuRenderer = info?.description || info?.vendor || "WebGPU Compatible Accelerator";
      }
    } catch (e) {
      console.warn("WebGPU probe error:", e);
    }
  }

  // Check WebAssembly SIMD capability
  let hasWasmSimd = false;
  try {
    hasWasmSimd = typeof WebAssembly !== "undefined" && 
      WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 26, 11]));
  } catch {
    hasWasmSimd = false;
  }

  const cpuCores = isBrowser ? (nav.hardwareConcurrency || 4) : 8;
  const memoryGb = isBrowser ? (nav.deviceMemory || 8) : 16;
  const estimatedTops = hasWebGpu ? Math.max(6, cpuCores * 1.5) : Math.max(1.5, cpuCores * 0.4);

  return {
    cpuCores,
    memoryGb,
    hasWebGpu,
    gpuRenderer,
    hasWasmSimd,
    platform: isBrowser ? (nav.userAgentData?.platform || nav.platform || "Browser") : "NodeJS Server",
    maxLocalBatchSize: hasWebGpu ? 4 : 1,
    estimatedTops
  };
}

export function evaluateCapabilities(hardware: HardwareProfile): NodeCapabilities {
  const supportedModels: string[] = ["sacred-gnostic-fallback"];

  if (hardware.hasWasmSimd) {
    supportedModels.push("lucifera-core-1.5b");
  }

  if (hardware.hasWebGpu && hardware.memoryGb >= 4) {
    supportedModels.push("gnosis-nano-0.5b");
    supportedModels.push("qmesh-embed-v1");
  }

  supportedModels.push("gemini-2.5-flash");

  return {
    supportedModels,
    maxContextTokens: hardware.hasWebGpu ? 8192 : 2048,
    quantizations: hardware.hasWebGpu ? ["f16", "q4_k_m", "q8_0"] : ["q4_k_m"],
    canValidateLedger: hardware.cpuCores >= 2,
    canHostMemoryShard: hardware.memoryGb >= 4,
    maxConcurrentTasks: Math.max(1, Math.floor(hardware.cpuCores / 2)),
    isAirGappedCapable: true
  };
}
