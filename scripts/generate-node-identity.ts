/**
 * CLI Utility to generate a new Sovereign Node Cryptographic Identity
 */
import { getOrCreateNodeIdentity } from "../src/lib/sovereign/identity/nodeIdentity";

async function main() {
  console.log("⚡ Generating Sovereign Node Identity...");
  const identity = await getOrCreateNodeIdentity("CLI-Worker-01", "WORKER", false);
  console.log("✅ Identity Generated Successfully:");
  console.log(JSON.stringify(identity, null, 2));
}

main().catch(console.error);
