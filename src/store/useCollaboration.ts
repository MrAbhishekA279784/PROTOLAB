import { useEffect, useState, useRef } from 'react';
import { useStore } from './useStore';

export type CursorInfo = { id: string; username: string; x: number; y: number; color: string; timestamp: number };

export function useCollaboration(projectId: string | null) {
  const { currentUser } = useStore();
  const [cursors, setCursors] = useState<Record<string, CursorInfo>>({});
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const channel = new BroadcastChannel(`collab-${projectId}`);
    channelRef.current = channel;

    channel.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'CURSOR') {
        setCursors(prev => ({
          ...prev,
          [payload.id]: { ...payload, timestamp: Date.now() }
        }));
      } else if (type === 'STATE_UPDATE') {
        const { event, data } = payload;
        window.dispatchEvent(new CustomEvent(`collab-update-${projectId}`, { detail: { event, data } }));
      }
    };
    
    // Cleanup old cursors
    const interval = setInterval(() => {
       setCursors(prev => {
         const now = Date.now();
         const next = { ...prev };
         let changed = false;
         for (const id in next) {
           if (now - next[id].timestamp > 3000) {
             delete next[id];
             changed = true;
           }
         }
         return changed ? next : prev;
       });
    }, 1000);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, [projectId]);

  const broadcastCursor = (x: number, y: number) => {
    if (channelRef.current && currentUser) {
      // Pick a pseudo-random color based on user ID
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const colorIndex = parseInt(currentUser.id) % colors.length || 0;
      
      channelRef.current.postMessage({
        type: 'CURSOR',
        payload: { id: currentUser.id, username: currentUser.username, x, y, color: colors[colorIndex] }
      });
    }
  };

  const broadcastState = (event: string, data: unknown) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'STATE_UPDATE', payload: { event, data } });
    }
  };

  return { cursors: Object.values(cursors), broadcastCursor, broadcastState };
}
