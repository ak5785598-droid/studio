'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/app-layout';
import { getPopularUsers, getAllRooms } from '@/lib/mock-data';
import { Trophy, Medal, Crown, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const topUsers = getPopularUsers().sort((a, b) => (b.level?.rich || 0) - (a.level?.rich || 0));
  const topCharm = [...topUsers].sort((a, b) => (b.level?.charm || 0) - (a.level?.charm || 0));
  const topRooms = getAllRooms().sort((a, b) => b.participants.length - a.participants.length);

  const RankingList = ({ items, type }: { items: any[], type: 'rich' | 'charm' | 'room' }) => (
    <div className="space-y-4">
      <div className="flex justify-center items-end gap-4 py-8">
        {/* Silver - 2nd */}
        <div className="flex flex-col items-center order-1 mt-8">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-slate-300">
              <AvatarImage src={type === 'room' ? items[1].coverUrl : items[1].avatarUrl} />
              <AvatarFallback>{items[1].name?.charAt(0) || items[1].title?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -left-2 bg-slate-300 text-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">2</div>
          </div>
          <p className="font-bold mt-2 text-sm">{items[1].name || items[1].title}</p>
        </div>
        
        {/* Gold - 1st */}
        <div className="flex flex-col items-center order-2">
          <Crown className="text-yellow-400 h-8 w-8 mb-1 animate-bounce" />
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-yellow-400 shadow-xl">
              <AvatarImage src={type === 'room' ? items[0].coverUrl : items[0].avatarUrl} />
              <AvatarFallback>{items[0].name?.charAt(0) || items[0].title?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center font-bold border-2 border-white">1</div>
          </div>
          <p className="font-bold mt-2 text-lg">{items[0].name || items[0].title}</p>
        </div>

        {/* Bronze - 3rd */}
        <div className="flex flex-col items-center order-3 mt-8">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-amber-600">
              <AvatarImage src={type === 'room' ? items[2].coverUrl : items[2].avatarUrl} />
              <AvatarFallback>{items[2].name?.charAt(0) || items[2].title?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -left-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">3</div>
          </div>
          <p className="font-bold mt-2 text-sm">{items[2].name || items[2].title}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.slice(3, 10).map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-secondary/20 transition-colors">
              <span className="w-6 text-center font-bold text-muted-foreground">{index + 4}</span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={type === 'room' ? item.coverUrl : item.avatarUrl} />
                <AvatarFallback>{item.name?.charAt(0) || item.title?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{item.name || item.title}</p>
                {type !== 'room' && <p className="text-[10px] text-muted-foreground">ID: {item.specialId || item.id.substring(0, 8)}</p>}
              </div>
              <div className="flex items-center gap-1 font-bold text-primary">
                {type === 'rich' && <Trophy className="h-3 w-3" />}
                {type === 'charm' && <Heart className="h-3 w-3" />}
                {type === 'room' && <TrendingUp className="h-3 w-3" />}
                {type === 'rich' ? item.level.rich : type === 'charm' ? item.level.charm : item.participants.length}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">Hall of Fame</h1>
        </header>

        <Tabs defaultValue="rich" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-secondary/50 rounded-full p-1 h-12">
            <TabsTrigger value="rich" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rich</TabsTrigger>
            <TabsTrigger value="charm" className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Charm</TabsTrigger>
            <TabsTrigger value="room" className="rounded-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rich"><RankingList items={topUsers} type="rich" /></TabsContent>
          <TabsContent value="charm"><RankingList items={topCharm} type="charm" /></TabsContent>
          <TabsContent value="room"><RankingList items={topRooms} type="room" /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
