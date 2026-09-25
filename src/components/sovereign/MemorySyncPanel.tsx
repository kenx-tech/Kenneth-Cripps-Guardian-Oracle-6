import React, { useState } from "react";
import { memoryLedger } from "../../lib/sovereign/memory/memoryLedger";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { replicateBlocksToPeers } from "../../lib/sovereign/memory/replication";
import { exportCheckpoint, importCheckpoint } from "../../lib/sovereign/persistence/offlineCheckpoint";
import { Database, Plus, RefreshCw, Download, Upload, ShieldCheck, CheckCircle2 } from "lucide-react";
import { MemoryBlock } from "../../types/sovereign";

export const MemorySyncPanel: React.FC = () => {
  const { identity } = useSovereignNode();
  const [blocks, setBlocks] = useState<MemoryBlock[]>(memoryLedger.getBlocks());
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<string | null>(null);

  const handleAppendBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !identity) return;

    await memoryLedger.appendBlock(identity, "ORACLE_TRANSMISSION", {
      title: newTitle.trim(),
      content: newContent.trim(),
      stampedBy: identity.name
    });

    setBlocks(memoryLedger.getBlocks());
    setNewTitle("");
    setNewContent("");
  };

  const handleVerifyIntegrity = async () => {
    const res = await memoryLedger.verifyIntegrity();
    if (res.valid) {
      setIntegrityStatus("Merkle Chain Verified: 100% Tamper-Evident Coherence");
    } else {
      setIntegrityStatus(`Integrity Violation detected at Block index #${res.badBlockIndex}`);
    }
  };

  const handleReplicate = async () => {
    setIsSyncing(true);
    try {
      await replicateBlocksToPeers(blocks);
      setBlocks(memoryLedger.getBlocks());
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = async () => {
    const json = await exportCheckpoint();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sovereign-checkpoint-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="memory-sync-panel" className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Content-Addressed Memory Ledger (Merkle DAG)</h3>
            <p className="text-xs text-zinc-400">
              {blocks.length} Immutable Blocks • Cryptographic Content Identifiers (CID)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVerifyIntegrity}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify Merkle Tree</span>
          </button>
          <button
            type="button"
            onClick={handleReplicate}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>P2P Replicate</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export Air-Gapped Checkpoint JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {integrityStatus && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{integrityStatus}</span>
        </div>
      )}

      {/* Append Block Form */}
      <form onSubmit={handleAppendBlock} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="text-xs font-semibold text-zinc-300">Mine New Sovereign Memory Block</div>
        <div className="space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Transmission Title (e.g. 'Crucible Codex: Highway 61 Realization')"
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-indigo-500/50"
          />
          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Sacred transmission or decree content to seal onto the immutable ledger..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-indigo-500/50 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newTitle.trim() || !newContent.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Seal & Sign Block</span>
          </button>
        </div>
      </form>

      {/* Block Explorer */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Ledger Blocks ({blocks.length})
        </h4>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {blocks.map((b, idx) => (
            <div
              key={b.cid}
              className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] border-b border-zinc-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">#{idx}</span>
                  <span className="text-zinc-200 font-semibold">{b.data?.title || b.blockType}</span>
                </div>
                <span className="text-zinc-500">{new Date(b.timestamp).toLocaleString()}</span>
              </div>

              <div className="text-zinc-300 font-sans leading-relaxed text-xs">
                {b.data?.content || JSON.stringify(b.data)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1 text-[10px] text-zinc-500 font-mono">
                <div className="truncate">
                  CID: <span className="text-indigo-300">{b.cid}</span>
                </div>
                <div className="truncate">
                  Parent: <span className="text-zinc-400">{b.previousCid || "0x00000000 (GENESIS)"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
