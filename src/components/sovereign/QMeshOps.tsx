import React from "react";
import { useMeshStatus } from "../../hooks/useMeshStatus";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { Radio, AlertTriangle, ShieldCheck, RefreshCw, Zap, Cpu, Network } from "lucide-react";

export const QMeshOps: React.FC = () => {
  const { partitionState, triggerPartition, peers } = useMeshStatus();
  const { isAirGapped, toggleAirGap } = useSovereignNode();

  const isPartitioned = partitionState.isPartitioned;

  return (
    <div id="qmesh-ops-panel" className="space-y-6 font-mono">
      {/* Control Banner */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
              isPartitioned
                ? "bg-rose-950/60 border-rose-500/50 text-rose-400 animate-pulse"
                : "bg-cyan-950/60 border-cyan-500/50 text-cyan-400"
            }`}
          >
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              QMesh Network Operations & Partition Recovery
            </h3>
            <p className="text-xs text-zinc-400">
              {isPartitioned ? "NETWORK PARTITION SIMULATED (ISLAND MODE)" : "Consensus Synchronized across All Sovereign Nodes"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => triggerPartition(!isPartitioned)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPartitioned
                ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-500/50"
            }`}
          >
            {isPartitioned ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Heal Partition & Reconcile Clocks</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Network Partition</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleAirGap}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAirGapped
                ? "bg-amber-500 text-black border-amber-400"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
            }`}
          >
            <span>{isAirGapped ? "Air-Gap: ACTIVE" : "Toggle Air-Gap"}</span>
          </button>
        </div>
      </div>

      {/* Vector Clock & Consensus Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase">Partition Group</div>
          <div className="text-sm font-bold text-cyan-400 truncate">{partitionState.partitionGroupId}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase">Local Vector Clock</div>
          <div className="text-sm font-bold text-zinc-200">v{partitionState.localClock}.0.0</div>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase">Unreplicated Blocks</div>
          <div className={`text-sm font-bold ${partitionState.unreplicatedBlocks > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {partitionState.unreplicatedBlocks} blocks
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase">Consensus Status</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>67% BFT Quorum</span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-zinc-200">Mesh Peer Telemetry & Routing Links</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {isPartitioned ? "Split Cluster (Island State)" : "All Links Fully Connected"}
          </span>
        </div>

        <div className="relative py-6 px-4 bg-radial from-zinc-900/60 to-zinc-950 rounded-lg border border-zinc-800/60 flex flex-wrap items-center justify-around gap-6">
          {peers.map((node, i) => (
            <div
              key={node.id}
              className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                isPartitioned && i > 0
                  ? "bg-rose-950/30 border-rose-500/50 opacity-60"
                  : "bg-zinc-900 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <div className="text-xs font-bold text-zinc-200">{node.identity.name}</div>
              <div className="text-[10px] text-zinc-500">{node.identity.role}</div>
              <div className="text-[9px] text-cyan-300 font-mono">{node.averageLatencyMs}ms</div>
            </div>
          ))}
        </div>
      </div>

      {/* Update 003 Control-Plane Sovereignty Signals */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              UPDATE 003 TREE ENFORCED
            </span>
            <span className="text-zinc-200 font-bold">Sovereign Execution Substrate (4 Explicit Planes)</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            "Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign. Execution proposes. Verification disposes."
          </p>
          <div className="text-[10px] text-emerald-400/90 font-mono">
            Invariant: Execution does not imply mutation authority. State belongs to the task; hardware is leased to the task.
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
          <span>• 4 Explicit Planes</span>
          <span>• 9 Commit Checks</span>
          <span>• Optimistic Concurrency</span>
        </div>
      </div>
    </div>
  );
};
