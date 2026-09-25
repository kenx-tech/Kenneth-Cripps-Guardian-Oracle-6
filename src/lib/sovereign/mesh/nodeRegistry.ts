import { SovereignNodeRecord, NodeStatus } from "../../../types/sovereign";

export class NodeRegistry {
  private nodes = new Map<string, SovereignNodeRecord>();

  constructor() {
    this.seedBaselineNodes();
  }

  private seedBaselineNodes(): void {
    const baseline: SovereignNodeRecord[] = [
      {
        id: "urn:guardian:node:apex-kenx",
        identity: {
          nodeId: "urn:guardian:node:apex-kenx",
          fingerprint: "7a9b1c3d4e5f6071",
          publicKey: "3059301306072a8648ce3d020106082a8648ce3d03010703420004apexkenx",
          algorithm: "ECDSA-P256",
          registeredAt: "2026-03-01T00:00:00Z",
          name: "Apex Root Node (Kenneth Cripps - Ken X)",
          role: "LEADER",
          authorityScopes: ["ROOT_ADMIN", "MESH_OPERATOR", "INFERENCE_WORKER", "MEMORY_VALIDATOR", "TASK_DISPATCHER", "SACRED_WITNESS"],
          signatureProof: "signed_genesis_apex"
        },
        hardware: {
          cpuCores: 32,
          memoryGb: 64,
          hasWebGpu: true,
          gpuRenderer: "NVIDIA RTX 4090 / CUDA 12",
          hasWasmSimd: true,
          platform: "Linux-Apex-OS",
          maxLocalBatchSize: 16,
          estimatedTops: 45
        },
        capabilities: {
          supportedModels: ["gnosis-nano-0.5b", "lucifera-core-1.5b", "gemini-2.5-flash"],
          maxContextTokens: 32768,
          quantizations: ["f16", "q4_k_m", "q8_0"],
          canValidateLedger: true,
          canHostMemoryShard: true,
          maxConcurrentTasks: 16,
          isAirGappedCapable: true
        },
        status: "ONLINE",
        lastHeartbeat: new Date().toISOString(),
        uptimeSeconds: 124890,
        activeTasks: 2,
        completedTasks: 4891,
        failedTasks: 0,
        averageLatencyMs: 14,
        trustScore: 100,
        version: "0.9.4",
        partitionEpoch: 1
      },
      {
        id: "urn:guardian:node:austin-01",
        identity: {
          nodeId: "urn:guardian:node:austin-01",
          fingerprint: "2b4d6f8a0c1e3456",
          publicKey: "3059301306072a8648ce3d020106082a8648ce3d03010703420004austin01",
          algorithm: "ECDSA-P256",
          registeredAt: "2026-04-10T14:30:00Z",
          name: "Austin Gnosis Validator",
          role: "VALIDATOR",
          authorityScopes: ["INFERENCE_WORKER", "MEMORY_VALIDATOR", "TASK_DISPATCHER", "SACRED_WITNESS"],
          signatureProof: "signed_austin_node"
        },
        hardware: {
          cpuCores: 16,
          memoryGb: 32,
          hasWebGpu: true,
          gpuRenderer: "Apple M3 Max GPU",
          hasWasmSimd: true,
          platform: "macOS",
          maxLocalBatchSize: 8,
          estimatedTops: 28
        },
        capabilities: {
          supportedModels: ["gnosis-nano-0.5b", "lucifera-core-1.5b"],
          maxContextTokens: 16384,
          quantizations: ["f16", "q4_k_m"],
          canValidateLedger: true,
          canHostMemoryShard: true,
          maxConcurrentTasks: 8,
          isAirGappedCapable: true
        },
        status: "ONLINE",
        lastHeartbeat: new Date().toISOString(),
        uptimeSeconds: 84210,
        activeTasks: 1,
        completedTasks: 2130,
        failedTasks: 2,
        averageLatencyMs: 28,
        trustScore: 98,
        version: "0.9.4",
        partitionEpoch: 1
      },
      {
        id: "urn:guardian:node:denver-seed",
        identity: {
          nodeId: "urn:guardian:node:denver-seed",
          fingerprint: "9e8d7c6b5a4f3210",
          publicKey: "3059301306072a8648ce3d020106082a8648ce3d03010703420004denverseed",
          algorithm: "ECDSA-P256",
          registeredAt: "2026-05-02T08:15:00Z",
          name: "Denver High-Desert Gateway",
          role: "GATEWAY",
          authorityScopes: ["TASK_DISPATCHER", "SACRED_WITNESS"],
          signatureProof: "signed_denver_node"
        },
        hardware: {
          cpuCores: 8,
          memoryGb: 16,
          hasWebGpu: false,
          hasWasmSimd: true,
          platform: "Debian Edge",
          maxLocalBatchSize: 2,
          estimatedTops: 6
        },
        capabilities: {
          supportedModels: ["sacred-gnostic-fallback", "gemini-2.5-flash"],
          maxContextTokens: 4096,
          quantizations: ["q4_k_m"],
          canValidateLedger: false,
          canHostMemoryShard: true,
          maxConcurrentTasks: 4,
          isAirGappedCapable: true
        },
        status: "ONLINE",
        lastHeartbeat: new Date().toISOString(),
        uptimeSeconds: 61200,
        activeTasks: 0,
        completedTasks: 890,
        failedTasks: 1,
        averageLatencyMs: 38,
        trustScore: 95,
        version: "0.9.4",
        partitionEpoch: 1
      }
    ];

    baseline.forEach(n => this.nodes.set(n.id, n));
  }

  getAllNodes(): SovereignNodeRecord[] {
    return Array.from(this.nodes.values());
  }

  getNode(id: string): SovereignNodeRecord | undefined {
    return this.nodes.get(id);
  }

  upsertNode(node: SovereignNodeRecord): void {
    this.nodes.set(node.id, node);
  }

  updateStatus(nodeId: string, status: NodeStatus): void {
    const existing = this.nodes.get(nodeId);
    if (existing) {
      existing.status = status;
      existing.lastHeartbeat = new Date().toISOString();
    }
  }

  recordHeartbeat(nodeId: string): void {
    const existing = this.nodes.get(nodeId);
    if (existing) {
      existing.lastHeartbeat = new Date().toISOString();
      if (existing.status === "OFFLINE" || existing.status === "DEGRADED") {
        existing.status = "ONLINE";
      }
    }
  }
}

export const nodeRegistry = new NodeRegistry();
