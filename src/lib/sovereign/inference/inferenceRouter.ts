import { 
  InferencePromptPayload, 
  InferenceRouteDecision, 
  InferenceRouteHop, 
  NodeExecutionTier, 
  HardwareProfile 
} from "../../../types/sovereign";
import { inferenceCache } from "./inferenceCache";
import { runLocalInference } from "./localInference";
import { runRemoteInference } from "./remoteInference";
import { bufferToHex } from "../identity/nodeIdentity";
import { controlPlaneEngine } from "../controlplane/controlPlaneEngine";

export interface RouteExecutionResult {
  text: string;
  decision: InferenceRouteDecision;
}

export async function routeInference(
  payload: InferencePromptPayload,
  hardware: HardwareProfile,
  preferredTier?: NodeExecutionTier,
  onToken?: (token: string) => void
): Promise<RouteExecutionResult> {
  const startTime = performance.now();
  const hops: InferenceRouteHop[] = [];
  const reqId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Check cache first
  const cached = inferenceCache.get(payload.prompt, payload.model, payload.systemInstruction);
  if (cached) {
    hops.push({
      tier: cached.tier as NodeExecutionTier,
      latencyMs: 1,
      status: "SELECTED",
      reason: "Inference cache hit (zero compute)"
    });
    if (onToken) onToken(cached.response);
    return {
      text: cached.response,
      decision: {
        requestId: reqId,
        selectedTier: cached.tier as NodeExecutionTier,
        hops,
        totalLatencyMs: 1,
        modelUsed: cached.model,
        fallbackEngaged: false,
        verifiableHash: "cache_hit"
      }
    };
  }

  // Determine optimal route
  const forceLocal = preferredTier === "LOCAL_WEBGPU" || preferredTier === "LOCAL_WASM";
  const forceCloud = preferredTier === "EDGE_CLOUD";

  // Tier 1: Local on-device execution
  if (!forceCloud && (forceLocal || hardware.hasWebGpu || payload.model.includes("nano") || payload.model.includes("lucifera"))) {
    hops.push({
      tier: hardware.hasWebGpu ? "LOCAL_WEBGPU" : "LOCAL_WASM",
      latencyMs: 5,
      status: "SELECTED",
      reason: hardware.hasWebGpu ? "WebGPU hardware acceleration engaged" : "WASM local thread engaged"
    });

    try {
      const localResult = await runLocalInference(payload, onToken, hardware.hasWebGpu);
      inferenceCache.set(payload.prompt, payload.model, payload.systemInstruction, localResult.text, localResult.tierUsed);

      const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(localResult.text));
      const verifiableHash = bufferToHex(digest).slice(0, 16);

      // Register with Update 003 Control-Plane Execution Planner
      controlPlaneEngine.createExecutionPlanContract({
        taskId: reqId,
        taskPrompt: payload.prompt,
        preferredModel: payload.model,
        targetTier: localResult.tierUsed,
        precision: "BF16",
        runtime: localResult.tierUsed === "LOCAL_WEBGPU" ? "WebGPU" : "WASM_SIMD",
        sloLatencyMs: 350
      }).catch(() => {});

      return {
        text: localResult.text,
        decision: {
          requestId: reqId,
          selectedTier: localResult.tierUsed,
          hops,
          totalLatencyMs: Math.round(performance.now() - startTime),
          modelUsed: payload.model,
          fallbackEngaged: false,
          verifiableHash
        }
      };
    } catch (err: any) {
      hops[hops.length - 1].status = "FALLBACK";
      hops[hops.length - 1].reason = `Local execution error: ${err.message}`;
    }
  } else {
    hops.push({
      tier: "LOCAL_WEBGPU",
      latencyMs: 2,
      status: "BYPASS",
      reason: forceCloud ? "Bypassed by user preference (Edge Cloud requested)" : "Hardware below threshold for local model"
    });
  }

  // Tier 2: Remote / Edge Cloud execution
  hops.push({
    tier: "EDGE_CLOUD",
    latencyMs: 25,
    status: "SELECTED",
    reason: "Routed to Guardian Oracle Edge Gateway"
  });

  const remoteResult = await runRemoteInference(payload);
  if (onToken) onToken(remoteResult.text);

  inferenceCache.set(payload.prompt, payload.model, payload.systemInstruction, remoteResult.text, remoteResult.tier);

  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(remoteResult.text));
  const verifiableHash = bufferToHex(digest).slice(0, 16);

  return {
    text: remoteResult.text,
    decision: {
      requestId: reqId,
      selectedTier: remoteResult.tier,
      hops,
      totalLatencyMs: Math.round(performance.now() - startTime),
      modelUsed: payload.model,
      fallbackEngaged: remoteResult.tier === "SACRED_FALLBACK",
      verifiableHash
    }
  };
}
