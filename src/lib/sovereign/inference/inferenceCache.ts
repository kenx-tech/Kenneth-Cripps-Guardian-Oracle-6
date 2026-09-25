interface CachedInference {
  response: string;
  timestamp: number;
  model: string;
  tier: string;
}

export class InferenceCache {
  private cache = new Map<string, CachedInference>();
  private maxEntries = 100;
  private ttlMs = 1000 * 60 * 30; // 30 mins

  private makeKey(prompt: string, model: string, system?: string): string {
    const combined = `${model}:${system || ""}:${prompt.trim().toLowerCase()}`;
    // Simple hash
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    return `inf_${hash}`;
  }

  get(prompt: string, model: string, system?: string): CachedInference | null {
    const key = this.makeKey(prompt, model, system);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry;
  }

  set(prompt: string, model: string, system: string | undefined, response: string, tier: string): void {
    const key = this.makeKey(prompt, model, system);
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      model,
      tier
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const inferenceCache = new InferenceCache();
