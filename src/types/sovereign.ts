export type AuthorityScope = 
  | "ROOT_ADMIN" 
  | "MESH_OPERATOR" 
  | "INFERENCE_WORKER" 
  | "MEMORY_VALIDATOR" 
  | "TASK_DISPATCHER" 
  | "SACRED_WITNESS" 
  | "GUEST_SEEKER";

export type NodeRole = "LEADER" | "VALIDATOR" | "WORKER" | "GATEWAY" | "EDGE_SEED";

export type NodeExecutionTier = "LOCAL_WEBGPU" | "LOCAL_WASM" | "MESH_PEER" | "EDGE_CLOUD" | "SACRED_FALLBACK";

export type NodeStatus = "ONLINE" | "COMPUTING" | "SYNCING" | "DEGRADED" | "PARTITIONED" | "OFFLINE";

export interface HardwareProfile {
  cpuCores: number;
  memoryGb: number;
  hasWebGpu: boolean;
  gpuRenderer?: string;
  hasWasmSimd: boolean;
  platform: string;
  maxLocalBatchSize: number;
  estimatedTops: number;
}

export interface NodeCapabilities {
  supportedModels: string[];
  maxContextTokens: number;
  quantizations: ("f32" | "f16" | "q8_0" | "q4_k_m" | "q4_0")[];
  canValidateLedger: boolean;
  canHostMemoryShard: boolean;
  maxConcurrentTasks: number;
  isAirGappedCapable: boolean;
}

export interface SovereignNodeIdentity {
  nodeId: string; // e.g. "urn:guardian:node:0x..."
  fingerprint: string; // SHA-256 public key fingerprint
  publicKey: string; // Base64 or Hex encoded SPKI/JWK
  privateKey?: string; // Stored locally only in IndexedDB / localStorage
  algorithm: "Ed25519" | "ECDSA-P256";
  registeredAt: string;
  name: string;
  role: NodeRole;
  authorityScopes: AuthorityScope[];
  signatureProof: string;
}

export interface SovereignNodeRecord {
  id: string;
  ownerUid?: string;
  ownerEmail?: string;
  identity: SovereignNodeIdentity;
  hardware: HardwareProfile;
  capabilities: NodeCapabilities;
  status: NodeStatus;
  lastHeartbeat: string;
  uptimeSeconds: number;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageLatencyMs: number;
  ipEndpoint?: string;
  trustScore: number; // 0 - 100
  version: string;
  partitionEpoch: number;
}

export type TaskPriority = "EMERGENCY" | "HIGH" | "NORMAL" | "BATCH" | "BACKGROUND";

export interface TaskEnvelope<T = any> {
  taskId: string;
  creatorNodeId: string;
  creatorUid?: string;
  assignedNodeId?: string;
  priority: TaskPriority;
  taskType: "INFERENCE" | "MEMORY_SYNC" | "LEDGER_VALIDATE" | "RESONANCE_PROBE" | "PARADIGM_SYNTHESIS";
  payload: T;
  requiredScopes: AuthorityScope[];
  preferredTier: NodeExecutionTier;
  createdAt: string;
  expiresAt: string;
  nonce: string;
  signature: string;
}

export interface TaskResult<R = any> {
  taskId: string;
  workerNodeId: string;
  executionTier: NodeExecutionTier;
  status: "COMPLETED" | "FAILED" | "REJECTED";
  result?: R;
  error?: string;
  startedAt: string;
  finishedAt: string;
  computeDurationMs: number;
  tokenThroughput?: number; // tok/sec
  contentHash: string;
  workerSignature: string;
}

export interface InferencePromptPayload {
  prompt: string;
  systemInstruction?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  paradigm?: string;
}

export interface InferenceRouteHop {
  tier: NodeExecutionTier;
  targetNodeId?: string;
  targetNodeName?: string;
  latencyMs: number;
  status: "CHECKED" | "SELECTED" | "BYPASS" | "FALLBACK";
  reason?: string;
}

