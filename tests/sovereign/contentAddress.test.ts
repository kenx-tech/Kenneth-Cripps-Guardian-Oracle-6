import { computeContentAddress, computeMerkleRoot } from "../../src/lib/sovereign/memory/contentAddress";

export async function runContentAddressTest() {
  const cid1 = await computeContentAddress({ hello: "gnosis" });
  const cid2 = await computeContentAddress({ hello: "gnosis" });
  const isDeterministic = cid1 === cid2;

  const root = await computeMerkleRoot([cid1, cid2]);
  const hasValidRoot = root.startsWith("bafy2bzace");

  return isDeterministic && hasValidRoot;
}
