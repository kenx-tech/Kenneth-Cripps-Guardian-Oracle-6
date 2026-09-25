import React, { useState } from "react";
import { taskScheduler } from "../../lib/sovereign/mesh/taskScheduler";
import { createTaskEnvelope } from "../../lib/sovereign/mesh/taskEnvelope";
import { useSovereignNode } from "../../hooks/useSovereignNode";
import { TaskEnvelope, TaskResult, TaskPriority } from "../../types/sovereign";
import { ListOrdered, Play, CheckCircle2, Clock, ShieldAlert, Cpu } from "lucide-react";

export const TaskQueuePanel: React.FC = () => {
  const { identity, hardware } = useSovereignNode();
  const [queue, setQueue] = useState<TaskEnvelope[]>(taskScheduler.getQueue());
  const [history, setHistory] = useState<TaskResult[]>(taskScheduler.getHistory());
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskPrompt, setTaskPrompt] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("HIGH");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskPrompt.trim() || !identity) return;

    const envelope = await createTaskEnvelope(
      identity,
      "INFERENCE",
      { prompt: taskPrompt.trim(), model: "gnosis-nano-0.5b" },
      { priority }
    );

    taskScheduler.enqueue(envelope);
    setQueue(taskScheduler.getQueue());
    setTaskPrompt("");
  };

  const handleProcessNext = async () => {
    if (!identity || isProcessing) return;
    setIsProcessing(true);
    try {
      await taskScheduler.processNext(identity, hardware?.hasWebGpu || false);
      setQueue(taskScheduler.getQueue());
      setHistory(taskScheduler.getHistory());
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="task-queue-panel" className="space-y-6 font-mono">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <ListOrdered className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Distributed Task Queue & Envelopes</h3>
            <p className="text-xs text-zinc-400">
              {queue.length} Pending Envelopes • Cryptographically Signed Work Orders
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProcessNext}
          disabled={isProcessing || queue.length === 0}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
        >
          <Play className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
          <span>{isProcessing ? "Executing Envelope..." : "Process Next Task"}</span>
        </button>
      </div>

      {/* New Task Creator */}
      <form onSubmit={handleCreateTask} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="text-xs font-semibold text-zinc-300">Dispatch Signed Work Envelope</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={taskPrompt}
            onChange={(e) => setTaskPrompt(e.target.value)}
            placeholder="Enter work order instructions (e.g. 'Synthesize 432Hz harmonic vector...')"
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500/50"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 outline-none"
          >
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="BATCH">BATCH</option>
          </select>
          <button
            type="submit"
            disabled={!taskPrompt.trim()}
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-black font-semibold text-xs transition-all cursor-pointer"
          >
            Sign & Queue
          </button>
        </div>
      </form>

      {/* Live Queue */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Enqueued Tasks ({queue.length})
        </h4>
        {queue.length === 0 ? (
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800 text-center text-xs text-zinc-500">
            Task queue empty. Enqueue a work order above to observe peer dispatching.
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((task) => (
              <div
                key={task.taskId}
                className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === "EMERGENCY"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : task.priority === "HIGH"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="font-semibold text-zinc-200">{task.taskType}</span>
                  <span className="text-zinc-500 truncate max-w-[200px]">
                    "{task.payload?.prompt || 'Work order payload'}"
                  </span>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-3">
                  <span className="truncate max-w-[120px]">{task.creatorNodeId}</span>
                  <span className="text-emerald-400">Sig: Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Execution History */}
      {history.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Completed Task Envelopes ({history.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.map((h) => (
              <div
                key={h.taskId}
                className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-300 font-semibold">{h.taskId}</span>
                  <span className="text-zinc-500 text-[11px]">({h.computeDurationMs}ms)</span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                  <span className="text-emerald-300">{h.tokenThroughput} tok/s</span>
                  <span className="text-zinc-600 truncate max-w-[140px]">Hash: #{h.contentHash.slice(0, 12)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
