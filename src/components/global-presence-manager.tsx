
'use client';

import { useEffect, useRef } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';

/**
 * Elite Global Presence Manager.
 * Synchronizes the user's online status with the tribal graph in real-time.
 * PULSE PROTOCOL: Updates online heartbeat every 20s for high-fidelity detection.
 * CUT DETECTION: Mark offline immediately when screen is hidden or app is backgrounded.
 */
export function GlobalPresenceManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user || !firestore) return;

    const userRef = doc(firestore, 'users', user.uid);
    const profileRef = doc(firestore, 'users', user.uid, 'profile', user.uid);

    const setPresence = (online: boolean) => {
      const data = { 
        isOnline: online, 
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp() 
      };
      setDocumentNonBlocking(userRef, data, { merge: true });
      setDocumentNonBlocking(profileRef, data, { merge: true });
    };

    // Initial Sync
    setPresence(true);

    // High-Frequency Pulse Engine (20s)
    heartbeatTimer.current = setInterval(() => {
      setPresence(true);
    }, 20000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Mark offline immediately if app is "cut" or minimized
        if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        setPresence(false);
      } else {
        // Resume presence on return
        setPresence(true);
        if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = setInterval(() => {
          setPresence(true);
        }, 20000);
      }
    };

    const handleBeforeUnload = () => {
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      setPresence(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      setPresence(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, firestore]);

  return null;
}
