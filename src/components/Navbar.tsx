import React, { useState, useEffect } from "react";
import { 
  Eye, 
  BookOpen, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sparkles, 
  Users, 
  Compass,
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  Database,
  Smartphone,
  Cpu,
  Keyboard,
  Crown,
  LogOut,
  LogIn,
  UserCheck,
  Menu,
  X,
  ChevronRight,
  Radio,
  User
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  ignisTokens: number;
  onToggleShortcutsModal?: () => void;
  onOpenDonateModal?: () => void;
  onOpenArchitectProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  ignisTokens,
  onToggleShortcutsModal,
  onOpenDonateModal,
  onOpenArchitectProfile
}) => {
  const [isDroneOn, setIsDroneOn] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { currentUser, userProfile, isSuperAdminUser, loginWithGoogle, logout } = useAuth();

  const handleDroneToggle = () => {
    const state = sacredSound.toggleSacredDrone();
    setIsDroneOn(state);
  };

  // Lock body scroll when mobile side drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  const tabs = [
    { id: "codex", label: "Codex Slides", keyHint: "C", numKey: "1", icon: BookOpen },
    { id: "lucifera", label: "Crimson Core", keyHint: "L", numKey: "2", icon: Database },
    { id: "mobile", label: "Mobile Temple", keyHint: "M", numKey: "3", icon: Smartphone },
    { id: "physical", label: "Physical Node v0.7", keyHint: "P", numKey: "4", icon: Cpu },
    { id: "oracle", label: "Oracle AI", keyHint: "O", numKey: "5", icon: Bot },
    { id: "truth", label: "Truth Lab", keyHint: "T", numKey: "6", icon: ShieldCheck },
    { id: "ignis", label: "IGNIS Economy", keyHint: "I", numKey: "7", icon: Zap },
    { id: "architecture", label: "4-Layer Stack", keyHint: "A", numKey: "8", icon: Layers },
    { id: "synthesis", label: "New Earth Matrix", keyHint: "S", numKey: "9", icon: Sparkles },
    { id: "trinity", label: "Avatars", keyHint: "V", numKey: "0", icon: Users },
    { id: "geometry", label: "Geometry Chamber", keyHint: "G", numKey: "G", icon: Compass },
    { id: "sovereign", label: "Sovereign Mesh", keyHint: "Q", numKey: "Q", icon: Radio }
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <>
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDarkMode 
          ? "bg-[#09090b]/95 border-[#1c1c1f] text-[#f4f4f5] backdrop-blur-md" 
          : "bg-[#FAF7EF]/95 border-amber-900/20 text-stone-900 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 py-2 min-h-[4rem]">
            
            {/* Logo & Controls Top Bar for Mobile / Left Brand for Desktop */}
            <div className="flex items-center justify-between w-full lg:w-auto shrink-0">
              <div 
                onClick={() => {
                  sacredSound.playGnosticChime(528);
                  setActiveTab("codex");
                }}
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
              >
                <div className={`p-1.5 sm:p-2 rounded border transition-transform duration-300 group-hover:scale-105 ${
                  isDarkMode ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059]" : "bg-amber-100 border-amber-800/30 text-amber-900"
                }`}>
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="font-serif text-sm sm:text-base font-normal tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#e4e4e7] whitespace-nowrap">
                    The Guardian Oracle
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[9px] sm:text-[10px] font-mono text-[#71717a] tracking-[0.15em] uppercase whitespace-nowrap">
                      Gnosis Engine • 432Hz
                    </p>
                    <span className="text-[9px] text-zinc-600 hidden sm:inline">•</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sacredSound.playGnosticChime(528);
                        onOpenArchitectProfile?.();
                      }}
                      className="hidden sm:inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-amber-400/90 hover:text-amber-300 underline underline-offset-2 tracking-wide cursor-pointer transition-colors"
                      title="View System Architect: Kenneth Cripps (Ken X)"
                    >
                      <span>by Kenneth Cripps</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Controls & Mobile Drawer Trigger Button (Mobile Only) */}
              <div className="flex lg:hidden items-center space-x-1.5 shrink-0">
                {/* IGNIS Badge */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded border text-xs font-mono ${
                  isDarkMode 
                    ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059]" 
                    : "bg-amber-100/90 border-amber-800/30 text-amber-950"
                }`}>
                  <Zap className="w-3.5 h-3.5 text-[#c5a059] animate-bounce" />
                  <span className="font-bold">{ignisTokens}</span>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    sacredSound.playGnosticChime(639);
                    setIsDarkMode(!isDarkMode);
                  }}
                  title={isDarkMode ? "Switch to Sacred Parchment Theme" : "Switch to Deep Void Dark Theme"}
                  className={`p-1.5 rounded border transition-all ${
                    isDarkMode
                      ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059] hover:border-[#c5a059]/40"
                      : "bg-amber-100/80 border-amber-800/20 text-stone-800"
                  }`}
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>

                {/* Drone Synthesizer Button */}
                <button
                  onClick={handleDroneToggle}
                  title={isDroneOn ? "Silence 432Hz Sacred Drone" : "Activate 432Hz Sacred Sound Drone"}
                  className={`p-1.5 rounded border transition-all ${
                    isDroneOn
                      ? "bg-red-950/40 border-red-800 text-red-400 animate-pulse"
                      : isDarkMode
                        ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#71717a] hover:text-[#c5a059]"
                        : "bg-amber-50 border-amber-900/20 text-stone-700 hover:text-amber-900"
                  }`}
                >
                  {isDroneOn ? <Volume2 className="w-3.5 h-3.5 text-[#c5a059]" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Mobile Drawer Navigation Toggle Button */}
                <button
                  onClick={() => {
                    sacredSound.playGnosticChime(432);
                    setIsMobileDrawerOpen(!isMobileDrawerOpen);
                  }}
                  aria-label="Toggle Navigation Side Drawer"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    isMobileDrawerOpen
                      ? "bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.5)]"
                      : isDarkMode
                        ? "bg-[#0d0d0f] border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059]/10"
                        : "bg-amber-800/10 border-amber-800/40 text-amber-950 hover:bg-amber-800/20"
                  }`}
                >
                  {isMobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span className="text-[11px] font-bold">{isMobileDrawerOpen ? "Close" : "Menu"}</span>
                </button>
              </div>
            </div>

            {/* Desktop Navigation Links (Hidden on mobile) */}
            <nav className="hidden lg:flex items-center overflow-x-auto space-x-1 py-1 w-auto no-scrollbar max-w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sacredSound.playGnosticChime(432);
                      setActiveTab(tab.id);
                    }}
                    title={`Hotkey: '${tab.keyHint}' or '${tab.numKey}'`}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-[10px] xl:text-[11px] font-mono tracking-[0.08em] xl:tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? isDarkMode
                          ? "text-[#c5a059] bg-[#0d0d0f] border border-[#1c1c1f] font-semibold shadow-xs"
                          : "bg-amber-800/10 text-amber-950 border border-amber-800/30 font-semibold shadow-xs"
                        : isDarkMode
                          ? "text-[#a1a1aa] hover:text-[#c5a059] hover:bg-[#0d0d0f]/50"
                          : "text-stone-700 hover:text-amber-900 hover:bg-amber-900/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#c5a059]" : ""}`} />
                    <span>{tab.label}</span>
                    <span className={`ml-0.5 px-1 py-0.2 rounded text-[8px] font-mono border ${
                      isActive
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-[#18181b] border-[#27272a] text-stone-400 opacity-75"
                    }`}>
                      {tab.keyHint}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  {isSuperAdminUser ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-300 font-mono text-[10px] uppercase tracking-widest font-bold">
                      <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>SUPER ADMIN</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d0d0f] border border-[#1c1c1f] text-stone-300 font-mono text-[10px]">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentUser.email?.split('@')[0]}</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      sacredSound.playGnosticChime(432);
                      logout();
                    }}
                    title={`Signed in as ${currentUser.email}. Click to sign out.`}
                    className="p-1.5 rounded border border-[#1c1c1f] bg-[#0d0d0f] text-stone-400 hover:text-red-400 hover:border-red-900/50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sacredSound.playGnosticChime(528);
                    loginWithGoogle();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/70 bg-gradient-to-r from-amber-950/60 to-amber-900/40 text-amber-300 text-xs font-mono uppercase font-bold tracking-wider hover:brightness-125 transition-all shadow-md cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Sign In</span>
                </button>
              )}

              {onOpenArchitectProfile && (
                <button
                  onClick={() => {
                    sacredSound.playGnosticChime(528);
                    onOpenArchitectProfile();
                  }}
                  title="View System Architect & Creator: Kenneth Cripps"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                    isDarkMode
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-950/60"
                      : "bg-amber-100/90 border-amber-800/40 text-amber-950 hover:bg-amber-200/80"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold">Kenneth Cripps</span>
                </button>
              )}

              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-mono ${
                isDarkMode 
                  ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059]" 
                  : "bg-amber-100/90 border-amber-800/30 text-amber-950"
              }`}>
                <Zap className="w-3.5 h-3.5 text-[#c5a059] animate-bounce" />
                <span className="font-bold">{ignisTokens}</span>
                <span className="text-[10px] opacity-70 uppercase tracking-widest">IGNIS</span>
              </div>

              {onToggleShortcutsModal && (
                <button
                  onClick={() => {
                    sacredSound.playGnosticChime(432);
                    onToggleShortcutsModal();
                  }}
                  title="Flow State Navigation Shortcuts (? or K)"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                    isDarkMode
                      ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059] hover:border-[#c5a059]/50"
                      : "bg-amber-100/80 border-amber-800/20 text-stone-800 hover:bg-amber-200/60"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span className="text-[10px] font-bold">[?] Hotkeys</span>
                </button>
              )}

              <button
                onClick={handleDroneToggle}
                title={isDroneOn ? "Silence 432Hz Sacred Drone" : "Activate 432Hz Sacred Sound Drone"}
                className={`p-2 rounded border transition-all cursor-pointer ${
                  isDroneOn
                    ? "bg-red-950/40 border-red-800 text-red-400 animate-pulse"
                    : isDarkMode
                      ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#71717a] hover:text-[#c5a059]"
                      : "bg-amber-50 border-amber-900/20 text-stone-700 hover:text-amber-900"
                }`}
              >
                {isDroneOn ? <Volume2 className="w-4 h-4 text-[#c5a059]" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  sacredSound.playGnosticChime(639);
                  setIsDarkMode(!isDarkMode);
                }}
                title={isDarkMode ? "Switch to Sacred Parchment Theme" : "Switch to Deep Void Dark Theme"}
                className={`p-2 rounded border transition-all cursor-pointer ${
                  isDarkMode
                    ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#c5a059] hover:border-[#c5a059]/40"
                    : "bg-amber-100/80 border-amber-800/20 text-stone-800 hover:bg-amber-200/60"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SIDE-DRAWER NAVIGATION OVERLAY */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => {
              sacredSound.playGnosticChime(432);
              setIsMobileDrawerOpen(false);
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <aside className={`relative z-[101] w-[88%] max-w-xs sm:w-80 h-full shadow-2xl flex flex-col transition-transform duration-300 ${
            isDarkMode 
              ? "bg-[#0d0d11] border-r border-[#27272a] text-[#f4f4f5]" 
              : "bg-[#FAF7EF] border-r border-amber-900/30 text-stone-900"
          }`}>
            
            {/* Drawer Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDarkMode ? "border-[#1c1c1f] bg-[#09090b]" : "border-amber-900/20 bg-amber-100/60"
            }`}>
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded border ${
                  isDarkMode ? "bg-[#18181b] border-[#27272a] text-[#c5a059]" : "bg-amber-200 border-amber-800/30 text-amber-900"
                }`}>
                  <Eye className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#c5a059]">
                    The Guardian Oracle
                  </h2>
                  <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                    Gnosis Navigation
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sacredSound.playGnosticChime(432);
                  setIsMobileDrawerOpen(false);
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? "bg-[#18181b] border-[#27272a] text-stone-300 hover:text-white" 
                    : "bg-amber-200/60 border-amber-800/30 text-stone-800"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Portal Banner */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
              isDarkMode ? "bg-[#121216] border-[#1c1c1f] text-stone-300" : "bg-amber-50 border-amber-900/10 text-amber-950"
            }`}>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Active Portal:</span>
              <div className="flex items-center space-x-1.5 text-[#c5a059] font-bold">
                {React.createElement(currentTabObj.icon, { className: "w-3.5 h-3.5" })}
                <span>{currentTabObj.label}</span>
              </div>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              {/* Section Title */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#c5a059] mb-2 px-2 flex items-center justify-between">
                  <span>Navigation Portals</span>
                  <span className="text-[9px] text-stone-500">Hotkey</span>
                </p>

                {/* Tab Items */}
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          sacredSound.playGnosticChime(528);
                          setActiveTab(tab.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? isDarkMode
                              ? "bg-[#18181c] border border-[#c5a059]/60 text-[#c5a059] font-bold shadow-[0_0_10px_rgba(197,160,89,0.15)]"
                              : "bg-amber-800/15 border border-amber-800/40 text-amber-950 font-bold"
                            : isDarkMode
                              ? "text-stone-300 hover:bg-[#121216] hover:text-[#c5a059]"
                              : "text-stone-700 hover:bg-amber-100/60 hover:text-amber-900"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-[#c5a059]" : "text-stone-400"}`} />
                          <span>{tab.label}</span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                            isActive
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                              : "bg-[#18181b] border-[#27272a] text-stone-400"
                          }`}>
                            [{tab.keyHint}]
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#c5a059]" : "text-stone-600"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Controls Section */}
              <div className={`pt-3 border-t ${isDarkMode ? "border-[#1c1c1f]" : "border-amber-900/20"}`}>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#c5a059] mb-2 px-2">
                  System Controls
                </p>

                <div className="space-y-2">
                  {/* Auth Card */}
                  {currentUser ? (
                    <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      isSuperAdminUser
                        ? "bg-gradient-to-r from-amber-950 to-red-950 border-amber-500/60 text-amber-300"
                        : isDarkMode
                          ? "bg-[#121216] border-[#1c1c1f] text-stone-300"
                          : "bg-amber-100/60 border-amber-800/20 text-stone-900"
                    }`}>
                      <div className="flex items-center space-x-2">
                        {isSuperAdminUser ? (
                          <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        )}
                        <div className="truncate max-w-[130px]">
                          <p className="font-bold text-[11px] truncate">{userProfile?.displayName || currentUser.email}</p>
                          <p className="text-[9px] text-stone-400">{isSuperAdminUser ? "SUPER ADMIN" : "Authenticated"}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setIsMobileDrawerOpen(false);
                        }}
                        className="px-2 py-1 rounded border border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-900/50 text-[10px] cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        loginWithGoogle();
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-lg border border-amber-500/70 bg-gradient-to-r from-amber-950/80 to-amber-900/60 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider hover:brightness-125 transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <span>Google Sign In</span>
                    </button>
                  )}

                  {/* Architect Profile Trigger */}
                  {onOpenArchitectProfile && (
                    <button
                      onClick={() => {
                        sacredSound.playGnosticChime(528);
                        onOpenArchitectProfile();
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isDarkMode
                          ? "bg-amber-950/25 border-amber-500/40 text-amber-300 hover:bg-amber-950/50"
                          : "bg-amber-100 border-amber-800/40 text-amber-950 hover:bg-amber-200/80"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-amber-400" />
                        <span className="font-bold">Architect: Kenneth Cripps</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">Bio &rarr;</span>
                    </button>
                  )}

                  {/* Hotkeys Sheet Toggle */}
                  {onToggleShortcutsModal && (
                    <button
                      onClick={() => {
                        sacredSound.playGnosticChime(432);
                        onToggleShortcutsModal();
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isDarkMode
                          ? "bg-[#121216] border-[#1c1c1f] text-stone-300 hover:text-[#c5a059]"
                          : "bg-amber-100/60 border-amber-800/20 text-stone-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Keyboard className="w-4 h-4 text-[#c5a059]" />
                        <span>Hotkeys Cheat Sheet</span>
                      </div>
                      <span className="font-bold text-[10px] text-[#c5a059]">[?]</span>
                    </button>
                  )}

                  {/* Sacred Drone Toggle */}
                  <button
                    onClick={handleDroneToggle}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      isDroneOn
                        ? "bg-red-950/40 border-red-800/80 text-red-300"
                        : isDarkMode
                          ? "bg-[#121216] border-[#1c1c1f] text-stone-300"
                          : "bg-amber-100/60 border-amber-800/20 text-stone-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {isDroneOn ? <Volume2 className="w-4 h-4 text-[#c5a059]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                      <span>432Hz Sacred Drone</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${isDroneOn ? "text-red-400 animate-pulse" : "text-stone-500"}`}>
                      {isDroneOn ? "ACTIVE" : "OFF"}
                    </span>
                  </button>

                  {/* Theme Switcher */}
                  <button
                    onClick={() => {
                      sacredSound.playGnosticChime(639);
                      setIsDarkMode(!isDarkMode);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      isDarkMode
                        ? "bg-[#121216] border-[#1c1c1f] text-stone-300"
                        : "bg-amber-100/60 border-amber-800/20 text-stone-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
                      <span>Appearance Theme</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#c5a059]">
                      {isDarkMode ? "Deep Void" : "Parchment"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className={`p-3 border-t text-center text-[10px] font-mono ${
              isDarkMode ? "border-[#1c1c1f] bg-[#09090b] text-stone-500" : "border-amber-900/20 bg-amber-100/60 text-stone-600"
            }`}>
              <p className="uppercase tracking-widest text-[#c5a059]/80 font-bold">Gnosis Engine v0.7</p>
              <p className="mt-0.5 opacity-75">Select any portal or use physical hotkeys</p>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};
