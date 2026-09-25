import React from "react";
import { useMeshStatus } from "../../hooks/useMeshStatus";
import { NodeHealthCard } from "./NodeHealthCard";
import { Network, Plus, Shield, RefreshCw } from "lucide-react";

interface Props {
  onRegisterNodeModal?: () => void;
}

export const MeshNodeGrid: React.FC<Props> = ({ onRegisterNodeModal }) => {
  const { peers, selectedNodeId, selectNode } = useMeshStatus();

  return (
    <div id="mesh-node-grid" className="space-y-4 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Network className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Quantum Mesh Cluster Topology</h3>
            <p className="text-xs text-zinc-400">
              {peers.length} Nodes Discovered • Byzantine Fault Tolerant Consensus Active
            </p>
          </div>
        </div>

        {onRegisterNodeModal && (
          <button
            type="button"
            onClick={onRegisterNodeModal}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Join Sovereign Peer</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {peers.map((node) => (
          <NodeHealthCard
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={() => selectNode(selectedNodeId === node.id ? null : node.id)}
          />
        ))}
      </div>
    </div>
  );
};
