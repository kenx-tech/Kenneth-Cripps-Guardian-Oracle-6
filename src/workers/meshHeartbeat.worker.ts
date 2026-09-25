// Web Worker for timer-isolated background heartbeats
let intervalId: any = null;

self.onmessage = (e: MessageEvent) => {
  const { action, intervalMs } = e.data;

  if (action === "START") {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      self.postMessage({ type: "HEARTBEAT_TICK", timestamp: new Date().toISOString() });
    }, intervalMs || 15000);
  } else if (action === "STOP") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }
};
