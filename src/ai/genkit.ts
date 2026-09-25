import { GoogleGenAI } from "@google/genai";

let genAiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  if (typeof process === "undefined" || !process.env) {
    return null;
  }
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) return null;

  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey: key });
  }
  return genAiClient;
}
