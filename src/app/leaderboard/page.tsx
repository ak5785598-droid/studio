
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppLayout } from '@/components/layout/app-layout';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Trophy, Crown, TrendingUp, Heart, Loader, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Global Ranking Page
 * Displays top 1-50 users based on spending (Rich) and followers (Charm).
 */
export default function LeaderboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Top 50 Rich Users - Based on coins spent
  const richUsersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users'), 
      orderBy('wallet.totalSpent', 'desc'), 
      limit(50)
    );
  }, [firestore, user]);

  // Top 50 Charm Users - Based on followers
  const charmUsersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users'), 
      orderBy('stats.followers', 'desc'), 
      limit(50)
    );
  }, [firestore, user]);

  // Top Active Rooms
  const topRoomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'chatRooms'), limit(50));
  }, [firestore, user]);

  const { data: richUsers, isLoading: isLoadingRich } = useCollection(richUsersQuery);
  const { data: charmUsers, isLoading: isLoadingCharm } = useCollection(charmUsersQuery);
  const { data: rooms, isLoading: isLoadingRooms } = useCollection(topRoomsQuery);

  const RankingList = ({ items, type, isLoading }: { items: any[] | null, type: 'rich' | 'charm' | 'room', isLoading: boolean }) => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculating Vibe Metrics...</p>
      </div>
    );

    if (!items || items.length === 0) return (
      <div className="text-center py-40 space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
          <TrendingUp className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground font-body text-lg italic max-w-xs mx-auto">The stage is set! Be the first to start your journey to #1.</p>
      </div>
    );

    const top3 = items.slice(0, 3);
    const others = items.slice(3);

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Podium for Top 3 */}
        <div className="flex justify-center items-end gap-2 md:gap-8 py-12 relative">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
          
          {/* Rank 2 */}
          {top3[1] && (
            <div className="flex flex-col items-center order-1 relative">
              <div className="relative mb-2">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-slate-300 shadow-xl ring-4 ring-slate-300/10">
                  <AvatarImage 
                    src={type === 'room' ? `https://picsum.photos/seed/${top3[1].id}/200` : top3[1].avatarUrl} 
                    alt={`${top3[1].username || 'User'} runner up avatar`}
                  />
                  <AvatarFallback className="text-xl">{(top3[1].username || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-3 -left-1 bg-slate-300 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-black border-2 border-white shadow-lg text-sm italic">2</div>
              </div>
              <p className="font-black mt-2 text-xs uppercase tracking-tight truncate max-w-[80px]">{top3[1].username || top3[1].name}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-400">
                {type === 'rich' ? (top3[1].wallet?.totalSpent || 0).toLocaleString() : type === 'charm' ? (top3[1].stats?.followers || 0).toLocaleString() : 'LIVE'}
              </div>
            </div>
          )}
          
          {/* Rank 1 */}
          {top3[0] && (
            <div className="flex flex-col items-center order-2 scale-110 relative z-10">
              <Crown className="text-yellow-400 h-8 w-8 mb-1 animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <div className="relative">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)] ring-4 ring-yellow-400/20">
                  <AvatarImage 
                    src={type === 'room' ? `https://picsum.photos/seed/${top3[0].id}/200` : top3[0].avatarUrl} 
                    alt={`${top3[0].username || 'User'} champion avatar`}
                  />
                  <AvatarFallback className="text-3xl">{(top3[0].username || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-4 -left-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center font-black border-4 border-white shadow-xl text-lg italic">1</div>
              </div>
              <p className="font-black mt-3 text-sm uppercase italic tracking-tighter drop-shadow-sm">{top3[0].username || top3[0].name}</p>
               <div className="flex items-center gap-1 mt-1 text-xs font-black text-primary drop-shadow-sm">
                 {type === 'rich' && <Gem className="h-3 w-3" />}
                 {type === 'rich' ? (top3[0].wallet?.totalSpent || 0).toLocaleString() : type === 'charm' ? (top3[0].stats?.followers || 0).toLocaleString() : 'POPULAR'}
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3[2] && (
            <div className="flex flex-col items-center order-3 relative">
              <div className="relative mb-2">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-amber-600/50 shadow-xl ring-4 ring-amber-600/5">
                  <AvatarImage 
                    src={type === 'room' ? `https://picsum.photos/seed/${top3[2].id}/200` : top3[2].avatarUrl} 
                    alt={`${top3[2].username || 'User'} third place avatar`}
                  />
                  <AvatarFallback className="text-xl">{(top3[2].username || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-3 -left-1 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-black border-2 border-white shadow-lg text-sm italic">3</div>
              </div>
              <p className="font-black mt-2 text-xs uppercase tracking-tight truncate max-w-[80px]">{top3[2].username || top3[2].name}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-600/60">
                {type === 'rich' ? (top3[2].wallet?.totalSpent || 0).toLocaleString() : type === 'charm' ? (top3[2].stats?.followers || 0).toLocaleString() : 'LIVE'}
              </div>
            </div>
          )}
        </div>

        {/* List for Rank 4-50 */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-md">
          <CardContent className="p-0">
            {others.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-5 border-b border-gray-100 last:border-0 hover:bg-white/80 transition-all group"
              >
                <span className="w-8 text-center font-black text-muted-foreground/40 italic group-hover:text-primary transition-colors">{index + 4}</span>
                <Avatar className="h-12 w-12 border border-gray-100">
                   <AvatarImage 
                     src={type === 'room' ? `https://picsum.photos/seed/${item.id}/200` : item.avatarUrl} 
                     alt={`${item.username || 'User'} ranked ${index+4} avatar`}
                   />
                  <AvatarFallback className="font-bold">{(item.username || item.name || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm uppercase tracking-tight truncate">{item.username || item.name}</p>
                  <p className="text-[9px] text-muted-foreground font-mono bg-secondary/30 w-fit px-1.5 rounded">ID: {item.id.substring(0, 8)}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                   <div className={cn(
                     "flex items-center gap-1 font-black text-xs",
                     type === 'rich' ? "text-primary" : type === 'charm' ? "text-accent" : "text-blue-500"
                   )}>
                    {type === 'rich' && <Gem className="h-3 w-3" />}
                    {type === 'charm' && <Heart className="h-3 w-3" />}
                    {type === 'room' && <TrendingUp className="h-3 w-3" />}
                    {type === 'rich' ? (item.wallet?.totalSpent || 0).toLocaleString() : type === 'charm' ? (item.stats?.followers || 0).toLocaleString() : 'Active'}
                  </div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    {type === 'rich' ? 'Spent' : type === 'charm' ? 'Followers' : 'Room'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-2 text-center pt-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-xl shadow-primary/20 rotate-3 mb-4">
             <Trophy className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h1 className="font-headline text-5xl font-black italic uppercase tracking-tighter text-foreground drop-shadow-sm">
            Global Rankings
          </h1>
          <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.3em]">Top 50 Neural Pulse</p>
        </header>

        <Tabs defaultValue="rich" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto mb-12 bg-secondary/50 rounded-full p-1.5 h-14 border border-white shadow-inner">
            <TabsTrigger 
              value="rich" 
              className="rounded-full text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Rich
            </TabsTrigger>
            <TabsTrigger 
              value="charm" 
              className="rounded-full text-xs font-black uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all"
            >
              Charm
            </TabsTrigger>
            <TabsTrigger 
              value="room" 
              className="rounded-full text-xs font-black uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              Active
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rich"><RankingList items={richUsers} type="rich" isLoading={isLoadingRich} /></TabsContent>
          <TabsContent value="charm"><RankingList items={charmUsers} type="charm" isLoading={isLoadingCharm} /></TabsContent>
          <TabsContent value="room"><RankingList items={rooms} type="room" isLoading={isLoadingRooms} /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
