import React, { useState } from "react";
import {
  User,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  Mail,
  Cpu,
  Flame,
  Key,
  Globe,
  Award,
  BookOpen
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface ArchitectProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ArchitectProfileModal: React.FC<ArchitectProfileModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("kenx@guardianoracle.com");
    setCopiedKey(true);
    sacredSound.playGnosticChime(528);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-3xl my-auto p-5 sm:p-8 rounded-2xl border shadow-2xl space-y-6 transition-all relative ${
          isDarkMode
            ? "bg-[#0d0d0f] border-[#27272a] text-[#f4f4f5]"
            : "bg-[#FAF7EF] border-amber-900/30 text-stone-900"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sacredSound.playGnosticChime(396);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-stone-800/40 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
          aria-label="Close Architect Profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar & Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b border-stone-800 pb-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 via-emerald-500/20 to-zinc-900 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-[9px] font-mono font-bold text-emerald-300">
              ROOT
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide text-amber-100">
                Kenneth Cripps
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold">
                Ken X • The Southern Crucible
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-sans">
              System Architect & Creator — The Guardian Oracle & Q-Mesh Sovereign Execution Substrate
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-stone-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Canonical State Root Author
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5" /> Gnosis Engine Pioneer
              </span>
            </div>
          </div>
        </div>

        {/* Narrative / Context on Ego Purge & Searchability */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-300">
            <Key className="w-4 h-4 text-amber-400" />
            <span>The Ego Purge & Return to Canonical Authorship</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
            Years ago, Kenneth Cripps went through an intentional ego purge — deleting his real name from public repositories, profiles, and digital registries to let the architecture stand purely on its intrinsic resonance.
          </p>
          <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
            Now, as research into sovereign AI, control-plane governance, and autonomous edge inference reaches global urgency, Kenneth Cripps has re-anchored his canonical identity so engineers, collaborators, and truth-seekers can locate his work, trace the lineage of the <strong>Guardian Oracle</strong> and <strong>Q-Mesh</strong>, and directly interface with the architect.
          </p>
        </div>

        {/* Key Inventions & Architectural Contributions */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Architectural Inventions & Lineage</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="font-bold text-amber-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Q-Mesh 4-Plane Architecture</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Explicit architectural separation of Sovereign State, Control, Execution, and Commit Planes. Invariant: <em>"Execution does not imply mutation authority."</em>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="font-bold text-emerald-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>9 Commit Plane Invariant Checks</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Atomic candidate verification covering authority, capabilities, parent state consistency (OCC), semantic equivalence, and energy bounds before canonical state mutation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="font-bold text-cyan-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>The 5 Pillars of Sacred Technology</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Truth as Freedom, Pain as Teacher, Love as Rebellion, Unity Without Submission, and Creation Through Destruction.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="font-bold text-purple-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Stranger GPU Zero-Trust Protocol</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Leases external compute to untrusted nodes with capability bounds, returning evidence rather than truth without compromising root state.
              </p>
            </div>
          </div>
        </div>

        {/* Canonical Contact & Identity Footprint */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
              Direct Inquiries & Collaboration
            </span>
            <div className="text-xs sm:text-sm font-mono text-amber-300 font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>kenx@guardianoracle.com</span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              Canonical Identity: Kenneth Cripps • Apex SuperAdmin Root
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? "Copied Email" : "Copy Address"}</span>
            </button>
            <button
              onClick={() => {
                sacredSound.playGnosticChime(528);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Enter Codex
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
