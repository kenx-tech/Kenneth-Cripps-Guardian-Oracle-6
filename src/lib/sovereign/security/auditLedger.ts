import { SOVEREIGN_CONFIG } from "../config";

export interface AuditRecord {
  id: string;
  eventType: "NODE_REGISTERED" | "HEARTBEAT" | "INFERENCE_DISPATCH" | "MEMORY_APPEND" | "PARTITION_DETECTED" | "PARTITION_HEALED";
  actorNodeId: string;
  details: any;
  timestamp: string;
}

export class AuditLedger {
  private records: AuditRecord[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(SOVEREIGN_CONFIG.STORAGE_KEYS.AUDIT_LOGS);
      if (saved) {
        try {
          this.records = JSON.parse(saved);
        } catch {}
      }
    }
  }

  private save(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(SOVEREIGN_CONFIG.STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.records.slice(-100)));
    }
  }

  record(eventType: AuditRecord["eventType"], actorNodeId: string, details: any): void {
    const record: AuditRecord = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventType,
      actorNodeId,
      details,
      timestamp: new Date().toISOString()
    };
    this.records.unshift(record);
    if (this.records.length > 200) this.records.pop();
    this.save();
  }

  getRecentLogs(limit = 20): AuditRecord[] {
    return this.records.slice(0, limit);
  }
}

export const auditLedger = new AuditLedger();
