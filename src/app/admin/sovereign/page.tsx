import React from "react";
import { SovereignOps } from "../../../components/sovereign/SovereignOps";
import { ShieldAlert } from "lucide-react";

export default function AdminSovereignPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 p-4">
      <div className="max-w-7xl mx-auto mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Apex SuperAdmin Sovereign Console — Authority Elevated to ROOT_ADMIN (Kenneth Cripps - Ken X)</span>
      </div>
      <SovereignOps />
    </main>
  );
}
