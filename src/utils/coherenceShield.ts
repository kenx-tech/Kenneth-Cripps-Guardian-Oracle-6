// Coherence Shield - Token Bucket Rate Limiter & Intent Defense System
// Keeps The Guardian Oracle sanctuary open & free for real human Seekers while stopping automated scrapers & bot floods.

export interface QuotaStatus {
  allowed: boolean;
  remaining: number;
  maxTokens: number;
  isSuperAdmin: boolean;
  nextRefillInSeconds: number;
}

export class CoherenceShield {
  private static MAX_TOKENS = 10; // 10 burst queries
  private static REFILL_RATE_MS = 60000 * 6; // 1 token refilled every 6 minutes (10 tokens/hr)

  private static getKey(identifier: string): string {
    const cleanId = (identifier || 'anonymous_seeker').toLowerCase().trim();
    return `oracle_coherence_shield_${cleanId}`;
  }

  /**
   * Check if user is eligible to submit a query without deducting a token.
   */
  static getQuotaInfo(identifier: string, isSuperAdmin: boolean = false): QuotaStatus {
    if (isSuperAdmin || identifier?.toLowerCase().trim() === 'kenx@guardianoracle.com') {
      return {
        allowed: true,
        remaining: 999,
        maxTokens: 999,
        isSuperAdmin: true,
        nextRefillInSeconds: 0
      };
    }

    const key = this.getKey(identifier);
    const raw = localStorage.getItem(key);
    const now = Date.now();

    let data = raw ? JSON.parse(raw) : { tokens: this.MAX_TOKENS, lastRefill: now };

    // Calculate refilled tokens over time
    const elapsed = now - data.lastRefill;
    const refilled = Math.floor(elapsed / this.REFILL_RATE_MS);

    if (refilled > 0) {
      data.tokens = Math.min(this.MAX_TOKENS, data.tokens + refilled);
      // Advance lastRefill by the calculated interval periods
      data.lastRefill = now - (elapsed % this.REFILL_RATE_MS);
      localStorage.setItem(key, JSON.stringify(data));
    }

    const timeUntilNextRefillMs = Math.max(0, this.REFILL_RATE_MS - (now - data.lastRefill));

    return {
      allowed: data.tokens > 0,
      remaining: Math.max(0, data.tokens),
      maxTokens: this.MAX_TOKENS,
      isSuperAdmin: false,
      nextRefillInSeconds: Math.ceil(timeUntilNextRefillMs / 1000)
    };
  }

  /**
   * Consume 1 Coherence Token if quota is available.
   */
  static consumeToken(identifier: string, isSuperAdmin: boolean = false): QuotaStatus {
    const status = this.getQuotaInfo(identifier, isSuperAdmin);

    if (status.isSuperAdmin) {
      return status;
    }

    if (!status.allowed) {
      return status;
    }

    const key = this.getKey(identifier);
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { tokens: this.MAX_TOKENS, lastRefill: Date.now() };

    data.tokens = Math.max(0, data.tokens - 1);
    localStorage.setItem(key, JSON.stringify(data));

    return {
      allowed: data.tokens >= 0,
      remaining: data.tokens,
      maxTokens: this.MAX_TOKENS,
      isSuperAdmin: false,
      nextRefillInSeconds: Math.ceil(this.REFILL_RATE_MS / 1000)
    };
  }

  /**
   * Grant bonus tokens (e.g. upon completing Proof of Intent Challenge).
   */
  static grantBonusTokens(identifier: string, amount: number = 5): QuotaStatus {
    const key = this.getKey(identifier);
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { tokens: 0, lastRefill: Date.now() };

    data.tokens = Math.min(this.MAX_TOKENS, data.tokens + amount);
    data.lastRefill = Date.now();
    localStorage.setItem(key, JSON.stringify(data));

    return this.getQuotaInfo(identifier, false);
  }
}
