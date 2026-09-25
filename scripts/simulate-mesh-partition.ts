/**
 * CLI Script to simulate mesh partitioning and vector clock reconciliation
 */
import { partitionRecoveryEngine } from "../src/lib/sovereign/mesh/partitionRecovery";

async function main() {
  console.log("⚡ Simulating QMesh Network Partition...");
  const partitionedState = partitionRecoveryEngine.simulatePartition(true);
  console.log("Partition State:", partitionedState);

  console.log("\n⚡ Writing local blocks in partition...");
  partitionRecoveryEngine.recordLocalWrite();
  partitionRecoveryEngine.recordLocalWrite();
  console.log("Local Unreplicated Blocks:", partitionRecoveryEngine.getState().unreplicatedBlocks);

  console.log("\n⚡ Healing Network Partition...");
  const healedState = partitionRecoveryEngine.simulatePartition(false);
  console.log("✅ Healed State:", healedState);
}

main().catch(console.error);
