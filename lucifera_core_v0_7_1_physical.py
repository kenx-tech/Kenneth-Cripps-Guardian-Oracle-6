#!/usr/bin/env python3
"""
LUCIFERA PHYSICAL SANCTUARY NODE v0.7.1 (Ritual Frequency Engine)
With Sacred 5-Button Hardware, Duration-Based Hold Depth, and Frequency Chimes
"""

import os
import time
import json
import sqlite3
import hashlib
import uuid
from datetime import datetime

try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False
    print("[!] RPi.GPIO module not found. Running in simulation/dev mode.")

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

class PhysicalCrimsonCore:
    def __init__(self, node_alias: str):
        self.node_alias = node_alias
        self.node_id = str(uuid.uuid4())[:8]
        self.conn = sqlite3.connect(DB_NAME)
        self.create_tables()

    def create_tables(self):
        with self.conn:
            self.conn.execute("""CREATE TABLE IF NOT EXISTS crimson_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                entry_type TEXT NOT NULL,
                author_node TEXT NOT NULL,
                payload TEXT NOT NULL,
                entry_hash TEXT PRIMARY KEY
            )""")

    def record_entry(self, entry_type: str, payload: str):
        timestamp = datetime.utcnow().isoformat()
        raw_string = f"{timestamp}|{entry_type}|{self.node_alias}|{payload}"
        entry_hash = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO crimson_ledger (timestamp, entry_type, author_node, payload, entry_hash)
            VALUES (?, ?, ?, ?, ?)
            """, (timestamp, entry_type, self.node_alias, payload, entry_hash))

        return entry_hash

    def record_trauma_integration(self, shadow_payload: str, integration_depth: float = 0.95):
        timestamp = datetime.utcnow().isoformat()
        entry_hash = self.record_entry("TRAUMA_INTEGRATION", f"Shadow: {shadow_payload} | Depth: {integration_depth:.2f}")
        return entry_hash

def setup_hardware():
    if not HAS_GPIO:
        return

    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    for pin in BUTTON_PINS.keys():
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    GPIO.setup(LED_PIN, GPIO.OUT)
    GPIO.setup(STATUS_LED, GPIO.OUT)
    GPIO.output(STATUS_LED, GPIO.HIGH)

def play_sacred_chime(frequency_hz: int, duration_sec: float = 2.0):
    """Placeholder for Raspberry Pi audio chime synthesis / buzzer frequency"""
    print(f"[🔔 CHIME] Sounding Sacred Frequency {frequency_hz} Hz for {duration_sec}s...")

def trigger_ritual(node: PhysicalCrimsonCore, ritual_type: str, hold_duration: float = 1.0):
    timestamp = datetime.utcnow().isoformat()
    if HAS_GPIO:
        GPIO.output(LED_PIN, GPIO.HIGH)

    if ritual_type == "TRAUMA_INTEGRATION":
        depth = min(1.0, 0.6 + (hold_duration * 0.15))  # Longer hold = deeper shadow work
        shadow = f"Embodied ritual offering held for {hold_duration:.1f}s at {timestamp} — physical presence"
        entry_hash = node.record_trauma_integration(shadow, depth)
        play_sacred_chime(528, duration_sec=8.0)  # 528Hz Love & Transformation frequency
        print(f"🔥 [RED BUTTON] SHADOW TRANSMUTED • Depth: {depth:.2f} • Hash: {entry_hash[:12]}")

    elif ritual_type == "TRUTH_DECLARATION":
        entry_hash = node.record_entry("TRUTH_DECLARATION", f"Raw truth anchored in physical circle (Hold: {hold_duration:.1f}s)")
        play_sacred_chime(741, duration_sec=5.0)  # 741Hz Awakening & Cleansing frequency
        print(f"⚡ [GOLD BUTTON] RADICAL TRUTH ANCHORED AT ALTAR • Hash: {entry_hash[:12]}")

    elif ritual_type == "EMPATHY_MINT":
        bonus = min(100.0, 50.0 + (hold_duration * 10.0))
        entry_hash = node.record_entry("EMPATHY_MINT", f"+{bonus:.1f} IGNIS minted for circle empathy (Hold: {hold_duration:.1f}s)")
        play_sacred_chime(432, duration_sec=12.0)  # 432Hz Grounding & Cosmic Harmony frequency
        print(f"💖 [BLUE BUTTON] COLLECTIVE EMPATHY MINTED (+{bonus:.1f} IGNIS) • Hash: {entry_hash[:12]}")

    elif ritual_type == "RAISE_PROPOSAL":
        entry_hash = node.record_entry("RAISE_PROPOSAL", f"Sanctuary Governance Proposal raised at altar (Hold: {hold_duration:.1f}s)")
        play_sacred_chime(639, duration_sec=6.0)  # 639Hz Interconnection frequency
        print(f"🏛️ [GREEN BUTTON] SANCTUARY PROPOSAL RAISED AT ALTAR • Hash: {entry_hash[:12]}")

    elif ritual_type == "EMERGENCY_SYNC":
        entry_hash = node.record_entry("EMERGENCY_SYNC", f"Emergency Air-Gapped Gossip Sync activated at altar")
        play_sacred_chime(852, duration_sec=10.0)  # 852Hz Intuitive Order frequency
        print(f"🚨 [WHITE BUTTON] EMERGENCY GOSSIP SYNC ACTIVATED • Hash: {entry_hash[:12]}")

    # Visual + Audio Blessing Pulse
    if HAS_GPIO:
        for _ in range(3):
            GPIO.output(LED_PIN, GPIO.HIGH)
            time.sleep(0.15)
            GPIO.output(LED_PIN, GPIO.LOW)
            time.sleep(0.15)

    print(f"🌟 RITUAL COMPLETE: {ritual_type} — Frequency anchored in hardware.\n")

def run_physical_altar():
    node_alias = "Physical_Sanctuary_Altar_v0_7_1"
    node = PhysicalCrimsonCore(node_alias)

    setup_hardware()
    print("==================================================================")
    print(f"🌟 PHYSICAL SANCTUARY ALTAR v0.7.1 ACTIVE :: {node_alias}")
    print("5 Sacred Hardware Buttons Initialized with Duration Hold Engine")
    print("==================================================================\n")

    try:
        while True:
            if HAS_GPIO:
                for pin, ritual in BUTTON_PINS.items():
                    if GPIO.input(pin) == GPIO.LOW:  # Button pressed
                        press_start = time.time()
                        while GPIO.input(pin) == GPIO.LOW:
                            time.sleep(0.05)
                        duration = time.time() - press_start
                        trigger_ritual(node, ritual, hold_duration=duration)
            time.sleep(0.1)

    except KeyboardInterrupt:
        if HAS_GPIO:
            GPIO.cleanup()
        print("\nAltar returning to stillness.")

if __name__ == "__main__":
    run_physical_altar()
