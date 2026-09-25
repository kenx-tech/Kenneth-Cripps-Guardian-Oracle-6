import { NodeExecutionTier } from "../../types/sovereign";

export interface FallbackSequence {
  primary: NodeExecutionTier;
  secondary: NodeExecutionTier;
  terminal: NodeExecutionTier;
}

export const DEFAULT_FALLBACK_SEQUENCE: FallbackSequence = {
  primary: "LOCAL_WEBGPU",
  secondary: "EDGE_CLOUD",
  terminal: "SACRED_FALLBACK"
};
