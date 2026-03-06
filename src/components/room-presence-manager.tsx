
'use client';

import { useEffect, useRef } from 'react';
import { useRoomContext } from './room-provider';
import { useUser, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, serverTimestamp, collection, increment, writeBatch, getDocs, query, where } from 'firebase/firestore';

/**
 * Maintains Firestore presence while a room is active.
 * ANTI-GHOST PROTOCOL: 
 * 1. 20s Heartbeat for live tracking.
 * 2. Distributed Cleanup: ANY participant now sweeps stale (60s+) participants periodically.
 * This ensures room counts are corrected even if users "cut" the app screen.
 */
export function RoomPresenceManager() {
  const { activeRoom, setActiveRoom } = useRoomContext();
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const lastRoomId = useRef<string | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const cleanupInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!firestore || !activeRoom?.id || !user) {
      return;
    }

    const roomId = activeRoom.id;
    const uid = user.uid;

    const performJoin = async () => {
      if (lastRoomId.current === roomId) return;
      lastRoomId.current = roomId;

      const roomDocRef = doc(firestore, 'chatRooms', roomId);
      const userRef = doc(firestore, 'users', uid);
      const profileRef = doc(firestore, 'users', uid, 'profile', uid);
      const participantRef = doc(firestore, 'chatRooms', roomId, 'participants', uid);

      // 1. Broadcast Entrance
      addDocumentNonBlocking(collection(firestore, 'chatRooms', roomId, 'messages'), {
        content: 'entered the room',
        senderId: uid,
        senderName: userProfile?.username || 'Tribe Member',
        senderAvatar: userProfile?.avatarUrl || null,
        chatRoomId: roomId,
        timestamp: serverTimestamp(),
        type: 'entrance'
      });

      // 2. Atomic Join Handshake
      const batch = writeBatch(firestore);
      batch.update(roomDocRef, { participantCount: increment(1), updatedAt: serverTimestamp() });
      batch.update(userRef, { currentRoomId: roomId, isOnline: true, updatedAt: serverTimestamp() });
      batch.update(profileRef, { currentRoomId: roomId, isOnline: true, updatedAt: serverTimestamp() });

      batch.set(participantRef, {
        uid: uid,
        name: userProfile?.username || 'Guest',
        avatarUrl: userProfile?.avatarUrl || null,
        activeFrame: userProfile?.inventory?.activeFrame || 'None',
        activeWave: userProfile?.inventory?.activeWave || 'Default',
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isMuted: true,
        seatIndex: 0,
      }, { merge: true });

      try {
        await batch.commit();
        
        // 3. Start Heartbeat Sync (20s)
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = setInterval(() => {
          setDocumentNonBlocking(participantRef, { lastSeen: serverTimestamp() }, { merge: true });
        }, 20000);

        // 4. DISTRIBUTED GHOST PURGE (Every Participant acts as a cleaner)
        // If anyone is in the room, they will clear out people who haven't pulsed in 60s.
        if (cleanupInterval.current) clearInterval(cleanupInterval.current);
        cleanupInterval.current = setInterval(async () => {
          const staleThreshold = new Date(Date.now() - 60000); 
          const q = query(collection(firestore, 'chatRooms', roomId, 'participants'), where('lastSeen', '<', staleThreshold));
          const snap = await getDocs(q);
          
          if (!snap.empty) {
            const purgeBatch = writeBatch(firestore);
            let purgedCount = 0;
            
            snap.docs.forEach(d => {
              if (d.id !== uid) { 
                purgeBatch.delete(d.ref);
                purgedCount++;
              }
            });

            if (purgedCount > 0) {
              purgeBatch.update(roomDocRef, { participantCount: increment(-purgedCount) });
              await purgeBatch.commit();
              console.log(`[Presence Sync] Terminated ${purgedCount} ghost identities from Room #${roomId}.`);
            }
          }
        }, 30000); 

      } catch (e) {
        lastRoomId.current = null;
      }
    };

    performJoin();

    const handleExit = async () => {
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      if (cleanupInterval.current) clearInterval(cleanupInterval.current);

      if (lastRoomId.current === roomId) {
        const exitRoomId = lastRoomId.current;
        lastRoomId.current = null;
        
        const batch = writeBatch(firestore);
        const roomDocRef = doc(firestore, 'chatRooms', exitRoomId);
        const userRef = doc(firestore, 'users', uid);
        const profileRef = doc(firestore, 'users', uid, 'profile', uid);
        const participantRef = doc(firestore, 'chatRooms', exitRoomId, 'participants', uid);

        batch.update(roomDocRef, { participantCount: increment(-1) });
        batch.delete(participantRef);
        batch.update(userRef, { currentRoomId: null, isOnline: false, updatedAt: serverTimestamp() });
        batch.update(profileRef, { currentRoomId: null, isOnline: false, updatedAt: serverTimestamp() });
        
        try {
          await batch.commit();
        } catch (e) {}
      }
    };

    window.addEventListener('beforeunload', handleExit);
    return () => {
      handleExit();
      window.removeEventListener('beforeunload', handleExit);
    };
  }, [firestore, activeRoom?.id, user?.uid, userProfile?.username]); 

  return null;
}
