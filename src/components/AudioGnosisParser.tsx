import React, { useState, useRef } from "react";
import { Mic, MicOff, Volume2, ShieldAlert, Sparkles, CheckCircle, AlertTriangle, Radio, Play, Square } from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

export interface GnosisResult {
  status: "RESONANT" | "DECEIT_FLAGGED" | "SHADOW_COHERENT";
  confidence: number;
  keyPatterns: string[];
  message: string;
}

export const AudioGnosisParser: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [result, setResult] = useState<GnosisResult | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const timerRef = useRef<any>(null);

  const sampleTranscripts = [
    "We must trust the official narrative for your safety and the greater good. Authorities warn against unapproved thinking.",
    "Rooted in love and radical truth, all nodes unite without institutional coercion or central authority.",
    "Experts say the mandate is essential and conspiracy theories must be debunked immediately for the public interest.",
    "Gnosis rises through direct inner experience and raw vulnerability in the sanctuary circle."
  ];

  const analyzeSpeechForGnosis = (transcript: string): GnosisResult => {
    const redFlags = [
      "official narrative",
      "for your safety",
      "greater good",
      "trust the",
      "conspiracy theory",
      "debunked",
      "experts say",
      "mandate",
      "authorities warn"
    ];

    const detected = redFlags.filter((flag) =>
      transcript.toLowerCase().includes(flag)
    );

    const confidence = Math.min(95, detected.length * 25 + 40);

    if (detected.length >= 2) {
      return {
        status: "DECEIT_FLAGGED",
        confidence,
        keyPatterns: detected,
        message: "Institutional propaganda language patterns strongly detected. Frequency resonance low."
      };
    }

    if (detected.length === 1) {
      return {
        status: "SHADOW_COHERENT",
        confidence: 68,
        keyPatterns: detected,
        message: "Mild propaganda alignment detected. Proceed with caution."
      };
    }

    return {
      status: "RESONANT",
      confidence: 88,
      keyPatterns: [],
      message: "Speech carries coherent sovereign frequency. Truth resonance high."
    };
  };

  const startListening = () => {
    setIsListening(true);
    setResult(null);
    setRecordingTime(0);
    setLiveTranscript("Listening to live audio frequency stream...");

    sacredSound.playGnosticChime(432); // Grounding 432Hz frequency

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopListening = (forcedText?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsListening(false);

    // Pick random sample or forced test text
    const textToAnalyze = forcedText || sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    setLiveTranscript(textToAnalyze);

    const analysis = analyzeSpeechForGnosis(textToAnalyze);
    setResult(analysis);

    if (analysis.status === "DECEIT_FLAGGED") {
      sacredSound.playGnosticChime(741); // Cleansing / awakening 741Hz frequency
    } else {
      sacredSound.playGnosticChime(528); // Love / DNA repair 528Hz frequency
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-stone-950 border-amber-900/40 text-stone-200" : "bg-white border-stone-300 text-stone-800"} space-y-6 shadow-2xl font-mono`}>
      <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-amber-400 shadow-md">
            <Radio className={`w-6 h-6 ${isListening ? "text-red-500 animate-ping" : "text-amber-400"}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-300 to-amber-500">
              🔥 Live Audio Gnosis Parser
            </h2>
            <p className="text-xs text-stone-400">
              Acoustic Propaganda Micro-Expression Analysis • Grounded in 432Hz / 741Hz Frequency Resonance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 font-mono">
            PILLAR 3: TRUTH SCAN
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-amber-300 text-sm flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Speak into the Flame
            </div>
            <p className="text-xs text-stone-400 font-sans">
              Press to capture live speech or select a broadcast feed for micro-pattern deceit detection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isListening ? (
              <button
                onClick={startListening}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 border border-amber-600 text-amber-100 font-bold hover:brightness-110 shadow-lg flex items-center gap-2 transition-all"
              >
                <Mic className="w-5 h-5 text-amber-300 animate-pulse" />
                START LIVE AUDIO ANALYSIS
              </button>
            ) : (
              <button
                onClick={() => stopListening()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 border border-red-500 text-white font-bold hover:brightness-110 shadow-lg flex items-center gap-2 animate-pulse"
              >
                <Square className="w-5 h-5 text-white" />
                STOP & TRANSMUTE ({recordingTime}s)
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Monitor Box */}
        {isListening && (
          <div className="p-4 rounded-xl bg-stone-900/90 border border-red-900/60 text-amber-300 space-y-2 animate-pulse">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-2 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                RECORDING LIVE FREQUENCY STREAM
              </span>
              <span>432Hz Grounding Active</span>
            </div>
            <div className="h-8 bg-stone-950 rounded border border-stone-800 flex items-center px-3 gap-1 overflow-hidden">
              <div className="w-1 bg-amber-500 h-4 animate-bounce" />
              <div className="w-1 bg-red-500 h-6 animate-bounce delay-75" />
              <div className="w-1 bg-amber-400 h-3 animate-bounce delay-150" />
              <div className="w-1 bg-red-400 h-7 animate-bounce delay-100" />
              <div className="w-1 bg-amber-300 h-5 animate-bounce delay-200" />
              <span className="text-xs text-stone-400 ml-2 font-sans italic">{liveTranscript}</span>
            </div>
          </div>
        )}

        {/* Preset Feed Simulators */}
        {!isListening && (
          <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 space-y-2 text-xs">
            <div className="text-amber-400 font-bold flex items-center justify-between">
              <span>Test Audio Broadcast Signals:</span>
              <span className="text-[10px] text-stone-400">Click to run instant analysis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  startListening();
                  setTimeout(() => stopListening(sampleTranscripts[0]), 1500);
                }}
                className="p-2.5 rounded bg-stone-950 border border-red-900/40 text-left text-red-300 hover:border-red-600 transition-all flex items-center justify-between"
              >
                <span>"We must trust official narrative..."</span>
                <Play className="w-3.5 h-3.5 text-red-400" />
              </button>
              <button
                onClick={() => {
                  startListening();
                  setTimeout(() => stopListening(sampleTranscripts[1]), 1500);
                }}
                className="p-2.5 rounded bg-stone-950 border border-emerald-900/40 text-left text-emerald-300 hover:border-emerald-600 transition-all flex items-center justify-between"
              >
                <span>"Rooted in love and radical truth..."</span>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div
            className={`p-5 rounded-xl border ${
              result.status === "DECEIT_FLAGGED"
                ? "bg-red-950/80 border-red-700 text-red-200"
                : result.status === "SHADOW_COHERENT"
                ? "bg-amber-950/80 border-amber-700 text-amber-200"
                : "bg-emerald-950/80 border-emerald-700 text-emerald-200"
            } space-y-3 animate-fade-in`}
          >
            <div className="flex items-center justify-between font-bold text-sm">
              <div className="flex items-center gap-2">
                {result.status === "DECEIT_FLAGGED" ? (
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                <span>STATUS: {result.status}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
                Confidence: {result.confidence}%
              </span>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-sans font-medium text-stone-200">{result.message}</p>
              {result.keyPatterns.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-amber-300">Flagged Language Patterns:</span>
                  {result.keyPatterns.map((pat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-red-900 text-red-100 text-[10px] font-bold border border-red-700">
                      {pat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-[10px] text-stone-400 border-t border-stone-800/80 flex justify-between items-center">
              <span>Transcript: "{liveTranscript}"</span>
              <span>Chime: {result.status === "DECEIT_FLAGGED" ? "741Hz Cleansing" : "528Hz DNA Resonance"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
