/**
 * Verification script for Memory Ledger Merkle DAG
 */
import { memoryLedger } from "../src/lib/sovereign/memory/memoryLedger";

async function main() {
  console.log("⚡ Inspecting and Verifying Sovereign Memory Ledger...");
  const blocks = memoryLedger.getBlocks();
  console.log(`Found ${blocks.length} blocks in local ledger.`);

  const result = await memoryLedger.verifyIntegrity();
  if (result.valid) {
    console.log("✅ Merkle chain integrity 100% verified!");
  } else {
    console.error(`❌ Chain broken at block index #${result.badBlockIndex}`);
  }
}

main().catch(console.error);
