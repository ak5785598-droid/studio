'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatRoomCard } from '@/components/chat-room-card';
import { Loader, Search, Plus, Trophy, Users, Heart, ArrowRight, Sparkles, Zap, Flame, Star, Gamepad2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { UserSearchDialog } from '@/components/user-search-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, limit, orderBy, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function RoomsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Popular' | 'Me'>('Popular');

  const roomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'chatRooms'), orderBy('participantCount', 'desc'), limit(50));
  }, [firestore, user]);

  const { data: roomsData, isLoading: isRoomsLoading } = useCollection(roomsQuery);

  const displayRooms = useMemo(() => {
    const helpRoomBase: any = {
      id: 'ummy-help-center',
      roomNumber: '0000',
      title: 'Ummy Official Help',
      topic: 'Official Support',
      category: 'Chat',
      coverUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000',
      ownerId: 'official-bot',
      isOfficial: true
    };
    if (!roomsData) return [helpRoomBase];
    return [helpRoomBase, ...roomsData.filter(r => r.id !== 'ummy-help-center')];
  }, [roomsData]);

  const CategoryCard = ({ title, label, gradient, onClick }: any) => (
    <div onClick={onClick} className={cn("relative flex-1 min-w-0 rounded-2xl h-24 overflow-hidden border-2 border-white/20 shadow-lg flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all cursor-pointer", gradient)}>
       <span className="text-white font-black text-[10px] uppercase tracking-widest z-10">{label}</span>
       <div className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full z-10">
          <p className="text-[8px] font-black text-white uppercase">{title}</p>
       </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f8f9fa] flex flex-col space-y-6 pb-32 font-headline">
        <header className="flex items-center justify-between px-6 pt-6 bg-white shrink-0">
          <div className="flex items-center gap-8">
            <button onClick={() => setActiveTab('Me')} className={cn("text-xl font-black uppercase italic transition-colors", activeTab === 'Me' ? "text-gray-900" : "text-gray-400")}>Me</button>
            <div className="relative">
              <button onClick={() => setActiveTab('Popular')} className={cn("text-2xl font-black uppercase italic tracking-tighter transition-colors", activeTab === 'Popular' ? "text-gray-900" : "text-gray-400")}>Popular</button>
              {activeTab === 'Popular' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-[#00E5FF] rounded-full" />}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <UserSearchDialog />
             <CreateRoomDialog iconOnly />
          </div>
        </header>

        <div className="px-4 space-y-6 flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'Popular' && (
            <>
              <div className="flex gap-2">
                 <CategoryCard title="Ranking" label="Ranking" gradient="bg-gradient-to-br from-orange-400 to-yellow-600" onClick={() => router.push('/leaderboard')} />
                 <CategoryCard title="Family" label="Family" gradient="bg-gradient-to-br from-blue-400 to-indigo-600" />
                 <CategoryCard title="CP" label="CP" gradient="bg-gradient-to-br from-pink-400 to-purple-600" onClick={() => router.push('/cp-challenge')} />
              </div>
              {isRoomsLoading ? <div className="flex justify-center py-20"><Loader className="animate-spin" /></div> : (
                <div className="grid grid-cols-2 gap-3 pb-10">
                  {displayRooms.map((room: any) => (
                    <ChatRoomCard key={room.id} room={room} variant="modern" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}