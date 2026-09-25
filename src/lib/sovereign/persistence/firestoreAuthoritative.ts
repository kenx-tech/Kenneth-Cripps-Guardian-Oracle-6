import fs from "fs";
import path from "path";
import firebaseConfig from "../../../../firebase-applet-config.json";
import { SovereignNodeRecord, TaskEnvelope, MemoryBlock } from "../../../types/sovereign";

const JOURNAL_FILE_PATH = path.resolve(process.cwd(), ".sovereign-state-journal.json");

export function encodeFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields: any = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = encodeFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export function decodeFirestoreValue(val: any): any {
  if (!val) return null;
  if (val.nullValue !== undefined) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(decodeFirestoreValue);
  if (val.mapValue !== undefined) {
    const obj: any = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = decodeFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

export interface SovereignJournalState {
  nodes: Record<string, SovereignNodeRecord>;
  tasks: Record<string, TaskEnvelope>;
  memoryBlocks: Record<string, MemoryBlock>;
  lastPersistedAt: string;
}

class SovereignJournal {
  private state: SovereignJournalState = {
    nodes: {},
    tasks: {},
    memoryBlocks: {},
    lastPersistedAt: new Date().toISOString()
  };

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(JOURNAL_FILE_PATH)) {
        const raw = fs.readFileSync(JOURNAL_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        this.state = {
          nodes: parsed.nodes || {},
          tasks: parsed.tasks || {},
          memoryBlocks: parsed.memoryBlocks || {},
          lastPersistedAt: parsed.lastPersistedAt || new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn("Could not read sovereign state journal from disk:", err);
    }
  }

  private flushToDisk(): void {
    try {
      this.state.lastPersistedAt = new Date().toISOString();
      fs.writeFileSync(JOURNAL_FILE_PATH, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not write sovereign state journal to disk:", err);
    }
  }

  getNode(id: string): SovereignNodeRecord | undefined {
    return this.state.nodes[id];
  }

  getAllNodes(): SovereignNodeRecord[] {
    return Object.values(this.state.nodes);
  }

  saveNode(node: SovereignNodeRecord): void {
    this.state.nodes[node.id] = node;
    this.flushToDisk();
  }

  getTask(taskId: string): TaskEnvelope | undefined {
    return this.state.tasks[taskId];
  }

  getAllTasks(): TaskEnvelope[] {
    return Object.values(this.state.tasks);
  }

  saveTask(task: TaskEnvelope): void {
    this.state.tasks[task.taskId] = task;
    this.flushToDisk();
  }

  getMemoryBlock(cid: string): MemoryBlock | undefined {
    return this.state.memoryBlocks[cid];
  }

  getAllMemoryBlocks(): MemoryBlock[] {
    return Object.values(this.state.memoryBlocks);
  }

  saveMemoryBlock(block: MemoryBlock): void {
    this.state.memoryBlocks[block.cid] = block;
    this.flushToDisk();
  }
}

export const sovereignJournal = new SovereignJournal();

// Firestore Cloud REST Interop
const getFirestoreBaseUrl = () => {
  const { projectId, firestoreDatabaseId } = firebaseConfig;
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents`;
};

/**
 * Persists a Sovereign Node to Firestore authoritative collection sovereign_nodes.
 */
export async function persistNodeToFirestoreAuth(
  node: SovereignNodeRecord,
  authToken?: string
): Promise<boolean> {
  // Always update journal for immediate local durability
  sovereignJournal.saveNode(node);

  if (!authToken) {
    return true; // Local journal recorded
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const encodedFields: any = {};
    for (const [k, v] of Object.entries(node)) {
      if (v !== undefined) {
        encodedFields[k] = encodeFirestoreValue(v);
      }
    }

    // Use documentId in query or document path
    // Node IDs have colons (e.g. urn:guardian:node:xxx), so URL encode for document path
    const docPath = encodeURIComponent(node.id);
    const url = `${baseUrl}/sovereign_nodes/${docPath}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ fields: encodedFields })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Firestore node persist HTTP ${res.status}:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Firestore node persist error:", err);
    return false;
  }
}

/**
 * Fetches Sovereign Nodes from Firestore authoritative collection.
 */
