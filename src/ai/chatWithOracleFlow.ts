import { routeInference } from "../lib/sovereign/inference/inferenceRouter";
import { probeHardware } from "../lib/sovereign/inference/resourceProbe";
import { InferencePromptPayload } from "../types/sovereign";

export async function chatWithOracleFlow(
  userMessage: string,
  options?: {
    model?: string;
    onToken?: (token: string) => void;
    preferredTier?: any;
    paradigm?: string;
  }
) {
  const hardware = await probeHardware();
  const payload: InferencePromptPayload = {
    prompt: userMessage,
    model: options?.model || "gnosis-nano-0.5b",
    paradigm: options?.paradigm || "Gnostic Cybernetics",
    temperature: 0.8
  };

  return await routeInference(payload, hardware, options?.preferredTier, options?.onToken);
}
