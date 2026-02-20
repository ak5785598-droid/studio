'use client';

import { use, useMemo } from 'react';
import { getRoomBySlug } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { RoomClient } from './room-client';
import { AppLayout } from '@/components/layout/app-layout';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import type { Room } from '@/lib/types';

export default function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const firestore = useFirestore();

  // 1. Try mock data first
  const mockRoom = getRoomBySlug(slug);

  // 2. If not in mock, try Firestore (assuming slug might be a doc ID)
  const roomDocRef = useMemoFirebase(() => {
    if (!firestore || mockRoom) return null;
    return doc(firestore, 'chatRooms', slug);
  }, [firestore, slug, mockRoom]);

  const { data: firestoreRoom, isLoading } = useDoc(roomDocRef);

  // Transform Firestore data into Room type
  const activeRoom: Room | null = useMemo(() => {
    if (mockRoom) return mockRoom;
    if (firestoreRoom) {
      return {
        id: firestoreRoom.id,
        slug: firestoreRoom.id,
        title: firestoreRoom.name,
        topic: firestoreRoom.description,
        category: (firestoreRoom.category as any) || 'Chat',
        coverUrl: `https://picsum.photos/seed/${firestoreRoom.id}/1200/400`,
        participants: [], // Dynamic participants can be handled in client
        messages: [],
      };
    }
    return null;
  }, [mockRoom, firestoreRoom]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!activeRoom && !isLoading) {
    notFound();
  }

  return (
    <AppLayout>
      <RoomClient room={activeRoom!} />
    </AppLayout>
  );
}
