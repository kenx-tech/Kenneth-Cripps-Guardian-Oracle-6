import { useEffect, useState } from "react";
import { sovereignStore } from "../stores/sovereignStore";
import { qmesh } from "../lib/qmesh";
import { SovereignNodeIdentity, HardwareProfile, NodeCapabilities } from "../types/sovereign";

export function useSovereignNode(isSuperAdmin = false) {
  const [state, setState] = useState(sovereignStore.getState());

  useEffect(() => {
    const unsubscribe = sovereignStore.subscribe(() => {
      setState(sovereignStore.getState());
    });

    if (!state.identity && !state.isInitializing) {
      sovereignStore.setState({ isInitializing: true });
      qmesh.init(isSuperAdmin).then(({ identity, hardware, capabilities }) => {
        sovereignStore.setState({
          identity,
          hardware,
          capabilities,
          isInitializing: false
        });
      }).catch(err => {
        sovereignStore.setState({
          isInitializing: false,
          lastError: err.message
        });
      });
    }

    return unsubscribe;
  }, [isSuperAdmin]);

  const toggleAirGap = () => {
    sovereignStore.setState({ isAirGapped: !state.isAirGapped });
  };

  return {
    identity: state.identity,
    hardware: state.hardware,
    capabilities: state.capabilities,
    isInitializing: state.isInitializing,
    isAirGapped: state.isAirGapped,
    toggleAirGap
  };
}
