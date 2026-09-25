import { TaskResult } from "../../../types/sovereign";
import { verifyMessage } from "../identity/signatures";

export async function verifyTaskContribution(
  taskResult: TaskResult,
  workerPublicKey: string
): Promise<{ verified: boolean; reason?: string }> {
  if (!taskResult.contentHash || !taskResult.workerSignature) {
    return { verified: false, reason: "Missing content hash or cryptographic worker signature" };
  }

  const isValid = await verifyMessage(workerPublicKey, taskResult.contentHash, taskResult.workerSignature);
  if (!isValid) {
    return { verified: false, reason: "Worker signature did not match reported content hash" };
  }

  return { verified: true };
}
