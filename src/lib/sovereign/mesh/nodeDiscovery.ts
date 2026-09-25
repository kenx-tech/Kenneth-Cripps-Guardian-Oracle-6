import { SovereignNodeRecord } from "../../../types/sovereign";
import { nodeRegistry } from "./nodeRegistry";

export interface PeerDiscoveryBeacon {
  nodeId: string;
  name: string;
  role: string;
  ipEndpoint?: string;
  announcedAt: string;
  uptimeSeconds: number;
}

export async function discoverPeers(): Promise<SovereignNodeRecord[]> {
  // Check local registry first
  const localPeers = nodeRegistry.getAllNodes();

  // Try querying sovereign nodes API if available
  try {
    const res = await fetch("/api/sovereign/nodes/register", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.nodes)) {
        data.nodes.forEach((n: SovereignNodeRecord) => nodeRegistry.upsertNode(n));
      }
    }
  } catch (e) {
    // Gracefully continue in offline mode
  }

  return nodeRegistry.getAllNodes();
}
