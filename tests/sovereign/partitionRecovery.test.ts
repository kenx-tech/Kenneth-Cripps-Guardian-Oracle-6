import { partitionRecoveryEngine } from "../../src/lib/sovereign/mesh/partitionRecovery";

export function runPartitionRecoveryTest() {
  const p1 = partitionRecoveryEngine.simulatePartition(true);
  const isPart = p1.isPartitioned === true;

  partitionRecoveryEngine.recordLocalWrite();
  const hasUnreplicated = partitionRecoveryEngine.getState().unreplicatedBlocks > 0;

  const p2 = partitionRecoveryEngine.simulatePartition(false);
  const isHealed = p2.isPartitioned === false && p2.unreplicatedBlocks === 0;

  return isPart && hasUnreplicated && isHealed;
}
