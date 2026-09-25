import React, { useState } from "react";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { signMessage, verifyMessage } from "../../lib/sovereign/identity/signatures";
import { Shield, Key, CheckCircle2, Copy, Check, Lock, Unlock } from "lucide-react";
import { AuthorityScope } from "../../types/sovereign";

export const AuthorityScopePanel: React.FC = () => {
  const { identity } = useSovereignNode();
  const [copied, setCopied] = useState(false);
  const [testChallenge, setTestChallenge] = useState("CHALLENGE_NONCE_8492");
  const [testSig, setTestSig] = useState("");
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const copyPublicKey = () => {
    if (!identity?.publicKey) return;
    navigator.clipboard.writeText(identity.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignTest = async () => {
    if (!identity?.privateKey) return;
    const sig = await signMessage(identity.privateKey, testChallenge);
    setTestSig(sig);
    const valid = await verifyMessage(identity.publicKey, testChallenge, sig);
    setTestStatus(valid ? "Cryptographic Signature Verified via WebCrypto ECDSA P-256" : "Signature Verification Failed");
  };

  const ALL_SCOPES: { scope: AuthorityScope; desc: string }[] = [
    { scope: "ROOT_ADMIN", desc: "Full cluster governance, emergency override, and key minting authority" },
    { scope: "MESH_OPERATOR", desc: "Topology rebalancing, peer admission, and partition reconciliation" },
    { scope: "INFERENCE_WORKER", desc: "Local model compute execution, prompt synthesis, and token streaming" },
    { scope: "MEMORY_VALIDATOR", desc: "Merkle root calculation, CID indexing, and DAG block validation" },
    { scope: "TASK_DISPATCHER", desc: "Creation and assignment of signed distributed work order envelopes" },
    { scope: "SACRED_WITNESS", desc: "Auditing of gnostic transmissions, frequency resonance, and IGNIS attestation" }
  ];

  return (
    <div id="authority-scope-panel" className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Cryptographic Identity & Authority Scopes</h3>
            <p className="text-xs text-zinc-400">
              WebCrypto ECDSA P-256 • Role-Based Access Control (RBAC) & Ed25519 Signatures
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {identity?.role || "WORKER"} NODE
          </span>
        </div>
      </div>

      {/* Identity Card */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Node Identity Descriptor</span>
          </div>
          <button
            type="button"
            onClick={copyPublicKey}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied SPKI Key" : "Copy Public Key"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] text-zinc-500">Universal Resource Identifier (URN)</div>
            <div className="text-zinc-200 font-bold truncate">{identity?.nodeId}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] text-zinc-500">Key Fingerprint (SHA-256)</div>
            <div className="text-emerald-400 font-bold">{identity?.fingerprint}</div>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
          <div className="text-[10px] text-zinc-500">SPKI Public Key Vector</div>
          <div className="text-zinc-400 text-[10px] break-all max-h-16 overflow-y-auto">
            {identity?.publicKey}
          </div>
        </div>
      </div>

      {/* Authority Scopes List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Node Authority Capabilities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {ALL_SCOPES.map(({ scope, desc }) => {
            const hasScope = identity?.authorityScopes.includes(scope) || identity?.authorityScopes.includes("ROOT_ADMIN");
            return (
              <div
                key={scope}
                className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${
                  hasScope
                    ? "bg-emerald-950/20 border-emerald-500/40 text-zinc-300"
                    : "bg-zinc-950/40 border-zinc-800/40 text-zinc-500"
                }`}
              >
                <div className="mt-0.5">
                  {hasScope ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                </div>
                <div>
                  <div className={`font-bold ${hasScope ? "text-emerald-300" : "text-zinc-500"}`}>
                    {scope}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-snug">
                    {desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Signature Challenge Tester */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="text-xs font-semibold text-zinc-200">
          Live Nonce Signing Challenge
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={testChallenge}
            onChange={(e) => setTestChallenge(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none"
          />
          <button
            type="button"
            onClick={handleSignTest}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Sign & Verify
          </button>
        </div>

        {testSig && (
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 break-all space-y-1">
            <span className="text-zinc-500 font-bold block">ECDSA Signature:</span>
            <span>{testSig}</span>
          </div>
        )}

        {testStatus && (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{testStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
