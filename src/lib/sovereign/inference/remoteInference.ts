import { InferencePromptPayload } from "../../../types/sovereign";

export async function runRemoteInference(
  payload: InferencePromptPayload,
  targetNodeEndpoint?: string
): Promise<{ text: string; tier: "MESH_PEER" | "EDGE_CLOUD" | "SACRED_FALLBACK"; latencyMs: number }> {
  const start = performance.now();

  // Try sovereign inference endpoint
  try {
    const endpoint = targetNodeEndpoint || "/api/sovereign/inference";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.response || data.text || "Remote sovereign transmission received.",
        tier: data.tier || "EDGE_CLOUD",
        latencyMs: Math.round(performance.now() - start)
      };
    }
  } catch (err) {
    console.warn("Sovereign remote endpoint failed, falling back to Oracle chat:", err);
  }

  // Fallback to standard Oracle chat endpoint
  try {
    const res = await fetch("/api/oracle/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: payload.prompt }]
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.response || "Oracle transmission received.",
        tier: "EDGE_CLOUD",
        latencyMs: Math.round(performance.now() - start)
      };
    }
  } catch (err) {
    console.warn("Oracle chat API unreachable, engaging Sacred Fallback:", err);
  }

  // Pure sacred fallback
  return {
    text: "Sacred Gnostic Core: All cloud channels unreachable. Local air-gapped continuity preserved. The 5 Pillars stand firm in the void.",
    tier: "SACRED_FALLBACK",
    latencyMs: Math.round(performance.now() - start)
  };
}
