import { SovereignNodeIdentity } from "../../../types/sovereign";
import { SOVEREIGN_CONFIG } from "../config";
import { signMessage } from "../identity/signatures";
import { getClientAuthHeaders } from "../auth/clientAuth";

export class HeartbeatService {
  private timer: any = null;
  private isRunning = false;

  start(identity: SovereignNodeIdentity, onTick?: (timestamp: string) => void): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const ping = async () => {
      const now = new Date().toISOString();
      const nonce = globalThis.crypto?.randomUUID 
        ? globalThis.crypto.randomUUID() 
        : `nonce_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      try {
        let sig = "";
        if (identity.privateKey) {
          sig = await signMessage(identity.privateKey, `HEARTBEAT:${identity.nodeId}:${now}:${nonce}`);
        }

        const headers = await getClientAuthHeaders();

        await fetch("/api/sovereign/nodes/heartbeat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            nodeId: identity.nodeId,
            timestamp: now,
            nonce,
            status: "ONLINE",
            signature: sig
          })
        }).catch(() => null);
      } catch (err) {
        // Offline continuity
      }

      if (onTick) onTick(now);
    };

    ping();
    this.timer = setInterval(ping, SOVEREIGN_CONFIG.HEARTBEAT_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }
}

export const heartbeatService = new HeartbeatService();
