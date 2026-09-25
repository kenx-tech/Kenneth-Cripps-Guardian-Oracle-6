import { 
  getOrCreateNodeIdentity, 
  probeHardware, 
  evaluateCapabilities,
  nodeRegistry,
  discoverPeers,
  heartbeatService,
  partitionRecoveryEngine,
  taskScheduler,
  memoryLedger,
  auditLedger,
  routeInference,
  syncNodeToFirestore
} from "./sovereign";
import { SovereignNodeIdentity, HardwareProfile, NodeCapabilities, SovereignNodeRecord, QMeshPartitionState } from "../types/sovereign";

export class QMeshNetwork {
  private static instance: QMeshNetwork;
  private identity: SovereignNodeIdentity | null = null;
  private hardware: HardwareProfile | null = null;
  private capabilities: NodeCapabilities | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): QMeshNetwork {
    if (!QMeshNetwork.instance) {
      QMeshNetwork.instance = new QMeshNetwork();
    }
    return QMeshNetwork.instance;
  }

  async init(isSuperAdmin = false): Promise<{
    identity: SovereignNodeIdentity;
    hardware: HardwareProfile;
    capabilities: NodeCapabilities;
  }> {
    if (this.initialized && this.identity && this.hardware && this.capabilities) {
      return { identity: this.identity, hardware: this.hardware, capabilities: this.capabilities };
    }

    this.hardware = await probeHardware();
    this.capabilities = evaluateCapabilities(this.hardware);
    this.identity = await getOrCreateNodeIdentity(undefined, "WORKER", isSuperAdmin);

    // Register local node into registry
    const localRecord: SovereignNodeRecord = {
      id: this.identity.nodeId,
      identity: this.identity,
      hardware: this.hardware,
      capabilities: this.capabilities,
      status: "ONLINE",
      lastHeartbeat: new Date().toISOString(),
      uptimeSeconds: 0,
      activeTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageLatencyMs: this.hardware.hasWebGpu ? 12 : 28,
      trustScore: isSuperAdmin ? 100 : 90,
      version: "0.9.4",
      partitionEpoch: 1
    };

    nodeRegistry.upsertNode(localRecord);
    syncNodeToFirestore(localRecord).catch(() => null);

    // Start background heartbeats
    heartbeatService.start(this.identity);

    // Initial peer discovery
    await discoverPeers();

    auditLedger.record("NODE_REGISTERED", this.identity.nodeId, {
      name: this.identity.name,
      hardware: this.hardware.gpuRenderer || "CPU"
    });

    this.initialized = true;
    return { identity: this.identity, hardware: this.hardware, capabilities: this.capabilities };
  }

  getIdentity(): SovereignNodeIdentity | null {
    return this.identity;
  }

  getHardware(): HardwareProfile | null {
    return this.hardware;
  }

  getCapabilities(): NodeCapabilities | null {
    return this.capabilities;
  }

  getPartitionState(): QMeshPartitionState {
    return partitionRecoveryEngine.getState();
  }

  simulatePartition(partitioned: boolean): QMeshPartitionState {
    const newState = partitionRecoveryEngine.simulatePartition(partitioned);
    auditLedger.record(
      partitioned ? "PARTITION_DETECTED" : "PARTITION_HEALED",
      this.identity?.nodeId || "local",
      { groupId: newState.partitionGroupId }
    );
    return newState;
  }

  getPeers(): SovereignNodeRecord[] {
    return nodeRegistry.getAllNodes();
  }
}

export const qmesh = QMeshNetwork.getInstance();
