import { SovereignNodeRecord } from "../../../types/sovereign";

export class TrustPolicy {
  private minTrustScoreForInference = 70;
  private minTrustScoreForValidation = 85;

  canExecuteInference(node: SovereignNodeRecord): boolean {
    return node.trustScore >= this.minTrustScoreForInference;
  }

  canValidateBlocks(node: SovereignNodeRecord): boolean {
    return node.trustScore >= this.minTrustScoreForValidation && node.capabilities.canValidateLedger;
  }

  penalizeNode(node: SovereignNodeRecord, penaltyPoints: number): void {
    node.trustScore = Math.max(0, node.trustScore - penaltyPoints);
    node.failedTasks += 1;
    if (node.trustScore < 50) {
      node.status = "DEGRADED";
    }
  }

  rewardNode(node: SovereignNodeRecord, rewardPoints = 1): void {
    node.trustScore = Math.min(100, node.trustScore + rewardPoints);
    node.completedTasks += 1;
  }
}

export const trustPolicy = new TrustPolicy();
