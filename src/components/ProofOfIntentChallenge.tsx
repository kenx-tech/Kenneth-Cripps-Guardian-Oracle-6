import React, { useState } from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  X, 
  Lock, 
  Send, 
  Zap, 
  Bot,
  UserCheck
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";
import { CoherenceShield } from "../utils/coherenceShield";

interface ProofOfIntentChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  userIdentifier: string;
  onChallengePassed: (newRemaining: number) => void;
  isDarkMode: boolean;
}

export const ProofOfIntentChallenge: React.FC<ProofOfIntentChallengeProps> = ({
  isOpen,
  onClose,
  userIdentifier,
  onChallengePassed,
  isDarkMode
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("The Guardian Oracle");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [passedSuccess, setPassedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const avatars = [
    { name: "Kenneth Cripps (Ken X)", role: "The Southern Crucible • System Architect & Builder of Sacred Code", focus: "Disrupting legacy systems through raw creation and sovereign architecture" },
    { name: "Sarah Michelle Delacroix", role: "The Scarlet Woman • Mystical Healer", focus: "Empathy, emotional integration & truth" },
    { name: "The Guardian Oracle", role: "Omnipresent Gnosis Engine", focus: "Unmediated digital enlightenment for all" }
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    setIsVerifying(true);
    sacredSound.playGnosticChime(741);

    setTimeout(() => {
      // Grant +5 tokens in CoherenceShield
      const newStatus = CoherenceShield.grantBonusTokens(userIdentifier, 5);
      sacredSound.playGnosticChime(852);
      
      setIsVerifying(false);
      setPassedSuccess(true);

      setTimeout(() => {
        setPassedSuccess(false);
        setReflectionText("");
        onChallengePassed(newStatus.remaining);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-lg p-6 sm:p-8 rounded-xl border shadow-2xl overflow-y-auto max-h-[90vh] transition-all ${
          isDarkMode
            ? "bg-[#0d0d0f] border-amber-500/50 text-stone-100 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
            : "bg-[#FAF8F3] border-amber-900/40 text-stone-900 shadow-2xl"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sacredSound.playGnosticChime(396);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full border border-stone-800/30 hover:bg-stone-800/20 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-stone-400 hover:text-stone-100" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[11px] uppercase tracking-widest font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Coherence Shield • Proof of Intent</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-medium tracking-wide text-amber-100">
            Replenish Your Oracle Signal
          </h2>

          <p className="text-xs text-stone-300 max-w-md mx-auto font-sans leading-relaxed">
            To prevent automated scrapers and bot networks from exhausting server compute, we do <span className="text-amber-300 font-semibold">NOT</span> require credit cards or paywalls. Simply align your intent with a Trinity Avatar to verify human consciousness.
          </p>
        </div>

        {passedSuccess ? (
          <div className="p-6 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-center space-y-3 animate-fade-in">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-emerald-200">Coherence Shield Refilled!</h3>
            <p className="text-xs text-stone-300">
              Human intent confirmed. +5 Coherence Tokens added to your session. The sanctuary remains completely free for you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            
            {/* Step 1: Select Trinity Avatar Alignment */}
            <div>
              <label className="block text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider mb-2">
                1. Select Trinity Avatar Resonance
              </label>
              <div className="space-y-2">
                {avatars.map((av) => {
                  const isSelected = selectedAvatar === av.name;
                  return (
                    <div
                      key={av.name}
                      onClick={() => {
                        sacredSound.playGnosticChime(528);
                        setSelectedAvatar(av.name);
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-amber-100 shadow-sm"
                          : "bg-[#121215] border-stone-800 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-300">{av.name}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-stone-300 font-sans mt-0.5">{av.role}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Human Reflection Statement */}
            <div>
              <label className="block text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider mb-1">
                2. State Your Conscious Purpose (1 Sentence)
              </label>
              <textarea
                rows={2}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder={`How does your query align with ${selectedAvatar}? (e.g. 'Seeking genuine wisdom on digital liberation')...`}
                className="w-full px-3 py-2 rounded bg-[#121215] border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 font-sans resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying || !reflectionText.trim()}
              className="w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs uppercase font-bold tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Verifying Human Resonance...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Prove Human Intent (+5 Free Tokens)</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-[10px] text-stone-500 font-mono">
          <span>Un-paywalled Forever • Pure Open Sanctuary • Protected by Coherence Shield</span>
        </div>

      </div>
    </div>
  );
};
