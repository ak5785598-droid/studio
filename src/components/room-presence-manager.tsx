'use client';

import { useEffect, useRef } from 'react';
import { useRoomContext } from './room-provider';
import { useUser, useFirestore, useUserProfile, addDocumentNonBlocking } from '@/firebase';
import { doc, setDoc, serverTimestamp, onSnapshot, collection, getDoc } from 'firebase/firestore';

/**
 * Maintains Firestore presence while a room is active.
 * Fix: Prevents seat loss on page refresh.
 */
export function RoomPresenceManager() {
  const { activeRoom } = useRoomContext();
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const lastRoomId = useRef<string | null>(null);
  const hasPerformedInitialSync = useRef<boolean>(false);

  useEffect(() => {
    if (!firestore || !activeRoom?.id || !user || !userProfile) return;

    const participantRef = doc(firestore, 'chatRooms', activeRoom.id, 'participants', user.uid);

    const performSync = async () => {
      // Entrance Announcement (Only once per room session)
      if (lastRoomId.current !== activeRoom.id) {
        lastRoomId.current = activeRoom.id;
        addDocumentNonBlocking(collection(firestore, 'chatRooms', activeRoom.id, 'messages'), {
          content: 'entered the frequency',
          senderId: user.uid,
          senderName: userProfile.username || 'Tribe Member',
          senderAvatar: userProfile.avatarUrl || '',
          chatRoomId: activeRoom.id,
          timestamp: serverTimestamp(),
          type: 'entrance'
        });
      }

      // 1. Check for existing seat index to prevent resetting to audience on refresh
      let seatIndex = 0;
      if (!hasPerformedInitialSync.current) {
        const snap = await getDoc(participantRef);
        if (snap.exists()) {
          seatIndex = snap.data().seatIndex || 0;
        }
        hasPerformedInitialSync.current = true;
      }

      // 2. Update/Create initial presence
      setDoc(participantRef, {
        uid: user.uid,
        name: userProfile.username || 'Guest',
        avatarUrl: userProfile.avatarUrl || '',
        activeFrame: userProfile.inventory?.activeFrame || 'None',
        joinedAt: serverTimestamp(),
        isMuted: true,
        seatIndex: seatIndex,
      }, { merge: true });
    };

    performSync();

    // Listen for changes from other clients/admins (like silences or kicks)
    const unsubscribe = onSnapshot(participantRef, (snap) => {
      // Logic for client-side reaction to remote changes could go here
    });

    return () => {
      unsubscribe();
      hasPerformedInitialSync.current = false;
    };
  }, [firestore, activeRoom?.id, user?.uid, userProfile]);

  return null;
}