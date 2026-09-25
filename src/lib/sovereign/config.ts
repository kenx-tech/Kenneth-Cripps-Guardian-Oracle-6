export const SOVEREIGN_CONFIG = {
  NETWORK_NAME: "guardian-qmesh-omega",
  PROTOCOL_VERSION: "0.9.4",
  HEARTBEAT_INTERVAL_MS: 15000,
  NODE_STALE_THRESHOLD_MS: 45000,
  DEFAULT_PORT: 4320,
  DEFAULT_SOLFEGGIO_BASE_HZ: 432,
  MAX_TASK_RETRY: 3,
  TASK_TTL_MS: 120000, // 2 minutes
  MAX_MEMORY_BLOCK_SIZE_BYTES: 1048576, // 1MB
  REPLAY_WINDOW_MS: 300000, // 5 minutes
  CONSENSUS_THRESHOLD_PERCENT: 67, // 2/3 BFT consensus
  STORAGE_KEYS: {
    NODE_IDENTITY: "sovereign_node_identity_v1",
    NODE_KEYPAIR: "sovereign_node_keypair_v1",
    LOCAL_MEMORY_LEDGER: "sovereign_memory_ledger_v1",
    OFFLINE_QUEUE: "sovereign_offline_sync_queue_v1",
    AUDIT_LOGS: "sovereign_audit_ledger_v1"
  }
};
