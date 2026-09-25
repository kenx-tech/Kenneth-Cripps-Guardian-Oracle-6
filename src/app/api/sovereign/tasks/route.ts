import { taskScheduler } from "../../../../lib/sovereign/mesh/taskScheduler";
import { nodeRegistry } from "../../../../lib/sovereign/mesh/nodeRegistry";
import { verifyTaskEnvelope } from "../../../../lib/sovereign/mesh/taskEnvelope";
import { TaskEnvelope } from "../../../../types/sovereign";
import { requireAuth, extractBearerToken } from "../../../../lib/sovereign/auth/serverAuth";
import { sovereignJournal, persistTaskToFirestoreAuth, fetchTasksFromFirestoreAuth } from "../../../../lib/sovereign/persistence/firestoreAuthoritative";

export async function handleTasksRoute(req: any, res: any) {
  const authToken = extractBearerToken(req) || undefined;

  if (req.method === "GET") {
    const authoritativeTasks = await fetchTasksFromFirestoreAuth(authToken);
    const tasks = authoritativeTasks.length > 0 ? authoritativeTasks : taskScheduler.getQueue();

    return res.json({
      status: "success",
      queueLength: tasks.length,
      tasks,
      history: taskScheduler.getHistory()
    });
  }

  if (req.method === "POST") {
    // 1. Authenticate with Firebase ID token server-side
    const authUser = await requireAuth(req, res);
    if (!authUser) {
      return; // 401 already sent
    }

    const task = req.body as TaskEnvelope;
    if (!task || !task.taskId) {
      return res.status(400).json({ error: "Task envelope invalid: Missing taskId" });
    }

    if (!task.creatorNodeId || !task.taskType || !task.payload) {
      return res.status(400).json({ error: "Task envelope invalid: Missing required fields (creatorNodeId, taskType, payload)" });
    }

    // 2. Derive creatorUid strictly from verified token
    task.creatorUid = authUser.uid;

    // 3. Enforce cryptographic signature on task envelope
    if (!task.signature) {
      return res.status(401).json({ error: "Task envelope rejected: Cryptographic signature required" });
    }

    const creatorNode = nodeRegistry.getNode(task.creatorNodeId) || sovereignJournal.getNode(task.creatorNodeId);
    if (!creatorNode) {
      return res.status(404).json({ error: `Creator node '${task.creatorNodeId}' not recognized in mesh registry` });
    }

    const publicKey = creatorNode.identity?.publicKey;
    if (!publicKey) {
      return res.status(400).json({ error: "Creator node has no cryptographic public key" });
    }

    const isValid = await verifyTaskEnvelope(task, publicKey);
    if (!isValid) {
      return res.status(401).json({ error: "Task envelope cryptographic signature verification failed or expired" });
    }

    // 4. Enqueue in local scheduler
    taskScheduler.enqueue(task);

    // 5. Persist to authoritative Firestore task ledger
    await persistTaskToFirestoreAuth(task, authToken);

    return res.json({
      status: "enqueued",
      taskId: task.taskId,
      creatorUid: authUser.uid,
      priority: task.priority || "NORMAL",
      queuePosition: taskScheduler.getQueue().length
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
