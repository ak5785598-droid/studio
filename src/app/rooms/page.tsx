'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChatRoomCard } from '@/components/chat-room-card';
import { Loader, Flame, Crown, Heart, Users, Home, Star } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { UserSearchDialog } from '@/components/user-search-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy, where } from 'firebase/firestore';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { MomentsFeed } from '@/components/moments-feed';

export default function RoomsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('All');
  const [navTab, setNavTab] = useState<'chatroom' | 'moments' | 'mine'>('chatroom');
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [api]);

  const roomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'chatRooms'), 
      orderBy('participantCount', 'desc'),
      limit(50)
    );
  }, [firestore, user]);

  const { data: roomsData, isLoading: isRoomsLoading } = useCollection(roomsQuery);

  const myRoomQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'chatRooms'), where('ownerId', '==', user.uid), limit(1));
  }, [firestore, user]);

  const { data: myRoomData } = useCollection(myRoomQuery);

  const topRichQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'), orderBy('wallet.dailySpent', 'desc'), limit(3));
  }, [firestore, user]);
  const { data: topRich } = useCollection(topRichQuery);

  const topCharmQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'), orderBy('stats.dailyFans', 'desc'), limit(3));
  }, [firestore, user]);
  const { data: topCharm } = useCollection(topCharmQuery);

  const topRoomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'chatRooms'), orderBy('stats.dailyGifts', 'desc'), limit(3));
  }, [firestore, user]);
  const { data: topRoomsRanking } = useCollection(topRoomsQuery);

  const filteredRooms = useMemo(() => {
    if (navTab === 'mine') return myRoomData || [];
    if (!roomsData) return [];
    let rooms = [...roomsData];
    if (activeTab !== 'All') {
      if (activeTab === 'Hot') return rooms.slice(0, 10);
      if (activeTab === 'New') return rooms.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5);
    }
    return rooms;
  }, [roomsData, myRoomData, activeTab, navTab]);

  const RankingCard = ({ title, color, items, icon: Icon, type }: any) => (
    <Link 
      href={`/leaderboard?type=${type}`} 
      className={cn(
        "relative flex-1 min-w-0 rounded-2xl p-3 h-28 overflow-hidden border border-white/10 shadow-lg block transition-transform active:scale-95", 
        color
      )}
    >
       <div className="flex justify-between items-start mb-2">
          <span className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">{title}</span>
          <Icon className="h-3 w-3 text-white/40" />
       </div>
       <div className="flex justify-center items-center h-12">
          <Avatar className="h-12 w-12 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
             <AvatarImage src={items?.[0]?.avatarUrl || items?.[0]?.coverUrl} />
             <AvatarFallback className="bg-black/20 text-white font-black">{items?.[0]?.username?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
       </div>
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </Link>
  );

  return (
    <AppLayout>
      <div className="min-h-full bg-white flex flex-col p-6 space-y-8 pb-32">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button onClick={() => setNavTab('chatroom')} className={cn("text-2xl font-black transition-all whitespace-nowrap", navTab === 'chatroom' ? "text-gray-900" : "text-gray-200")}>Chatroom</button>
            <button onClick={() => setNavTab('moments')} className={cn("text-2xl font-black transition-all whitespace-nowrap", navTab === 'moments' ? "text-gray-900" : "text-gray-200")}>Moments</button>
            <button onClick={() => setNavTab('mine')} className={cn("text-2xl font-black transition-all whitespace-nowrap", navTab === 'mine' ? "text-gray-900" : "text-gray-200")}>Mine</button>
          </div>
          <div className="flex items-center gap-4">
             <UserSearchDialog />
             <button className="text-gray-800 hover:scale-110 transition-transform"><Home className="h-6 w-6" /></button>
          </div>
        </header>

        {navTab === 'chatroom' && (
          <>
            <div className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {[1, 2, 3].map((i) => (
                    <CarouselItem key={i}>
                      <div className="relative aspect-[16/8] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#ffd700] via-[#ff9800] to-[#ff4081] flex flex-col justify-center px-10 border-[6px] border-white shadow-inner">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                         <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg relative z-10 leading-[0.9]">RISING HOST<br/><span className="text-black/80">CONTEST</span></h2>
                         <div className="flex gap-1.5 mt-6 relative z-10">
                            {Array.from({length: 8}).map((_, dot) => (
                              <div key={dot} className={cn("h-2.5 w-2.5 rounded-full bg-white/40 shadow-sm", dot === 0 && "bg-white w-6")} />
                            ))}
                         </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="flex gap-3">
               <RankingCard title="RICH" color="bg-gradient-to-br from-[#4a3a1a] to-[#2a1a0a]" items={topRich} icon={Crown} type="rich" />
               <RankingCard title="CHARM" color="bg-gradient-to-br from-[#4a0a1a] to-[#2a050a]" items={topCharm} icon={Heart} type="charm" />
               <RankingCard title="ROOM" color="bg-gradient-to-br from-[#0a2a0a] to-[#051a05]" items={topRoomsRanking} icon={Users} type="rooms" />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              <button onClick={() => setActiveTab('All')} className={cn("flex items-center gap-2 px-8 h-11 rounded-full text-sm font-black uppercase transition-all whitespace-nowrap shadow-md", activeTab === 'All' ? "bg-[#ffd700] text-gray-900 border-2 border-white ring-2 ring-[#ffd700]/20" : "bg-gray-100 text-gray-400")}><Star className="h-4 w-4 fill-current" />All</button>
              <button onClick={() => setActiveTab('Hot')} className={cn("px-10 h-11 rounded-full text-sm font-black uppercase transition-all whitespace-nowrap", activeTab === 'Hot' ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-400")}>Hot</button>
              <button onClick={() => setActiveTab('New')} className={cn("px-10 h-11 rounded-full text-sm font-black uppercase transition-all whitespace-nowrap", activeTab === 'New' ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-400")}>New</button>
            </div>

            {isRoomsLoading ? (
              <div className="flex justify-center py-20"><Loader className="animate-spin text-primary h-10 w-10" /></div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {filteredRooms.map((room: any) => (
                  <ChatRoomCard key={room.id} room={room} variant="modern" />
                ))}
              </div>
            )}
          </>
        )}

        {navTab === 'moments' && <MomentsFeed />}
        {navTab === 'mine' && (
          <div className="space-y-6">
             {myRoomData && myRoomData.length > 0 ? (
               <div className="grid grid-cols-2 gap-4">
                  {myRoomData.map((room: any) => (<ChatRoomCard key={room.id} room={room} variant="modern" />))}
               </div>
             ) : (
               <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-24 w-24 bg-[#FFCC00]/10 rounded-full flex items-center justify-center text-[#FFCC00]"><Flame className="h-12 w-12" /></div>
                  <h3 className="text-2xl font-black uppercase">Start Your Frequency</h3>
                  <CreateRoomDialog />
               </div>
             )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