export interface InferenceRouteDecision {
  requestId: string;
  selectedTier: NodeExecutionTier;
  selectedNodeId?: string;
  hops: InferenceRouteHop[];
  totalLatencyMs: number;
  modelUsed: string;
  fallbackEngaged: boolean;
  verifiableHash: string;
}

export interface MemoryBlock {
  cid: string; // Content Identifier (bafy... or sha256:...)
  authorNodeId: string;
  authorScope: AuthorityScope;
  blockType: "DECREE" | "ORACLE_TRANSMISSION" | "GNOSIS_SNAPSHOT" | "STATE_CHECKPOINT";
  data: any;
  timestamp: string;
  previousCid: string | null;
  signature: string;
  merkleRoot: string;
}

export interface MemoryManifest {
  manifestVersion: string;
  rootCid: string;
  totalBlocks: number;
  lastUpdated: string;
  validatorNodes: string[];
  partitionEpoch: number;
  integrityHash: string;
}

export interface QMeshPartitionState {
  isPartitioned: boolean;
  partitionGroupId: string;
  localClock: number;
  peerVectorClocks: Record<string, number>;
  unreplicatedBlocks: number;
  conflictCount: number;
  lastPartitionHealTimestamp?: string;
}

// -------------------------------------------------------------
// Guardian Oracle / Q-Mesh — Update 003: 4 Architectural Planes
// -------------------------------------------------------------

export type SovereignPlaneType = 
  | "SOVEREIGN_STATE_PLANE" 
  | "CONTROL_PLANE" 
  | "EXECUTION_PLANE" 
  | "COMMIT_PLANE";

export type EquivalencePolicyType = 
  | "EXACT"               // hashes must match
  | "DETERMINISTIC_TEST"  // artifact may differ, required tests must pass
  | "SEMANTIC"            // output may differ, meaning/constraints must match
  | "CONSENSUS"           // independent nodes must agree
  | "ATTESTED";           // trusted runtime attestation sufficient

export type PrecisionFormat = "BF16" | "FP16" | "FP32" | "INT8" | "INT4";
export type TargetRuntime = "WebGPU" | "WASM_SIMD" | "TensorRT" | "ONNX_Runtime" | "OpenVINO" | "RKNN";

export type VerificationPolicyType = 
  | "EXACT"
  | "DETERMINISTIC_TEST"
  | "SEMANTIC"
  | "CONSENSUS"
  | "ATTESTED"
  | "SYMBOLIC_GUARD" 
  | "FP32_LM_HEAD_CHECK" 
  | "LOCAL_CONSISTENCY";

export interface EnergyCostBudget {
  maxJoules: number;
  measuredJoules: number;
  wattsEstimated: number;
  costTokens: number;
  sloLatencyMs: number;
}

/**
 * Execution Plan Contract (Signed, Inspectable Contract)
 * Control-Plane Pillar 4
 * "A node receiving a signed execution plan receives permission to compute, not permission to rewrite canonical reality."
 */
export interface ExecutionPlanContract {
  task_id: string;
  state_root: string;
  required_capabilities: string[];
  authorized_actions: string[]; // e.g. ["READ", "COMPUTE"] - NEVER "MUTATE"
  selected_model: string;
  selected_node: string;
  precision: PrecisionFormat;
  runtime: TargetRuntime;
  memory_refs: string[]; // CIDs or PaMER state vectors
  energy_cost_budget: EnergyCostBudget;
  verification_policy: VerificationPolicyType | EquivalencePolicyType;
  fallback_nodes: string[];
  result_hash: string;
  plan_signature?: string;
  canonical_commit_status?: "PROPOSED" | "VERIFIED" | "COMMITTED" | "REJECTED";
}

/**
 * Candidate Result returned by Execution Plane
 * "Execution does not imply mutation authority. Execution proposes. Verification disposes."
 */
