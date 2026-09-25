import { db } from "../../firebase";
import { collection, doc, setDoc, getDocs, getDoc, query, orderBy, limit } from "firebase/firestore";
import { SovereignNodeRecord, MemoryBlock } from "../../../types/sovereign";

export async function syncNodeToFirestore(node: SovereignNodeRecord): Promise<void> {
  try {
    const nodeRef = doc(db, "sovereign_nodes", node.id);
    await setDoc(nodeRef, {
      ...node,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore node sync deferred (offline or permission):", err);
  }
}

export async function fetchNodesFromFirestore(): Promise<SovereignNodeRecord[]> {
  try {
    const colRef = collection(db, "sovereign_nodes");
    const snapshot = await getDocs(colRef);
    const nodes: SovereignNodeRecord[] = [];
    snapshot.forEach(doc => {
      nodes.push(doc.data() as SovereignNodeRecord);
    });
    return nodes;
  } catch (err) {
    console.warn("Firestore fetch nodes failed, using local mesh:", err);
    return [];
  }
}

export async function persistMemoryBlockToFirestore(block: MemoryBlock): Promise<void> {
  try {
    const blockRef = doc(db, "memory_blocks", block.cid);
    await setDoc(blockRef, block, { merge: true });
  } catch (err) {
    console.warn("Firestore block persistence deferred (offline):", err);
  }
}

export async function fetchRecentMemoryBlocksFromFirestore(): Promise<MemoryBlock[]> {
  try {
    const colRef = collection(db, "memory_blocks");
    const q = query(colRef, orderBy("timestamp", "desc"), limit(50));
    const snapshot = await getDocs(q);
    const blocks: MemoryBlock[] = [];
    snapshot.forEach(d => blocks.push(d.data() as MemoryBlock));
    return blocks.reverse();
  } catch (err) {
    console.warn("Firestore fetch memory blocks failed:", err);
    return [];
  }
}
