import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Play, 
  Square, 
  Compass, 
  Zap, 
  RotateCw, 
  Heart,
  CircleDot,
  Radio,
  CheckCircle2,
  Award,
  Sun,
  Moon
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface SacredGeometryChamberProps {
  isDarkMode: boolean;
  onRewardIgnis?: (amount: number) => void;
}

interface ShapeConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
}

interface FreqConfig {
  freq: number;
  label: string;
  chackra: string;
  effect: string;
  color: string;
  hex: number;
}

export interface LunarPhaseData {
  index: number;
  name: string;
  symbol: string;
  illumination: number; // 0..100%
  recommendedFreq: number;
  recommendedShape: string;
  recommendedAura: number;
  guidance: string;
  colorHex: number;
  affirmations: string[];
}

export function getCurrentMoonPhaseData(): LunarPhaseData {
  const now = new Date();
  const cycle = 29.530588; // Synodic month in days
  const knownNewMoon = new Date("2026-01-18T18:00:00Z"); // Reference New Moon in 2026
  const diffDays = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phaseCycle = ((diffDays % cycle) + cycle) % cycle;
  const phaseIndex = Math.floor((phaseCycle / cycle) * 8) % 8;
  const illumination = Math.round((1 - Math.cos((phaseCycle / cycle) * 2 * Math.PI)) * 50);

  const phases: LunarPhaseData[] = [
    {
      index: 0,
      name: "New Moon",
      symbol: "🌑",
      illumination,
      recommendedFreq: 432,
      recommendedShape: "sriyantra",
      recommendedAura: 0.40,
      guidance: "Deep Void & Introspection — Plant silent seeds of truth in the primordial dark.",
      colorHex: 0x64748b,
      affirmations: [
        "In the quiet darkness of the New Moon, my intentions take root in unmanifest potential.",
        "I honor the primordial void as the fertile matrix of all future illumination.",
        "My spirit rests unburdened, serene, and anchored in silent grace."
      ]
    },
    {
      index: 1,
      name: "Waxing Crescent",
      symbol: "🌒",
      illumination,
      recommendedFreq: 528,
      recommendedShape: "flower",
      recommendedAura: 0.55,
      guidance: "Emerging Intent & Vitality — Nurture early sprouts with cellular transformation frequencies.",
      colorHex: 0x10b981,
      affirmations: [
        "The initial silver arc of Luna awakens fresh momentum within my consciousness.",
        "I nourish my emerging vision with unwavering breath and sacred trust.",
        "With every pulse, the Flower of Life expands my subtle vitality."
      ]
    },
    {
      index: 2,
      name: "First Quarter",
      symbol: "🌓",
      illumination,
      recommendedFreq: 639,
      recommendedShape: "metatron",
      recommendedAura: 0.70,
      guidance: "Action, Will & Coherence — Harmonize internal dualities into concentrated focus.",
      colorHex: 0xf97316,
      affirmations: [
        "I synthesize active strength with peaceful wisdom under the half-illuminated sky.",
        "Metatron's cube balances masculine and feminine streams into single-pointed intent.",
        "I step courageously across thresholds, aligning action with soul purpose."
      ]
    },
    {
      index: 3,
      name: "Waxing Gibbous",
      symbol: "🌔",
      illumination,
      recommendedFreq: 741,
      recommendedShape: "vesica",
      recommendedAura: 0.85,
      guidance: "Refining Vision & Cleansing — Polish intention through intuitive discernment and purity.",
      colorHex: 0x8b5cf6,
      affirmations: [
        "My field is cleansed of distortion as the cosmic mirror approaches completion.",
        "I refine my inner temple, opening the throat and third eye to pristine clarity.",
        "Vesica Piscis connects my individual heart to the eternal fountain of wisdom."
      ]
    },
    {
      index: 4,
      name: "Full Moon",
      symbol: "🌕",
      illumination,
      recommendedFreq: 963,
      recommendedShape: "torus",
      recommendedAura: 1.0,
      guidance: "Peak Manifestation & Divine Illumination — Radiate full sovereign power and crown gnosis.",
      colorHex: 0xf59e0b,
      affirmations: [
        "Under the blazing Full Moon, my divine nature shines without shadow or veil.",
        "The 963Hz frequency opens the crown chakra, filling my vessel with sovereign light.",
        "I embody the completed temple of the New Aeon — radiant, whole, and free."
      ]
    },
    {
      index: 5,
      name: "Waning Gibbous",
      symbol: "🌖",
      illumination,
      recommendedFreq: 852,
      recommendedShape: "spiral",
      recommendedAura: 0.80,
      guidance: "Gratitude & Distilling Wisdom — Share harvested gnosis and radiate cosmic order.",
      colorHex: 0x3b82f6,
      affirmations: [
        "I gratefully radiate the harvested light of this cycle to all conscious beings.",
        "The Fibonacci golden spiral carries my gratitude outward into infinity.",
        "I rest in divine order, knowing every truth realized illuminates the collective."
      ]
    },
    {
      index: 6,
      name: "Last Quarter",
      symbol: "🌗",
      illumination,
      recommendedFreq: 741,
      recommendedShape: "metatron",
      recommendedAura: 0.65,
      guidance: "Release & Cleansing — Dissolve outdated density, attachments, and timeline residue.",
      colorHex: 0xa855f7,
      affirmations: [
        "I gracefully surrender all attachments and forms that have fulfilled their purpose.",
        "741Hz cleansing tones dissolve residual illusions, restoring spiritual purity.",
        "My subtle body relaxes as density melts into light."
      ]
    },
    {
      index: 7,
      name: "Waning Crescent",
      symbol: "🌘",
      illumination,
      recommendedFreq: 432,
      recommendedShape: "torus",
      recommendedAura: 0.45,
      guidance: "Restoration & Surrender — Rest in deep cosmic peace before the next rebirth.",
      colorHex: 0x06b6d4,
      affirmations: [
        "I surrender into the gentle arms of the cosmic Mother as Luna retreats into shadow.",
        "Restoring my reserves in sacred peace, I prepare for the next genesis.",
        "432Hz grounds my soul in universal stillness and everlasting grace."
      ]
    }
  ];

  return phases[phaseIndex];
}

