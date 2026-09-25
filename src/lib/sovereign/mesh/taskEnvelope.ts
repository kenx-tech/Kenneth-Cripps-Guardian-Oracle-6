import { TaskEnvelope, TaskPriority, AuthorityScope, NodeExecutionTier, SovereignNodeIdentity } from "../../../types/sovereign";
import { signMessage, verifyMessage } from "../identity/signatures";
import { SOVEREIGN_CONFIG } from "../config";

export async function createTaskEnvelope<T>(
  creatorIdentity: SovereignNodeIdentity,
  taskType: TaskEnvelope["taskType"],
  payload: T,
  options?: {
    priority?: TaskPriority;
    requiredScopes?: AuthorityScope[];
    preferredTier?: NodeExecutionTier;
    assignedNodeId?: string;
  }
): Promise<TaskEnvelope<T>> {
  const now = new Date();
  const expires = new Date(now.getTime() + SOVEREIGN_CONFIG.TASK_TTL_MS);
  const nonce = Math.random().toString(36).substring(2, 12);
  const taskId = `task_${Date.now()}_${nonce}`;

  const envelope: TaskEnvelope<T> = {
    taskId,
    creatorNodeId: creatorIdentity.nodeId,
    assignedNodeId: options?.assignedNodeId,
    priority: options?.priority || "NORMAL",
    taskType,
    payload,
    requiredScopes: options?.requiredScopes || ["INFERENCE_WORKER"],
    preferredTier: options?.preferredTier || "LOCAL_WEBGPU",
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    nonce,
    signature: ""
  };

  const serialized = JSON.stringify({
    taskId,
    creator: envelope.creatorNodeId,
    type: envelope.taskType,
    nonce,
    created: envelope.createdAt
  });

  if (creatorIdentity.privateKey) {
    envelope.signature = await signMessage(creatorIdentity.privateKey, serialized);
  }

  return envelope;
}

export async function verifyTaskEnvelope(
  envelope: TaskEnvelope,
  creatorPublicKey: string
): Promise<boolean> {
  const now = Date.now();
  const expires = new Date(envelope.expiresAt).getTime();
  if (now > expires) {
    return false; // Expired
  }

  const serialized = JSON.stringify({
    taskId: envelope.taskId,
    creator: envelope.creatorNodeId,
    type: envelope.taskType,
    nonce: envelope.nonce,
    created: envelope.createdAt
  });

  return await verifyMessage(creatorPublicKey, serialized, envelope.signature);
}
