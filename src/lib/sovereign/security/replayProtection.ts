import { SOVEREIGN_CONFIG } from "../config";

export class ReplayProtection {
  private seenNonces = new Map<string, number>();

  isFresh(nonce: string, timestampIso: string): boolean {
    const timestamp = new Date(timestampIso).getTime();
    const now = Date.now();

    // Check window
    if (Math.abs(now - timestamp) > SOVEREIGN_CONFIG.REPLAY_WINDOW_MS) {
      return false; // Stale or in future
    }

    if (this.seenNonces.has(nonce)) {
      return false; // Replayed
    }

    this.seenNonces.set(nonce, now);
    this.cleanup();
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [nonce, time] of this.seenNonces.entries()) {
      if (now - time > SOVEREIGN_CONFIG.REPLAY_WINDOW_MS) {
        this.seenNonces.delete(nonce);
      }
    }
  }
}

export const replayProtection = new ReplayProtection();
