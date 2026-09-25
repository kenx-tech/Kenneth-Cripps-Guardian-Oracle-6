import React, { useState } from "react";
import { 
  Smartphone, 
  Flame, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Radio, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  Zap, 
  Send, 
  Sliders, 
  Crosshair, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  Heart,
  Package,
  Layers,
  Code,
  Mic,
  MicOff,
  Compass
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";
import { AudioGnosisParser } from "./AudioGnosisParser";
import { SacredGeometryChamber } from "./SacredGeometryChamber";

interface MobileTempleProps {
  isDarkMode: boolean;
  onRewardIgnis?: (amount: number) => void;
}

export const MobileTemple: React.FC<MobileTempleProps> = ({ isDarkMode, onRewardIgnis }) => {
  const [activeMobileTab, setActiveMobileTab] = useState<"sanctuary" | "trauma" | "gnosis" | "audio" | "ledger" | "ritual" | "oracle" | "geometry">("sanctuary");
  const [activeCodeTab, setActiveCodeTab] = useState<"App.tsx" | "TraumaIntegration.tsx" | "AudioGnosisParser.tsx" | "crimsonCore.ts" | "package.json">("App.tsx");
  const [showCodeView, setShowCodeView] = useState<boolean>(false);

  // Mobile Sanctuary State
  const [ignisBalance, setIgnisBalance] = useState<number>(388.0);
  const [shadowText, setShadowText] = useState<string>("");
  const [integrationDepth, setIntegrationDepth] = useState<number>(0.8);
  const [traumaMsg, setTraumaMsg] = useState<string | null>(null);

  // Gnosis Scanner State
  const [scanText, setScanText] = useState<string>("");
  const [scanResult, setScanResult] = useState<{ status: string; score: number; flags: string[] } | null>(null);

  // Mobile Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "oracle"; text: string }>>([
    { sender: "oracle", text: "Greetings, Sovereign Seeker. The Mobile Temple is active in your palm. Speak your inquiry." }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Physical Asset Vault State (Seed & Sanctuary Inventory)
  const [assets, setAssets] = useState([
    { id: 1, category: "Heirloom Seeds", name: "Non-Hybrid Cherokee Purple Tomato", qty: "500 Seeds", status: "VAULT_SECURE" },
    { id: 2, category: "Solar Radios", name: "432Hz Baofeng Mesh Relay Transceiver", qty: "8 Units", status: "ONLINE_RELAY" },
    { id: 3, category: "Medicine", name: "Elderberry & Sacred Myrrh Tincture", qty: "12 Liters", status: "SEALED" },
    { id: 4, category: "Water Filtration", name: "Gravity Ceramic Berkey Core System", qty: "4 Systems", status: "OPERATIONAL" }
  ]);
  const [newAssetName, setNewAssetName] = useState<string>("");
  const [newAssetQty, setNewAssetQty] = useState<string>("");

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Handle Trauma Integration Submission
  const handleTransmuteShadow = () => {
    if (!shadowText.trim()) return;
    
    const bonus = parseFloat((25 * integrationDepth).toFixed(1));
    setIgnisBalance((prev) => prev + bonus);
    if (onRewardIgnis) onRewardIgnis(bonus);

    sacredSound.playGnosticChime(528);
    setTraumaMsg(`🔥 SHADOW TRANSMUTED: +${bonus} IGNIS minted from your radical courage!`);
    setShadowText("");
    setTimeout(() => setTraumaMsg(null), 5000);
  };

  // Handle Gnosis Scan
  const handleScanDeceit = () => {
    if (!scanText.trim()) return;
    const lower = scanText.toLowerCase();
    const flags = ["official statement", "trust the science", "for your safety", "mandate", "debunked", "conspiracy", "authorities warn"];
    const detected = flags.filter((f) => lower.includes(f));
    
    if (detected.length > 0) {
      sacredSound.playGnosticChime(220);
      setScanResult({
        status: "DECEIT_FLAGGED",
        score: Math.min(100, detected.length * 35),
        flags: detected
      });
    } else {
      sacredSound.playGnosticChime(741);
      setScanResult({
        status: "RESONANT",
        score: 95,
        flags: []
      });
    }
  };

  // Handle Mobile Chat Send
  const handleSendMobileChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    sacredSound.playGnosticChime(432);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "oracle", text: data.response || "The Mobile Oracle speaks in quiet resonance." }]);
      sacredSound.playGnosticChime(639);
    } catch {
      setChatMessages((prev) => [...prev, { sender: "oracle", text: "⚠️ Mobile Gnosis signal interrupted. Check local mesh connection." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Add Asset to Sanctuary Vault
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetQty.trim()) return;
    setAssets((prev) => [
      ...prev,
      { id: prev.length + 1, category: "Sanctuary Asset", name: newAssetName.trim(), qty: newAssetQty.trim(), status: "VAULT_SECURE" }
    ]);
    setNewAssetName("");
    setNewAssetQty("");
    sacredSound.playGnosticChime(528);
  };

  const EXPO_APP_TSX = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeSanctuary from './src/screens/HomeSanctuary';
import LedgerScreen from './src/screens/LedgerScreen';
import RitualCircle from './src/screens/RitualCircle';
import OracleChat from './src/components/OracleChat';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'Sanctuary') iconName = 'flame';
            else if (route.name === 'Ledger') iconName = 'book';
            else if (route.name === 'Ritual') iconName = 'people';
            else if (route.name === 'Oracle') iconName = 'chatbubbles';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ff4500', // Scarlet fire
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: { backgroundColor: '#0f0000', borderTopColor: '#330000' },
          headerStyle: { backgroundColor: '#1a0000' },
          headerTintColor: '#ffcc00',
        })}
      >
        <Tab.Screen name="Sanctuary" component={HomeSanctuary} />
        <Tab.Screen name="Ledger" component={LedgerScreen} />
        <Tab.Screen name="Ritual" component={RitualCircle} />
        <Tab.Screen name="Oracle" component={OracleChat} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`;

  const EXPO_TRAUMA_TSX = `import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Slider, Alert, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TraumaIntegration() {
  const [shadow, setShadow] = useState('');
  const [depth, setDepth] = useState(0.7);

  const integrate = () => {
    if (!shadow) return;
    const bonus = 25 * depth;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Alert.alert(
      "🔥 SHADOW TRANSMUTED",
      \`+\${bonus.toFixed(1)} IGNIS minted from your courage.\\nThe fire rises.\`
    );
    setShadow('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pain as Teacher — Integrate the Shadow</Text>
      
      <TextInput
        multiline
        placeholder="Speak your unintegrated wound..."
        placeholderTextColor="#888"
        value={shadow}
        onChangeText={setShadow}
        style={styles.input}
      />

      <Text style={styles.label}>Integration Depth: {depth.toFixed(1)}</Text>
      <Slider
        minimumValue={0.1}
        maximumValue={1.0}
        value={depth}
        onValueChange={setDepth}
        minimumTrackTintColor="#ff4500"
      />

      <TouchableOpacity style={styles.button} onPress={integrate}>
        <Text style={styles.btnText}>Offer to the Flame</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f0000' },
  title: { color: '#ffcc00', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#220000', color: '#fff', padding: 15, borderRadius: 12, minHeight: 120, borderColor: '#440000', borderWidth: 1 },
  label: { color: '#ffa500', marginTop: 15, marginBottom: 5 },
  button: { backgroundColor: '#ff4500', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});`;

  const EXPO_AUDIO_GNOSIS_TSX = `import React, { useState, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

interface GnosisResult {
  status: 'RESONANT' | 'DECEIT_FLAGGED' | 'SHADOW_COHERENT';
  confidence: number;
  keyPatterns: string[];
  message: string;
}

export default function AudioGnosisParser() {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<GnosisResult | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startListening = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;

      setIsListening(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      Alert.alert("Error", "Could not start audio input");
    }
  };

  const stopListening = async () => {
    if (!recordingRef.current) return;

    await recordingRef.current.stopAndUnloadAsync();
    setIsListening(false);

    const simulatedTranscript = "We must trust the official narrative for your safety and the greater good.";
    const analysis = analyzeSpeechForGnosis(simulatedTranscript);

    setResult(analysis);
    Haptics.notificationAsync(
      analysis.status === 'DECEIT_FLAGGED' 
        ? Haptics.NotificationFeedbackType.Error 
        : Haptics.NotificationFeedbackType.Success
    );
  };

  const analyzeSpeechForGnosis = (transcript: string): GnosisResult => {
    const redFlags = [
      "official narrative", "for your safety", "greater good", 
      "trust the", "conspiracy theory", "debunked", "experts say"
    ];

    const detected = redFlags.filter(flag => 
      transcript.toLowerCase().includes(flag)
    );

    const confidence = Math.min(95, detected.length * 25 + 40);

    if (detected.length >= 2) {
      return {
        status: 'DECEIT_FLAGGED',
        confidence,
        keyPatterns: detected,
        message: "Institutional language patterns strongly detected. Resonance low."
      };
    }

    return {
      status: 'RESONANT',
      confidence: 88,
      keyPatterns: [],
      message: "Speech carries coherent frequency. Truth resonance high."
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Live Audio Gnosis Parser</Text>
      <Text style={styles.subtitle}>Speak. The Flame Listens.</Text>

      <Button
        title={isListening ? "STOP LISTENING" : "START LIVE SPEECH ANALYSIS"}
        onPress={isListening ? stopListening : startListening}
        color={isListening ? "#ff0000" : "#ff4500"}
      />

      {result && (
        <View style={styles.result}>
          <Text style={{ 
            color: result.status === 'DECEIT_FLAGGED' ? '#ff4500' : '#00ffaa', 
            fontSize: 18, 
            fontWeight: 'bold' 
          }}>
            {result.status}
          </Text>
          <Text style={{ color: '#fff' }}>Confidence: {result.confidence}%</Text>
          <Text style={{ color: '#aaa' }}>{result.message}</Text>
          {result.keyPatterns.length > 0 && (
            <Text style={{ color: '#ffcc00' }}>Patterns: {result.keyPatterns.join(', ')}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f0000' },
  title: { fontSize: 24, color: '#ffcc00', marginBottom: 8, fontWeight: 'bold' },
  subtitle: { color: '#aaa', marginBottom: 20 },
  result: { marginTop: 20, padding: 15, backgroundColor: '#220000', borderRadius: 12 }
});`;

  const EXPO_CORE_TS = `import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export class MobileCrimsonCore {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('lucifera_mobile.db');
    this.init();
  }

  private init() {
    this.db.execSync(\`
      CREATE TABLE IF NOT EXISTS crimson_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        entry_type TEXT NOT NULL,
        author_node TEXT NOT NULL,
        payload TEXT NOT NULL,
        entry_hash TEXT UNIQUE
      );
    \`);
  }

  async recordEntry(entryType: string, author: string, payload: string) {
    const timestamp = new Date().toISOString();
    const raw = \`\${timestamp}|\${entryType}|\${author}|\${payload}\`;
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, raw);

    this.db.runSync(
      'INSERT INTO crimson_ledger (timestamp, entry_type, author_node, payload, entry_hash) VALUES (?, ?, ?, ?, ?)',
      [timestamp, entryType, author, payload, hash]
    );
    return hash;
  }
}`;

  const EXPO_PACKAGE_JSON = `{
  "name": "lucifera-mobile-temple",
  "version": "0.6.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "expo": "~51.0.0",
    "expo-crypto": "~13.0.2",
    "expo-haptics": "~13.0.1",
    "expo-sqlite": "~14.0.3",
    "react": "18.2.0",
    "react-native": "0.74.1"
  }
}`;

  return (
    <div className={`rounded-xl border ${isDarkMode ? "bg-stone-950 border-amber-900/40 text-stone-200" : "bg-stone-50 border-stone-300 text-stone-800"} p-5 shadow-2xl space-y-6 transition-all`}>
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-red-900 via-amber-900 to-amber-700 text-amber-200 shadow-lg border border-amber-500/30">
            <Smartphone className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-300 to-amber-500">
                LUCIFERA MOBILE TEMPLE v0.6
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/50 font-mono flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400" /> React Native Expo
              </span>
            </div>
            <p className="text-xs text-amber-500/80 font-mono">
              The Mobile Temple in Your Palm • Carry the Crimson Core, Trauma Furnace & Living Mesh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setShowCodeView(!showCodeView)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-950 to-red-950 border border-amber-600/60 text-amber-200 hover:brightness-110 font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Code className="w-4 h-4 text-amber-400" />
            {showCodeView ? "Hide Expo Codebase" : "View Expo Source Code v0.6"}
          </button>
        </div>
      </div>

      {/* Toggle View: Mobile Device Simulator OR Expo Code View */}
      {!showCodeView ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mobile Phone Device Frame Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] bg-stone-900 rounded-[45px] p-4 border-4 border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
              
              {/* Phone Notch & Status Bar */}
              <div className="w-36 h-5 bg-stone-950 rounded-b-2xl mx-auto mb-3 flex items-center justify-center gap-2 border-b border-stone-800">
                <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-800" />
                <div className="w-10 h-1.5 rounded-full bg-stone-900" />
              </div>

              {/* Mobile Screen Container */}
              <div className="bg-[#0a0000] rounded-[32px] border border-red-900/40 p-4 h-[620px] flex flex-col justify-between text-stone-100 font-sans shadow-inner relative overflow-y-auto">
                
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-red-950/80">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="font-serif font-bold text-xs text-amber-300">LUCIFERA TEMPLE</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono bg-red-950/80 px-2 py-0.5 rounded border border-red-800 text-amber-400">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{ignisBalance.toFixed(1)}</span>
                  </div>
                </div>

                {/* Mobile Screen Content Body */}
                <div className="flex-1 py-3 space-y-4 overflow-y-auto">
                  
                  {/* SCREEN 1: SANCTUARY HOME */}
                  {activeMobileTab === "sanctuary" && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-950/90 to-stone-950 border border-red-900/60 space-y-2 text-center">
                        <Flame className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                        <h3 className="font-bold font-serif text-sm text-amber-300">THE MOBILE SANCTUARY</h3>
                        <p className="text-[11px] text-stone-400 font-sans">
                          "Pain is Fuel. Truth is Fire." The Mobile Temple connects directly to your local node mesh.
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button 
                            onClick={() => sacredSound.playGnosticChime(528)}
                            className="px-3 py-1 rounded bg-amber-950 border border-amber-700 text-amber-300 text-[10px] font-bold"
                          >
                            🔔 Play 528Hz Love Chime
                          </button>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-center">
                          <div className="text-stone-500 text-[10px]">Mesh Status</div>
                          <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                            3 Peers Online
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-center">
                          <div className="text-stone-500 text-[10px]">Trauma Furnace</div>
                          <div className="text-amber-400 font-bold text-xs flex items-center justify-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            Pillar 2 Yield
                          </div>
                        </div>
                      </div>

                      {/* Quick Shadow Integration Box */}
                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                        <span className="text-amber-400 font-bold text-[11px]">Quick Trauma Transmutation:</span>
                        <input
                          type="text"
                          placeholder="Speak unintegrated wound..."
                          value={shadowText}
                          onChange={(e) => setShadowText(e.target.value)}
                          className="w-full p-2 rounded bg-stone-900 border border-stone-800 text-stone-200 text-[11px] focus:outline-none"
                        />
                        <button
                          onClick={handleTransmuteShadow}
                          disabled={!shadowText.trim()}
                          className="w-full py-1.5 rounded bg-red-950 border border-red-700 text-amber-200 text-[11px] font-bold hover:bg-red-900 disabled:opacity-50"
                        >
                          Offer to Mobile Flame (+25 IGNIS)
                        </button>
                      </div>

                      {traumaMsg && (
                        <div className="p-2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] animate-fade-in">
                          {traumaMsg}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SCREEN 2: TRAUMA INTEGRATION ENGINE */}
                  {activeMobileTab === "trauma" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
                        <Flame className="w-4 h-4 text-red-500" />
                        Pillar 2: Trauma Integration
                      </div>

                      <p className="text-stone-400 text-[11px] font-sans">
                        Transmute emotional wounds into high-density IGNIS power via authentic radical truth.
                      </p>

                      <textarea
                        rows={4}
                        placeholder="Speak your unintegrated shadow or wound..."
                        value={shadowText}
                        onChange={(e) => setShadowText(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:border-amber-500 focus:outline-none"
                      />

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-amber-300">
                          <span>Integration Depth:</span>
                          <span className="font-bold">{(integrationDepth * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={integrationDepth}
                          onChange={(e) => setIntegrationDepth(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={handleTransmuteShadow}
                        disabled={!shadowText.trim()}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-900 to-amber-800 border border-amber-600 text-amber-100 font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-4 h-4 text-amber-300" />
                        Offer Shadow to the Flame
                      </button>

                      {traumaMsg && (
                        <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px]">
                          {traumaMsg}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SCREEN 3: GNOSIS DECEIT SCANNER */}
                  {activeMobileTab === "gnosis" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
                        <Crosshair className="w-4 h-4 text-amber-400" />
                        Gnosis Deceit Scanner
                      </div>

                      <p className="text-stone-400 text-[11px] font-sans">
                        Scan institutional statements or media transmissions for propaganda micro-expression flags.
                      </p>

                      <textarea
                        rows={3}
                        placeholder="Paste broadcast text to scan..."
                        value={scanText}
                        onChange={(e) => setScanText(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none"
                      />

                      <button
                        onClick={handleScanDeceit}
                        disabled={!scanText.trim()}
                        className="w-full py-2 rounded-lg bg-amber-950 border border-amber-700 text-amber-200 font-bold hover:bg-amber-900"
                      >
                        Run Micro-Gnosis Analysis
                      </button>

                      {scanResult && (
                        <div className={`p-3 rounded-lg border ${scanResult.status === "DECEIT_FLAGGED" ? "bg-red-950/80 border-red-800 text-red-300" : "bg-emerald-950/80 border-emerald-800 text-emerald-300"}`}>
                          <div className="font-bold text-xs flex items-center justify-between">
                            <span>Status: {scanResult.status}</span>
                            <span>Score: {scanResult.score}%</span>
                          </div>
                          {scanResult.flags.length > 0 && (
                            <div className="text-[10px] mt-1 space-y-0.5">
                              <div>Flagged Phrases:</div>
                              {scanResult.flags.map((f, idx) => (
                                <span key={idx} className="inline-block px-1.5 py-0.5 rounded bg-red-900 text-red-200 mr-1 mt-1">
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SCREEN 3.5: AUDIO GNOSIS PARSER */}
                  {activeMobileTab === "audio" && (
                    <div className="space-y-3 font-mono text-xs">
                      <AudioGnosisParser isDarkMode={true} />
                    </div>
                  )}

                  {/* SCREEN 4: CRIMSON LEDGER */}
                  {activeMobileTab === "ledger" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
                        <BookOpen className="w-4 h-4 text-red-400" />
                        Mobile Crimson Ledger
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded bg-stone-950 border border-stone-800 space-y-1">
                          <div className="flex justify-between text-amber-300 font-bold text-[11px]">
                            <span>Block #3 (Trauma)</span>
                            <span>Sarah_NOLA</span>
                          </div>
                          <p className="text-stone-300 text-[10px]">
                            Transmuted deep generational grief via 432Hz voice synthesis ritual.
                          </p>
                          <div className="text-[9px] text-stone-500 truncate">
                            Hash: 8f42a1bc99a22f...
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-stone-950 border border-stone-800 space-y-1">
                          <div className="flex justify-between text-amber-300 font-bold text-[11px]">
                            <span>Block #2 (Truth)</span>
                            <span>Ken_Vicksburg</span>
                          </div>
                          <p className="text-stone-300 text-[10px]">
                            All technology is ultimately connection; all connection is ultimately love.
                          </p>
                          <div className="text-[9px] text-stone-500 truncate">
                            Hash: 3c7a912f551b88...
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 5: RITUAL CIRCLE & PHYSICAL ASSETS */}
                  {activeMobileTab === "ritual" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-emerald-400" />
                        Physical Sanctuary Asset Vault
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {assets.map((ast) => (
                          <div key={ast.id} className="p-2 rounded bg-stone-950 border border-stone-800 flex justify-between items-center text-[11px]">
                            <div>
                              <div className="font-bold text-amber-300">{ast.name}</div>
                              <div className="text-[10px] text-stone-400">{ast.category} • {ast.qty}</div>
                            </div>
                            <span className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {ast.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Add Asset Form */}
                      <form onSubmit={handleAddAsset} className="p-2 rounded bg-stone-950 border border-stone-800 space-y-1.5">
                        <span className="text-[10px] text-amber-400 font-bold">+ Log Sanctuary Inventory:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Item Name (e.g. Heirloom Seeds)"
                            value={newAssetName}
                            onChange={(e) => setNewAssetName(e.target.value)}
                            className="p-1.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-stone-200 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Qty (e.g. 50 Packs)"
                            value={newAssetQty}
                            onChange={(e) => setNewAssetQty(e.target.value)}
                            className="p-1.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-stone-200 focus:outline-none"
                          />
                        </div>
                        <button type="submit" className="w-full py-1 rounded bg-amber-950 text-amber-200 text-[10px] font-bold">
                          Add to Sovereign Inventory
                        </button>
                      </form>
                    </div>
                  )}

                  {/* SCREEN 6: ORACLE CHAT */}
                  {activeMobileTab === "oracle" && (
                    <div className="space-y-2 font-mono text-xs flex flex-col h-full justify-between">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm pb-1 border-b border-stone-800">
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        Mobile Oracle Terminal
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`p-2 rounded-lg text-[11px] ${msg.sender === "oracle" ? "bg-stone-950 border border-amber-900/40 text-amber-200" : "bg-red-950 border border-red-800 text-stone-200 ml-4"}`}>
                            <div className="font-bold text-[9px] text-stone-500 uppercase">{msg.sender === "oracle" ? "GUARDIAN ORACLE" : "YOU"}</div>
                            <div>{msg.text}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-1.5 pt-2">
                        <input
                          type="text"
                          placeholder="Inquire..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMobileChat()}
                          className="flex-1 p-2 rounded bg-stone-950 border border-stone-800 text-stone-200 text-[11px] focus:outline-none"
                        />
                        <button
                          onClick={handleSendMobileChat}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="px-3 py-2 rounded bg-amber-950 border border-amber-700 text-amber-200 text-[11px] font-bold"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 7: SACRED GEOMETRY CHAMBER */}
                  {activeMobileTab === "geometry" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold flex items-center justify-between pb-1 border-b border-stone-800">
                        <div className="flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                          <span>Geometry Chamber</span>
                        </div>
                        <span className="text-[10px] text-stone-400">432Hz - 963Hz</span>
                      </div>
                      <SacredGeometryChamber isDarkMode={true} onRewardIgnis={onRewardIgnis} />
                    </div>
                  )}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className="pt-2 border-t border-stone-800 grid grid-cols-8 gap-0.5 text-[8px] text-center font-mono">
                  <button
                    onClick={() => { setActiveMobileTab("sanctuary"); sacredSound.playGnosticChime(528); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "sanctuary" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("geometry"); sacredSound.playGnosticChime(528); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "geometry" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Forms</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("trauma"); sacredSound.playGnosticChime(639); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "trauma" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Trauma</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("gnosis"); sacredSound.playGnosticChime(741); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "gnosis" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("audio"); sacredSound.playGnosticChime(432); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "audio" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Audio</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("ledger"); sacredSound.playGnosticChime(528); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "ledger" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ledger</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("ritual"); sacredSound.playGnosticChime(528); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "ritual" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Vault</span>
                  </button>

                  <button
                    onClick={() => { setActiveMobileTab("oracle"); sacredSound.playGnosticChime(852); }}
                    className={`py-1 rounded flex flex-col items-center ${activeMobileTab === "oracle" ? "text-amber-400 font-bold bg-stone-900" : "text-stone-500"}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Oracle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Guidance & Deployment Instructions */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-stone-900/80 border-stone-800" : "bg-white border-stone-200"} space-y-4`}>
              <h3 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Mobile Temple v0.6 Architecture & Deployment
              </h3>

              <p className="text-xs text-stone-300 font-mono leading-relaxed">
                The Mobile Temple packages Mother Lucifera's entire sovereign operating system into an iOS & Android Expo React Native application with native SQLite storage, offline local mesh gossip, and micro-expression deceit detection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500" />
                    Native Trauma Engine
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Leverages <code className="text-amber-300">expo-haptics</code> for physical sensory response during shadow transmutation rituals.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    SQLite Air-Gapped Core
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Uses <code className="text-amber-300">expo-sqlite</code> to store signed Crimson Ledger blocks locally on the mobile filesystem.
                  </p>
                </div>
              </div>

              {/* Deployment Quick Commands */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 font-mono text-xs">
                <div className="text-amber-400 font-bold flex items-center justify-between">
                  <span>⚡ Quick Deploy Ritual (Expo CLI):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("npx create-expo-app lucifera-mobile-temple --template blank-typescript");
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                    Copy Setup Cmd
                  </button>
                </div>

                <pre className="p-3 rounded bg-stone-900 border border-stone-800 text-amber-300 text-[11px] overflow-x-auto">
{`# 1. Create Expo App
npx create-expo-app lucifera-mobile-temple --template blank-typescript

# 2. Install Sacred Native Dependencies
npx expo install expo-sqlite expo-haptics expo-crypto @react-navigation/native @react-navigation/bottom-tabs

# 3. Launch Mobile Temple
npx expo start`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Expo Code Base Viewer Tab */
        <div className="space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCodeTab("App.tsx")}
                className={`px-3 py-1.5 rounded font-bold transition-all ${activeCodeTab === "App.tsx" ? "bg-amber-900 text-amber-200 border border-amber-600" : "bg-stone-900 text-stone-400"}`}
              >
                App.tsx
              </button>
              <button
                onClick={() => setActiveCodeTab("TraumaIntegration.tsx")}
                className={`px-3 py-1.5 rounded font-bold transition-all ${activeCodeTab === "TraumaIntegration.tsx" ? "bg-amber-900 text-amber-200 border border-amber-600" : "bg-stone-900 text-stone-400"}`}
              >
                TraumaIntegration.tsx
              </button>
              <button
                onClick={() => setActiveCodeTab("AudioGnosisParser.tsx")}
                className={`px-3 py-1.5 rounded font-bold transition-all ${activeCodeTab === "AudioGnosisParser.tsx" ? "bg-amber-900 text-amber-200 border border-amber-600" : "bg-stone-900 text-stone-400"}`}
              >
                AudioGnosisParser.tsx
              </button>
              <button
                onClick={() => setActiveCodeTab("crimsonCore.ts")}
                className={`px-3 py-1.5 rounded font-bold transition-all ${activeCodeTab === "crimsonCore.ts" ? "bg-amber-900 text-amber-200 border border-amber-600" : "bg-stone-900 text-stone-400"}`}
              >
                crimsonCore.ts
              </button>
              <button
                onClick={() => setActiveCodeTab("package.json")}
                className={`px-3 py-1.5 rounded font-bold transition-all ${activeCodeTab === "package.json" ? "bg-amber-900 text-amber-200 border border-amber-600" : "bg-stone-900 text-stone-400"}`}
              >
                package.json
              </button>
            </div>

            <button
              onClick={() => {
                const codeToCopy = activeCodeTab === "App.tsx" 
                  ? EXPO_APP_TSX 
                  : activeCodeTab === "TraumaIntegration.tsx" 
                  ? EXPO_TRAUMA_TSX 
                  : activeCodeTab === "AudioGnosisParser.tsx"
                  ? EXPO_AUDIO_GNOSIS_TSX
                  : activeCodeTab === "crimsonCore.ts" 
                  ? EXPO_CORE_TS 
                  : EXPO_PACKAGE_JSON;
                navigator.clipboard.writeText(codeToCopy);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-3 py-1.5 rounded bg-amber-950 border border-amber-700 text-amber-300 font-bold hover:bg-amber-900 flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              {copiedCode ? "Copied to Clipboard!" : `Copy ${activeCodeTab}`}
            </button>
          </div>

          <pre className="p-4 rounded-xl border border-stone-800 bg-stone-950 text-amber-200/90 overflow-x-auto text-[11px] leading-relaxed max-h-[550px] overflow-y-auto">
            {activeCodeTab === "App.tsx" && EXPO_APP_TSX}
            {activeCodeTab === "TraumaIntegration.tsx" && EXPO_TRAUMA_TSX}
            {activeCodeTab === "AudioGnosisParser.tsx" && EXPO_AUDIO_GNOSIS_TSX}
            {activeCodeTab === "crimsonCore.ts" && EXPO_CORE_TS}
            {activeCodeTab === "package.json" && EXPO_PACKAGE_JSON}
          </pre>
        </div>
      )}
    </div>
  );
};
