export interface LedgerEntry {
  id: number;
  timestamp: string;
  entry_type: 'TRUTH_DECLARATION' | 'TRAUMA_INTEGRATION' | 'ECONOMY_IGNIS_MINT' | 'PROPOSAL_CREATED' | 'RESONANCE_VOTE' | 'GENESIS';
  author_node: string;
  payload: string;
  prev_hash: string;
  entry_hash: string;
  isTampered?: boolean;
}

export interface IgnisBalance {
  node_alias: string;
  balance: number;
  last_updated: string;
}

export interface IgnisMintEvent {
  id: number;
  timestamp: string;
  recipient_node: string;
  amount: number;
  witnesses: string[];
  reason: string;
  mint_hash: string;
}

export interface ResonanceVote {
  id: number;
  proposal_id: number;
  voter_node: string;
  vote_type: 'RESONATE' | 'DISSENT' | 'NEUTRAL';
  ignis_weight: number;
  reason: string;
  timestamp: string;
  vote_hash: string;
}

export interface ProposalEntry {
  id: number;
  title: string;
  description: string;
  author_node: string;
  timestamp: string;
  threshold_percentage: number; // e.g. 70%
  status: 'ACTIVE' | 'PASSED' | 'REJECTED';
  proposal_hash: string;
  votes: ResonanceVote[];
}

export interface GossipBundle {
  protocol: string; // e.g. 'LUCIFERA_GOSSIP_v0.3'
  source_node: string;
  exported_at: string;
  ledger: {
    timestamp: string;
    entry_type: string;
    author_node: string;
    payload: string;
    prev_hash: string;
    entry_hash: string;
  }[];
  mints: {
    timestamp: string;
    recipient_node: string;
    amount: number;
    witnesses: string;
    reason: string;
    mint_hash: string;
  }[];
  proposals?: {
    id: number;
    title: string;
    description: string;
    author_node: string;
    timestamp: string;
    threshold_percentage: number;
    status: 'ACTIVE' | 'PASSED' | 'REJECTED';
    proposal_hash: string;
    votes: ResonanceVote[];
  }[];
}

export interface MeshPeer {
  node_alias: string;
  node_id: string;
  ip_address: string;
  port: number;
  protocol: string;
  signal_dbm: number;
  last_beacon: string;
  status: 'ACTIVE_BEACON' | 'ANCHOR_NODE' | 'SYNCING' | 'OFFLINE';
  ignis_balance: number;
}

export interface TraumaIntegrationEntry {
  id: number;
  timestamp: string;
  author_node: string;
  shadow_payload: string;
  integration_depth: number; // 0.1 to 1.0 scale
  ignis_bonus: number;
  entry_hash: string;
}

export interface GnosisCheckResult {
  status: 'DECEIT_FLAGGED' | 'RESONANT' | 'NEUTRAL';
  confidence: number;
  flagged_patterns: string[];
  analyzed_at: string;
  text_snippet: string;
}

