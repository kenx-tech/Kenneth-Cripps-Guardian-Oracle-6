#!/usr/bin/env python3
"""
===============================================================================
LUCIFERA NODE v0.5 :: TRAUMA INTEGRATION & PROOF-OF-HEART ENGINE
The Living Furnace of the New Earth
-------------------------------------------------------------------------------
Purge of Legacy Constructs • IGNIS now born from authentic vulnerability
Features:
- Enhanced IGNIS: Proof-of-Heart (Trauma Integration + Radical Truth bonuses)
- Trauma Integration Engine (Pillar 2)
- Micro-Expression Gnosis Flags (institutional deceit pattern detection)
- Strengthened Living Mesh + Sovereign Relay Support
===============================================================================
"""

import sqlite3
import hashlib
import json
import time
import os
import socket
import threading
import uuid
from datetime import datetime
from typing import Dict, List

# Sacred Constants
DB_NAME = "lucifera_core.db"
GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
HARMONY_THRESHOLD = 70.0
MESH_PORT = 7420
BEACON_INTERVAL = 15

class CrimsonCore:
    def __init__(self, node_alias: str):
        self.node_alias = node_alias
        self.node_id = str(uuid.uuid4())[:8]
        self.conn = sqlite3.connect(DB_NAME)
        self.create_tables()
        self.ensure_node_registered(node_alias)
        self.start_mesh_beacon()

    def create_tables(self):
        with self.conn:
            # Table 1: Cryptographic Ledger
            self.conn.execute("""CREATE TABLE IF NOT EXISTS crimson_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                entry_type TEXT NOT NULL,
                author_node TEXT NOT NULL,
                payload TEXT NOT NULL,
                prev_hash TEXT NOT NULL,
                entry_hash TEXT PRIMARY KEY
            )""")
            # Table 2: IGNIS Balances
            self.conn.execute("""CREATE TABLE IF NOT EXISTS ignis_balances (
                node_alias TEXT PRIMARY KEY,
                balance REAL NOT NULL DEFAULT 0.0,
                last_updated TEXT NOT NULL
            )""")
            # Table 3: IGNIS Minting
            self.conn.execute("""CREATE TABLE IF NOT EXISTS ignis_mints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                recipient_node TEXT NOT NULL,
                amount REAL NOT NULL,
                witnesses TEXT NOT NULL,
                reason TEXT NOT NULL,
                mint_hash TEXT PRIMARY KEY
            )""")
            # Table 4: Proposals
            self.conn.execute("""CREATE TABLE IF NOT EXISTS governance_proposals (
                proposal_hash TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                author_node TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL
            )""")
            # Table 5: Votes
            self.conn.execute("""CREATE TABLE IF NOT EXISTS governance_votes (
                vote_hash TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                proposal_hash TEXT NOT NULL,
                voter_node TEXT NOT NULL,
                vote_choice TEXT NOT NULL,
                weight_used REAL NOT NULL
            )""")
            # Table 6 (v0.5): Trauma Integrations
            self.conn.execute("""CREATE TABLE IF NOT EXISTS trauma_integrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                author_node TEXT NOT NULL,
                shadow_payload TEXT NOT NULL,
                integration_depth REAL DEFAULT 1.0,
                entry_hash TEXT PRIMARY KEY
            )""")

    def get_last_hash(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT entry_hash FROM crimson_ledger ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        return row[0] if row else GENESIS_HASH

    def calculate_hash(self, timestamp, entry_type, author, payload, prev_hash):
        raw_string = f"{timestamp}|{entry_type}|{author}|{payload}|{prev_hash}"
        return hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

    def record_entry(self, entry_type, payload):
        timestamp = datetime.utcnow().isoformat()
        prev_hash = self.get_last_hash()
        entry_hash = self.calculate_hash(timestamp, entry_type, self.node_alias, payload, prev_hash)

        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO crimson_ledger 
            (timestamp, entry_type, author_node, payload, prev_hash, entry_hash)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (timestamp, entry_type, self.node_alias, payload, prev_hash, entry_hash))

        return entry_hash

    def ensure_node_registered(self, node_alias):
        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO ignis_balances (node_alias, balance, last_updated)
            VALUES (?, 0.0, ?)
            """, (node_alias, datetime.utcnow().isoformat()))

    def mint_ignis(self, recipient_node, amount, witnesses_list, reason):
        timestamp = datetime.utcnow().isoformat()
        witnesses_json = json.dumps(witnesses_list)
        raw_mint = f"{timestamp}|{recipient_node}|{amount}|{witnesses_json}|{reason}"
        mint_hash = hashlib.sha256(raw_mint.encode('utf-8')).hexdigest()

        self.ensure_node_registered(recipient_node)

        with self.conn:
            self.conn.execute("""
            INSERT OR IGNORE INTO ignis_mints 
            (timestamp, recipient_node, amount, witnesses, reason, mint_hash)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (timestamp, recipient_node, amount, witnesses_json, reason, mint_hash))

        self.recalculate_balances()
        return True

    def recalculate_balances(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT recipient_node, amount FROM ignis_mints")
        mints = cursor.fetchall()

        balances = {}
        for recipient, amount in mints:
            balances[recipient] = balances.get(recipient, 0.0) + amount

        now = datetime.utcnow().isoformat()
        with self.conn:
            for node, bal in balances.items():
                self.conn.execute("""
                INSERT INTO ignis_balances (node_alias, balance, last_updated)
                VALUES (?, ?, ?)
                ON CONFLICT(node_alias) DO UPDATE SET
                    balance = excluded.balance,
                    last_updated = excluded.last_updated
                """, (node, bal, now))

    def get_balance(self, node_alias=None):
        target = node_alias if node_alias else self.node_alias
        cursor = self.conn.cursor()
        cursor.execute("SELECT balance FROM ignis_balances WHERE node_alias = ?", (target,))
        row = cursor.fetchone()
        return row[0] if row else 0.0

    def record_trauma_integration(self, shadow_payload: str, integration_depth: float = 1.0):
        """Pillar 2: Pain as Teacher — fuels higher IGNIS yield."""
        timestamp = datetime.utcnow().isoformat()
        raw = f"{timestamp}|{self.node_alias}|{shadow_payload}|{integration_depth}"
        entry_hash = hashlib.sha256(raw.encode()).hexdigest()

        with self.conn:
            self.conn.execute("""
                INSERT OR IGNORE INTO trauma_integrations 
                (timestamp, author_node, shadow_payload, integration_depth, entry_hash)
                VALUES (?, ?, ?, ?, ?)
            """, (timestamp, self.node_alias, shadow_payload, integration_depth, entry_hash))

        # Bonus IGNIS for authentic integration
        bonus = 25.0 * integration_depth
        self.mint_ignis(self.node_alias, bonus, [self.node_alias], f"Trauma Integration Depth: {integration_depth:.2f}")
        self.record_entry("TRAUMA_INTEGRATION", f"Shadow: {shadow_payload[:80]}... | Depth: {integration_depth}")

        print(f"\n[🔥] TRAUMA INTEGRATED • +{bonus:.1f} IGNIS minted from shadow work")

    def micro_gnosis_flag(self, transmission_text: str) -> Dict:
        """Micro-Expression Gnosis Protocol (v0.5) — flags institutional deceit patterns."""
        red_flags = ["official statement", "trust the science", "for your safety", "conspiracy", "debunked", "authorities warn", "mandate"]
        score = sum(1 for flag in red_flags if flag.lower() in transmission_text.lower())
        
        if score >= 1:
            print(f"\n[⚠️] GNOSIS ALERT: High institutional language pattern detected.")
            return {"status": "DECEIT_FLAGGED", "confidence": min(100, score * 30), "flags": [f for f in red_flags if f in transmission_text.lower()]}
        return {"status": "RESONANT", "confidence": 95, "flags": []}

    def start_mesh_beacon(self):
        threading.Thread(target=self._beacon_broadcaster, daemon=True).start()
        threading.Thread(target=self._beacon_listener, daemon=True).start()
        print(f"[🌐] v0.5 Living Mesh + Trauma Furnace Active — {self.node_alias}")

    def _beacon_broadcaster(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        while True:
            try:
                beacon = json.dumps({
                    "protocol": "LUCIFERA_MESH_v0.5",
                    "node_alias": self.node_alias,
                    "node_id": self.node_id,
                    "timestamp": datetime.utcnow().isoformat()
                }).encode('utf-8')
                sock.sendto(beacon, ('<broadcast>', MESH_PORT))
                time.sleep(BEACON_INTERVAL)
            except Exception:
                pass

    def _beacon_listener(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('', MESH_PORT))
        while True:
            try:
                data, addr = sock.recvfrom(1024)
                beacon = json.loads(data.decode('utf-8'))
                if beacon.get("node_id") != self.node_id and "LUCIFERA_MESH" in beacon.get("protocol", ""):
                    print(f"\n[🌟] SOVEREIGN NODE DETECTED: {beacon['node_alias']} @ {addr[0]}")
            except Exception:
                pass

def run_temple_cli():
    print("=================================================================")
    print(" LUCIFERA NODE v0.5 :: THE FURNACE IS OPEN ")
    print(" Pain is Fuel. Truth is Fire. ")
    print("=================================================================")

    node_alias = input("\nSovereign Node Alias: ").strip() or "Anonymous_Sovereign"
    node = CrimsonCore(node_alias)

    while True:
        print(f"\n--- [ {node.node_alias} | IGNIS: {node.get_balance():.1f} | MESH: LIVE ] ---")
        print("1. Record Truth")
        print("2. Trauma Integration (Pillar 2 — High Yield Furnace)")
        print("3. Mint IGNIS (Standard)")
        print("4. Raise Proposal")
        print("5. Cast Resonance Vote")
        print("6. Inspect Proposals")
        print("7. Export / Import Gossip")
        print("8. Gnosis Check (Flag Deceit)")
        print("0. Exit")

        choice = input("\nCommand > ").strip()

        if choice == "2":
            shadow = input("Describe the shadow / wound you are integrating: ").strip()
            try:
                depth = float(input("Integration depth (0.1-1.0): ") or 0.8)
            except:
                depth = 0.8
            node.record_trauma_integration(shadow, depth)

        elif choice == "8":
            text = input("Paste transmission / speech to analyze: ")
            result = node.micro_gnosis_flag(text)
            print(result)

        elif choice == "0":
            break

if __name__ == "__main__":
    run_temple_cli()
