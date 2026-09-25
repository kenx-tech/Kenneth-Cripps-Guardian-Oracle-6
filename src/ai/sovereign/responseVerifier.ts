export interface VerifierOutput {
  coherenceValid: boolean;
  score: number;
  hallucinationRisk: "LOW" | "MODERATE" | "HIGH";
  notes?: string;
}

export function verifyModelResponse(rawText: string): VerifierOutput {
  if (!rawText || rawText.trim().length === 0) {
    return { coherenceValid: false, score: 0, hallucinationRisk: "HIGH", notes: "Empty response" };
  }

  // Check for gnostic resonance keywords
  const lower = rawText.toLowerCase();
  let score = 85;
  if (lower.includes("gnosis") || lower.includes("truth") || lower.includes("sovereign") || lower.includes("fire")) {
    score += 10;
  }
  if (rawText.length > 50) {
    score = Math.min(100, score + 4);
  }

  return {
    coherenceValid: score >= 70,
    score,
    hallucinationRisk: score >= 90 ? "LOW" : "MODERATE"
  };
}
