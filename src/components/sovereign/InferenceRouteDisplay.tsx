import React from "react";
import { InferenceRouteDecision, InferenceRouteHop } from "../../types/sovereign";
import { Cpu, Network, Cloud, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

interface Props {
  decision: InferenceRouteDecision | null;
  isRunning?: boolean;
}

export const InferenceRouteDisplay: React.FC<Props> = ({ decision, isRunning }) => {
  if (!decision && !isRunning) {
    return (
      <div id="inference-route-idle" className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-500 font-mono">
        Inference router idle. Transmit a query to observe sovereign routing decisions.
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "LOCAL_WEBGPU":
      case "LOCAL_WASM":
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "MESH_PEER":
        return <Network className="w-4 h-4 text-cyan-400" />;
      case "EDGE_CLOUD":
        return <Cloud className="w-4 h-4 text-violet-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div id="inference-route-display" className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
            Routing Topology Circuit
          </span>
        </div>
        {decision && (
          <div className="text-[11px] text-zinc-400 flex items-center gap-2">
            <span>Latency: <strong className="text-emerald-400">{decision.totalLatencyMs}ms</strong></span>
            <span>•</span>
            <span className="text-zinc-500 truncate max-w-[120px]">Hash: #{decision.verifiableHash}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1">
        {["LOCAL_WEBGPU", "MESH_PEER", "EDGE_CLOUD", "SACRED_FALLBACK"].map((tier, idx) => {
          const hop = decision?.hops.find(h => h.tier === tier);
          const isSelected = decision?.selectedTier === tier;
          const isBypassed = hop?.status === "BYPASS";

          return (
            <div
              key={tier}
              className={`p-3 rounded-lg border text-xs relative flex flex-col justify-between transition-all ${
                isSelected
                  ? "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : isBypassed
                  ? "bg-zinc-950/40 border-zinc-800/40 opacity-50"
                  : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getTierIcon(tier)}
                  <span className="font-bold text-[11px] text-zinc-200">
                    {tier === "LOCAL_WEBGPU" ? "Local Node" : tier === "MESH_PEER" ? "QMesh Peer" : tier === "EDGE_CLOUD" ? "Edge Gateway" : "Sacred Fallback"}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <div className="text-[10px] text-zinc-500 mb-2">
                {hop?.reason || (tier === "LOCAL_WEBGPU" ? "On-device WebGPU" : tier === "MESH_PEER" ? "P2P consensus peer" : tier === "EDGE_CLOUD" ? "Cloud AI" : "Deterministic Core")}
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800/60 font-mono">
                <span className="text-zinc-500">Hop {idx + 1}</span>
                <span className={isSelected ? "text-emerald-300 font-semibold" : "text-zinc-600"}>
                  {hop ? `${hop.latencyMs}ms` : "Standby"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