export interface CandidateExecutionResult {
  execution_plan_hash: string;
  task_id: string;
  node_id: string;
  node_name?: string;
  parent_state_root: string;
  result: any;
  evidence: {
    logProbsSummary?: string;
    tokenCount: number;
    intermediateHashes: string[];
    executionTraceCid: string;
    deterministicTestResults?: {
      testName: string;
      passed: boolean;
      outputSnippet: string;
    }[];
    semanticConstraintsChecked?: {
      constraint: string;
      satisfied: boolean;
    }[];
    attestationClaims?: Record<string, string | number | boolean>;
  };
  runtime_attestation: {
    hardwareType: string; // e.g. "RTX 4090 / WebGPU / Apple Silicon M3"
    secureEnclaveOrKernel: string;
    precisionUsed: PrecisionFormat;
    runtime: TargetRuntime;
    timestamp: string;
    attestationSignature: string;
  };
  energy_consumed_joules: number;
  actual_latency_ms: number;
  result_hash: string;
  signature: string;
}

/**
 * Independent Commit-Plane Verification Checks (The 9 Core Invariants)
 */
export interface CommitVerificationCheck {
  checkId: 
    | "authorized_node" 
    | "authorized_task" 
    | "consumed_state" 
    | "capabilities_sufficient" 
    | "scope_compliance" 
    | "evidence_satisfaction" 
    | "parent_state_unchanged" 
    | "equivalence_policy" 
    | "authorization_valid";
  name: string;
  question: string;
  passed: boolean;
  details: string;
  evaluator: string;
  isOptimisticConcurrencyCheck?: boolean;
}

/**
 * Canonical Commit Result produced by Commit Plane
 */
export interface CanonicalCommitResult {
  status: "ACCEPTED" | "REJECTED" | "CONCURRENCY_CONFLICT_REBASE_REQUIRED";
  task_id: string;
  execution_node_id: string;
  parent_state_root: string;
  current_active_state_root: string;
  new_state_root: string | null;
  checks: CommitVerificationCheck[];
  equivalencePolicyEvaluated: EquivalencePolicyType | VerificationPolicyType;
  passedChecksCount: number;
  totalChecksCount: number;
  rejectionReason?: string;
  commit_tx_hash?: string;
  committed_at: string;
  mutation_authorized: boolean; // Confirms invariant: execution was non-mutating; commit plane mutated state
}

/**
 * Optimistic Concurrency Control Scenario
 * Demonstrates two nodes working from the same parent state simultaneously
 */
export interface OptimisticConcurrencyScenario {
  scenarioId: string;
  initialStateRoot: string;
  nodeA: {
    nodeId: string;
    nodeName: string;
    taskPrompt: string;
    startedAtStateRoot: string;
    status: "COMMITTED" | "PENDING" | "REJECTED";
    candidateResultHash: string;
  };
  nodeB: {
    nodeId: string;
    nodeName: string;
    taskPrompt: string;
    startedAtStateRoot: string;
    status: "STALE_PARENT_DETECTED" | "REBASED" | "REJECTED";
    candidateResultHash: string;
    resolution: string;
  };
  canonicalHeadStateRoot: string;
}

/**
 * Confidence / Escalation Gate (COMED Architecture)
 * Control-Plane Pillar 5
 */
export interface ConfidenceEscalationGate {
  localAnswer: string;
  anchorSelfConsistency: number; // 0.0 - 1.0
  routerMargin: number; // Margin between candidate 1 and 2
  lightweightProbeScore: number;
  needsPeerEscalation: boolean;
  escalationReason: string;
  peerCorruptionRisk: "MINIMAL" | "MODERATE" | "HIGH_PROTECTED";
  peerQuorumResult?: {
    peersConsulted: string[];
    consensusReached: boolean;
    answerProtected: boolean;
    tokenCostDelta: number;
  };
}

