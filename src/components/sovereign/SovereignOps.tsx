import React, { useState } from "react";
import { LocalInferencePanel } from "./LocalInferencePanel";
import { MeshNodeGrid } from "./MeshNodeGrid";
import { TaskQueuePanel } from "./TaskQueuePanel";
import { MemorySyncPanel } from "./MemorySyncPanel";
import { AuthorityScopePanel } from "./AuthorityScopePanel";
import { QMeshOps } from "./QMeshOps";
import { ControlPlaneSovereigntyView } from "./ControlPlaneSovereigntyView";
import { SovereignStatusBadge } from "./SovereignStatusBadge";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { Cpu, Network, ListOrdered, Database, Shield, Radio, Sparkles, Terminal, Layers } from "lucide-react";

export const SovereignOps: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"controlplane" | "inference" | "mesh" | "tasks" | "memory" | "authority" | "qmesh">("controlplane");
  const { identity, hardware } = useSovereignNode();

  interface TabDef {
    id: "controlplane" | "inference" | "mesh" | "tasks" | "memory" | "authority" | "qmesh";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isSpecial?: boolean;
  }

  const tabs: TabDef[] = [
    { id: "controlplane", label: "Update 003: Control-Plane", icon: Layers, isSpecial: true },
    { id: "inference", label: "Local Inference", icon: Cpu },
    { id: "mesh", label: "Mesh Nodes", icon: Network },
    { id: "tasks", label: "Task Queue", icon: ListOrdered },
    { id: "memory", label: "Memory Ledger", icon: Database },
    { id: "authority", label: "Authority & Scopes", icon: Shield },
    { id: "qmesh", label: "QMesh Ops", icon: Radio },
  ];

  return (
    <div id="sovereign-ops-container" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  <span>Sovereign Node Hub</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal border border-emerald-500/30">
                    QMesh v0.9.4
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 font-sans">
                  Autonomous Edge Inference • Byzantine-Resilient P2P Mesh • Air-Gapped Gnostic Memory
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SovereignStatusBadge />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-zinc-800/80 mt-6 scrollbar-none font-mono">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-emerald-300 shadow-md border border-zinc-700 font-bold"
                    : tab.isSpecial
                    ? "text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : tab.isSpecial ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="transition-opacity duration-200">
        {activeTab === "controlplane" && <ControlPlaneSovereigntyView />}
        {activeTab === "inference" && <LocalInferencePanel />}
        {activeTab === "mesh" && <MeshNodeGrid />}
        {activeTab === "tasks" && <TaskQueuePanel />}
        {activeTab === "memory" && <MemorySyncPanel />}
        {activeTab === "authority" && <AuthorityScopePanel />}
        {activeTab === "qmesh" && <QMeshOps />}
      </div>
    </div>
  );
};
