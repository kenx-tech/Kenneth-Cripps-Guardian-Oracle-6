import { routeInference } from "../../lib/sovereign/inference/inferenceRouter";
import { probeHardware } from "../../lib/sovereign/inference/resourceProbe";
import { InferencePromptPayload, NodeExecutionTier } from "../../types/sovereign";

export async function executeSovereignInference(
  payload: InferencePromptPayload,
  preferredTier?: NodeExecutionTier,
  onToken?: (token: string) => void
) {
  const hw = await probeHardware();
  return await routeInference(payload, hw, preferredTier, onToken);
}
