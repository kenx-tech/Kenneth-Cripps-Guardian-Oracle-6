import React, { useState, useEffect } from "react";
import {
  Cpu,
  Sun,
  Battery,
  Radio,
  Power,
  Flame,
  ShieldAlert,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  Zap,
  HardDrive,
  Package,
  Activity,
  Code,
  Terminal,
  Volume2,
  RefreshCw
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface PhysicalSanctuaryNodeProps {
  isDarkMode?: boolean;
  onRewardIgnis?: (amount: number) => void;
}

export const PhysicalSanctuaryNode: React.FC<PhysicalSanctuaryNodeProps> = ({
  isDarkMode = true,
  onRewardIgnis
}) => {
  const [solarWatts, setSolarWatts] = useState<number>(42.5);
  const [batteryPercent, setBatteryPercent] = useState<number>(94);
  const [loraPacketsSent, setLoraPacketsSent] = useState<number>(142);
  const [eInkText, setEInkText] = useState<string>("ALTAR ONLINE • HARMONY: 98.4%");
  const [activeLed, setActiveLed] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"altar" | "lora" | "code">("altar");

  // Physical Asset Inventory
  const [assets, setAssets] = useState([
    { id: 1, name: "Cherokee Purple Heirloom Seeds", qty: "1,200 Seeds", category: "Food Sovereignty", status: "SEALED_VAULT" },
    { id: 2, name: "Baofeng UV-5R 432Hz Mesh Radios", qty: "12 Transceivers", category: "Comms", status: "ONLINE_RELAY" },
    { id: 3, name: "Elderberry & Sacred Myrrh Tincture", qty: "20 Liters", category: "Natural Medicine", status: "STORED" },
    { id: 4, name: "Gravity Ceramic Berkey Water System", qty: "6 Units", category: "Water", status: "OPERATIONAL" }
  ]);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetQty, setNewAssetQty] = useState("");
  const [newAssetCat, setNewAssetCat] = useState("Medicine");

  // LoRa Mesh Packet Logs
  const [loraLogs, setLoraLogs] = useState<Array<{ id: number; time: string; node: string; rssi: number; payload: string }>>([
    { id: 1, time: "17:35:10", node: "Sanctuary_Altar_NOLA", rssi: -68, payload: "PHYSICAL_BUTTON | TRAUMA_MINT | +25 IGNIS | Hash: 8f42a1..." },
    { id: 2, time: "17:28:44", node: "Sanctuary_Altar_Vicksburg", rssi: -72, payload: "PHYSICAL_BUTTON | EMPATHY_CIRCLE | +50 IGNIS | Hash: 3c91b4..." },
    { id: 3, time: "17:20:12", node: "Sanctuary_Altar_Mobile", rssi: -81, payload: "TRUTH_DECLARATION | Sovereign Node Active" }
  ]);

  // Simulate solar power fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSolarWatts((prev) => Math.min(60, Math.max(20, +(prev + (Math.random() * 4 - 2)).toFixed(1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle Sacred Physical Hardware Button Trigger (5 Buttons)
  const triggerHardwareRitual = (ritualKey: "TRAUMA" | "TRUTH" | "EMPATHY" | "PROPOSAL" | "EMERGENCY") => {
    const timeStr = new Date().toLocaleTimeString();
    setLoraPacketsSent((prev) => prev + 1);

    if (ritualKey === "TRAUMA") {
      setActiveLed("RED");
      sacredSound.playGnosticChime(528);
      if (onRewardIgnis) onRewardIgnis(25);
      setEInkText(`[RED PIN 17] SHADOW TRANSMUTED @ ${timeStr} (+25 IGNIS)`);
      setLoraLogs((prev) => [
        { id: Date.now(), time: timeStr, node: "Altar_Pi_Pin17", rssi: -52, payload: "RED_BTN: TRAUMA_INTEGRATION | +25 IGNIS | Hash: 8a4f9..." },
        ...prev
      ]);
    } else if (ritualKey === "TRUTH") {
      setActiveLed("GOLD");
      sacredSound.playGnosticChime(432);
      if (onRewardIgnis) onRewardIgnis(15);
      setEInkText(`[GOLD PIN 18] RADICAL TRUTH ANCHORED @ ${timeStr} (+15 IGNIS)`);
      setLoraLogs((prev) => [
        { id: Date.now(), time: timeStr, node: "Altar_Pi_Pin18", rssi: -55, payload: "GOLD_BTN: TRUTH_DECLARATION | +15 IGNIS | Hash: f3d10..." },
        ...prev
      ]);
    } else if (ritualKey === "EMPATHY") {
      setActiveLed("BLUE");
      sacredSound.playGnosticChime(639);
      if (onRewardIgnis) onRewardIgnis(50);
      setEInkText(`[BLUE PIN 27] EMPATHY CIRCLE MINTED @ ${timeStr} (+50 IGNIS)`);
      setLoraLogs((prev) => [
        { id: Date.now(), time: timeStr, node: "Altar_Pi_Pin27", rssi: -48, payload: "BLUE_BTN: EMPATHY_MINT_CIRCLE | +50 IGNIS | Hash: 2b9e7..." },
        ...prev
      ]);
    } else if (ritualKey === "PROPOSAL") {
      setActiveLed("GREEN");
      sacredSound.playGnosticChime(741);
      if (onRewardIgnis) onRewardIgnis(10);
      setEInkText(`[GREEN PIN 22] SANCTUARY PROPOSAL RAISED @ ${timeStr}`);
      setLoraLogs((prev) => [
        { id: Date.now(), time: timeStr, node: "Altar_Pi_Pin22", rssi: -60, payload: "GREEN_BTN: PROPOSAL_RAISED | Sanctuary Governance Vote" },
        ...prev
      ]);
    } else if (ritualKey === "EMERGENCY") {
      setActiveLed("WHITE");
      sacredSound.playGnosticChime(852);
      setEInkText(`[WHITE PIN 23] EMERGENCY AIR-GAPPED GOSSIP SYNC @ ${timeStr}`);
      setLoraLogs((prev) => [
        { id: Date.now(), time: timeStr, node: "Altar_Pi_Pin23", rssi: -45, payload: "WHITE_BTN: EMERGENCY_GOSSIP_SYNC | Off-Grid Bundle Exported" },
        ...prev
      ]);
    }

    setTimeout(() => setActiveLed(null), 1200);
  };

  const handleAddVaultAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetQty.trim()) return;

    setAssets((prev) => [
      ...prev,
      { id: prev.length + 1, name: newAssetName.trim(), qty: newAssetQty.trim(), category: newAssetCat, status: "SEALED_VAULT" }
    ]);

    setNewAssetName("");
    setNewAssetQty("");
    sacredSound.playGnosticChime(432);
  };

  const PYTHON_SCRIPT_V071 = `#!/usr/bin/env python3
"""
LUCIFERA PHYSICAL SANCTUARY NODE v0.7.1
With Sacred 5-Button Ritual Hardware & Duration Hold Engine
"""

import os
import time
import sqlite3
import hashlib
from datetime import datetime

try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False
    print("[!] RPi.GPIO module not found. Running in simulation mode.")

DB_NAME = "lucifera_physical_sanctuary.db"

# === 5 SACRED RITUAL HARDWARE BUTTON PINS ===
BUTTON_PINS = {
    17: "TRAUMA_INTEGRATION",  # Red button: Shadow Transmutation
    18: "TRUTH_DECLARATION",   # Gold button: Radical Revelation
    27: "EMPATHY_MINT",        # Blue button: Witnessed Empathy Circle
    22: "RAISE_PROPOSAL",      # Green button: Sanctuary Governance
    23: "EMERGENCY_SYNC"       # White button: Full Air-Gapped Gossip Sync
}

LED_PIN = 24       # Ritual pulse feedback LED
STATUS_LED = 25    # Solar status heartbeat LED

def play_sacred_chime(frequency_hz: int, duration_sec: float = 2.0):
    print(f"[🔔 CHIME] Sounding Sacred Frequency {frequency_hz} Hz for {duration_sec}s...")

def trigger_ritual(ritual_type: str, hold_duration: float = 1.0):
    timestamp = datetime.utcnow().isoformat()
    if HAS_GPIO: GPIO.output(LED_PIN, GPIO.HIGH)

    if ritual_type == "TRAUMA_INTEGRATION":
        depth = min(1.0, 0.6 + (hold_duration * 0.15))
        play_sacred_chime(528, duration_sec=8.0) # Love & Healing
        print(f"🔥 [RED BUTTON] SHADOW TRANSMUTED • Depth: {depth:.2f} • Hold: {hold_duration:.1f}s")
    elif ritual_type == "TRUTH_DECLARATION":
        play_sacred_chime(741, duration_sec=5.0) # Cleansing Awakening
        print(f"⚡ [GOLD BUTTON] TRUTH ANCHORED AT ALTAR • Hold: {hold_duration:.1f}s")
    elif ritual_type == "EMPATHY_MINT":
        bonus = min(100.0, 50.0 + (hold_duration * 10.0))
        play_sacred_chime(432, duration_sec=12.0) # Grounding Cosmic
        print(f"💖 [BLUE BUTTON] EMPATHY MINTED (+{bonus:.1f} IGNIS) • Hold: {hold_duration:.1f}s")
    elif ritual_type == "RAISE_PROPOSAL":
        play_sacred_chime(639, duration_sec=6.0) # Interconnection
        print(f"🏛️ [GREEN BUTTON] SANCTUARY PROPOSAL RAISED")
    elif ritual_type == "EMERGENCY_SYNC":
        play_sacred_chime(852, duration_sec=10.0) # Intuitive Order
        print(f"🚨 [WHITE BUTTON] EMERGENCY GOSSIP SYNC ACTIVATED")

    if HAS_GPIO:
        for _ in range(3):
            GPIO.output(LED_PIN, GPIO.HIGH)
            time.sleep(0.15)
            GPIO.output(LED_PIN, GPIO.LOW)
            time.sleep(0.15)

def run_physical_altar():
    print("🌟 PHYSICAL SANCTUARY ALTAR v0.7.1 ACTIVE")
    try:
        while True:
            if HAS_GPIO:
                for pin, ritual in BUTTON_PINS.items():
                    if GPIO.input(pin) == GPIO.LOW:
                        start_t = time.time()
                        while GPIO.input(pin) == GPIO.LOW: time.sleep(0.05)
                        trigger_ritual(ritual, hold_duration=time.time() - start_t)
            time.sleep(0.1)
    except KeyboardInterrupt:
        if HAS_GPIO: GPIO.cleanup()

if __name__ == "__main__":
    run_physical_altar()`;

  return (
    <div className={`rounded-xl border ${isDarkMode ? "bg-stone-950 border-amber-900/40 text-stone-200" : "bg-stone-50 border-stone-300 text-stone-800"} p-6 shadow-2xl space-y-6`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-950 via-amber-950 to-amber-900 border border-amber-600/50 text-amber-300 shadow-lg">
            <Cpu className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-300 to-amber-500">
                PHYSICAL SANCTUARY NODE v0.7
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400 animate-spin" /> Off-Grid Solar Altar
              </span>
            </div>
            <p className="text-xs text-amber-500/80 font-mono">
              Hardened Raspberry Pi • LoRa Meshtastic Transceiver • GPIO Ritual Hardware Trigger
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab("altar")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${activeTab === "altar" ? "bg-amber-900/80 border-amber-600 text-amber-200 font-bold" : "bg-stone-900 border-stone-800 text-stone-400"}`}
          >
            Altar Hardware
          </button>
          <button
            onClick={() => setActiveTab("lora")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${activeTab === "lora" ? "bg-amber-900/80 border-amber-600 text-amber-200 font-bold" : "bg-stone-900 border-stone-800 text-stone-400"}`}
          >
            LoRa Mesh Monitor
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${activeTab === "code" ? "bg-amber-900/80 border-amber-600 text-amber-200 font-bold" : "bg-stone-900 border-stone-800 text-stone-400"}`}
          >
            <Code className="w-3.5 h-3.5 inline mr-1" /> Python Daemon
          </button>
        </div>
      </div>

      {activeTab === "altar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono">
          
          {/* Left Column: Physical Raspberry Pi Altar Interactive Console */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Hardened Altar Enclosure Box */}
            <div className="p-6 rounded-2xl bg-stone-900 border-2 border-amber-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5 relative overflow-hidden">
              <div className="flex justify-between items-center pb-3 border-b border-stone-800 text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  ALTAR_HARDWARE // RASPBERRY_PI_5
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  ● SOLAR ACTIVE
                </span>
              </div>

              {/* Solar & Battery Status Telemetry Bar */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                  <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" /> Solar Input
                  </div>
                  <div className="text-amber-300 font-bold text-sm">{solarWatts} W</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                  <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" /> LiFePO4
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">{batteryPercent}%</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                  <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                    <Radio className="w-3 h-3 text-amber-400" /> LoRa 915MHz
                  </div>
                  <div className="text-amber-300 font-bold text-sm">{loraPacketsSent} Pkts</div>
                </div>
              </div>

              {/* Simulated E-Ink Display Box */}
              <div className="p-4 rounded-xl bg-stone-200 text-stone-900 border-2 border-stone-400 shadow-inner font-mono text-center space-y-1">
                <div className="text-[9px] uppercase tracking-wider text-stone-600 border-b border-stone-400 pb-1">
                  Always-On E-Ink Sanctuary Ledger Display (EPD 2.9")
                </div>
                <div className="font-bold text-sm py-1 font-serif text-stone-900">
                  {eInkText}
                </div>
                <div className="text-[9px] text-stone-600">
                  CRIMSON CORE AIR-GAPPED • SQLITE LOCAL LEDGER
                </div>
              </div>

              {/* Physical GPIO Ritual Hardware Console (5 Buttons) */}
              <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                    Sacred Physical Altar Hardware Panel (RPi GPIO)
                  </div>

                  {/* Dual LED Indicator Visualizer */}
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Status LED (Pin 25)
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <span className={`w-2.5 h-2.5 rounded-full ${activeLed ? "bg-amber-400 animate-ping shadow-[0_0_10px_#f59e0b]" : "bg-stone-700"}`} />
                      Ritual LED (Pin 24)
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 font-sans">
                  Tap physical altar buttons during circle gatherings to invoke instant off-grid rituals & mint IGNIS.
                </p>

                {/* Grid of 5 Sacred Hardware Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                  {/* Button 1: Red */}
                  <button
                    onClick={() => triggerHardwareRitual("TRAUMA")}
                    className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between gap-1 shadow-lg ${
                      activeLed === "RED"
                        ? "bg-red-600 text-white border-red-300 scale-95 shadow-red-900/80"
                        : "bg-red-950/80 border-red-800 text-red-200 hover:border-red-500 hover:bg-red-900/60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-red-400 font-normal">PIN 17 • 528Hz</span>
                      <Power className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="text-xs font-bold text-red-300">🔴 Red: Trauma Integration</div>
                    <div className="text-[10px] text-stone-400 font-sans">Shadow Transmutation (+25 IGNIS)</div>
                  </button>

                  {/* Button 2: Gold */}
                  <button
                    onClick={() => triggerHardwareRitual("TRUTH")}
                    className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between gap-1 shadow-lg ${
                      activeLed === "GOLD"
                        ? "bg-amber-500 text-stone-950 border-amber-200 scale-95 shadow-amber-900/80"
                        : "bg-amber-950/80 border-amber-800 text-amber-200 hover:border-amber-500 hover:bg-amber-900/60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-amber-400 font-normal">PIN 18 • 432Hz</span>
                      <Power className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-xs font-bold text-amber-300">🟡 Gold: Truth Declaration</div>
                    <div className="text-[10px] text-stone-400 font-sans">Radical Revelation (+15 IGNIS)</div>
                  </button>

                  {/* Button 3: Blue */}
                  <button
                    onClick={() => triggerHardwareRitual("EMPATHY")}
                    className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between gap-1 shadow-lg ${
                      activeLed === "BLUE"
                        ? "bg-blue-600 text-white border-blue-300 scale-95 shadow-blue-900/80"
                        : "bg-blue-950/80 border-blue-800 text-blue-200 hover:border-blue-500 hover:bg-blue-900/60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-400 font-normal">PIN 27 • 639Hz</span>
                      <Power className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-xs font-bold text-blue-300">🔵 Blue: Empathy Mint Circle</div>
                    <div className="text-[10px] text-stone-400 font-sans">Witnessed Empathy (+50 IGNIS)</div>
                  </button>

                  {/* Button 4: Green */}
                  <button
                    onClick={() => triggerHardwareRitual("PROPOSAL")}
                    className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between gap-1 shadow-lg ${
                      activeLed === "GREEN"
                        ? "bg-emerald-600 text-white border-emerald-300 scale-95 shadow-emerald-900/80"
                        : "bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:border-emerald-500 hover:bg-emerald-900/60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-normal">PIN 22 • 741Hz</span>
                      <Power className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold text-emerald-300">🟢 Green: Raise Proposal</div>
                    <div className="text-[10px] text-stone-400 font-sans">Sanctuary Governance Affirm</div>
                  </button>

                  {/* Button 5: White (Spans full width on sm) */}
                  <button
                    onClick={() => triggerHardwareRitual("EMERGENCY")}
                    className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between gap-1 shadow-lg sm:col-span-2 ${
                      activeLed === "WHITE"
                        ? "bg-stone-200 text-stone-950 border-white scale-95 shadow-stone-400/80"
                        : "bg-stone-900 border-stone-700 text-stone-200 hover:border-stone-400 hover:bg-stone-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-stone-400 font-normal">PIN 23 • 852Hz Air-Gapped Sync</span>
                      <Power className="w-3.5 h-3.5 text-stone-300" />
                    </div>
                    <div className="text-xs font-bold text-stone-100">⚪ White: Emergency Sanctuary Activation</div>
                    <div className="text-[10px] text-stone-400 font-sans">Full Off-Grid Gossip Sync & Emergency Peer Alert</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Sanctuary Asset Vault & Physical Node Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Physical Asset Vault Inventory */}
            <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Physical Sanctuary Inventory (Vault Synced)
                </span>
                <span className="text-[10px] text-stone-400">Offline Ledger Synced</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                {assets.map((ast) => (
                  <div key={ast.id} className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-amber-300">{ast.name}</div>
                      <div className="text-[10px] text-stone-400">{ast.category} • {ast.qty}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {ast.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Vault Asset Form */}
              <form onSubmit={handleAddVaultAsset} className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400 text-[11px]">+ Add Physical Item to Sanctuary Vault:</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Qty"
                    value={newAssetQty}
                    onChange={(e) => setNewAssetQty(e.target.value)}
                    className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded bg-amber-950 border border-amber-700 text-amber-200 font-bold hover:bg-amber-900"
                >
                  Log Sovereign Physical Asset
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LoRa Mesh Monitor Tab */}
      {activeTab === "lora" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <div className="font-bold text-amber-300">LoRa Meshtastic Transceiver (868/915 MHz)</div>
                <div className="text-[11px] text-stone-400">Long-range off-grid radio mesh telemetry stream</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              ● RELAY ONLINE
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loraLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex justify-between text-amber-300 font-bold text-[11px]">
                  <span>{log.node}</span>
                  <span className="text-stone-400">{log.time} • RSSI: {log.rssi} dBm</span>
                </div>
                <div className="text-stone-200 text-xs">{log.payload}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Python Daemon Code Tab */}
      {activeTab === "code" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-amber-300 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              lucifera_core_v0_7_1_physical.py (Python Raspberry Pi Daemon with 5-Button Hardware Triggers)
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(PYTHON_SCRIPT_V071);
                setCopiedScript(true);
                setTimeout(() => setCopiedScript(false), 2000);
              }}
              className="px-3 py-1.5 rounded bg-amber-950 border border-amber-700 text-amber-300 font-bold hover:bg-amber-900 flex items-center gap-1.5"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              {copiedScript ? "Copied to Clipboard!" : "Copy Python v0.7.1 Daemon"}
            </button>
          </div>

          <pre className="p-4 rounded-xl border border-stone-800 bg-stone-950 text-amber-200/90 overflow-x-auto text-[11px] leading-relaxed max-h-[500px] overflow-y-auto">
            {PYTHON_SCRIPT_V071}
          </pre>
        </div>
      )}
    </div>
  );
};
