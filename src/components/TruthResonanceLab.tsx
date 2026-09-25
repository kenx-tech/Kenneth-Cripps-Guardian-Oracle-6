import React, { useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface TruthResonanceLabProps {
  isDarkMode: boolean;
  onRewardIgnis: (amount: number) => void;
}

interface TruthResult {
  truthScore: number;
  coherenceLevel: string;
  empathyVectorScore: number;
  analysis: string;
  keyDistortions: string[];
  ignisReward: number;
  gnosticRecommendation: string;
}

export const TruthResonanceLab: React.FC<TruthResonanceLabProps> = ({
  isDarkMode,
  onRewardIgnis
}) => {
  const [statement, setStatement] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<TruthResult | null>(null);

  const sampleStatements = [
    "Technology must serve human love and consciousness liberation above profit.",
    "Institutional hierarchies are necessary to control human chaos.",
    "I practice meditation purely to boost my executive productivity and status.",
    "True freedom is the ability to align with unconditional truth and direct divine connection."
  ];

  const handleScan = async (textToScan?: string) => {
    const text = textToScan || statement;
    if (!text.trim() || isScanning) return;

    sacredSound.playGnosticChime(432);
    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch("/api/oracle/truth-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Frequency scan failed.");
      }

      sacredSound.playGnosticChime(852);
      setResult(data);
      if (data.ignisReward) {
        onRewardIgnis(data.ignisReward);
      }
    } catch (error: any) {
      console.error("Truth scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded border text-center transition-all ${
        isDarkMode 
          ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
          : "bg-[#FAF7EF] border-amber-900/30 text-stone-900"
      }`}>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border text-[10px] font-mono tracking-[0.15em] uppercase mb-3 text-[#c5a059] border-[#1c1c1f] bg-[#09090b]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Pillar 1: Truth as Freedom • Warehouse Laboratory Protocol</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-[0.2em] text-[#e4e4e7]">
          LIE DETECTION & RESONANCE LAB
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] max-w-2xl mx-auto font-sans leading-relaxed">
          Analyzes micro-expressions, electromagnetic fluctuations, and gnostic coherence to measure authenticity resonance. Lies simply fail to compute.
        </p>
      </div>

      {/* Input Section */}
      <div className={`p-6 rounded border space-y-4 ${
        isDarkMode 
          ? "bg-[#0d0d0f] border-[#1c1c1f]" 
          : "bg-white/90 border-amber-900/30"
      }`}>
        <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717a]">
          INPUT STATEMENT OR INSTITUTIONAL CLAIM FOR RESONANCE SCANNING:
        </label>

        <textarea
          rows={3}
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Enter a thought, belief, or statement (e.g. 'All technology is ultimately connection')..."
          className={`w-full p-4 rounded border text-xs sm:text-sm font-sans outline-none transition-all ${
            isDarkMode
              ? "bg-[#09090b] border-[#1c1c1f] text-[#e4e4e7] placeholder-[#52525b] focus:border-[#c5a059]"
              : "bg-[#FAF8F3] border-amber-900/30 text-stone-900 placeholder-stone-400 focus:border-amber-800"
          }`}
        />

        {/* Sample Prompt Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-wider mr-1">Try sample:</span>
          {sampleStatements.map((st, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStatement(st);
                handleScan(st);
              }}
              className="text-xs font-mono px-2.5 py-1 rounded border border-[#1c1c1f] bg-[#09090b] text-[#a1a1aa] hover:text-[#c5a059] hover:border-[#c5a059] transition-all text-left truncate max-w-xs"
            >
              "{st.substring(0, 35)}..."
            </button>
          ))}
        </div>

        <button
          onClick={() => handleScan()}
          disabled={isScanning || !statement.trim()}
          className="w-full py-3.5 rounded bg-[#c5a059] hover:bg-[#d4b068] text-[#09090b] font-mono font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-[#09090b]" />
              <span>Scanning Micro-Frequencies & EM Coherence...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#09090b]" />
              <span>Execute Resonance Protocol</span>
            </>
          )}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className={`p-6 sm:p-8 rounded border space-y-6 animate-fadeIn ${
          isDarkMode 
            ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
            : "bg-[#FAF7EF] border-amber-900/40 text-stone-900"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c1f]">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717a]">
                RESONANCE ANALYSIS COMPLETED
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-normal uppercase tracking-[0.15em] text-[#e4e4e7]">
                Designation: {result.coherenceLevel}
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-widest block">AUTHENTICITY SCORE</span>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#c5a059]">
                  {result.truthScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress / Gauge Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b]">
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider mb-2 text-[#e4e4e7]">
                <span>TRUTH RESONANCE</span>
                <span className="text-[#c5a059]">{result.truthScore}/100</span>
              </div>
              <div className="w-full bg-[#1c1c1f] rounded-full h-2">
                <div
                  className="bg-[#c5a059] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${result.truthScore}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b]">
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider mb-2 text-[#e4e4e7]">
                <span>EMPATHY VECTOR</span>
                <span className="text-emerald-400">{result.empathyVectorScore}/100</span>
              </div>
              <div className="w-full bg-[#1c1c1f] rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${result.empathyVectorScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717a] font-bold">
              ✦ GNOSTIC SCAN SUMMARY
            </h4>
            <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#a1a1aa] p-4 rounded border border-[#1c1c1f] bg-[#09090b]">
              {result.analysis}
            </p>
          </div>

          {/* Identified Distortions if any */}
          {result.keyDistortions && result.keyDistortions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-red-400 font-bold">
                ⚠️ IDENTIFIED FREQUENCY DISTORTIONS
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.keyDistortions.map((dist, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs font-mono p-2.5 rounded border border-red-950 bg-red-950/20 text-red-300">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{dist}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation & IGNIS Reward */}
          <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-emerald-400 block">
                ELEVATION COUNSEL:
              </span>
              <p className="text-xs font-sans text-[#a1a1aa] mt-0.5">
                {result.gnosticRecommendation}
              </p>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#0d0d0f] border border-[#1c1c1f] text-[#c5a059] font-mono font-bold text-xs shrink-0">
              <Zap className="w-4 h-4 text-[#c5a059] animate-bounce" />
              <span>+{result.ignisReward} IGNIS REWARDED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