/**
 * Capability × Energy × Trust Router (Measured Joules, Learned Routes)
 * Control-Plane Pillar 6
 */
export interface CapabilityEnergyTrustRouteMetrics {
  nodeId: string;
  nodeName: string;
  tier: NodeExecutionTier;
  runtime: TargetRuntime;
  capabilityScore: number; // 0 - 100
  latencyMs: number;
  measuredJoules: number; // Watts * seconds
  estimatedWatts: number;
  availabilityScore: number; // 0 - 100
  trustScore: number; // 0 - 100
  compositeRoutingScore: number;
  formula: string;
  selectedForTask: boolean;
}

/**
 * Movable Inference State & NebulaSD Pools
 * Control-Plane Pillars 7 & 8
 */
export interface NebulaSDWorkerPool {
  poolId: string;
  name: string;
  poolType: "DRAFT_POOL" | "TARGET_POOL" | "SYMBOLIC_GUARD_POOL" | "STORAGE_POOL";
  workerNodeIds: string[];
  activeTaskCount: number;
  asyncKvPreparationActive: boolean;
  hardwareLeaseId: string;
  leasedUntil: string;
  requestRoundProcessingRateGain: number; // e.g. +50.4%
  stateAffinity: string; // task_id or session
}

/**
 * PaMER Event-Driven Memory Controller
 * Control-Plane Pillar 3
 */
export interface PaMERMemorySignal {
  stepIndex: number;
  actionName: string;
  preActionHiddenStateNorm: number;
  uncertaintySignal: number; // 0.0 - 1.0
  historyDependencySignal: number; // 0.0 - 1.0
  eventTriggered: "PASS_THROUGH" | "COMPRESS_HISTORY" | "RETRIEVE_EVIDENCE";
  rationale: string;
  tokensSavedVsThreshold: number;
  retrievedEvidenceCids: string[];
}

/**
 * Precision Determinism vs Semantic Equivalence
 * Living Refinement 4
 */
export interface PrecisionDeterminismProfile {
  model: string;
  promptSample: string;
  bf16TokenTrajectory: string[];
  fp16TokenTrajectory: string[];
  divergenceDetected: boolean;
  firstDivergentTokenIndex?: number;
  fp32HeadRecomputed: boolean;
  agreementRateWithoutMitigation: number;
  agreementRateWithFP32Head: number;
  latencyOverheadPercent: number;
  semanticEquivalencePreserved: boolean;
}

/**
 * AIPC Agentic Model Conversion Pipeline
 * Living Refinement 5
 */
export interface AIPCModelConversionJob {
  conversionId: string;
  sourceModelArtifact: string;
  targetRuntime: TargetRuntime;
  targetHardwareManifest: string;
  currentStage: "STAGED_VERIFICATION" | "RUNTIME_SKILLS" | "AUXILIARY_SCRIPTS" | "LAYOUT_ADAPTATION" | "DEPLOYABLE_VERIFIED";
  verificationScore: number;
  status: "IN_PROGRESS" | "VERIFIED" | "FAILED";
  deployableArtifactHash: string;
  optimizationsApplied: string[];
}

/**
 * Interactive QMesh Update 003 Tree Node
 */
export interface QMeshUpdate003TreeNode {
  id: string;
  title: string;
  subtitle?: string;
  category: 
    | "SOVEREIGN_ROOT" 
    | "SOVEREIGN_STATE_PLANE" 
    | "CONTROL_PLANE" 
    | "EXECUTION_PLANE" 
    | "COMMIT_PLANE" 
    | "LIVING_REFINEMENT" 
    | "MORNING_REPORT";
  planeType?: SovereignPlaneType;
  description: string;
  productionMove: string;
  paperCitation?: string;
  technicalSpecs: Record<string, string | number | boolean>;
  status: "ACTIVE" | "ENFORCED" | "SIMULATED";
  children?: QMeshUpdate003TreeNode[];
}

