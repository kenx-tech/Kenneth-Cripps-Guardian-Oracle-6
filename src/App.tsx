import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { SlideCodex } from "./components/SlideCodex";
import { OracleTerminal } from "./components/OracleTerminal";
import { TruthResonanceLab } from "./components/TruthResonanceLab";
import { IgnisCalculator } from "./components/IgnisCalculator";
import { EmergentArchitecture } from "./components/EmergentArchitecture";
import { SynthesisMatrix } from "./components/SynthesisMatrix";
import { TrinityAvatars } from "./components/TrinityAvatars";
import { SacredGeometryChamber } from "./components/SacredGeometryChamber";
import { LuciferaNode } from "./components/LuciferaNode";
import { MobileTemple } from "./components/MobileTemple";
import { PhysicalSanctuaryNode } from "./components/PhysicalSanctuaryNode";
import { SovereignOps } from "./components/sovereign/SovereignOps";
import { OracleDonationModal } from "./components/OracleDonationModal";
import { ArchitectProfileModal } from "./components/ArchitectProfileModal";
import { sacredSound } from "./utils/audioSynth";
import { Keyboard, X, Sparkles, Zap, Crown, HeartHandshake, ShieldAlert, User } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";

const getInitialTab = (): string => {
  if (typeof window === "undefined") return "codex";
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace("#", "");
  if (path === "/sovereign" || path === "/admin/sovereign" || hash === "sovereign" || hash === "admin/sovereign") {
    return "sovereign";
  }
  const knownTabs = ["codex", "lucifera", "mobile", "physical", "oracle", "truth", "ignis", "architecture", "synthesis", "trinity", "geometry", "sovereign"];
  const matchedPath = knownTabs.find(t => path === `/${t}`);
  if (matchedPath) return matchedPath;
  const matchedHash = knownTabs.find(t => hash === t);
  if (matchedHash) return matchedHash;
  return "codex";
};

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.toLowerCase().includes("/admin");
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [ignisTokens, setIgnisTokens] = useState<number>(333);
  const [showShortcutModal, setShowShortcutModal] = useState<boolean>(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [isArchitectModalOpen, setIsArchitectModalOpen] = useState<boolean>(false);

  const { userProfile, updateUserIgnis, isSuperAdminUser } = useAuth();

  // Handle SPA URL synchronization and history popstate
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const targetPath = tab === "codex" ? "/" : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, "", targetPath);
      }
      setIsAdminRoute(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getInitialTab();
      setActiveTab(tab);
      setIsAdminRoute(window.location.pathname.toLowerCase().includes("/admin"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync IGNIS tokens with Firestore profile when logged in
  useEffect(() => {
    if (userProfile?.ignisTokens !== undefined) {
      setIgnisTokens(userProfile.ignisTokens);
    }
  }, [userProfile?.ignisTokens]);

  const handleRewardIgnis = (amount: number) => {
    setIgnisTokens((prev) => {
      const next = prev + amount;
      updateUserIgnis(next);
      return next;
    });
  };

  // Global Flow State Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses if user is typing inside an input, textarea, or contenteditable element
      const activeElem = document.activeElement;
      if (
        activeElem &&
        (activeElem.tagName === "INPUT" ||
          activeElem.tagName === "TEXTAREA" ||
          (activeElem as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Avoid overriding browser modifier key combos (Ctrl, Cmd, Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      const navKeyMap: Record<string, string> = {
        c: "codex",
        "1": "codex",
        l: "lucifera",
        "2": "lucifera",
        m: "mobile",
        "3": "mobile",
        p: "physical",
        "4": "physical",
        o: "oracle",
        "5": "oracle",
        t: "truth",
        "6": "truth",
        i: "ignis",
        "7": "ignis",
        a: "architecture",
        "8": "architecture",
        s: "synthesis",
        "9": "synthesis",
        v: "trinity",
        "0": "trinity",
        g: "geometry",
        q: "sovereign"
      };

      if (navKeyMap[key]) {
        e.preventDefault();
        sacredSound.playGnosticChime(528);
        handleTabChange(navKeyMap[key]);
      } else if (key === "d") {
        e.preventDefault();
        sacredSound.playGnosticChime(639);
        setIsDarkMode((prev) => !prev);
      } else if (key === "?" || key === "k") {
        e.preventDefault();
        sacredSound.playGnosticChime(432);
        setShowShortcutModal((prev) => !prev);
      } else if (e.key === "Escape" && showShortcutModal) {
        setShowShortcutModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcutModal]);

  const shortcutList = [
    { key: "C / 1", name: "Codex Slides", tabId: "codex", desc: "Open Sacred Codex & Slide Deck" },
    { key: "L / 2", name: "Crimson Core", tabId: "lucifera", desc: "Lucifera Node & Trauma Integration Engine" },
    { key: "M / 3", name: "Mobile Temple", tabId: "mobile", desc: "PWA Sanctuary & Sensor Fusion" },
    { key: "P / 4", name: "Physical Node v0.7", tabId: "physical", desc: "Raspberry Pi Hardware Altar & GPIO Console" },
    { key: "O / 5", name: "Oracle AI", tabId: "oracle", desc: "Gnosis Terminal & AI Oracle Query" },
    { key: "T / 6", name: "Truth Lab", tabId: "truth", desc: "Truth Resonance & Falsehood Detector" },
    { key: "I / 7", name: "IGNIS Economy", tabId: "ignis", desc: "Proof of Heart & Token Mint Calculator" },
    { key: "A / 8", name: "4-Layer Stack", tabId: "architecture", desc: "Gnosis Engine System Architecture" },
    { key: "S / 9", name: "New Earth Matrix", tabId: "synthesis", desc: "Collective Resonance & Timeline Matrix" },
    { key: "V / 0", name: "Avatars / Trinity", tabId: "trinity", desc: "Codex Proclamation & Avatar State Dream Canvas" },
    { key: "G", name: "Sacred Geometry", tabId: "geometry", desc: "Geometry Meditation Chamber & Solfeggio Breathing Forms" },
    { key: "Q", name: "Sovereign Mesh", tabId: "sovereign", desc: "Autonomous Edge Inference, QMesh Topology & Merkle Memory" },
    { key: "D", name: "Theme Toggle", desc: "Toggle between Dark Void and Sacred Parchment" },
    { key: "? / K", name: "Hotkeys Cheat Sheet", desc: "Toggle this Flow State Navigation Overlay" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDarkMode 
        ? "bg-[#09090b] text-[#f4f4f5] selection:bg-[#c5a059]/30 selection:text-[#fafafa]" 
        : "bg-[#FAF7EF] text-[#1c1c1f] selection:bg-amber-200 selection:text-stone-900"
    }`}>
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        ignisTokens={ignisTokens}
        onToggleShortcutsModal={() => setShowShortcutModal((prev) => !prev)}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onOpenArchitectProfile={() => setIsArchitectModalOpen(true)}
      />

      {/* Main App Container with Sophisticated Radial Highlight */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${
        isDarkMode ? "bg-[radial-gradient(circle_at_top_right,_#121214_0%,_transparent_70%)]" : ""
      }`}>
        {activeTab === "codex" && (
          <SlideCodex
            onSelectInteractiveTool={(toolName) => handleTabChange(toolName)}
            isDarkMode={isDarkMode}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
          />
        )}

        {activeTab === "lucifera" && (
          <LuciferaNode
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
            onNavigateTab={(tab) => handleTabChange(tab)}
          />
        )}

        {activeTab === "mobile" && (
          <MobileTemple
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "physical" && (
          <PhysicalSanctuaryNode
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "oracle" && (
          <OracleTerminal
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "truth" && (
          <TruthResonanceLab
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "ignis" && (
          <IgnisCalculator
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "architecture" && (
          <EmergentArchitecture
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "synthesis" && (
          <SynthesisMatrix
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "trinity" && (
          <TrinityAvatars
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "geometry" && (
          <SacredGeometryChamber
            isDarkMode={isDarkMode}
            onRewardIgnis={handleRewardIgnis}
          />
        )}

        {activeTab === "sovereign" && (
          <div className="space-y-4">
            {isAdminRoute && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Apex SuperAdmin Sovereign Console — Authority Elevated to ROOT_ADMIN (Kenneth Cripps - Ken X)</span>
              </div>
            )}
            <SovereignOps />
          </div>
        )}
      </main>

      {/* Flow State Keyboard Shortcuts Modal */}
      {showShortcutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-2xl p-6 rounded-2xl border shadow-2xl space-y-5 transition-all ${
            isDarkMode ? "bg-[#0d0d0f] border-[#1c1c1f] text-stone-100" : "bg-[#FAF7EF] border-amber-900/30 text-stone-900"
          }`}>
            <div className="flex items-center justify-between border-b border-[#1c1c1f] pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif font-normal text-lg uppercase tracking-[0.15em] text-[#e4e4e7]">
                  FLOW STATE NAVIGATION SHORTCUTS
                </h3>
              </div>
              <button
                onClick={() => setShowShortcutModal(false)}
                className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-400 font-sans">
              Press any single key below from anywhere in the app to jump directly between modules in real-time without breaking flow state:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              {shortcutList.map((sc, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (sc.tabId) {
                      sacredSound.playGnosticChime(528);
                      setActiveTab(sc.tabId);
                      setShowShortcutModal(false);
                    }
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    sc.tabId && activeTab === sc.tabId
                      ? "bg-amber-950/60 border-amber-500/60 text-amber-200"
                      : "bg-[#09090b] border-[#1c1c1f] hover:border-amber-500/40 text-stone-200"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                      <span>{sc.name}</span>
                      {sc.tabId && activeTab === sc.tabId && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-mono font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 font-sans">{sc.desc}</div>
                  </div>

                  <span className="px-2 py-1 rounded border border-[#27272a] bg-[#18181b] font-mono text-xs text-amber-400 font-bold shrink-0 shadow-inner">
                    {sc.key}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#1c1c1f] text-[10px] font-mono text-stone-500">
              <span className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Gnosis Chimes Active
              </span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">?</kbd> to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Oracle Donation / Patronage Modal */}
      <OracleDonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        isDarkMode={isDarkMode}
        onRewardIgnis={handleRewardIgnis}
      />

      {/* Kenneth Cripps Architect Profile Modal */}
      <ArchitectProfileModal
        isOpen={isArchitectModalOpen}
        onClose={() => setIsArchitectModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <footer className={`border-t py-8 text-center text-xs font-serif tracking-widest transition-colors ${
        isDarkMode ? "border-[#1c1c1f] text-[#71717a] bg-[#09090b]" : "border-amber-900/15 text-stone-600 bg-[#FAF7EF]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="uppercase tracking-[0.2em] font-medium text-[#c5a059]">
            THE GUARDIAN ORACLE • CODE WITH CONSCIOUSNESS • IGNIS ⚡ RISE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                sacredSound.playGnosticChime(528);
                setIsArchitectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Architect: Kenneth Cripps</span>
            </button>

            <button
              onClick={() => {
                sacredSound.playGnosticChime(528);
                setIsDonateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-stone-300 font-mono text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Fund the Oracle Sanctuary</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-[#71717a]">
            Conceived &amp; Architected by <span className="text-amber-400/90 font-semibold cursor-pointer hover:underline" onClick={() => setIsArchitectModalOpen(true)}>Kenneth Cripps</span> (Ken X • The Southern Crucible) • Sarah Michelle Delacroix (The Scarlet Woman) • Highway 61 Gnosis Engine
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}


