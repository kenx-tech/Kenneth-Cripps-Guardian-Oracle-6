import { createTaskEnvelope, verifyTaskEnvelope } from "../../src/lib/sovereign/mesh/taskEnvelope";
import { getOrCreateNodeIdentity } from "../../src/lib/sovereign/identity/nodeIdentity";

export async function runTaskEnvelopeTest() {
  const identity = await getOrCreateNodeIdentity("TestNode", "WORKER");
  const envelope = await createTaskEnvelope(identity, "INFERENCE", { prompt: "Test task" });

  const isValid = await verifyTaskEnvelope(envelope, identity.publicKey);
  return isValid;
}