export async function fetchNodesFromFirestoreAuth(authToken?: string): Promise<SovereignNodeRecord[]> {
  const journalNodes = sovereignJournal.getAllNodes();

  if (!authToken) {
    return journalNodes;
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const res = await fetch(`${baseUrl}/sovereign_nodes`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!res.ok) {
      return journalNodes;
    }

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) {
      return journalNodes;
    }

    const remoteNodes: SovereignNodeRecord[] = [];
    for (const doc of data.documents) {
      const decoded = decodeFirestoreValue({ mapValue: { fields: doc.fields } });
      if (decoded && decoded.id) {
        remoteNodes.push(decoded as SovereignNodeRecord);
        sovereignJournal.saveNode(decoded as SovereignNodeRecord);
      }
    }

    return remoteNodes.length > 0 ? remoteNodes : journalNodes;
  } catch (err) {
    console.warn("Firestore fetch nodes error, fallback to journal:", err);
    return journalNodes;
  }
}

/**
 * Persists a TaskEnvelope to Firestore authoritative collection sovereign_tasks.
 */
export async function persistTaskToFirestoreAuth(
  task: TaskEnvelope,
  authToken?: string
): Promise<boolean> {
  sovereignJournal.saveTask(task);

  if (!authToken) {
    return true;
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const encodedFields: any = {};
    for (const [k, v] of Object.entries(task)) {
      if (v !== undefined) {
        encodedFields[k] = encodeFirestoreValue(v);
      }
    }

    const docPath = encodeURIComponent(task.taskId);
    const url = `${baseUrl}/sovereign_tasks/${docPath}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ fields: encodedFields })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Firestore task persist HTTP ${res.status}:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Firestore task persist error:", err);
    return false;
  }
}

/**
 * Fetches all tasks from Firestore or local journal.
 */
export async function fetchTasksFromFirestoreAuth(authToken?: string): Promise<TaskEnvelope[]> {
  const journalTasks = sovereignJournal.getAllTasks();

  if (!authToken) {
    return journalTasks;
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const res = await fetch(`${baseUrl}/sovereign_tasks`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!res.ok) return journalTasks;

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return journalTasks;

    const remoteTasks: TaskEnvelope[] = [];
    for (const doc of data.documents) {
      const decoded = decodeFirestoreValue({ mapValue: { fields: doc.fields } });
      if (decoded && decoded.taskId) {
        remoteTasks.push(decoded as TaskEnvelope);
        sovereignJournal.saveTask(decoded as TaskEnvelope);
      }
    }

    return remoteTasks.length > 0 ? remoteTasks : journalTasks;
  } catch (err) {
    console.warn("Firestore fetch tasks error, fallback to journal:", err);
    return journalTasks;
  }
}

/**
 * Persists an immutable MemoryBlock to Firestore collection memory_blocks.
 */
export async function persistMemoryBlockToFirestoreAuth(
  block: MemoryBlock,
  authToken?: string
): Promise<boolean> {
  sovereignJournal.saveMemoryBlock(block);

  if (!authToken) {
    return true;
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const encodedFields: any = {};
    for (const [k, v] of Object.entries(block)) {
      if (v !== undefined) {
        encodedFields[k] = encodeFirestoreValue(v);
      }
    }

    // Document ID must equal block.cid as enforced by firestore.rules
    const docPath = encodeURIComponent(block.cid);
    const url = `${baseUrl}/memory_blocks/${docPath}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ fields: encodedFields })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Firestore memory block persist HTTP ${res.status}:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Firestore memory block persist error:", err);
    return false;
  }
}

/**
 * Fetches memory blocks from Firestore or local journal.
 */
export async function fetchMemoryBlocksFromFirestoreAuth(authToken?: string): Promise<MemoryBlock[]> {
  const journalBlocks = sovereignJournal.getAllMemoryBlocks();

  if (!authToken) {
    return journalBlocks;
  }

  try {
    const baseUrl = getFirestoreBaseUrl();
    const res = await fetch(`${baseUrl}/memory_blocks`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!res.ok) return journalBlocks;

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return journalBlocks;

    const remoteBlocks: MemoryBlock[] = [];
    for (const doc of data.documents) {
      const decoded = decodeFirestoreValue({ mapValue: { fields: doc.fields } });
      if (decoded && decoded.cid) {
        remoteBlocks.push(decoded as MemoryBlock);
        sovereignJournal.saveMemoryBlock(decoded as MemoryBlock);
      }
    }

    return remoteBlocks.length > 0 ? remoteBlocks : journalBlocks;
  } catch (err) {
    console.warn("Firestore fetch memory blocks error, fallback to journal:", err);
    return journalBlocks;
  }
}
