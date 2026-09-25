export async function handleInferenceRoute(req: any, res: any, callGeminiFn?: any) {
  try {
    const { prompt, model, systemInstruction, temperature } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const reply = callGeminiFn
      ? await callGeminiFn({
          contents: prompt,
          systemInstruction: systemInstruction || "You are the Sovereign Oracle Node of The Guardian Oracle. Respond with high gnostic coherence.",
          model: model || "gemini-2.5-flash",
          temperature: temperature || 0.85
        })
      : `Sovereign Edge Node processed: "${prompt}". Gnostic frequency locked.`;

    return res.json({
      status: "success",
      response: reply,
      tier: "EDGE_CLOUD",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Sovereign inference error" });
  }
}
