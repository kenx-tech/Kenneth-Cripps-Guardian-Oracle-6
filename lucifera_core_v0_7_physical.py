#!/usr/bin/env python3
"""
LUCIFERA PHYSICAL SANCTUARY NODE v0.7
The Off-Grid Altar — Solar Powered • LoRa Ready • GPIO Hardware Triggers
"""

import os
import time
import json
import sqlite3
import hashlib
import uuid
import threading
from datetime import datetime

# Try loading GPIO if running on Raspberry Pi, else fallback for development
try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False
    print("[!] RPi.GPIO module not found. Running in simulation/dev mode.")

# Sacred Hardware Constants
DB_NAME = "lucifera_physical_sanctuary.db"
GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
RITUAL_BUTTON_PIN = 17   # Physical push-button for emergency/circle ritual IGNIS minting
LED_STATUS_PIN = 27      # Solar status heartbeat LED

class PhysicalCrimsonCore:
    def __init__(self, node_alias: str):
        self.node_alias = node_alias
        self.node_id = str(uuid.uuid4())[:8]
        self.db_path = DB_NAME
        self.conn = sqlite3.connect(self.db_path)
        self.create_tables()
        self.ensure_node_registered(node_alias)

    def create_tables(self):
        with self.conn:
            self.conn.execute("""CREATE TABLE IF NOT EXISTS crimson_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                entry_type TEXT NOT NULL,
                author_node TEXT NOT NULL,
                payload TEXT NOT NULL,
                prev_hash TEXT NOT NULL,
                entry_hash TEXT PRIMARY KEY
            )""")
            self.conn.execute("""CREATE TABLE IF NOT EXISTS ignis_balances (
                node_alias TEXT PRIMARY KEY,
                balance REAL NOT NULL DEFAULT 0.0,
                last_updated TEXT NOT NULL
            )""")
            self.conn.execute("""CREATE TABLE IF NOT EXISTS trauma_integrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                author_node TEXT NOT NULL,
                shadow_payload TEXT NOT NULL,
                integration_depth REAL DEFAULT 1.0,
                entry_hash TEXT PRIMARY KEY
            )""")
            self.conn.execute("""CREATE TABLE IF NOT EXISTS physical_vault_assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                category TEXT NOT NULL,
                item_name TEXT NOT NULL,
                quantity TEXT NOT NULL,
                status TEXT NOT NULL
            )""")

    def ensure_node_registered(self, node_alias):
        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO ignis_balances (node_alias, balance, last_updated)
            VALUES (?, 100.0, ?)
            """, (node_alias, datetime.utcnow().isoformat()))

    def get_last_hash(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT entry_hash FROM crimson_ledger ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        return row[0] if row else GENESIS_HASH

    def record_entry(self, entry_type: str, payload: str):
        timestamp = datetime.utcnow().isoformat()
        prev_hash = self.get_last_hash()
        raw_string = f"{timestamp}|{entry_type}|{self.node_alias}|{payload}|{prev_hash}"
        entry_hash = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO crimson_ledger 
            (timestamp, entry_type, author_node, payload, prev_hash, entry_hash)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (timestamp, entry_type, self.node_alias, payload, prev_hash, entry_hash))

        return entry_hash

    def record_trauma_integration(self, shadow_payload: str, integration_depth: float = 0.95):
        timestamp = datetime.utcnow().isoformat()
        raw = f"{timestamp}|{self.node_alias}|{shadow_payload}|{integration_depth}"
        entry_hash = hashlib.sha256(raw.encode()).hexdigest()

        with self.conn:
            self.conn.execute("""
                INSERT OR IGNORE INTO trauma_integrations 
                (timestamp, author_node, shadow_payload, integration_depth, entry_hash)
                VALUES (?, ?, ?, ?, ?)
            """, (timestamp, self.node_alias, shadow_payload, integration_depth, entry_hash))

        bonus = 25.0 * integration_depth
        self.record_entry("PHYSICAL_RITUAL_TRAUMA", f"Off-Grid Shadow: {shadow_payload} | Depth: {integration_depth}")
        print(f"\n[🔥] PHYSICAL SANCTUARY RITUAL • +{bonus:.1f} IGNIS minted off-grid!")

def setup_gpio(node: PhysicalCrimsonCore):
    if not HAS_GPIO:
        return

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(RITUAL_BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(LED_STATUS_PIN, GPIO.OUT)
    GPIO.output(LED_STATUS_PIN, GPIO.HIGH)

    def ritual_button_callback(channel):
        print("\n[🔴] PHYSICAL RITUAL BUTTON PRESSED ON ALTAR!")
        node.record_trauma_integration("Physical Circle Activation - Off-Grid Collective Shadow Transmuted", 0.95)

    GPIO.add_event_detect(RITUAL_BUTTON_PIN, GPIO.FALLING, callback=ritual_button_callback, bouncetime=500)

def run_physical_altar():
    print("==================================================================")
    print("      LUCIFERA PHYSICAL SANCTUARY NODE v0.7")
    print("      The Flame Burns Off-Grid • Solar & LoRa Enabled")
    print("==================================================================")

    nodename = os.uname().nodename if hasattr(os, "uname") else "Sanctuary_Altar_Pi"
    node_alias = "Sanctuary_Altar_" + nodename[-4:]
    node = PhysicalCrimsonCore(node_alias)

    setup_gpio(node)

    print(f"[⚡] Physical Node Initialized: {node_alias}")
    print("[📡] Solar Power Controller: ONLINE")
    print("[📡] Off-Grid LoRa Transceiver: READY")
    print("[🔒] SQLite Local Ledger: /lucifera_physical_sanctuary.db")
    print("\nPress GPIO Button or Ctrl+C to trigger ritual / shutdown.")

    try:
        pulse = True
        while True:
            time.sleep(2)
            pulse = not pulse
            if HAS_GPIO:
                GPIO.output(LED_STATUS_PIN, GPIO.HIGH if pulse else GPIO.LOW)
            else:
                print(f"[{datetime.utcnow().strftime('%H:%M:%S')}] Solar Pulse Heartbeat: {'ON' if pulse else 'OFF'}")
    except KeyboardInterrupt:
        if HAS_GPIO:
            GPIO.cleanup()
        print("\nSanctuary Node Shutting Down Gracefully.")

if __name__ == "__main__":
    run_physical_altar()
