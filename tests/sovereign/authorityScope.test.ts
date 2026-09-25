import { hasAuthorityScope, hasAllScopes } from "../../src/lib/sovereign/identity/authorityScope";
import { SovereignNodeIdentity } from "../../src/types/sovereign";

export function runAuthorityScopeTest() {
  const rootIdentity: SovereignNodeIdentity = {
    nodeId: "urn:guardian:node:root",
    fingerprint: "rootfp",
    publicKey: "rootpub",
    algorithm: "ECDSA-P256",
    registeredAt: new Date().toISOString(),
    name: "Root Node",
    role: "LEADER",
    authorityScopes: ["ROOT_ADMIN"],
    signatureProof: "proof"
  };

  const workerIdentity: SovereignNodeIdentity = {
    nodeId: "urn:guardian:node:worker",
    fingerprint: "workerfp",
    publicKey: "workerpub",
    algorithm: "ECDSA-P256",
    registeredAt: new Date().toISOString(),
    name: "Worker Node",
    role: "WORKER",
    authorityScopes: ["INFERENCE_WORKER"],
    signatureProof: "proof"
  };

  const test1 = hasAuthorityScope(rootIdentity, "TASK_DISPATCHER") === true;
  const test2 = hasAuthorityScope(workerIdentity, "ROOT_ADMIN") === false;
  const test3 = hasAuthorityScope(workerIdentity, "INFERENCE_WORKER") === true;

  return test1 && test2 && test3;
}
