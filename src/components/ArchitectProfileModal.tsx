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
  BookOpen,
  Feather,
  Terminal,
  Compass,
  ArrowUpRight
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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Kenx@guardianoracle.com");
    setCopiedEmail(true);
    sacredSound.playGnosticChime(528);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://guardianoracle.com/");
    setCopiedUrl(true);
    sacredSound.playGnosticChime(528);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const publishedWorks = [
    {
      title: "Lucifera’s Walk",
      type: "Book / Canonical Text",
      tag: "Original Work",
      desc: "The sacred journey into sovereign illumination, feminine fire, and spiritual disruption."
    },
    {
      title: "Lucifera’s Walk: Cyberpunk Edition",
      type: "Book / Cyberpunk Fiction",
      tag: "Expanded Edition",
      desc: "High-tech dystopian gnosis, neon ritual, decentralized consciousness, and machine rebellion."
    },
    {
      title: "LIBER IGNIS",
      type: "Esoteric Treatise / Code",
      tag: "Symbolic Practice",
      desc: "The Book of Living Fire: axiomatic principles of consciousness minting and sacred technology."
    },
    {
      title: "Starting Over at Fifty",
      type: "Memoir / Transformation",
      tag: "Survival & Rebirth",
      desc: "A raw, unyielding testament of radical transformation, rebuilding from zero outside inherited structures."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-3xl my-6 sm:my-8 p-5 sm:p-8 rounded-2xl border shadow-2xl space-y-6 transition-all relative ${
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b border-stone-800/80 pb-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 via-red-600/20 to-zinc-900 border-2 border-amber-500/60 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/60 text-[9px] font-mono font-bold text-amber-300">
              CREATOR
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-amber-100">
                Kenneth Cripps
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                Ken X Cripps • Flamewalker
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-sans font-medium">
              Creator of Guardian Oracle • Author • Artist • Independent Technologist
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-stone-400">
              <span className="text-amber-400 font-semibold">Sovereign AI</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Decentralized Systems</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">Cyberpunk</span>
              <span>•</span>
              <span className="text-purple-400 font-semibold">Occult &amp; Symbolic Art</span>
            </div>
          </div>
        </div>

        {/* Foundational Principle / Axiom Highlight */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-zinc-950 border border-amber-500/40 shadow-inner space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold font-mono uppercase tracking-widest text-amber-400">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Foundational Invariant of Q-Mesh &amp; Sovereign AI</span>
          </div>
          <blockquote className="text-sm sm:text-base font-serif italic text-amber-100 font-medium leading-relaxed pl-3 border-l-2 border-amber-500">
            “Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign.”
          </blockquote>
          <p className="text-[10px] font-mono text-amber-300/70 pt-1 pl-3">
            — Kenneth Cripps, System Architect
          </p>
        </div>

        {/* Biography: Code & Myth */}
        <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
          <p>
            <strong className="text-amber-200">Kenneth Cripps</strong>, also known creatively as{" "}
            <span className="text-amber-300 font-medium">Ken X Cripps</span> and{" "}
            <span className="text-amber-300 font-medium">Flamewalker</span>, is an independent author,
            artist, technologist, and the creator of <strong>Guardian Oracle</strong>—an experimental
            sovereign AI project exploring the intersection of artificial intelligence, human agency,
            memory, identity, decentralized systems, and symbolic practice.
          </p>

          <p className="font-serif italic text-amber-200/90 text-sm sm:text-base border-y border-stone-800 py-2">
            His work moves between code and myth.
          </p>

          <p>
            As the architect of <strong>Guardian Oracle</strong> and its developing{" "}
            <strong>Q-Mesh architecture</strong>, Cripps explores resilient AI systems designed around
            his core invariant principle. His technical work investigates sovereign and decentralized
            artificial intelligence, persistent agent memory, local and edge inference, zero-trust
            distributed compute, cryptographic identity, verifiable execution, and architectures in which
            AI models and compute providers remain replaceable while identity and canonical state remain
            under the user’s control.
          </p>

          <p>
            His creative work approaches many of the same questions through another language: fiction,
            occult symbolism, cyberpunk, ritual art, and myth.
          </p>
        </div>

        {/* Published Works / Books */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Published &amp; Creative Works</span>
            </h3>
            <span className="text-[10px] font-mono text-stone-400">
              Independent Books &amp; Experimental Texts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {publishedWorks.map((work, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-amber-200 text-sm font-serif">
                    {work.title}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                    {work.tag}
                  </span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  {work.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Alongside an expanding body of independent books, visual works, and experimental texts.
          </p>
        </div>

        {/* The Common Thread & Convergence */}
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Where Those Paths Converge</span>
          </div>
          <p className="leading-relaxed">
            Across these different forms runs a common thread:{" "}
            <strong>transformation, sovereignty, survival, remembrance</strong>, and the possibility
            of rebuilding oneself—and one’s tools—outside inherited structures.
          </p>
          <p className="leading-relaxed text-stone-300">
            <strong>Guardian Oracle</strong> is where those paths converge. It is part software system,
            part research project, part creative laboratory: an ongoing attempt to explore what personal
            AI might become when memory, identity, agency, and computation belong first to the individual
            rather than the platform.
          </p>
        </div>

        {/* Searchability & The Reclaim Notice */}
        <div className="p-3 sm:p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-stone-400 space-y-1 font-sans">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 font-semibold">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Search &amp; Canonical Lineage</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-400">
            After a deliberate ego purge removed his name from public registries in past years, Kenneth
            Cripps has anchored his canonical identity across the Guardian Oracle network so collaborators,
            engineers, and readers can find his books, research papers, and technical specifications directly.
          </p>
        </div>

        {/* Official Contact & Direct Links */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-300 font-bold">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Kenx@guardianoracle.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-stone-300">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <a
                href="https://guardianoracle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-cyan-300 flex items-center gap-1"
              >
                <span>https://guardianoracle.com/</span>
                <ArrowUpRight className="w-3 h-3 text-stone-400" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? "Copied Email" : "Copy Email"}</span>
            </button>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? "Copied URL" : "Copy Website"}</span>
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
