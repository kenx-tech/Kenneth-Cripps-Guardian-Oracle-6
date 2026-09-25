import React from "react";
import { Cpu, ShieldCheck, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { useMeshStatus } from "../../hooks/useMeshStatus";

interface Props {
  onClick?: () => void;
}

export const SovereignStatusBadge: React.FC<Props> = ({ onClick }) => {
  const { identity, hardware, isAirGapped } = useSovereignNode();
  const { partitionState } = useMeshStatus();

  const isGpu = hardware?.hasWebGpu;
  const isPartitioned = partitionState.isPartitioned;

  return (
    <button
      id="sovereign-status-badge"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all border ${
        isAirGapped
          ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
          : isPartitioned
          ? "bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse"
          : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
      }`}
      title={identity?.nodeId || "Sovereign Node"}
    >
      <div className="relative flex items-center justify-center">
        {isAirGapped ? (
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        ) : isPartitioned ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        )}
      </div>

      <span className="truncate max-w-[120px]">
        {isAirGapped ? "AIR-GAPPED" : isPartitioned ? "PARTITIONED" : "QMESH ONLINE"}
      </span>

      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/5">
        {isGpu ? "WEBGPU" : "WASM"}
      </span>
    </button>
  );
};
