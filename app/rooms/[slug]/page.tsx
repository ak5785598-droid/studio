'use client';

import { use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomClient } from './room-client';
import { AppLayout } from '@/components/layout/app-layout';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import type { Room } from '@/lib/types';
import { useRoomContext } from '@/components/room-provider';

export default function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const firestore = useFirestore();
  const { user: currentUser, isUserLoading } = useUser();
  const { setActiveRoom, setIsMinimized } = useRoomContext();
  
  const roomDocRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'chatRooms', slug);
  }, [firestore, slug]);

  const { data: firestoreRoom, isLoading: isDocLoading } = useDoc(roomDocRef);

  const activeRoom: Room | null = useMemo(() => {
    if (firestoreRoom) return { ...firestoreRoom, slug } as any;
    if (slug === 'ummy-help-center') {
      return { id: 'ummy-help-center', roomNumber: '0000', slug, title: 'Ummy Support', ownerId: 'bot', category: 'Chat' } as any;
    }
    return null;
  }, [firestoreRoom, slug]);

  useEffect(() => {
    if (activeRoom) {
      setActiveRoom(activeRoom);
      setIsMinimized(false);
    }
  }, [activeRoom, setActiveRoom, setIsMinimized]);

  if (isDocLoading && slug !== 'ummy-help-center') return <AppLayout><div className="flex h-full items-center justify-center"><Loader className="animate-spin text-primary" /></div></AppLayout>;

  if (!activeRoom) return <AppLayout><div className="p-20 text-center">Frequency Expired</div></AppLayout>;

  return (
    <AppLayout hideSidebarOnMobile>
       <RoomClient room={activeRoom} />
    </AppLayout>
  );
}