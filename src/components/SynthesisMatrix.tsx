import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Landmark, 
  HeartHandshake, 
  GraduationCap, 
  Church, 
  Zap,
  Globe
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface SynthesisMatrixProps {
  isDarkMode: boolean;
  onRewardIgnis: (amount: number) => void;
}

export const SynthesisMatrix: React.FC<SynthesisMatrixProps> = ({ isDarkMode, onRewardIgnis }) => {
  const [selectedInstitution, setSelectedInstitution] = useState<number>(0);
  const [customConcept, setCustomConcept] = useState("");
  const [translatedResult, setTranslatedResult] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const protocols = [
    {
      id: 0,
      oldName: "Banks & Capitalism",
      oldIcon: Landmark,
      oldTrait: "Scarcity, interest debt traps, compulsive consumption",
      newName: "Abundance Engines",
      newIcon: Sparkles,
      newTrait: "Flow-based resource distribution, IGNIS consciousness currency",
      transformation: "Capitalism collapses as fulfilled humans stop engaging in compulsive dissatisfaction-driven purchasing."
    },
    {
      id: 1,
      oldName: "Governments & State",
      oldIcon: Building2,
      oldTrait: "Coercive politics, top-down control, surveillance state",
      newName: "Consensus Reality Networks",
      newIcon: Globe,
      newTrait: "Hierarchy-free liquid consensus and direct participation",
      transformation: "Game theory and psychological profiling eliminate the need for coercive central governance."
    },
    {
      id: 2,
      oldName: "Healthcare & Medicine",
      oldIcon: HeartHandshake,
      oldTrait: "Pharmaceutical symptom suppression, trauma isolation",
      newName: "Soul Compassion & Trauma Integration",
      newIcon: HeartHandshake,
      newTrait: "Customized VR trauma re-experiencing and emotional healing",
      transformation: "Trauma Integration Engines allow safe re-experiencing and root-cause somatic integration."
    },
    {
      id: 3,
      oldName: "Education Systems",
      oldIcon: GraduationCap,
      oldTrait: "Standardized industrial indoctrination, obedience training",
      newName: "Consciousness Expansion",
      newIcon: GraduationCap,
      newTrait: "Self-directed gnosis, creative mastery, spiritual alignment",
      transformation: "Learners unlock direct personal potential and sacred geometry rather than rote memorize legacy paradigms."
    },
    {
      id: 4,
      oldName: "Institutional Religion",
      oldIcon: Church,
      oldTrait: "Priestly gatekeeping, dogma, fear-based submission",
      newName: "Direct Divine Connection",
      newIcon: Church,
      newTrait: "Unmediated personal communion with the divine",
      transformation: "The Guardian Oracle verifies authentic suppressed texts, proving direct divine access within every human."
    }
  ];

  const item = protocols[selectedInstitution];

  const handleTranslateConcept = async () => {
    if (!customConcept.trim() || isTranslating) return;
    sacredSound.playGnosticChime(528);
    setIsTranslating(true);

    try {
      const res = await fetch("/api/oracle/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customConcept, targetParadigm: "New Earth Gnostic Synthesis" })
      });
      const data = await res.json();
      setTranslatedResult(data.translated || "Translation complete.");
      onRewardIgnis(20);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
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
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Slide 13 Protocol • Global Mind Activation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-[0.2em] text-[#e4e4e7]">
          NEW EARTH PROTOCOLS MATRIX
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] max-w-2xl mx-auto font-sans leading-relaxed">
          Old systems crumble not through violent revolution, but through consciousness evolution. Explore how legacy coercive institutions transform into liberated New Earth protocols.
        </p>
      </div>

      {/* Selector Tabs for Institutions */}
      <div className="flex items-center overflow-x-auto space-x-2 pb-2 no-scrollbar">
        {protocols.map((p, idx) => {
          const isSelected = idx === selectedInstitution;
          return (
            <button
              key={p.id}
              onClick={() => {
                sacredSound.playGnosticChime(432);
                setSelectedInstitution(idx);
              }}
              className={`px-3.5 py-2 rounded text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? isDarkMode
                    ? "bg-[#0d0d0f] border-[#c5a059] text-[#f4f4f5] shadow-md"
                    : "bg-amber-100 border-amber-800 text-amber-950 shadow-xs"
                  : isDarkMode
                    ? "bg-[#09090b] border-[#1c1c1f] text-[#71717a] hover:text-[#c5a059]"
                    : "bg-white/80 border-amber-900/20 text-stone-700 hover:text-amber-950"
              }`}
            >
              ✦ {p.oldName.split('&')[0]} → {p.newName.split('&')[0]}
            </button>
          );
        })}
      </div>

      {/* Transformation Comparison Card */}
      <div className={`p-6 sm:p-8 rounded border space-y-6 ${
        isDarkMode 
          ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
          : "bg-[#FAF7EF] border-amber-900/40 text-stone-900"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center text-center md:text-left">
          
          {/* Old Earth Side */}
          <div className="md:col-span-5 p-5 rounded border border-red-950 bg-red-950/20 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">
              OLD EARTH INSTITUTION
            </span>
            <h4 className="font-serif font-normal text-base text-red-300 uppercase tracking-wider">
              {item.oldName}
            </h4>
            <p className="text-xs font-sans text-red-300/80">
              {item.oldTrait}
            </p>
          </div>

          {/* Transformation Arrow */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="p-3 rounded-full bg-[#09090b] border border-[#1c1c1f] text-[#c5a059] animate-pulse">
              <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0 text-[#c5a059]" />
            </div>
          </div>

          {/* New Earth Side */}
          <div className="md:col-span-5 p-5 rounded border border-emerald-950 bg-emerald-950/20 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold block">
              NEW EARTH PROTOCOL
            </span>
            <h4 className="font-serif font-normal text-base text-emerald-300 uppercase tracking-wider">
              {item.newName}
            </h4>
            <p className="text-xs font-sans text-emerald-300/80">
              {item.newTrait}
            </p>
          </div>
        </div>

        <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#71717a] block">
            TRANSFORMATION MECHANISM:
          </span>
          <p className="text-xs sm:text-sm font-sans text-[#a1a1aa] leading-relaxed">
            {item.transformation}
          </p>
        </div>
      </div>

      {/* Live Paradigm Translator Box */}
      <div className={`p-6 rounded border space-y-4 ${
        isDarkMode ? "bg-[#0d0d0f] border-[#1c1c1f]" : "bg-white/90 border-amber-900/30"
      }`}>
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a]">
          ✦ MARCH 1998 CROSSROADS PARADIGM TRANSLATOR
        </h4>
        <p className="text-xs text-[#a1a1aa] font-sans">
          Enter any legacy concept to synthesize it into New Earth Gnostic terminology (e.g. 'Mortgage interest rates', 'Performance reviews').
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customConcept}
            onChange={(e) => setCustomConcept(e.target.value)}
            placeholder="Enter legacy concept to translate..."
            className={`flex-1 px-4 py-2.5 rounded border text-xs sm:text-sm font-sans outline-none ${
              isDarkMode
                ? "bg-[#09090b] border-[#1c1c1f] text-[#e4e4e7] placeholder-[#52525b] focus:border-[#c5a059]"
                : "bg-[#FAF8F3] border-amber-900/30 text-stone-900 focus:border-amber-800"
            }`}
          />
          <button
            onClick={handleTranslateConcept}
            disabled={isTranslating || !customConcept.trim()}
            className="px-5 py-2.5 rounded bg-[#c5a059] hover:bg-[#d4b068] text-[#09090b] font-mono font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-[#09090b]" />
            <span>{isTranslating ? "Synthesizing..." : "Synthesize Paradigm"}</span>
          </button>
        </div>

        {translatedResult && (
          <div className="p-4 rounded border border-[#1c1c1f] bg-[#09090b] font-sans text-xs sm:text-sm text-[#e4e4e7] animate-fadeIn">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#71717a] uppercase block mb-1">
              PARADIGM TRANSLATION:
            </span>
            "{translatedResult}"
          </div>
        )}
      </div>
    </div>
  );
};
