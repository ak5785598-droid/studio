'use client';

import { use, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { RoomClient } from './room-client';
import { AppLayout } from '@/components/layout/app-layout';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import type { Room } from '@/lib/types';

/**
 * Real-time Room Page.
 * Handles the logic for loading a chat room and initializing the Official Help Hub.
 */
export default function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const firestore = useFirestore();
  const { user: currentUser, isLoading: isUserLoading } = useUser();

  // Guard: Only fetch document if we have an authenticated user context
  const roomDocRef = useMemoFirebase(() => {
    if (!firestore || !slug || isUserLoading || !currentUser) return null;
    return doc(firestore, 'chatRooms', slug);
  }, [firestore, slug, isUserLoading, currentUser]);

  const { data: firestoreRoom, isLoading: isDocLoading } = useDoc(roomDocRef);

  // Auto-initialize Official Help Room if it doesn't exist
  useEffect(() => {
    if (slug === 'official-help-room' && !isDocLoading && !firestoreRoom && firestore && currentUser) {
      const officialRef = doc(firestore, 'chatRooms', 'official-help-room');
      setDoc(officialRef, {
        name: 'Ummy Official Help Room',
        description: 'Meet the community and get live support from the official team.',
        ownerId: 'official-admin',
        category: 'Popular',
        coverUrl: 'https://picsum.photos/seed/official-help/1200/400',
        announcement: 'Welcome to Ummy! Be respectful and enjoy the group vibe. Official support is active here.',
        createdAt: serverTimestamp(),
        moderatorIds: ['official-admin'],
        lockedSeats: []
      }, { merge: true });
    }
  }, [slug, isDocLoading, firestoreRoom, firestore, currentUser]);

  // Transform Firestore data into Room type
  const activeRoom: Room | null = useMemo(() => {
    if (!firestoreRoom) return null;
    return {
      id: firestoreRoom.id,
      slug: firestoreRoom.id,
      title: firestoreRoom.name || 'Untitled Room',
      topic: firestoreRoom.description || 'No topic set',
      category: (firestoreRoom.category as any) || 'Chat',
      coverUrl: firestoreRoom.coverUrl || `https://picsum.photos/seed/${firestoreRoom.id}/1200/400`,
      ownerId: firestoreRoom.ownerId,
      moderatorIds: firestoreRoom.moderatorIds || [],
      lockedSeats: firestoreRoom.lockedSeats || [],
      announcement: firestoreRoom.announcement || "Welcome! Be respectful and enjoy the group vibe.",
      createdAt: firestoreRoom.createdAt,
    } as any;
  }, [firestoreRoom]);

  // Comprehensive loading state
  // Only show notFound() if we have an auth context, a ref, and the doc definitely doesn't exist.
  if (isUserLoading || (isDocLoading && !firestoreRoom) || (currentUser && !roomDocRef)) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] w-full flex-col items-center justify-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse font-mono uppercase tracking-widest">Synchronizing Vibe...</p>
        </div>
      </AppLayout>
    );
  }

  // Final check for existence
  if (!activeRoom && !isDocLoading && roomDocRef) {
    notFound();
  }

  if (!activeRoom) {
     return (
        <AppLayout>
            <div className="flex h-[50vh] w-full flex-col items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        </AppLayout>
     );
  }

  return (
    <AppLayout>
       <RoomClient room={activeRoom} />
    </AppLayout>
  );
}
