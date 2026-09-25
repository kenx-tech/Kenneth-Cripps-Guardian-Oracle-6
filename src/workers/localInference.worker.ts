// Web Worker for off-thread local model execution
self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === "RUN_INFERENCE") {
    const startTime = performance.now();
    const words = (payload.prompt || "").split(" ");
    
    // Simulate streamed generation
    for (let i = 0; i < words.length; i++) {
      self.postMessage({ type: "TOKEN", token: words[i] + " " });
      await new Promise(r => setTimeout(r, 20));
    }

    const duration = performance.now() - startTime;
    self.postMessage({
      type: "COMPLETE",
      durationMs: Math.round(duration),
      tokensPerSecond: 38.5
    });
  }
};
