import { useEffect, useState } from "react";
import { meshStore } from "../stores/meshStore";
import { nodeRegistry } from "../lib/sovereign/mesh/nodeRegistry";
import { qmesh } from "../lib/qmesh";

export function useMeshStatus() {
  const [state, setState] = useState(meshStore.getState());

  useEffect(() => {
    // Initial sync
    meshStore.setState({
      peers: nodeRegistry.getAllNodes(),
      partitionState: qmesh.getPartitionState()
    });

    return meshStore.subscribe(() => {
      setState(meshStore.getState());
    });
  }, []);

  const triggerPartition = (partitioned: boolean) => {
    const nextState = qmesh.simulatePartition(partitioned);
    meshStore.setState({ partitionState: nextState });
  };

  const selectNode = (nodeId: string | null) => {
    meshStore.setState({ selectedNodeId: nodeId });
  };

  return {
    peers: state.peers,
    partitionState: state.partitionState,
    selectedNodeId: state.selectedNodeId,
    totalThroughput: state.totalNetworkThroughput,
    triggerPartition,
    selectNode
  };
}