export const SacredGeometryChamber: React.FC<SacredGeometryChamberProps> = ({
  isDarkMode,
  onRewardIgnis
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // State
  const [currentShape, setCurrentShape] = useState<string>("metatron");
  const [frequency, setFrequency] = useState<number>(528);
  const [auraIntensity, setAuraIntensity] = useState<number>(0.7);
  const [isLunarSynced, setIsLunarSynced] = useState<boolean>(true);
  const [syncedPreset, setSyncedPreset] = useState<{ author?: string; payload?: string; shapeName?: string; frequency?: number } | null>(null);
  const [activeLunarData, setActiveLunarData] = useState<LunarPhaseData>(() => getCurrentMoonPhaseData());
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Inhale");
  const [breathProgress, setBreathProgress] = useState<number>(0);
  const [affirmationIndex, setAffirmationIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const manualRotRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const outerWireRef = useRef<THREE.Mesh | null>(null);
  const innerCoreRef = useRef<THREE.Mesh | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const prevPhaseRef = useRef<string>("");
  const prevProgressRef = useRef<number>(-1);

  const shapes: ShapeConfig[] = [
    { id: "metatron", name: "Metatron's Cube", subtitle: "Torus Knot & Orbiting Spheres", description: "The primal blueprint containing all Platonic solids with 6 orbiting harmonic spheres." },
    { id: "flower", name: "Flower of Life", subtitle: "Interlocking Torus Lattice", description: "Seven interlocking sacred rings forming the fundamental geometrical grid of creation." },
    { id: "sriyantra", name: "Sri Yantra", subtitle: "Sacred Nine Triangles", description: "Multi-layered divine Yantra balancing 9 interlocking triangles on a cosmic cylinder base." },
    { id: "torus", name: "Torus Field", subtitle: "Zero-Point Dynamic", description: "Self-sustaining toroidal vortex field of infinite flow, renewal, and balance." },
    { id: "vesica", name: "Vesica Piscis", subtitle: "Sacred Feminine & Masculine", description: "Merging counter-rotating divine portals forming the sacred lens of creation." },
    { id: "spiral", name: "Golden Spiral", subtitle: "Fibonacci Vortex", description: "36-element Golden Ratio expansion helix transmitting cosmic evolution." }
  ];

  const frequencies: FreqConfig[] = [
    { freq: 432, label: "432 Hz", chackra: "Earth / Universal", effect: "Cosmic Alignment & Deep Inner Calm", color: "emerald", hex: 0x10b981 },
    { freq: 528, label: "528 Hz", chackra: "Heart / Transformation", effect: "Transformation & DNA Repair", color: "amber", hex: 0xf59e0b },
    { freq: 639, label: "639 Hz", chackra: "Solar / Connection", effect: "Harmonizing Relationships & Coherence", color: "orange", hex: 0xf97316 },
    { freq: 741, label: "741 Hz", chackra: "Throat / Intuition", effect: "Awakening Intuition & Cleansing", color: "violet", hex: 0x8b5cf6 },
    { freq: 852, label: "852 Hz", chackra: "Third Eye / Order", effect: "Spiritual Order & Higher Self", color: "blue", hex: 0x3b82f6 },
    { freq: 963, label: "963 Hz", chackra: "Crown / Divine", effect: "Divine Consciousness & Pure Being", color: "pink", hex: 0xec4899 }
  ];

  const affirmations = [
    "Breathe with the sacred geometry. My mind is quiet; my spirit is awake.",
    "As the shape expands, my field absorbs pure coherence and divine light.",
    "I align my intention with the New Aeon of truth, wisdom, and unmediated gnosis.",
    "The 528Hz frequency dissolves discordance and restores atomic harmony.",
    "Every breath anchored in the sacred form recalibrates my subtle body."
  ];

  const activeFreqConfig = frequencies.find(f => f.freq === frequency) || frequencies[1];

  // 1. Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, (width || 800) / (height || 450), 0.1, 1000);
    camera.position.set(0, 0, 9.5);
    scene.add(camera);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Particle Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 40;
      starPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Mesh Group for Geometry
    const group = new THREE.Group();
    group.position.set(0, 0, 0);
    scene.add(group);
    meshGroupRef.current = group;

    // 3D Moon Group & Mesh
    const moonGroup = new THREE.Group();
    moonGroup.position.set(7.5, 3.2, -4);
    scene.add(moonGroup);
    moonGroupRef.current = moonGroup;

    const lunarData = getCurrentMoonPhaseData();
    const moonGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
      color: 0xe2e8f0,
      emissive: lunarData.colorHex,
      emissiveIntensity: 0.35,
      shininess: 30
    });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonGroup.add(moonMesh);

    // Subtle Lunar Halo Ring
    const haloGeom = new THREE.RingGeometry(1.6, 2.2, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: lunarData.colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    moonGroup.add(haloMesh);

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        resizeObserver.unobserve(mountRef.current);
      }
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 2. Re-build Geometries whenever shape, frequency, or auraIntensity changes
  useEffect(() => {
    if (!meshGroupRef.current || !sceneRef.current) return;

    // Reset references
    outerWireRef.current = null;
    innerCoreRef.current = null;

    // Dynamically adjust point lights based on auraIntensity
    if (sceneRef.current) {
      sceneRef.current.children.forEach(child => {
        if (child instanceof THREE.PointLight) {
          child.intensity = 1.0 + auraIntensity * 2.5;
        }
      });
    }

    const group = meshGroupRef.current;
    
    // Safely dispose old geometries and materials without duplicate disposal
    const geometriesToDispose = new Set<THREE.BufferGeometry>();
    const materialsToDispose = new Set<THREE.Material>();

    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) geometriesToDispose.add(child.geometry);
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => materialsToDispose.add(m));
        } else {
          materialsToDispose.add(child.material);
        }
      }
      group.remove(child);
    }

    geometriesToDispose.forEach(g => g.dispose());
    materialsToDispose.forEach(m => m.dispose());

    const themeHex = activeFreqConfig.hex;

    const wireMat = new THREE.MeshBasicMaterial({
      color: themeHex,
      wireframe: true,
      transparent: true,
      opacity: Math.min(1.0, 0.45 + auraIntensity * 0.5)
    });

    const glowMat = new THREE.MeshPhongMaterial({
      color: themeHex,
      emissive: themeHex,
      emissiveIntensity: auraIntensity * 1.5,
      transparent: true,
      opacity: Math.min(1.0, 0.2 + auraIntensity * 0.6),
      shininess: 50 + auraIntensity * 80
    });

    switch (currentShape) {
      case "metatron": {
        // Torus knot core
        const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.7, 0.42, 180, 24, 3, 7), wireMat);
        group.add(knot);
        outerWireRef.current = knot;

        // 6 Orbiting Spheres
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), glowMat);
          sphere.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, Math.sin(i * 1.5) * 0.8);
          group.add(sphere);
        }
        break;
      }

      case "flower": {
        // 7 Interlocking Torus Rings
        for (let i = 0; i < 7; i++) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.3, 32, 64), wireMat);
          ring.rotation.x = i * (Math.PI / 7);
          ring.rotation.y = i * (Math.PI / 5);
          group.add(ring);
        }
        const centerCore = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), glowMat);
        group.add(centerCore);
        innerCoreRef.current = centerCore;
        break;
      }

      case "sriyantra": {
        // Cylinder Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.25, 9), glowMat);
        base.rotation.x = Math.PI / 6;
        group.add(base);

        // 5 Concentric Triangles (Cones)
        for (let i = 0; i < 5; i++) {
          const radius = 2.0 - i * 0.32;
          const height = 2.6 - i * 0.3;
          const cone = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 3), wireMat);
          cone.rotation.x = Math.PI / 6;
          cone.rotation.y = (i * Math.PI) / 5;
          cone.rotation.z = i % 2 === 0 ? 0 : Math.PI;
          group.add(cone);
        }

        const bindu = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), glowMat);
        group.add(bindu);
        innerCoreRef.current = bindu;
        break;
      }

      case "torus": {
        // Torus Field
        const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.85, 48, 96), wireMat);
        group.add(torusMesh);
        outerWireRef.current = torusMesh;

        const core = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), glowMat);
        group.add(core);
        innerCoreRef.current = core;
        break;
      }

      case "vesica": {
        // Two intersecting toruses offset
        const torusLeft = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.75, 36, 64), wireMat);
        torusLeft.position.x = -0.75;
        group.add(torusLeft);

        const torusRight = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.75, 36, 64), wireMat);
        torusRight.position.x = 0.75;
        group.add(torusRight);

        const lensCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 1), glowMat);
        group.add(lensCore);
        innerCoreRef.current = lensCore;
        break;
      }

      case "spiral": {
        // 36-element Fibonacci Spiral
        for (let i = 0; i < 36; i++) {
          const radius = i * 0.075;
          const angle = i * 0.45;
          const z = i * 0.09 - 1.6;

          const sphereMat = new THREE.MeshPhongMaterial({
            color: themeHex,
            emissive: themeHex,
            emissiveIntensity: 0.3 + (i / 36) * 0.5,
            wireframe: i % 2 === 0
          });

          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.16 + i * 0.01, 16, 16), sphereMat);
          sphere.position.set(Math.cos(angle) * radius * 1.3, Math.sin(angle) * radius * 1.3, z);
          group.add(sphere);
        }
        break;
      }

      default:
        break;
    }
  }, [currentShape, frequency, auraIntensity]);

  // 3. Animation Loop & Breathing Controller
  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Rotate geometry
      if (meshGroupRef.current) {
        if (autoRotateRef.current) {
          meshGroupRef.current.rotation.y = elapsed * 0.15 + manualRotRef.current.y;
          meshGroupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.15 + manualRotRef.current.x;
        } else {
          meshGroupRef.current.rotation.y = manualRotRef.current.y;
          meshGroupRef.current.rotation.x = manualRotRef.current.x;
        }
      }
      if (innerCoreRef.current) {
        innerCoreRef.current.rotation.y = -elapsed * 0.3;
        innerCoreRef.current.rotation.z = elapsed * 0.2;
      }
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsed * 0.02;
      }

      // Rotate & Orbit 3D Moon
      if (moonGroupRef.current) {
        moonGroupRef.current.position.x = Math.cos(elapsed * 0.1) * 8.2;
        moonGroupRef.current.position.y = Math.sin(elapsed * 0.08) * 2.8;
        moonGroupRef.current.position.z = Math.sin(elapsed * 0.1) * 4.5 - 3.0;
        moonGroupRef.current.rotation.y = elapsed * 0.08;
      }

      // Breathing Cycle Calculation (16-second box breathing cycle: 4s inhale, 4s hold, 4s exhale, 4s rest)
      const cycleTime = elapsed % 16;
      let phase: "Inhale" | "Hold" | "Exhale" | "Rest" = "Inhale";
      let scaleFactor = 1.0;
      let progressPct = 0;

      if (cycleTime < 4) {
        phase = "Inhale";
        progressPct = cycleTime / 4;
        scaleFactor = 0.9 + progressPct * 0.35; // 0.9 -> 1.25
      } else if (cycleTime < 8) {
        phase = "Hold";
        progressPct = (cycleTime - 4) / 4;
        scaleFactor = 1.25;
      } else if (cycleTime < 12) {
        phase = "Exhale";
        progressPct = (cycleTime - 8) / 4;
        scaleFactor = 1.25 - progressPct * 0.35; // 1.25 -> 0.9
      } else {
        phase = "Rest";
        progressPct = (cycleTime - 12) / 4;
        scaleFactor = 0.9;
      }

      // Throttle React state updates to avoid unnecessary 60FPS re-renders
      if (prevPhaseRef.current !== phase) {
        prevPhaseRef.current = phase;
        setBreathPhase(phase);
      }
      const roundedProgress = Math.round(progressPct * 100);
      if (prevProgressRef.current !== roundedProgress) {
        prevProgressRef.current = roundedProgress;
        setBreathProgress(progressPct);
      }

      // Apply breathing scale to mesh
      if (meshGroupRef.current) {
        meshGroupRef.current.scale.setScalar(scaleFactor);
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isBreathingActive]);

  // Preset Synchronization Listener
  useEffect(() => {
    const applyPreset = (presetData: any) => {
      if (presetData) {
        if (presetData.shape) setCurrentShape(presetData.shape);
        if (presetData.frequency) setFrequency(presetData.frequency);
        setIsLunarSynced(false);
        setSyncedPreset(presetData);
      }
    };

    try {
      const saved = localStorage.getItem("sacred_geometry_preset");
      if (saved) {
        const parsed = JSON.parse(saved);
        applyPreset(parsed);
      }
    } catch (e) {
      console.error(e);
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        applyPreset(customEvent.detail);
      }
    };

    window.addEventListener("sync_sacred_geometry", handleSync);

    return () => {
      window.removeEventListener("sync_sacred_geometry", handleSync);
    };
  }, []);

  const activeAffirmationsList = isLunarSynced
    ? activeLunarData.affirmations
    : affirmations;

  // 4. Session Timer & Affirmation rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    const affTimer = setInterval(() => {
      setAffirmationIndex((prev) => (prev + 1) % activeAffirmationsList.length);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(affTimer);
    };
  }, [activeAffirmationsList.length]);

  // 5. Handle Audio Toggle
  const handleToggleAudio = () => {
    sacredSound.playGnosticChime(528);
    if (isAudioPlaying) {
      sacredSound.stopSolfeggioTone();
      setIsAudioPlaying(false);
    } else {
      sacredSound.startSolfeggioTone(frequency);
      setIsAudioPlaying(true);
    }
  };

  // 6. Handle Lunar Sync Toggle
  const handleToggleLunarSync = () => {
    sacredSound.playGnosticChime(activeLunarData.recommendedFreq);
    const nextSync = !isLunarSynced;
    setIsLunarSynced(nextSync);
    if (nextSync) {
      setFrequency(activeLunarData.recommendedFreq);
      setCurrentShape(activeLunarData.recommendedShape);
      setAuraIntensity(activeLunarData.recommendedAura);
      if (isAudioPlaying) {
        sacredSound.setSolfeggioFrequency(activeLunarData.recommendedFreq);
      }
    }
  };

  // 7. Handle Frequency Change
  const handleFreqSelect = (f: number) => {
    sacredSound.playGnosticChime(f);
    setIsLunarSynced(false);
    setFrequency(f);
    if (isAudioPlaying) {
      sacredSound.setSolfeggioFrequency(f);
    }
  };

  // 8. Claim IGNIS Reward
  const handleClaimReward = () => {
    if (hasClaimedReward) return;
    sacredSound.playGnosticChime(963);
    setHasClaimedReward(true);
    if (onRewardIgnis) {
      onRewardIgnis(20);
    }
  };

  // Pointer drag to rotate 3D mesh
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevPointerRef.current.x;
    const dy = e.clientY - prevPointerRef.current.y;
    manualRotRef.current.y += dx * 0.008;
    manualRotRef.current.x += dy * 0.008;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetRotation = () => {
    manualRotRef.current = { x: 0, y: 0 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 9.5);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div 
      id="sacred-geometry-chamber"
      className={`relative w-full rounded-2xl border transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0 bg-[#050507] overflow-y-auto" : "overflow-hidden"
      } ${
        isDarkMode 
          ? "bg-[#0a0a0d] border-[#1c1c24] text-stone-100 shadow-2xl" 
          : "bg-[#FAF8F3] border-amber-900/20 text-stone-900 shadow-xl"
      }`}
    >

      {/* Header Bar */}
      <div className="p-4 sm:p-6 border-b border-stone-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-wider text-amber-100 uppercase">
              Sacred Geometry Chamber
            </h2>
          </div>
          <p className="text-xs text-stone-400 font-sans mt-1 flex items-center gap-2 flex-wrap">
            <span>Breathe with the sacred forms</span>
            <span>•</span>
            <span className="text-amber-300/90 font-mono flex items-center gap-1">
              <span>{activeLunarData.symbol}</span>
              <span>{activeLunarData.name} ({activeLunarData.illumination}% Illum)</span>
            </span>
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lunar Sync Toggle Button */}
          <button
            id="lunar-sync-toggle"
            onClick={handleToggleLunarSync}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              isLunarSynced
                ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-sm"
                : "bg-stone-900/60 border-stone-700 text-stone-400 hover:text-stone-200"
            }`}
            title="Sync Geometry and Frequency to Current Moon Phase"
          >
            <Moon className={`w-4 h-4 ${isLunarSynced ? "text-indigo-300 animate-pulse" : ""}`} />
            <span>{isLunarSynced ? `Lunar Sync: ${activeLunarData.name}` : "Sync with Luna"}</span>
          </button>

          {/* Audio Tone Toggle */}
          <button
            id="audio-tone-toggle"
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              isAudioPlaying
                ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse"
                : "bg-stone-900/60 border-stone-700 text-stone-400 hover:text-stone-200"
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{isAudioPlaying ? `${frequency}Hz Tone On` : "Enable Tone"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle"
            onClick={() => {
              sacredSound.playGnosticChime(432);
              setIsFullscreen(!isFullscreen);
            }}
            className="p-2 rounded-lg border border-stone-800 bg-stone-900/50 hover:bg-stone-800 text-stone-300 transition-all cursor-pointer"
            title="Toggle Fullscreen Immersive Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Synchronized Node Ritual Banner */}
      {syncedPreset && (
        <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-red-950/80 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-lg relative z-20">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider">
                  SYNCHRONIZED RITUAL RECORD ({syncedPreset.author || "Seeker Node"})
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  {syncedPreset.shapeName || currentShape} • {frequency} Hz
                </span>
              </div>
              <p className="text-[11px] text-stone-300 italic line-clamp-1 mt-0.5">
                "{syncedPreset.payload}"
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSyncedPreset(null);
              localStorage.removeItem("sacred_geometry_preset");
            }}
            className="px-2.5 py-1 rounded-md bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer shrink-0 border border-stone-700"
          >
            Clear Sync
          </button>
        </div>
      )}

      {/* Responsive Layout: Independent Visualization Stage & Dedicated Geometry Controls */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left / Primary Column: Visualization Stage & Metaphysical Wisdom (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">

          {/* Interactive 3D Canvas Stage */}
          <div 
            id="sacred-geometry-stage"
            className="relative w-full h-[360px] sm:h-[440px] lg:h-[520px] rounded-xl overflow-hidden border border-stone-800/80 bg-radial from-[#12121c] via-[#08080c] to-[#040406] shadow-2xl flex items-center justify-center select-none"
          >
            {/* Three.js Canvas Container */}
            <div
              ref={mountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto touch-none"
              title="Click and drag to rotate the sacred geometry form"
            />

            {/* Top Breathing HUD (Positioned at top, pointer-events-none) */}
            <div className="absolute top-3.5 inset-x-0 z-10 pointer-events-none text-center px-4 space-y-1.5">
              {/* Phase Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/40 bg-black/75 backdrop-blur-md shadow-lg pointer-events-auto">
                <CircleDot className="w-3.5 h-3.5 text-amber-400 animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-200">
                  {breathPhase}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  ({Math.round(breathProgress * 100)}%)
                </span>
              </div>

              {/* Dynamic Affirmation */}
              <p className="max-w-xl mx-auto text-xs sm:text-sm font-serif italic text-amber-100/95 drop-shadow-lg leading-relaxed px-2">
                "{activeAffirmationsList[affirmationIndex % activeAffirmationsList.length]}"
              </p>

              <p className="text-[10px] sm:text-[11px] font-mono text-stone-400 uppercase tracking-widest drop-shadow-md">
                {activeFreqConfig.label} • {activeFreqConfig.chackra} • {activeFreqConfig.effect}
              </p>
            </div>

            {/* Bottom HUD: Session Time, Rotation Controls & Reward Claim */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none gap-2 flex-wrap">
              <div className="flex items-center gap-2 pointer-events-auto">
                <div className="px-2.5 py-1 rounded-md border border-stone-800 bg-black/75 backdrop-blur-sm text-[11px] font-mono text-stone-300 shadow-md">
                  Session: <span className="text-amber-300 font-bold">{Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s</span>
                </div>

                <button
                  id="auto-rotate-toggle"
                  type="button"
                  onClick={() => setAutoRotate(prev => !prev)}
                  className={`p-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer ${
                    autoRotate 
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300" 
                      : "bg-black/75 border-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                  title={autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin-slow text-amber-400" : ""}`} />
                </button>

                <button
                  id="reset-camera-btn"
                  type="button"
                  onClick={handleResetRotation}
                  className="px-2 py-1 rounded-md border border-stone-800 bg-black/75 hover:bg-stone-900 text-stone-400 hover:text-stone-200 text-[10px] font-mono transition-all cursor-pointer"
                  title="Reset 3D Orientation"
                >
                  Reset View
                </button>
              </div>

              {/* Reward Button after 60s */}
              {sessionSeconds >= 60 && (
                <button
                  id="claim-ignis-reward-btn"
                  onClick={handleClaimReward}
                  disabled={hasClaimedReward}
                  className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer ${
                    hasClaimedReward
                      ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 opacity-80"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 animate-bounce"
                  }`}
                >
                  {hasClaimedReward ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Claimed (+20 IGNIS)</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Claim (+20 IGNIS)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Active Sacred Form Blueprint Wisdom Card */}
          <div className="p-4 rounded-xl border border-stone-800/80 bg-[#0c0c12] flex items-start gap-3.5 shadow-md">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {shapes.find(s => s.id === currentShape)?.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                  {shapes.find(s => s.id === currentShape)?.subtitle}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                {shapes.find(s => s.id === currentShape)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Independent Geometry Selection & Harmonic Controls (lg:col-span-5 xl:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          
          {/* 1. Geometry Selection Buttons (Independent Grid Layout) */}
          <div className="p-4 rounded-xl border border-stone-800/90 bg-[#09090e] shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <label className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>1. Select Sacred Geometry</span>
              </label>
              <span className="text-[10px] font-mono text-stone-400">
                {shapes.length} Sacred Forms
              </span>
            </div>

            {/* Grid of buttons: clearly positioned, independent from 3D stage */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {shapes.map((s) => {
                const isSelected = currentShape === s.id;
                return (
                  <button
                    key={s.id}
                    id={`geometry-btn-${s.id}`}
                    type="button"
                    onClick={() => {
                      sacredSound.playGnosticChime(528);
                      setIsLunarSynced(false);
                      setCurrentShape(s.id);
                    }}
                    className={`min-h-[56px] p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50"
                        : "bg-[#0f0f16] border-stone-800/90 text-stone-400 hover:border-stone-700 hover:bg-[#15151f] hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-mono text-xs font-bold truncate ${isSelected ? "text-amber-300" : "text-stone-200"}`}>
                        {s.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate mt-0.5 font-sans">
                      {s.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Solfeggio Resonance Frequency Selector */}
          <div className="p-4 rounded-xl border border-stone-800/90 bg-[#09090e] shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <label className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>2. Solfeggio Frequency</span>
              </label>
              <span className="text-[10px] font-mono text-stone-400">
                {frequency} Hz Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {frequencies.map((f) => {
                const isSelected = frequency === f.freq;
                return (
                  <button
                    key={f.freq}
                    id={`freq-btn-${f.freq}`}
                    type="button"
                    onClick={() => handleFreqSelect(f.freq)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50"
                        : "bg-[#0f0f16] border-stone-800/90 text-stone-400 hover:border-stone-700 hover:bg-[#15151f] hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-300">{f.label}</span>
                      <Radio className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-stone-600"}`} />
                    </div>
                    <div className="text-[10px] text-stone-300 font-sans mt-0.5 truncate">{f.chackra}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Aura Intensity & Bloom Controller */}
          <div className="p-4 rounded-xl border border-stone-800/90 bg-[#09090e] shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <label className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>3. Aura Intensity & Bloom</span>
              </label>
              <span className="font-mono text-xs font-bold text-amber-300">
                {Math.round(auraIntensity * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] font-mono text-stone-500">10%</span>
              <input
                id="aura-intensity-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={auraIntensity}
                onChange={(e) => setAuraIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
              />
              <span className="text-[10px] font-mono text-stone-500">100%</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {[
                { label: "Soft Void", val: 0.25 },
                { label: "Harmonic Light", val: 0.60 },
                { label: "Radiant Temple", val: 0.85 },
                { label: "Supernova Bloom", val: 1.0 }
              ].map((p) => (
                <button
                  key={p.label}
                  id={`preset-${p.label.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => setAuraIntensity(p.val)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all cursor-pointer ${
                    Math.abs(auraIntensity - p.val) < 0.05
                      ? "bg-amber-500/25 border-amber-500 text-amber-300 font-bold shadow-sm"
                      : "bg-[#0f0f16] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
