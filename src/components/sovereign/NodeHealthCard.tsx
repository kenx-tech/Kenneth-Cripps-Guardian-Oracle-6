import React from "react";
import { SovereignNodeRecord } from "../../types/sovereign";
import { Server, Activity, ShieldCheck, Cpu, HardDrive, Zap } from "lucide-react";

interface Props {
  node: SovereignNodeRecord;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const NodeHealthCard: React.FC<Props> = ({ node, isSelected, onSelect }) => {
  const isOnline = node.status === "ONLINE";
  const isLeader = node.identity.role === "LEADER";

  return (
    <div
      id={`node-card-${node.id}`}
      onClick={onSelect}
      className={`p-4 rounded-xl border font-mono transition-all cursor-pointer ${
        isSelected
          ? "bg-zinc-900 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50"
          : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isLeader
                ? "bg-amber-950/40 border-amber-500/50 text-amber-400"
                : "bg-cyan-950/40 border-cyan-500/50 text-cyan-400"
            }`}
          >
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              <span>{node.identity.name}</span>
              {isLeader && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                  APEX
                </span>
              )}
            </div>
            <div className="text-[10px] text-zinc-500 truncate max-w-[170px]">
              {node.identity.nodeId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-rose-500"
            }`}
          />
          <span className="text-[10px] text-zinc-400 font-semibold">{node.status}</span>
        </div>
      </div>

      {/* Hardware specs */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-800/60 text-[11px] mb-3">
        <div className="space-y-0.5">
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Cores
          </div>
          <div className="font-semibold text-zinc-300">{node.hardware.cpuCores} vCPU</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> Memory
          </div>
          <div className="font-semibold text-zinc-300">{node.hardware.memoryGb} GB</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Zap className="w-3 h-3" /> TOPS
          </div>
          <div className="font-semibold text-emerald-400">~{node.hardware.estimatedTops} TOPS</div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Trust: <strong className="text-zinc-200">{node.trustScore}%</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Ping: <strong className="text-zinc-200">{node.averageLatencyMs}ms</strong></span>
        </div>
      </div>
    </div>
  );
};
