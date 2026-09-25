import { useEffect, useState } from "react";
import { inferenceStore, InferenceLogEntry } from "../stores/inferenceStore";
import { sovereignStore } from "../stores/sovereignStore";
import { executeSovereignInference } from "../ai/sovereign/sovereignRouter";
import { NodeExecutionTier } from "../types/sovereign";

export function useInferenceRouter() {
  const [state, setState] = useState(inferenceStore.getState());

  useEffect(() => {
    return inferenceStore.subscribe(() => {
      setState(inferenceStore.getState());
    });
  }, []);

  const runPrompt = async (promptText: string, modelOverride?: string) => {
    const hw = sovereignStore.getState().hardware;
    if (!hw) return;

    inferenceStore.setState({
      isRunning: true,
      currentTokens: "",
      activeTier: state.preferredTier
    });

    const startTime = performance.now();
    let streamedTokens = "";

    try {
      const result = await executeSovereignInference(
        {
          prompt: promptText,
          model: modelOverride || state.selectedModel,
          temperature: 0.85
        },
        state.preferredTier,
        (token) => {
          streamedTokens += token;
          inferenceStore.setState({ currentTokens: streamedTokens });
        }
      );

      const durationMs = Math.round(performance.now() - startTime);
      const wordsCount = result.text.split(" ").length;
      const tokensPerSec = parseFloat(((wordsCount * 1.33) / (durationMs / 1000)).toFixed(1));

      const logEntry: InferenceLogEntry = {
        id: `inf_${Date.now()}`,
        prompt: promptText,
        response: result.text,
        tier: result.decision.selectedTier,
        durationMs,
        tokensPerSec: isNaN(tokensPerSec) ? 32 : tokensPerSec,
        timestamp: new Date().toISOString(),
        verifiableHash: result.decision.verifiableHash
      };

      inferenceStore.setState({
        isRunning: false,
        lastDecision: result.decision,
        currentTokens: result.text,
        history: [logEntry, ...state.history.slice(0, 20)]
      });

      return result;
    } catch (err: any) {
      inferenceStore.setState({
        isRunning: false,
        currentTokens: `Error: ${err.message}`
      });
    }
  };

  const setPreferredTier = (tier: NodeExecutionTier) => {
    inferenceStore.setState({ preferredTier: tier });
  };

  const setSelectedModel = (model: string) => {
    inferenceStore.setState({ selectedModel: model });
  };

  return {
    ...state,
    runPrompt,
    setPreferredTier,
    setSelectedModel
  };
}
