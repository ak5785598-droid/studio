
'use client';

import { useState, useMemo } from 'react';
import { ChatRoomCard } from '@/components/chat-room-card';
import { Search, Loader, Flame, Gamepad2, Music, Crown, Heart, Users, Home, BadgeCheck, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Explore Rooms Page - Yari Enterprise Edition.
 * Vibrant design with discovery ribbons and social proof.
 */
export default function RoomsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('Popular');

  const allRoomsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !user) return null;
    return query(collection(firestore, 'chatRooms'), limit(50));
  }, [firestore, isUserLoading, user]);

  const recentUsersQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !user) return null;
    return query(collection(firestore, 'users'), limit(15));
  }, [firestore, isUserLoading, user]);

  const { data: roomsData, isLoading: isRoomsLoading } = useCollection(allRoomsQuery);
  const { data: recentUsers } = useCollection(recentUsersQuery);

  const categories = [
    { id: 'Popular', label: 'Popular', icon: Flame },
    { id: 'Game', label: 'Game', icon: Gamepad2 },
    { id: 'Video/Music', label: 'Video/Music', icon: Music },
  ];

  const filteredRooms = useMemo(() => {
    if (!roomsData) return [];
    if (activeTab === 'Popular') return roomsData.slice(0, 10);
    return roomsData.filter((r: any) => r.category === activeTab);
  }, [roomsData, activeTab]);

  return (
    <AppLayout hideSidebarOnMobile>
      <div className="min-h-screen bg-background pb-20">
        {/* Yari Header with Mine/Popular Toggles */}
        <header className="bg-gradient-to-b from-primary to-primary/80 px-4 pt-10 pb-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Home className="h-5 w-5 text-black" />
            </div>
            <div className="flex items-center gap-8 text-black">
              <button className="text-xl font-bold opacity-60 hover:opacity-100 transition-opacity">Mine</button>
              <button className="text-2xl font-black border-b-4 border-black pb-1">Popular</button>
            </div>
            <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm" aria-label="Search">
              <Search className="h-6 w-6 text-black" />
            </button>
          </div>

          <div className="w-full mt-4 overflow-hidden rounded-2xl">
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3].map((i) => (
                  <CarouselItem key={i}>
                    <div className="relative aspect-[1536/681] rounded-2xl overflow-hidden shadow-xl mx-2">
                      <Image
                        src={`https://picsum.photos/seed/ummy-banner-${i}/800/400`}
                        alt={`Featured event ${i}`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </header>

        <div className="px-4 mt-6 space-y-6">
          {/* Discovery Ribbons */}
          <div className="grid grid-cols-3 gap-3">
            <Link href="/leaderboard" className="relative h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 p-3 shadow-lg hover:scale-105 transition-transform group overflow-hidden">
               <span className="text-white font-bold text-sm uppercase relative z-10">Ranking</span>
               <Crown className="absolute -bottom-2 -right-2 h-16 w-16 text-white/20" />
            </Link>
            <Link href="/match" className="relative h-24 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 p-3 shadow-lg hover:scale-105 transition-transform group overflow-hidden">
               <span className="text-white font-bold text-sm uppercase relative z-10">CP Match</span>
               <Heart className="absolute -bottom-2 -right-2 h-16 w-16 text-white/20" />
            </Link>
            <div className="relative h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 p-3 shadow-lg hover:scale-105 transition-transform group overflow-hidden cursor-pointer">
               <span className="text-white font-bold text-sm uppercase relative z-10">Family</span>
               <Users className="absolute -bottom-2 -right-2 h-16 w-16 text-white/20" />
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <Link href="/rooms/official-help-room" className="block group">
              <Card className="overflow-hidden border-2 border-blue-500/10 bg-gradient-to-r from-blue-50/50 to-white rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4 p-4">
                  <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-blue-100 flex items-center justify-center text-blue-500">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-blue-700 uppercase italic tracking-tight truncate text-sm">Ummy Official Hub</h3>
                    </div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1">Real-time Support Hub</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-blue-500 text-white border-none text-[8px] font-black px-2 py-0 h-4">OFFICIAL</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Social Proof Section */}
          <section className="space-y-3">
             <div className="flex items-center gap-2 px-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-black uppercase italic tracking-tight">Active Frequency</h2>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {recentUsers?.map((u) => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="flex flex-col items-center gap-1.5 shrink-0 group">
                    <div className="relative">
                       <Avatar className="h-14 w-14 border-2 border-white shadow-md transition-transform group-hover:scale-110">
                          <AvatarImage src={u.avatarUrl} />
                          <AvatarFallback>{u.username?.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground truncate w-14 text-center">{u.username?.split(' ')[0]}</span>
                  </Link>
                ))}
             </div>
          </section>

          {/* Category Tabs */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === cat.id 
                    ? 'bg-primary text-black shadow-md scale-105' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat.id === 'Popular' && <Flame className="h-4 w-4 fill-current" />}
                {cat.label}
              </button>
            ))}
            <div className="ml-auto">
              <CreateRoomDialog />
            </div>
          </div>

          {isRoomsLoading ? (
            <div className="flex justify-center py-20">
              <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pb-24">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room: any) => (
                  <ChatRoomCard key={room.id} room={room} variant="modern" />
                ))
              ) : (
                <div className="col-span-2 py-20 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-muted">
                   <p className="font-bold uppercase tracking-widest text-xs">Syncing Tribe Frequency...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
