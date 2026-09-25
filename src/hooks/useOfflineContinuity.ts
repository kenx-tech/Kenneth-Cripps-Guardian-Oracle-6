import { useState, useEffect } from "react";
import { syncQueue } from "../lib/sovereign/memory/syncQueue";
import { memoryLedger } from "../lib/sovereign/memory/memoryLedger";

export function useOfflineContinuity() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingSyncCount, setPendingSyncCount] = useState(syncQueue.getPendingCount());
  const [blocks, setBlocks] = useState(memoryLedger.getBlocks());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue.flush().then(() => {
        setPendingSyncCount(syncQueue.getPendingCount());
        setBlocks(memoryLedger.getBlocks());
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const refreshBlocks = () => {
    setBlocks(memoryLedger.getBlocks());
    setPendingSyncCount(syncQueue.getPendingCount());
  };

  return {
    isOnline,
    pendingSyncCount,
    blocks,
    refreshBlocks
  };
}
