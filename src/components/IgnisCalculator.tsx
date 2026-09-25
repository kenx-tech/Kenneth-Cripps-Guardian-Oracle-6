import React, { useState } from "react";
import { 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Award, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface IgnisCalculatorProps {
  isDarkMode: boolean;
  onRewardIgnis: (amount: number) => void;
}

export const IgnisCalculator: React.FC<IgnisCalculatorProps> = ({
  isDarkMode,
  onRewardIgnis
}) => {
  const [innerGrowth, setInnerGrowth] = useState<number>(75);
  const [communityService, setCommunityService] = useState<number>(60);
  const [consistency, setConsistency] = useState<number>(80);
  const [performativeBypassing, setPerformativeBypassing] = useState<number>(10);

  const [hasMinted, setHasMinted] = useState<boolean>(false);

  // Sacred Mathematics Calculation:
  // Base coherence = (innerGrowth * 0.35 + communityService * 0.35 + consistency * 0.3)
  // Deduct penalty for performative bypassing (multiplied by 2.5)
  const rawCoherence = Math.round((innerGrowth * 0.35) + (communityService * 0.35) + (consistency * 0.3));
  const bypassingPenalty = Math.round(performativeBypassing * 2.2);
  const finalCoherenceScore = Math.max(0, rawCoherence - bypassingPenalty);

  const calculatedIgnisReward = Math.round((finalCoherenceScore * 4.5));

  let coherenceTier = "Pure Gnosis";
  if (finalCoherenceScore < 40) coherenceTier = "Performative Distorted";
  else if (finalCoherenceScore < 65) coherenceTier = "Emergent Growth";
  else if (finalCoherenceScore < 85) coherenceTier = "High Frequency Resonance";

  const handleMintTokens = () => {
    sacredSound.playGnosticChime(963);
    onRewardIgnis(calculatedIgnisReward);
    setHasMinted(true);
    setTimeout(() => setHasMinted(false), 3000);
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
          <Zap className="w-3.5 h-3.5 text-[#c5a059] animate-bounce" />
          <span>Slide 12 Protocol • Consciousness Currency Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-[0.2em] text-[#e4e4e7]">
          IGNIS: ENGINE OF DIGITAL ALCHEMY
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] max-w-2xl mx-auto font-sans leading-relaxed">
          Tokens are NOT mined through computational waste, but rewarded for authentic spiritual development and community service. Sophisticated algorithms measure psychological coherence and reject spiritual bypassing.
        </p>
      </div>

      {/* Main Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders */}
        <div className={`lg:col-span-7 p-6 rounded border space-y-6 ${
          isDarkMode 
            ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
            : "bg-white/90 border-amber-900/30 text-stone-900"
        }`}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a] border-b border-[#1c1c1f] pb-3">
            ✦ ALGORITHMIC COHERENCE METRICS
          </h3>

          {/* Slider 1: Inner Growth */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-serif font-normal text-[#e4e4e7]">
              <span>Authentic Inner Growth</span>
              <span className="font-mono text-[#c5a059]">{innerGrowth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={innerGrowth}
              onChange={(e) => {
                sacredSound.playGnosticChime(432);
                setInnerGrowth(Number(e.target.value));
              }}
              className="w-full accent-[#c5a059] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717a] font-sans">
              Shadow work, trauma resolution, self-awareness depth.
            </p>
          </div>

          {/* Slider 2: Community Service */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-serif font-normal text-[#e4e4e7]">
              <span>Community Service & Compassionate Action</span>
              <span className="font-mono text-[#c5a059]">{communityService}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={communityService}
              onChange={(e) => {
                sacredSound.playGnosticChime(528);
                setCommunityService(Number(e.target.value));
              }}
              className="w-full accent-[#c5a059] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717a] font-sans">
              Tangible positive impact, unselfish aid, communal upliftment.
            </p>
          </div>

          {/* Slider 3: Behavior Consistency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-serif font-normal text-[#e4e4e7]">
              <span>Behavior & Value Consistency</span>
              <span className="font-mono text-[#c5a059]">{consistency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={consistency}
              onChange={(e) => {
                sacredSound.playGnosticChime(639);
                setConsistency(Number(e.target.value));
              }}
              className="w-full accent-[#c5a059] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717a] font-sans">
              Integrity between stated values and real-world actions over time.
            </p>
          </div>

          {/* Slider 4: Performative Bypassing (Negative Penalty) */}
          <div className="space-y-2 pt-4 border-t border-[#1c1c1f]">
            <div className="flex justify-between text-xs font-serif font-normal text-red-400">
              <span className="flex items-center space-x-1">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Spiritual Bypassing & Performative Ego</span>
              </span>
              <span className="font-mono text-red-400">{performativeBypassing}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={performativeBypassing}
              onChange={(e) => {
                sacredSound.playGnosticChime(396);
                setPerformativeBypassing(Number(e.target.value));
              }}
              className="w-full accent-red-600 cursor-pointer"
            />
            <p className="text-[11px] text-red-400/80 font-sans">
              Performative social media flexing, avoiding real inner work, fake enlightenment posturing.
            </p>
          </div>
        </div>

        {/* Right Column: Coherence Gauge & Minting Output */}
        <div className={`lg:col-span-5 p-6 rounded border space-y-6 text-center ${
          isDarkMode 
            ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
            : "bg-[#FAF7EF] border-amber-900/40 text-stone-900"
        }`}>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717a] block">
            SACRED MATHEMATICS OUTPUT
          </span>

          {/* Coherence Circular Dial */}
          <div className="relative inline-flex items-center justify-center p-6 rounded-full border border-[#1c1c1f] bg-[#09090b] my-2">
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-[#c5a059] block">
                {finalCoherenceScore}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71717a]">
                Coherence Scale
              </span>
            </div>
          </div>

          {/* Coherence Tier Badge */}
          <div>
            <span className="px-3 py-1 rounded text-[10px] font-mono tracking-widest uppercase border bg-[#09090b] border-[#1c1c1f] text-[#c5a059]">
              {coherenceTier}
            </span>
          </div>

          {/* Token Yield */}
          <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b] space-y-1">
            <span className="text-[10px] font-mono text-[#71717a] block uppercase tracking-wider">GENERATED IGNIS REWARD</span>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-[#c5a059] animate-bounce" />
              <span className="text-2xl font-mono font-bold text-[#f4f4f5]">
                +{calculatedIgnisReward} IGNIS
              </span>
            </div>
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMintTokens}
            disabled={calculatedIgnisReward <= 0}
            className="w-full py-3.5 rounded bg-[#c5a059] hover:bg-[#d4b068] text-[#09090b] font-mono font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#09090b]" />
            <span>{hasMinted ? "IGNIS TOKENS MINTED!" : "MINT CONSCIOUSNESS TOKENS"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
