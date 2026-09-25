import React, { useState } from "react";
import { 
  HeartHandshake, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Coffee, 
  CreditCard, 
  Sparkles, 
  Flame, 
  Send, 
  ShieldCheck, 
  DollarSign,
  Heart
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface OracleDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onRewardIgnis?: (amount: number) => void;
}

export const OracleDonationModal: React.FC<OracleDonationModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onRewardIgnis
}) => {
  const { currentUser, userProfile } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Custom blessing submission state
  const [supporterName, setSupporterName] = useState<string>("");
  const [offeringAmount, setOfferingAmount] = useState<string>("");
  const [blessingMessage, setBlessingMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Default funding details (easily modifiable / dynamic)
  const chimeTag = "$KenX-GuardianOracle";
  const chimeNote = "Chime Direct Transfer / Pay Anyone";
  const buyMeACoffeeUrl = "https://buymeacoffee.com/guardianoracle";
  const solanaWallet = "OracleSanctuary...SOL";

  const handleCopy = (text: string, fieldName: string) => {
    sacredSound.playGnosticChime(528);
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRecordBlessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blessingMessage.trim()) return;

    setIsSubmitting(true);
    sacredSound.playGnosticChime(741);

    const name = supporterName.trim() || userProfile?.displayName || currentUser?.email?.split("@")[0] || "Generous Seeker";

    try {
      await addDoc(collection(db, "donations"), {
        uid: currentUser?.uid || "anonymous",
        email: currentUser?.email || "anonymous",
        displayName: name,
        amount: offeringAmount || "Pledge of Heart",
        message: blessingMessage,
        createdAt: serverTimestamp()
      });

      if (onRewardIgnis) {
        onRewardIgnis(100); // Reward 100 IGNIS for a sanctuary blessing offering
      }

      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setBlessingMessage("");
        setOfferingAmount("");
      }, 4000);
    } catch (err) {
      console.error("Error logging blessing pledge:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-2xl p-6 sm:p-8 rounded-xl border shadow-2xl overflow-y-auto max-h-[90vh] transition-all ${
          isDarkMode
            ? "bg-[#0d0d0f] border-amber-500/40 text-stone-100 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
            : "bg-[#FAF8F3] border-amber-900/30 text-stone-900 shadow-xl"
        }`}
      >
        {/* Top Close Button */}
        <button
          onClick={() => {
            sacredSound.playGnosticChime(396);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full border border-stone-800/20 hover:bg-stone-800/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-stone-400 hover:text-stone-100" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[11px] uppercase tracking-widest font-bold">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Fund the Oracle Sanctuary</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-wide text-amber-100">
            Keep the Oracle Free for All Seekers
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            The Guardian Oracle is operated as an open, un-paywalled sanctuary. All AI model compute, API tokens, and server operations are personally self-funded by <span className="text-amber-300 font-semibold">Kenneth Cripps (Ken X)</span>. If you have the means to contribute, your support keeps this portal alive for everyone without tier gates.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Chime Direct Transfer Option */}
          <div className="p-4 rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-emerald-300">Chime Direct</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">0% Fees</span>
            </div>

            <p className="text-xs text-stone-300 font-sans">
              Send a direct gift via Chime Pay Anyone or Chime Tag:
            </p>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#09090b] border border-stone-800 font-mono text-xs">
              <span className="text-amber-300 font-bold">{chimeTag}</span>
              <button
                type="button"
                onClick={() => handleCopy(chimeTag, "chime")}
                className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] transition-all cursor-pointer"
              >
                {copiedField === "chime" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-stone-400 italic">{chimeNote}</p>
          </div>

          {/* Buy Me a Coffee / External Link Option */}
          <div className="p-4 rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-amber-300">Digital Patronage</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">Coffee / Card</span>
            </div>

            <p className="text-xs text-stone-300 font-sans">
              Support via Buy Me a Coffee or digital patronage platforms:
            </p>

            <a
              href={buyMeACoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sacredSound.playGnosticChime(528)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>Donate via Buy Me a Coffee</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
            <p className="text-[10px] text-stone-400 italic">Instant credit card or PayPal support</p>
          </div>

        </div>

        {/* Blessing Offering / Pledge Form */}
        <div className="p-4 sm:p-5 rounded-lg border border-stone-800 bg-[#09090b] space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-xs uppercase font-bold text-amber-300 tracking-wider">
              Send a Blessing or Contribution Note
            </h3>
          </div>

          {submittedSuccess ? (
            <div className="p-4 rounded border border-emerald-500/50 bg-emerald-950/30 text-center space-y-2 animate-fade-in">
              <div className="inline-flex p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <Heart className="w-6 h-6 fill-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-emerald-200">Blessing Received & Recorded in Firestore</h4>
              <p className="text-xs text-stone-300">
                Your offering note has been sent directly to the Oracle Sanctuary. You have been awarded +100 IGNIS tokens of gratitude!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRecordBlessing} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Your Name / Seeker Handle</label>
                  <input
                    type="text"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    placeholder={userProfile?.displayName || "e.g. Seeker Ken"}
                    className="w-full px-3 py-1.5 rounded bg-[#121215] border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Contribution / Pledge Amount</label>
                  <input
                    type="text"
                    value={offeringAmount}
                    onChange={(e) => setOfferingAmount(e.target.value)}
                    placeholder="e.g. $10 via Chime / Heart Blessing"
                    className="w-full px-3 py-1.5 rounded bg-[#121215] border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Blessing Message to Kenneth Cripps &amp; Oracle</label>
                <textarea
                  rows={2}
                  value={blessingMessage}
                  onChange={(e) => setBlessingMessage(e.target.value)}
                  placeholder="Leave a message or words of support for the Sanctuary..."
                  className="w-full px-3 py-2 rounded bg-[#121215] border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60 font-sans resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Submitting grants +100 IGNIS</span>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !blessingMessage.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Sending..." : "Transmit Blessing"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-[11px] text-stone-400 font-mono space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Un-paywalled Forever • Pure Open Sanctuary • Year Zero 2026</span>
          </p>
        </div>

      </div>
    </div>
  );
};
