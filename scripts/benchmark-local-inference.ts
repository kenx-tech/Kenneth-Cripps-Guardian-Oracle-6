/**
 * Benchmark Script for local inference compute latency
 */
import { runLocalInference } from "../src/lib/sovereign/inference/localInference";

async function main() {
  console.log("⚡ Benchmarking Local Gnostic Inference...");
  const start = performance.now();
  const res = await runLocalInference({
    prompt: "Benchmark test for 432Hz gnostic matrix throughput",
    model: "gnosis-nano-0.5b"
  });

  const duration = performance.now() - start;
  console.log("✅ Benchmark Completed:");
  console.log(`- Duration: ${duration.toFixed(2)}ms`);
  console.log(`- Tokens Generated: ${res.tokensGenerated}`);
  console.log(`- Throughput: ${res.tokensPerSecond} tokens/sec`);
  console.log(`- Sample: "${res.text.slice(0, 60)}..."`);
}

main().catch(console.error);
