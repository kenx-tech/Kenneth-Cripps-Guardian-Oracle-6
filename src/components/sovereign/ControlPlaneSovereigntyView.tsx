import React, { useState } from "react";
import {
  UPDATE_003_TREE_DATA,
  controlPlaneEngine
} from "../../lib/sovereign/controlplane/controlPlaneEngine";
import {
  ExecutionPlanContract,
  ConfidenceEscalationGate,
  CapabilityEnergyTrustRouteMetrics,
  NebulaSDWorkerPool,
  PaMERMemorySignal,
  PrecisionDeterminismProfile,
  AIPCModelConversionJob,
  QMeshUpdate003TreeNode,
  PrecisionFormat,
  TargetRuntime,
  EquivalencePolicyType,
  CandidateExecutionResult,
  CanonicalCommitResult,
  OptimisticConcurrencyScenario
} from "../../types/sovereign";
import {
  Cpu,
  Zap,
  Shield,
  Layers,
  Terminal,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  BookOpen,
  Lock,
  GitBranch,
  Boxes,
  Workflow,
  Users,
  ShieldCheck,
  RefreshCw,
  Play,
  ArrowRight,
  Database,
  Scale,
  Sparkles,
  Check,
  XCircle,
  AlertTriangle
} from "lucide-react";

