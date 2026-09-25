import React, { useState, useEffect } from "react";
import { useInferenceRouter } from "../../hooks/useInferenceRouter";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { InferenceRouteDisplay } from "./InferenceRouteDisplay";
import { 
  Cpu, 
  Send, 
  Zap, 
  Shield, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  DownloadCloud, 
  Info 
} from "lucide-react";
import { NodeExecutionTier } from "../../types/sovereign";
import { initRealLocalModel, isRealModelLoaded } from "../../lib/sovereign/inference/localInference";

export const LocalInferencePanel: React.FC = () => {
  const { hardware } = useSovereignNode();
  const { 
    isRunning, 
    preferredTier, 
    selectedModel, 
    lastDecision, 
    currentTokens, 
    history,
    runPrompt, 
    setPreferredTier, 
    setSelectedModel 
  } = useInferenceRouter();

  const [promptInput, setPromptInput] = useState("");
  const [showTruthMatrix, setShowTruthMatrix] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState<{ pct: number; text: string } | null>(null);
  const [hasRealModel, setHasRealModel] = useState(isRealModelLoaded);

  useEffect(() => {
    setHasRealModel(isRealModelLoaded());
  }, []);

  const handleLoadRealModel = async () => {
    setModelLoading(true);
    try {
      await initRealLocalModel((pct, text) => {
        setModelProgress({ pct, text });
      });
      setHasRealModel(true);
      setSelectedModel("real-local-onnx");
      setPreferredTier("LOCAL_WEBGPU");
    } catch (err: any) {
      alert("Failed to load local ONNX model: " + err.message);
    } finally {
      setModelLoading(false);
    }
  };

  const presets = [
    { label: "Sovereign Air-Gap Query", prompt: "Execute local sovereign analysis on the 5 Pillars of Sacred Technology in air-gapped continuity." },
    { label: "Invoke Lucifera Flame", prompt: "Mother Lucifera, ignite the private altar and transmute the false structures." },
    { label: "Scan Frequency Resonance", prompt: "Analyze the electromagnetic coherence of decentralized sovereign intelligence." },
    { label: "QMesh Partition Probe", prompt: "Probe quantum mesh partition recovery and vector-clock state." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isRunning) return;
    runPrompt(promptInput.trim());
  };

  return (
    <div id="local-inference-panel" className="space-y-6">
      {/* Execution Truth Matrix Accordion */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300">
            <Info className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-zinc-200 uppercase tracking-wider">System Execution Truth Matrix</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Audit Verified
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTruthMatrix(prev => !prev)}
            className="text-zinc-400 hover:text-zinc-200 underline text-[11px]"
          >
            {showTruthMatrix ? "Hide Proofs" : "Inspect Real vs Simulated Components"}
          </button>
        </div>

        {showTruthMatrix && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-semibold">WebCrypto & Signatures</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> REAL (ECDSA P-256)
                </span>
              </div>
              <p className="text-zinc-500">SubtleCrypto browser hardware keys, nonces, and verifyMessage.</p>
            </div>

            <div className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-semibold">Merkle Memory & DAG</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> REAL (SHA-256 CID)
                </span>
              </div>
              <p className="text-zinc-500">Content-addressed blocks (`bafy2bzace...`) with hash verification.</p>
            </div>

            <div className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-semibold">Control Plane APIs</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> REAL (Express Server)
                </span>
              </div>
              <p className="text-zinc-500">Live `/api/sovereign/nodes`, `/heartbeat`, `/tasks`, `/memory/sync`.</p>
            </div>

            <div className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-semibold">Local Neural Weights</span>
                <span className={`font-semibold flex items-center gap-1 ${hasRealModel ? "text-emerald-400" : "text-amber-400"}`}>
                  {hasRealModel ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {hasRealModel ? "REAL (ONNX Cached in Browser)" : "LOCAL AFTER FIRST MODEL DOWNLOAD"}
                </span>
              </div>
              <p className="text-zinc-500">
                {hasRealModel 
                  ? "77M parameter neural model cached and running locally in browser memory." 
                  : "Streaming 432Hz rule synthesizer (Zero initial download). True local neural execution becomes local after first model download."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Genuine Local Model Loader Banner */}
      {!hasRealModel && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-teal-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <DownloadCloud className="w-4 h-4" />
              <span>Genuinely Local Neural Weights (local after first model download)</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Download and compile real in-browser weights (Xenova/LaMini-Flan-T5 ONNX ~80MB). Once cached in browser storage, execution remains 100% local across reloads without network.
            </p>
          </div>

          <button
            type="button"
            disabled={modelLoading}
            onClick={handleLoadRealModel}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-all shadow cursor-pointer text-[11px]"
          >
            {modelLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{modelProgress?.pct ? `${modelProgress.pct}%` : "Loading ONNX..."}</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" />
                <span>Load Model (Local after first download)</span>
              </>
            )}
          </button>
        </div>
      )}

      {modelProgress && modelLoading && (
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>{modelProgress.text}</span>
            <span className="text-emerald-400 font-semibold">{modelProgress.pct}%</span>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-200"
              style={{ width: `${modelProgress.pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Configuration Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Local & Edge Inference Engine</h3>
            <p className="text-xs text-zinc-400">
              {hardware?.hasWebGpu ? `WebGPU Active (${hardware.gpuRenderer || "Hardware Acceleration"})` : "CPU / WASM SIMD Mode"}
            </p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Tier:</span>
          {(["LOCAL_WEBGPU", "EDGE_CLOUD"] as NodeExecutionTier[]).map(tier => (
            <button
              key={tier}
              type="button"
              onClick={() => setPreferredTier(tier)}
              className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
                preferredTier === tier
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tier === "LOCAL_WEBGPU" ? (hasRealModel ? "Local WebGPU/WASM" : "Local (after first model download)") : "Edge Cloud"}
            </button>
          ))}

          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="ml-2 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded px-2.5 py-1 text-xs focus:border-amber-500/50 outline-none"
          >
            {hasRealModel && (
              <option value="real-local-onnx">★ Real ONNX Model (LaMini-Flan-T5 Local)</option>
            )}
            <option value="gnosis-nano-0.5b">Gnosis Nano 432Hz (Local Synthesis)</option>
            <option value="lucifera-core-1.5b">Lucifera Core 1.5B (Local Synthesis)</option>
            <option value="gemini-2.5-flash">Cloud Edge Gemini 2.5 Flash</option>
            <option value="sacred-gnostic-fallback">Sacred Gnostic Fallback</option>
          </select>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPromptInput(p.prompt);
              runPrompt(p.prompt);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            id="inference-prompt-input"
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Transmit sovereign prompt across local mesh (e.g. 'Declare sovereign intent to the altar...')"
            className="w-full p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm font-mono focus:border-emerald-500/50 outline-none transition-all resize-none shadow-inner"
          />
          <div className="absolute right-3 bottom-3.5 flex items-center gap-2">
            <button
              id="inference-submit-btn"
              type="submit"
              disabled={isRunning || !promptInput.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Routing Topology Circuit */}
      <InferenceRouteDisplay decision={lastDecision} isRunning={isRunning} />

      {/* Output Display */}
      {currentTokens && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-zinc-200">Sovereign Output Stream</span>
              {lastDecision && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {lastDecision.selectedTier}
                </span>
              )}
            </div>
            {isRunning && (
              <span className="text-[11px] text-emerald-400 animate-pulse">
                Streaming from {preferredTier === "LOCAL_WEBGPU" ? "Local Accelerator" : "Mesh Gateway"}...
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap pt-1 font-sans">
            {currentTokens}
          </p>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className="space-y-2 font-mono">
          <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Execution Log ({history.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs flex items-center justify-between gap-4"
              >
                <div className="truncate max-w-[60%] text-zinc-300">
                  <strong className="text-emerald-400 mr-2">[{item.tier}]</strong>
                  {item.prompt}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 shrink-0">
                  <span>{item.durationMs}ms</span>
                  <span>{item.tokensPerSec} tok/s</span>
                  <span className="text-zinc-600">#{item.verifiableHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
