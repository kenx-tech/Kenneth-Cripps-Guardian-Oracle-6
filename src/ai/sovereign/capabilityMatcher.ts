import { HardwareProfile } from "../../types/sovereign";
import { SOVEREIGN_MODELS, ModelSpec } from "./modelRegistry";

export function getEligibleModels(hardware: HardwareProfile): ModelSpec[] {
  return Object.values(SOVEREIGN_MODELS).filter(model => {
    if (model.requiresWebGpu && !hardware.hasWebGpu) return false;
    if (hardware.memoryGb < model.minMemoryGb) return false;
    if (hardware.estimatedTops < model.minTops) return false;
    return true;
  });
}
