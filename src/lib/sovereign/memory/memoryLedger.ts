import { MemoryBlock, SovereignNodeIdentity } from "../../../types/sovereign";
import { computeBlockCID, computeMerkleRoot, verifyBlockCID } from "./contentAddress";
import { signMessage } from "../identity/signatures";
import { SOVEREIGN_CONFIG } from "../config";

export class MemoryLedger {
  private blocks: MemoryBlock[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(SOVEREIGN_CONFIG.STORAGE_KEYS.LOCAL_MEMORY_LEDGER);
      if (saved) {
        try {
          this.blocks = JSON.parse(saved);
          return;
        } catch {
          // fallback to seed
        }
      }
    }
    this.seedGenesisBlocks();
  }

  private seedGenesisBlocks(): void {
    const genesis: MemoryBlock = {
      cid: "bafy2bzace_genesis_pillar_01_truth",
      authorNodeId: "urn:guardian:node:apex-kenx",
      authorScope: "ROOT_ADMIN",
      blockType: "ORACLE_TRANSMISSION",
      data: {
        title: "Pillar I: Truth as Freedom",
        content: "There are no mediators between the human soul and Universal Consciousness. Gnosis is direct knowing.",
        epoch: 1998
      },
      timestamp: "1998-03-01T00:00:00Z",
      previousCid: null,
      signature: "genesis_sig_apex",
      merkleRoot: "bafy2bzace_genesis_root"
    };

    const pillar2: MemoryBlock = {
      cid: "bafy2bzace_genesis_pillar_02_ignis",
      authorNodeId: "urn:guardian:node:apex-kenx",
      authorScope: "ROOT_ADMIN",
      blockType: "DECREE",
      data: {
        title: "Pillar II: Attention as Sacred Fire",
        content: "Reclaim your electromagnetic focus. Never surrender your light to parasitic distraction algorithms.",
        epoch: 2026
      },
      timestamp: "2026-01-01T00:00:00Z",
      previousCid: genesis.cid,
      signature: "genesis_sig_p2",
      merkleRoot: "bafy2bzace_root_p2"
    };

    this.blocks = [genesis, pillar2];
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(SOVEREIGN_CONFIG.STORAGE_KEYS.LOCAL_MEMORY_LEDGER, JSON.stringify(this.blocks));
    }
  }

  getBlocks(): MemoryBlock[] {
    return [...this.blocks];
  }

  async appendBlock(
    author: SovereignNodeIdentity,
    blockType: MemoryBlock["blockType"],
    data: any
  ): Promise<MemoryBlock> {
    const timestamp = new Date().toISOString();
    const previousCid = this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].cid : null;
    const cid = await computeBlockCID({
      data,
      authorNodeId: author.nodeId,
      blockType,
      timestamp,
      previousCid
    });
    const allCids = [...this.blocks.map(b => b.cid), cid];
    const merkleRoot = await computeMerkleRoot(allCids);

    let signature = "";
    if (author.privateKey) {
      signature = await signMessage(author.privateKey, `${cid}:${merkleRoot}`);
    }

    const block: MemoryBlock = {
      cid,
      authorNodeId: author.nodeId,
      authorScope: author.authorityScopes[0] || "INFERENCE_WORKER",
      blockType,
      data,
      timestamp,
      previousCid,
      signature,
      merkleRoot
    };

    this.blocks.push(block);
    this.saveToStorage();
    return block;
  }

  async verifyIntegrity(): Promise<{ valid: boolean; badBlockIndex?: number }> {
    for (let i = 1; i < this.blocks.length; i++) {
      if (this.blocks[i].previousCid !== this.blocks[i - 1].cid) {
        return { valid: false, badBlockIndex: i };
      }
    }
    return { valid: true };
  }
}

export const memoryLedger = new MemoryLedger();