export const ControlPlaneSovereigntyView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "tree" | "commit_plane" | "occ" | "stranger_gpu" | "planner" | "router" | "comed" | "nebulasd" | "pamer" | "precision" | "brief"
  >("commit_plane");

  // Selected tree node for detail drawer
  const [selectedTreeNode, setSelectedTreeNode] = useState<QMeshUpdate003TreeNode>(
    UPDATE_003_TREE_DATA.children![3] // Default to Commit Plane
  );

  // -------------------------------------------------------------
  // Commit Plane & Invariant State
  // -------------------------------------------------------------
  const [activeEquivalencePolicy, setActiveEquivalencePolicy] = useState<EquivalencePolicyType>("SEMANTIC");
  const [activeContract, setActiveContract] = useState<ExecutionPlanContract>(() => {
    const history = controlPlaneEngine.getHistory();
    if (history.length > 0) return history[0];
    return {
      task_id: "QM-009341",
      state_root: controlPlaneEngine.getStateRoot(),
      required_capabilities: ["code_reasoning", "filesystem_read"],
      authorized_actions: ["READ", "COMPUTE"],
      selected_model: "local/qwen",
      selected_node: "node-c",
      precision: "BF16",
      runtime: "WebGPU",
      memory_refs: ["mem://guardian/81af", "mem://task/009341"],
      energy_cost_budget: {
        maxJoules: 420,
        measuredJoules: 312.4,
        wattsEstimated: 52.5,
        costTokens: 850,
        sloLatencyMs: 8000
      },
      verification_policy: "SEMANTIC",
      fallback_nodes: ["node-a", "node-f"],
      result_hash: "0xsha256_plan_qm009341_a81f9b",
      plan_signature: "sig:ed25519:dispatcher_0x992b",
      canonical_commit_status: "PROPOSED"
    };
  });

  const [simOptions, setSimOptions] = useState({
    simulateStaleParent: false,
    simulateCapabilityViolation: false,
    simulateTestFailure: false
  });

  const [candidateResult, setCandidateResult] = useState<CandidateExecutionResult | null>(null);
  const [commitResult, setCommitResult] = useState<CanonicalCommitResult | null>(null);
  const [isExecutingCandidate, setIsExecutingCandidate] = useState<boolean>(false);
  const [isVerifyingCommit, setIsVerifyingCommit] = useState<boolean>(false);
  const [copiedContract, setCopiedContract] = useState<boolean>(false);

  // -------------------------------------------------------------
  // OCC Simulation State
  // -------------------------------------------------------------
  const [occScenario, setOccScenario] = useState<OptimisticConcurrencyScenario | null>(null);
  const [isRunningOcc, setIsRunningOcc] = useState<boolean>(false);

  // -------------------------------------------------------------
  // Stranger GPU Simulation State
  // -------------------------------------------------------------
  const [strangerCandidate, setStrangerCandidate] = useState<CandidateExecutionResult | null>(null);
  const [strangerCommit, setStrangerCommit] = useState<CanonicalCommitResult | null>(null);
  const [isStrangerExecuting, setIsStrangerExecuting] = useState<boolean>(false);

  // -------------------------------------------------------------
  // Execution Planner Simulator state
  // -------------------------------------------------------------
  const [plannerPrompt, setPlannerPrompt] = useState<string>(
    "Execute Byzantine state consensus checkpoint and calibrate 528Hz harmonic resonance across edge nodes"
  );
  const [plannerPrecision, setPlannerPrecision] = useState<PrecisionFormat>("BF16");
  const [plannerRuntime, setPlannerRuntime] = useState<TargetRuntime>("WebGPU");
  const [plannerSloMs, setPlannerSloMs] = useState<number>(350);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // -------------------------------------------------------------
  // COMED Simulator state
  // -------------------------------------------------------------
  const [comedComplexity, setComedComplexity] = useState<"SIMPLE" | "MODERATE" | "HIGH" | "AMBIGUOUS">("SIMPLE");
  const [comedGateResult, setComedGateResult] = useState<ConfidenceEscalationGate>(() =>
    controlPlaneEngine.evaluateConfidenceGate({
      prompt: "Harmonic consensus probe",
      localAnswer: "All 12 localized nodes in the sanctuary cluster are operating at 528Hz coherent resonance with 0 state divergence.",
      taskComplexity: "SIMPLE"
    })
  );

  // -------------------------------------------------------------
  // Router metrics state
  // -------------------------------------------------------------
  const [routerSloMs, setRouterSloMs] = useState<number>(350);
  const [routingCandidates, setRoutingCandidates] = useState<CapabilityEnergyTrustRouteMetrics[]>(() =>
    controlPlaneEngine.evaluateRoutingCandidates(350)
  );

  // Profiles and pools
  const precisionProfile: PrecisionDeterminismProfile = controlPlaneEngine.getPrecisionDeterminismProfile();
  const workerPools: NebulaSDWorkerPool[] = controlPlaneEngine.getWorkerPools();
  const pamerSignals: PaMERMemorySignal[] = controlPlaneEngine.simulatePaMERSignals();
  const aipcJobs: AIPCModelConversionJob[] = controlPlaneEngine.getAIPCConversionJobs();

  // Load Node C Exemplar from prompt
  const handleLoadNodeCExemplar = async () => {
    const { contract } = await controlPlaneEngine.getNodeCExemplarContract();
    setActiveContract(contract);
    setCandidateResult(null);
    setCommitResult(null);
    setSimOptions({
      simulateStaleParent: false,
      simulateCapabilityViolation: false,
      simulateTestFailure: false
    });
  };

  // Node executes candidate work (proposes result)
  const handleExecuteCandidate = async () => {
    setIsExecutingCandidate(true);
    setCommitResult(null);
    try {
      const candidate = await controlPlaneEngine.executeCandidateWork(activeContract, {
        simulatedNodeId: activeContract.selected_node,
        simulatedNodeName: "Node C (Reasoning Worker)",
        simulateStaleParent: simOptions.simulateStaleParent,
        simulateCapabilityViolation: simOptions.simulateCapabilityViolation,
        simulateTestFailure: simOptions.simulateTestFailure
      });
      setCandidateResult(candidate);
    } finally {
      setIsExecutingCandidate(false);
    }
  };

  // Commit Plane verifies candidate result through the 9 checks
  const handleVerifyAndCommit = async () => {
    if (!candidateResult) return;
    setIsVerifyingCommit(true);
    try {
      const result = await controlPlaneEngine.verifyAndCommit(
        candidateResult,
        activeContract,
        activeEquivalencePolicy
      );
      setCommitResult(result);
    } finally {
      setIsVerifyingCommit(false);
    }
  };

  // Run OCC simulation
  const handleRunOccSimulation = async () => {
    setIsRunningOcc(true);
    try {
      const scenario = await controlPlaneEngine.runOptimisticConcurrencyDemonstrator();
      setOccScenario(scenario);
    } finally {
      setIsRunningOcc(false);
    }
  };

  // Run Stranger GPU simulation
  const handleRunStrangerGpu = async () => {
    setIsStrangerExecuting(true);
    setStrangerCommit(null);
    try {
      const strangerContract: ExecutionPlanContract = {
        task_id: "QM-STRANGER-771",
        state_root: controlPlaneEngine.getStateRoot(),
        required_capabilities: ["webgpu_compute", "matrix_multiply"],
        authorized_actions: ["READ", "COMPUTE"], // NEVER WRITE!
        selected_model: "local/qwen-draft",
        selected_node: "stranger-gpu-worker-0x89",
        precision: "FP16",
        runtime: "WebGPU",
        memory_refs: ["mem://task/stranger-vector-shard"],
        energy_cost_budget: {
          maxJoules: 180,
          measuredJoules: 124.5,
          wattsEstimated: 35.0,
          costTokens: 400,
          sloLatencyMs: 4000
        },
        verification_policy: "DETERMINISTIC_TEST",
        fallback_nodes: ["node-local-wasm"],
        result_hash: "0xplan_stranger_sandbox_99a",
        plan_signature: "sig:ed25519:dispatcher_sandbox",
        canonical_commit_status: "PROPOSED"
      };

      const cand = await controlPlaneEngine.executeCandidateWork(strangerContract, {
        simulatedNodeId: "stranger-gpu-worker-0x89",
        simulatedNodeName: "Stranger GPU (Zero-Trust Leased Vessel)",
        customAnswer: "Candidate calculation complete. Bounded draft tokens generated under zero-trust sandbox without access to canonical state root."
      });
      setStrangerCandidate(cand);

      // Immediately run commit plane checks
      const commit = await controlPlaneEngine.verifyAndCommit(cand, strangerContract, "DETERMINISTIC_TEST");
      setStrangerCommit(commit);
    } finally {
      setIsStrangerExecuting(false);
    }
  };

  // Planner contract creation
  const handleGenerateContract = async () => {
    setIsGeneratingPlan(true);
    try {
      const contract = await controlPlaneEngine.createExecutionPlanContract({
        taskPrompt: plannerPrompt,
        precision: plannerPrecision,
        runtime: plannerRuntime,
        sloLatencyMs: plannerSloMs
      });
      setActiveContract(contract);
      setCandidateResult(null);
      setCommitResult(null);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCopyContractJson = () => {
    if (!activeContract) return;
    navigator.clipboard.writeText(JSON.stringify(activeContract, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* ============================================================= */}
      {/* HERO BANNER: SOVEREIGN ROOT & 4-PLANE ARCHITECTURE           */}
      {/* ============================================================= */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 uppercase">
                Update 003 Sovereign Substrate
              </span>
              <span className="text-xs text-zinc-400">
                4 Architectural Planes • Explicit Control & Commit Separation
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950/90 px-3.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">Canonical State Root:</span>
              <span className="text-emerald-400 font-bold truncate max-w-[140px] md:max-w-[220px]">
                {controlPlaneEngine.getStateRoot()}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>Guardian Oracle / Q-Mesh — Sovereign Root</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-zinc-500">Conceived &amp; Architected by:</span>
              <span className="text-amber-300 font-bold">Kenneth Cripps (Ken X)</span>
            </div>
          </div>

          {/* The 5 Axioms of Sovereign AI */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/30 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sovereign Root Mantra (5 Foundational Axioms)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-200">
                <span className="text-emerald-400 font-bold block text-[10px]">AXIOM 1</span>
                Knowledge can propagate.
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-200">
                <span className="text-emerald-400 font-bold block text-[10px]">AXIOM 2</span>
                Privilege cannot.
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-200">
                <span className="text-emerald-400 font-bold block text-[10px]">AXIOM 3</span>
                Compute can migrate.
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-200">
                <span className="text-emerald-400 font-bold block text-[10px]">AXIOM 4</span>
                State remains sovereign.
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 font-bold shadow-sm">
                <span className="text-emerald-400 font-bold block text-[10px]">CLOSING AXIOM 5</span>
                Execution proposes. Verification disposes.
              </div>
            </div>
          </div>

          {/* Sub-Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-zinc-800/80 scrollbar-none text-xs">
            {[
              { id: "commit_plane", label: "Commit Plane & Invariants", icon: ShieldCheck, highlight: true },
              { id: "occ", label: "Optimistic Concurrency", icon: Workflow },
              { id: "stranger_gpu", label: "Stranger GPU Protocol", icon: Users },
              { id: "tree", label: "4-Plane Tree", icon: GitBranch },
              { id: "planner", label: "Execution Planner", icon: FileCheck },
              { id: "router", label: "Joules Router", icon: Zap },
              { id: "comed", label: "COMED Gate", icon: Shield },
              { id: "nebulasd", label: "NebulaSD Pools", icon: Boxes },
              { id: "pamer", label: "PaMER Memory", icon: Database },
              { id: "precision", label: "Precision Auditor", icon: Scale },
              { id: "brief", label: "Morning Report", icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold"
                      : tab.highlight
                      ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60"
                      : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: COMMIT PLANE & INVARIANT STUDIO                         */}
      {/* ============================================================= */}
      {activeSubTab === "commit_plane" && (
        <div className="space-y-6">
          {/* Core Invariant Callout */}
          <div className="p-4 rounded-xl bg-zinc-950 border-l-4 border-l-emerald-500 border-y border-r border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Core Architectural Invariant</span>
              </div>
              <div className="text-sm font-bold text-white">
                "Execution does not imply mutation authority."
              </div>
              <p className="text-xs text-zinc-400 font-sans max-w-3xl leading-relaxed">
                A node receiving a signed execution plan receives permission to compute, not permission to rewrite canonical reality.
                The node returns candidate evidence rather than truth. Its result remains provisional until the Commit Plane verifies all 9 checks.
              </p>
            </div>
            <button
              onClick={handleLoadNodeCExemplar}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reload Node C Specimen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Signed Execution Contract & Node C Execution */}
            <div className="lg:col-span-6 space-y-4">
              {/* Contract Card */}
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Signed Execution Contract</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      Task: {activeContract.task_id}
                    </span>
                    <button
                      onClick={handleCopyContractJson}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                      title="Copy Contract JSON"
                    >
                      {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Assigned Node</span>
                    <span className="text-emerald-300 font-bold">{activeContract.selected_node}</span>
                    <span className="text-zinc-500 block text-[10px]">Model: {activeContract.selected_model}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Authorized Actions</span>
                    <div className="flex flex-wrap gap-1">
                      {activeContract.authorized_actions.map(act => (
                        <span key={act} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">
                          {act}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] text-red-400/80 block">WRITE: FORBIDDEN</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Energy & Latency Budget</span>
                    <span className="text-zinc-200 font-bold">{activeContract.energy_cost_budget.maxJoules} Joules</span>
                    <span className="text-zinc-500 block text-[10px]">Max Latency: {activeContract.energy_cost_budget.sloLatencyMs}ms</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Required Capabilities</span>
                    <span className="text-zinc-300 truncate block text-[10px]">
                      {activeContract.required_capabilities.join(", ")}
                    </span>
                    <span className="text-zinc-500 block text-[10px]">Precision: {activeContract.precision}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-[10px] space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Parent State Root:</span>
                    <span className="text-zinc-300 font-mono truncate max-w-[200px]">{activeContract.state_root}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory References:</span>
                    <span className="text-zinc-300 font-mono">{activeContract.memory_refs.join(" • ")}</span>
                  </div>
                </div>

                {/* Simulation Toggles to test Commit Plane Resilience */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Resilience & Fault Injections (Test Commit Gate)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSimOptions(s => ({ ...s, simulateStaleParent: !s.simulateStaleParent }))}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        simOptions.simulateStaleParent
                          ? "bg-amber-950/50 border-amber-500 text-amber-200"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-bold text-[10px]">Stale Parent Root</div>
                      <div className="text-[9px] text-zinc-500">Triggers OCC Rejection</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimOptions(s => ({ ...s, simulateCapabilityViolation: !s.simulateCapabilityViolation }))}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        simOptions.simulateCapabilityViolation
                          ? "bg-red-950/50 border-red-500 text-red-200"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-bold text-[10px]">Scope Leak</div>
                      <div className="text-[9px] text-zinc-500">Attempted Mutation</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimOptions(s => ({ ...s, simulateTestFailure: !s.simulateTestFailure }))}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        simOptions.simulateTestFailure
                          ? "bg-purple-950/50 border-purple-500 text-purple-200"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-bold text-[10px]">Invariant Test Fail</div>
                      <div className="text-[9px] text-zinc-500">Evidence Rejection</div>
                    </button>
                  </div>
                </div>

                {/* Execute Candidate Button */}
                <button
                  type="button"
                  onClick={handleExecuteCandidate}
                  disabled={isExecutingCandidate}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isExecutingCandidate ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Node Computing Bounded Work...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>1. Node Executes & Proposes Candidate Result</span>
                    </>
                  )}
                </button>
              </div>

              {/* Candidate Result Envelope */}
              {candidateResult && (
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-bold text-white">Candidate Result Envelope (Provisional)</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      PROVISIONAL EVIDENCE
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-1.5 font-mono text-[11px]">
                    <div className="text-zinc-300 font-sans">{candidateResult.result.answer}</div>
                    <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
                      <span>Joules: <strong className="text-emerald-400">{candidateResult.energy_consumed_joules} J</strong></span>
                      <span>Latency: <strong className="text-zinc-200">{candidateResult.actual_latency_ms} ms</strong></span>
                      <span>Hardware: <strong className="text-cyan-400">{candidateResult.runtime_attestation.hardwareType}</strong></span>
                    </div>
                  </div>

                  {/* Evidence & Attestation Snippet */}
                  <div className="space-y-1.5 text-[10px]">
                    <div className="text-zinc-400 font-bold uppercase tracking-wider">Returned Evidence:</div>
                    <div className="p-2 rounded bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Trace CID:</span>
                        <span className="text-cyan-400 font-mono">{candidateResult.evidence.executionTraceCid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Result Digest Hash:</span>
                        <span className="text-zinc-300 font-mono">{candidateResult.result_hash.slice(0, 24)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Worker Signature:</span>
                        <span className="text-zinc-300 font-mono">{candidateResult.signature.slice(0, 30)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit to Commit Plane Button */}
                  <button
                    type="button"
                    onClick={handleVerifyAndCommit}
                    disabled={isVerifyingCommit}
                    className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingCommit ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Evaluating 9 Commit Checks...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>2. Submit to Commit Plane (Verify & Commit)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Commit Plane Arbitration & The 9 Checks */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Commit Plane Verification Pipeline</h3>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    9 Independent Checks
                  </span>
                </div>

                {/* Equivalence Policy Selector */}
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    Equivalence Policy (arXiv 2609.26621 Invariant)
                  </label>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {[
                      { id: "EXACT", label: "EXACT", tip: "Hash match" },
                      { id: "DETERMINISTIC_TEST", label: "TEST", tip: "Tests pass" },
                      { id: "SEMANTIC", label: "SEMANTIC", tip: "Meaning match" },
                      { id: "CONSENSUS", label: "CONSENSUS", tip: "Peer quorum" },
                      { id: "ATTESTED", label: "ATTESTED", tip: "TEE proof" }
                    ].map(pol => (
                      <button
                        key={pol.id}
                        type="button"
                        onClick={() => setActiveEquivalencePolicy(pol.id as EquivalencePolicyType)}
                        className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                          activeEquivalencePolicy === pol.id
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                        title={pol.tip}
                      >
                        <div className="truncate">{pol.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">
                    {activeEquivalencePolicy === "EXACT" && "Requires exact byte hash match."}
                    {activeEquivalencePolicy === "DETERMINISTIC_TEST" && "Artifact may vary across BF16/FP16; required tests must pass."}
                    {activeEquivalencePolicy === "SEMANTIC" && "Output text may differ; semantic resonance constraints must hold."}
                    {activeEquivalencePolicy === "CONSENSUS" && "Quorum of independent peer nodes must confirm result."}
                    {activeEquivalencePolicy === "ATTESTED" && "Hardware secure enclave signature is sufficient."}
                  </p>
                </div>

                {/* Interactive Visual Commit Decision Tree */}
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">candidate result</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">VERIFY (9 Checks)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                    {commitResult ? (
                      commitResult.status === "ACCEPTED" ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold animate-pulse">
                          CANONICAL COMMIT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500 text-red-300 font-bold">
                          REJECTED ({commitResult.status})
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                        REJECT / ACCEPT
                      </span>
                    )}
                  </div>
                </div>

                {/* The 9 Checks Inspection List */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(commitResult ? commitResult.checks : [
                    { checkId: "authorized_node", name: "1. Authorized Node", question: "Was this the authorized node?", passed: true, details: "Verified against contract selected_node.", evaluator: "Identity Registry" },
                    { checkId: "authorized_task", name: "2. Authorized Task", question: "Was this the authorized task?", passed: true, details: "Plan hash matches contract signature.", evaluator: "Task Gate" },
                    { checkId: "consumed_state", name: "3. Consumed State", question: "Did it consume expected state?", passed: true, details: "Parent state root matches dispatch state.", evaluator: "State Anchor" },
                    { checkId: "capabilities_sufficient", name: "4. Capability Envelope", question: "Were capabilities sufficient?", passed: true, details: "Required runtime capabilities matched.", evaluator: "Capability Guard" },
                    { checkId: "scope_compliance", name: "5. Scope Compliance", question: "Did execution remain in scope?", passed: true, details: "Strictly non-mutating (READ/COMPUTE only).", evaluator: "Policy Engine" },
                    { checkId: "evidence_satisfaction", name: "6. Evidence & Trace", question: "Does evidence satisfy policy?", passed: true, details: "Trace CID present, tests passed.", evaluator: "Trace Arbiter" },
                    { checkId: "parent_state_unchanged", name: "7. OCC Parent State Check", question: "Did parent state change while working?", passed: true, details: "Optimistic concurrency control check.", evaluator: "Concurrency Engine" },
                    { checkId: "equivalence_policy", name: "8. Equivalence Evaluation", question: "Is exact or semantic equality met?", passed: true, details: "Evaluates under active equivalence policy.", evaluator: "Equivalence Arbiter" },
                    { checkId: "authorization_valid", name: "9. Authorization Validity", question: "Has authorization expired?", passed: true, details: "SLO latency bounds & lease unexpired.", evaluator: "Lease Sentinel" }
                  ]).map((check, idx) => (
                    <div
                      key={check.checkId || idx}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        commitResult
                          ? check.passed
                            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                            : "bg-red-950/40 border-red-500 text-red-200"
                          : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-2">
                          {commitResult ? (
                            check.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            )
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-zinc-600 inline-block shrink-0" />
                          )}
                          <span>{check.name}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-sans">{check.evaluator}</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 font-sans mt-0.5 pl-5">
                        {check.question}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1 pl-5">
                        {check.details}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Commit Decision Result Banner */}
                {commitResult && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                      commitResult.status === "ACCEPTED"
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        : commitResult.status === "CONCURRENCY_CONFLICT_REBASE_REQUIRED"
                        ? "bg-amber-950/60 border-amber-500 text-amber-200"
                        : "bg-red-950/60 border-red-500 text-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2 text-sm">
                        {commitResult.status === "ACCEPTED" ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>CANONICAL COMMIT ACCEPTED</span>
                          </>
                        ) : commitResult.status === "CONCURRENCY_CONFLICT_REBASE_REQUIRED" ? (
                          <>
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span>CONCURRENCY CONFLICT — STALE PARENT</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span>PROPOSAL REJECTED</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-mono">
                        {commitResult.passedChecksCount} / {commitResult.totalChecksCount} Checks Passed
                      </span>
                    </div>

                    {commitResult.status === "ACCEPTED" ? (
                      <div className="space-y-1.5 text-[11px] pt-2 border-t border-emerald-500/30">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Previous State Root:</span>
                          <span className="text-zinc-300 font-mono">{commitResult.parent_state_root.slice(0, 24)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-400 font-bold">New Canonical State Root:</span>
                          <span className="text-emerald-300 font-mono font-bold">{commitResult.new_state_root}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Commit Transaction:</span>
                          <span className="text-cyan-300 font-mono">{commitResult.commit_tx_hash}</span>
                        </div>
                        <div className="text-[10px] text-emerald-300/80 font-sans italic mt-1">
                          ✓ State transition committed authoritatively by Commit Plane. Node C held zero mutation privileges.
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] pt-1 text-zinc-300 font-sans">
                        <strong>Reason:</strong> {commitResult.rejectionReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: OPTIMISTIC CONCURRENCY CONTROL (OCC)                    */}
      {/* ============================================================= */}
      {activeSubTab === "occ" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Optimistic Concurrency Control (OCC) Simulator</h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans max-w-3xl leading-relaxed">
                  "That last parent state changed? check matters enormously. It gives Q-Mesh something analogous to optimistic concurrency control.
                  Two nodes can work from the same state simultaneously without either being allowed to silently overwrite the other's accepted result."
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunOccSimulation}
                disabled={isRunningOcc}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer"
              >
                {isRunningOcc ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Simulating Concurrent Nodes...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Parallel OCC Collision Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {occScenario && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-xs">
              {/* Node A (Winner) */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/50 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{occScenario.nodeA.nodeName} (Commits 1st)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    COMMITTED
                  </span>
                </div>

                <div className="space-y-2 text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Task</span>
                    <span>{occScenario.nodeA.taskPrompt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Started at State Root</span>
                    <span className="font-mono text-zinc-300">{occScenario.initialStateRoot.slice(0, 24)}...</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Candidate Result Digest</span>
                    <span className="font-mono text-emerald-300">{occScenario.nodeA.candidateResultHash}</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 font-sans">
                    ✓ Node A completed first. Parent state matched canonical head. Commit Plane approved candidate and advanced canonical state root.
                  </div>
                </div>
              </div>

              {/* Node C (OCC Conflict Caught) */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/50 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{occScenario.nodeB.nodeName} (Completes 2nd)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                    OCC STALE PARENT
                  </span>
                </div>

                <div className="space-y-2 text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Task</span>
                    <span>{occScenario.nodeB.taskPrompt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Started at State Root</span>
                    <span className="font-mono text-zinc-300">{occScenario.initialStateRoot.slice(0, 24)}...</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Current Head State Root</span>
                    <span className="font-mono text-amber-300">{occScenario.canonicalHeadStateRoot.slice(0, 24)}...</span>
                  </div>
                  <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 font-sans">
                    <strong>Check 7 Triggered:</strong> {occScenario.nodeB.resolution}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 text-zinc-400 font-sans leading-relaxed">
            <div className="text-zinc-200 font-mono font-bold text-sm">Why Optimistic Concurrency Control Matters for Sovereign Mesh:</div>
            <p>
              In traditional distributed systems, either locks stall execution or silent overwrites corrupt state.
              In Q-Mesh, nodes compute opportunistically in parallel. The Commit Plane acts as the authoritative atomic serializer:
              no worker can overwrite another worker’s accepted state without explicitly rebasing onto the latest state root.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: STRANGER GPU ZERO-TRUST PROTOCOL                       */}
      {/* ============================================================= */}
      {activeSubTab === "stranger_gpu" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Stranger GPU Protocol (Zero-Trust Compute Leasing)</h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans max-w-3xl leading-relaxed">
                  "Q-Mesh doesn't actually require nodes to trust each other. They need to trust the protocol. A stranger's GPU could eventually participate.
                  It receives only the state required by its capability envelope. It possesses only the authority encoded in its execution contract.
                  It returns evidence rather than truth. Its result remains provisional until verification."
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunStrangerGpu}
                disabled={isStrangerExecuting}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer"
              >
                {isStrangerExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sandboxing Stranger Node...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Simulate Stranger GPU Participation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">1. Minimal State Ingress</span>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                Stranger GPU receives only the exact memory vector necessary for the task shard (e.g. PaMER hidden state vector).
                It never receives private keys, canonical state roots, or full user session history.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">2. Strict Compute Envelope</span>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                Actions are strictly constrained to <strong className="text-emerald-300 font-mono">READ</strong> and <strong className="text-emerald-300 font-mono">COMPUTE</strong>.
                The stranger node possesses zero commit credentials.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">3. Evidence, Not Truth</span>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                Stranger node returns evidence (intermediate tensors, log-probabilities, execution trace CID, attestation).
                Commit Plane checks the evidence deterministically before admitting into state.
              </p>
            </div>
          </div>

          {strangerCandidate && (
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Stranger Worker Execution Trace: {strangerCandidate.node_name}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                  Node ID: {strangerCandidate.node_id}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                {strangerCandidate.result.answer}
              </div>

              {strangerCommit && (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Stranger Evidence Verified & Committed by Local Commit Plane</span>
                  </div>
                  <p className="font-sans text-zinc-300 text-[11px]">
                    The local Commit Plane verified all symbolic invariants and deterministic tests.
                    The compute was successfully leased and utilized without granting the stranger GPU any mutation rights or sensitive state.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: 4-PLANE ARCHITECTURAL TREE                             */}
      {/* ============================================================= */}
      {activeSubTab === "tree" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tree Structure Panel */}
          <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100">Update 003 Sovereign Architecture Tree</h3>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Click any node to inspect contract specs
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 text-xs">
              {/* Root */}
              <div
                onClick={() => setSelectedTreeNode(UPDATE_003_TREE_DATA)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedTreeNode.id === UPDATE_003_TREE_DATA.id
                    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{UPDATE_003_TREE_DATA.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {UPDATE_003_TREE_DATA.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">{UPDATE_003_TREE_DATA.subtitle}</div>
              </div>

              {/* Children Planes */}
              {UPDATE_003_TREE_DATA.children?.map(plane => (
                <div key={plane.id} className="pl-3 border-l-2 border-zinc-800 space-y-2">
                  <div
                    onClick={() => setSelectedTreeNode(plane)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      selectedTreeNode.id === plane.id
                        ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{plane.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {plane.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{plane.productionMove}</div>
                  </div>

                  {/* Sub-children */}
                  {plane.children && (
                    <div className="pl-4 border-l border-zinc-800/80 space-y-1.5">
                      {plane.children.map(subItem => (
                        <div
                          key={subItem.id}
                          onClick={() => setSelectedTreeNode(subItem)}
                          className={`p-2 rounded-md border text-[11px] transition-all cursor-pointer ${
                            selectedTreeNode.id === subItem.id
                              ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm"
                              : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-400"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="truncate pr-2">{subItem.title}</span>
                            {subItem.paperCitation && (
                              <span className="text-[9px] px-1 rounded bg-zinc-800 text-cyan-400 shrink-0 font-sans">
                                {subItem.paperCitation.split("(")[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Node Detail Inspector Drawer */}
          <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Node Inspector</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold">
                {selectedTreeNode.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Element</span>
                <div className="text-sm font-bold text-emerald-300 mt-0.5">{selectedTreeNode.title}</div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Description</span>
                <p className="text-zinc-300 font-sans mt-1 leading-relaxed">
                  {selectedTreeNode.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Production Move
                </span>
                <p className="text-xs text-emerald-200 font-sans font-medium leading-snug whitespace-pre-line">
                  "{selectedTreeNode.productionMove}"
                </p>
              </div>

              {selectedTreeNode.paperCitation && (
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Research Grounding</span>
                  <div className="text-xs font-mono text-cyan-300 mt-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedTreeNode.paperCitation}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">Technical Specifications</span>
                <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                  {Object.entries(selectedTreeNode.technicalSpecs || {}).map(([key, val]) => (
                    <div key={key} className="flex items-start justify-between gap-2 text-[11px]">
                      <span className="text-zinc-400 font-sans">{key}:</span>
                      <span className="text-zinc-200 font-mono text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: INFERENCE EXECUTION PLANNER                             */}
      {/* ============================================================= */}
      {activeSubTab === "planner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Execution Contract Generator</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Pillar 4 (arXiv 2609.23130)
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                  Task Specification / Prompt
                </label>
                <textarea
                  value={plannerPrompt}
                  onChange={e => setPlannerPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-emerald-500 text-xs font-mono"
                  placeholder="Describe inference task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    Target Precision
                  </label>
                  <select
                    value={plannerPrecision}
                    onChange={e => setPlannerPrecision(e.target.value as PrecisionFormat)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BF16">BF16 (Bfloat16)</option>
                    <option value="FP16">FP16 (Half Precision)</option>
                    <option value="FP32">FP32 (Single Precision)</option>
                    <option value="INT8">INT8 (Quantized)</option>
                    <option value="INT4">INT4 (Ultra-compact)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    Target Runtime
                  </label>
                  <select
                    value={plannerRuntime}
                    onChange={e => setPlannerRuntime(e.target.value as TargetRuntime)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="WebGPU">WebGPU (Browser Edge)</option>
                    <option value="WASM_SIMD">WASM SIMD (Fallback)</option>
                    <option value="TensorRT">TensorRT (Server GPU)</option>
                    <option value="OpenVINO">OpenVINO (Intel NPU)</option>
                    <option value="RKNN">RKNN (Rockchip NPU)</option>
                    <option value="ONNX_Runtime">ONNX Runtime</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    SLO Latency Budget
                  </label>
                  <span className="text-emerald-400 font-bold">{plannerSloMs} ms</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={50}
                  value={plannerSloMs}
                  onChange={e => setPlannerSloMs(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 font-sans">
                <div className="font-bold text-zinc-300 font-mono text-xs">Planner Invariant:</div>
                <div>• Nodes receive READ and COMPUTE rights only.</div>
                <div>• Output remains provisional until Commit Plane verification.</div>
              </div>

              <button
                type="button"
                onClick={handleGenerateContract}
                disabled={isGeneratingPlan}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingPlan ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Generate Signed Execution Contract</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Generated Contract Specimen</span>
              </h3>
              <button
                onClick={handleCopyContractJson}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-1"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedContract ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            <pre className="bg-zinc-900/90 p-4 rounded-lg border border-zinc-800 overflow-x-auto text-[11px] text-emerald-300 font-mono leading-relaxed max-h-[460px]">
              {JSON.stringify(activeContract, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 6: JOULES ROUTER                                          */}
      {/* ============================================================= */}
      {activeSubTab === "router" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Capability × Energy × Trust Router (Measured Joules)</span>
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  arXiv 2609.23085 — Routing objectives include measured joules (Watts × latency), not just price or latency.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-zinc-400">Task SLO:</span>
                <input
                  type="range"
                  min={100}
                  max={800}
                  step={25}
                  value={routerSloMs}
                  onChange={e => {
                    const newSlo = Number(e.target.value);
                    setRouterSloMs(newSlo);
                    setRoutingCandidates(controlPlaneEngine.evaluateRoutingCandidates(newSlo));
                  }}
                  className="w-36 accent-emerald-500 cursor-pointer"
                />
                <span className="text-emerald-400 font-bold font-mono">{routerSloMs} ms</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {routingCandidates.map(cand => (
                <div
                  key={cand.nodeId}
                  className={`p-4 rounded-xl border transition-all ${
                    cand.selectedForTask
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-2">
                    <span className="truncate pr-1">{cand.nodeName}</span>
                    {cand.selectedForTask && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold uppercase">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Measured Energy:</span>
                      <span className="text-amber-400 font-bold">{cand.measuredJoules} Joules</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Latency:</span>
                      <span className="text-zinc-300 font-mono">{cand.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Trust Score:</span>
                      <span className="text-emerald-400">{cand.trustScore} / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Capability:</span>
                      <span className="text-cyan-400">{cand.capabilityScore} / 100</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold">
                      <span className="text-zinc-400">Router Score:</span>
                      <span className="text-emerald-300 font-mono text-sm">{cand.compositeRoutingScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 7: COMED CONFIDENCE / ESCALATION GATE                     */}
      {/* ============================================================= */}
      {activeSubTab === "comed" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>COMED Confidence / Escalation Gate (AACL-IJCNLP 2026)</span>
                </h3>
                <p className="text-zinc-400 font-sans mt-0.5">
                  Multi-agent collaboration is non-monotonic: peers sometimes rescue an incorrect answer, but can also corrupt an already correct one.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(["SIMPLE", "MODERATE", "HIGH", "AMBIGUOUS"] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setComedComplexity(c);
                      const res = controlPlaneEngine.evaluateConfidenceGate({
                        prompt: "Harmonic consensus probe",
                        localAnswer: c === "HIGH" || c === "AMBIGUOUS"
                          ? "Potential cross-cluster variance detected in high-order tensor harmonic roots."
                          : "All 12 localized nodes in the sanctuary cluster are operating at 528Hz coherent resonance with 0 state divergence.",
                        taskComplexity: c
                      });
                      setComedGateResult(res);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      comedComplexity === c
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Anchor Consistency</span>
                <span className="text-base font-bold text-emerald-400">
                  {(comedGateResult.anchorSelfConsistency * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-zinc-500 block">Threshold: &gt; 75% for bypass</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Router Confidence Margin</span>
                <span className="text-base font-bold text-cyan-400">
                  {comedGateResult.routerMargin.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-500 block">Threshold: &gt; 0.15 margin</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Peer Corruption Risk</span>
                <span className={`text-base font-bold ${
                  comedGateResult.peerCorruptionRisk === "HIGH_PROTECTED" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {comedGateResult.peerCorruptionRisk}
                </span>
                <span className="text-[10px] text-zinc-500 block">Isolated against false consensus</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              comedGateResult.needsPeerEscalation
                ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
            }`}>
              <div className="font-bold text-xs flex items-center gap-2 mb-1">
                {comedGateResult.needsPeerEscalation ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Selective Peer Escalation Triggered</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Local Anchor Protected (Swarm Bypassed to Prevent Corruption)</span>
                  </>
                )}
              </div>
              <p className="text-zinc-300 font-sans text-xs">
                {comedGateResult.escalationReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 8: NEBULASD SPECULATIVE POOLS                             */}
      {/* ============================================================= */}
      {activeSubTab === "nebulasd" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-400" />
                  <span>NebulaSD Interchangeable Speculative Pools (arXiv 2609.29364)</span>
                </h3>
                <p className="text-zinc-400 font-sans mt-0.5">
                  "State belongs to the task; hardware is leased to the task." Separating draft and target workers into dynamic pools.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                +50.4% Request Rounds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workerPools.map(pool => (
                <div key={pool.poolId} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-zinc-200">{pool.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400">
                      {pool.poolType}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-zinc-400">
                    <div>Workers: <span className="text-zinc-200 font-mono">{pool.workerNodeIds.length} nodes</span></div>
                    <div>Async KV Prep: <span className="text-emerald-400">{pool.asyncKvPreparationActive ? "Active" : "Inactive"}</span></div>
                    <div>Speedup Gain: <span className="text-cyan-400 font-bold">+{pool.requestRoundProcessingRateGain}%</span></div>
                    <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 truncate">
                      Lease: {pool.hardwareLeaseId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 9: PAMER EVENT-DRIVEN MEMORY                              */}
      {/* ============================================================= */}
      {activeSubTab === "pamer" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>PaMER Event-Driven Memory Controller (arXiv 2609.27286)</span>
                </h3>
                <p className="text-zinc-400 font-sans mt-0.5">
                  Pre-action hidden state uncertainty triggers compression or evidence recall instead of naive context length thresholds.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Up to 58% Token Reduction
              </span>
            </div>

            <div className="space-y-3">
              {pamerSignals.map(sig => (
                <div key={sig.stepIndex} className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-zinc-200">Step {sig.stepIndex}: {sig.actionName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      sig.eventTriggered === "RETRIEVE_EVIDENCE"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : sig.eventTriggered === "COMPRESS_HISTORY"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {sig.eventTriggered}
                    </span>
                  </div>
                  <p className="text-zinc-300 font-sans text-xs">{sig.rationale}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <span>Hidden State Norm: <strong className="text-zinc-200">{sig.preActionHiddenStateNorm}</strong></span>
                    <span>Tokens Saved: <strong className="text-emerald-400">+{sig.tokensSavedVsThreshold}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 10: PRECISION DETERMINISM AUDITOR                         */}
      {/* ============================================================= */}
      {activeSubTab === "precision" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Precision ≠ Determinism Auditor (arXiv 2609.26621)</span>
                </h3>
                <p className="text-zinc-400 font-sans mt-0.5">
                  Greedy decoding diverges across BF16 vs FP16. Selective FP32 recomputing of the LM head restores agreement with &lt;4% overhead.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                +33.4 Points Agreement
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">BF16 Greedy Trajectory</span>
                <div className="p-2.5 rounded bg-zinc-950 font-mono text-[11px] text-emerald-300">
                  {precisionProfile.bf16TokenTrajectory.join(" ")}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">FP16 Greedy Trajectory</span>
                <div className="p-2.5 rounded bg-zinc-950 font-mono text-[11px] text-cyan-300">
                  {precisionProfile.fp16TokenTrajectory.join(" ")}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Selective FP32 LM-Head Recovery Enforced</span>
              </div>
              <p className="text-xs font-sans text-zinc-300">
                Agreement boosted from {precisionProfile.agreementRateWithoutMitigation}% to {precisionProfile.agreementRateWithFP32Head}% with only {precisionProfile.latencyOverheadPercent}% latency overhead.
                Semantic equivalence is strictly preserved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 11: MORNING REPORT DIGEST                                 */}
      {/* ============================================================= */}
      {activeSubTab === "brief" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs leading-relaxed">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Sovereign AI Brief — September 25, 2026</span>
                </h3>
                <span className="text-zinc-400 text-[11px]">Curated &amp; Synthesized by Kenneth Cripps (Ken X) • 8 Peer-Reviewed Syntheses</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Update 003 Canonical
              </span>
            </div>

            <div className="space-y-4 text-zinc-300 font-sans">
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-white font-mono text-xs">1. From Inference Engine to Inference Control Plane</h4>
                <p className="text-[11px] text-zinc-400 mt-1">arXiv 2609.23130 — The scarce resource shifts from raw FLOPs toward managed state, placement, and scheduling quality.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-white font-mono text-xs">2. NebulaSD — Interchangeable Worker Pools</h4>
                <p className="text-[11px] text-zinc-400 mt-1">arXiv 2609.29364 — State belongs to the task; hardware is leased to the task. 50.4% higher request-round rate.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-white font-mono text-xs">3. Measured Joules, Learned Routes</h4>
                <p className="text-[11px] text-zinc-400 mt-1">arXiv 2609.23085 — Watts can be every bit as important as milliseconds. Route against measured energy.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-white font-mono text-xs">4. COMED — Prevent Swarm Corruption</h4>
                <p className="text-[11px] text-zinc-400 mt-1">AACL-IJCNLP 2026 — Local answer → confidence test → cheap verification → selective peer escalation.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
