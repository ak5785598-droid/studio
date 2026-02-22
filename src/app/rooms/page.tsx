'use client';

import { useMemo } from 'react';
import { ChatRoomCard } from '@/components/chat-room-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Loader, Sparkles, LayoutPanelTop, Crown } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { RecommendationsForm } from '@/components/recommendations-form';
import Image from 'next/image';
import Link from 'next/link';

export default function RoomsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const allRoomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'chatRooms'), orderBy('createdAt', 'desc'), limit(50));
  }, [firestore, user]);

  const { data: roomsData, isLoading } = useCollection(allRoomsQuery);

  const configRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'appConfig', 'global');
  }, [firestore, user]);
  
  const { data: config } = useDoc(configRef);

  const activeBanner = config?.activeBanners?.[0];

  const categories = ['Popular', 'Game', 'Chat', 'Singing', 'Battle'];

  const roomsByCategory = (category: string) => {
    if (!roomsData) return [];
    if (category === 'Popular') return roomsData.slice(0, 8);
    return roomsData.filter((room: any) => room.category === category);
  };

  const myRooms = useMemo(() => {
    if (!roomsData || !user) return [];
    return roomsData.filter((r: any) => r.ownerId === user.uid);
  }, [roomsData, user]);

  return (
    <AppLayout>
      <div className="space-y-10 pb-20">
        
        {/* OFFICIAL BANNER SECTION (1536x681 Aspect) */}
        <section className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 group">
          <Link href={activeBanner?.link || '#'}>
            <div className="relative aspect-[1536/681] w-full">
              <Image
                src={activeBanner?.imageUrl || "https://picsum.photos/seed/ummy-banner/1536/681"}
                alt="Official Ummy Event"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                data-ai-hint="vibrant party"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 md:bottom-12 md:left-12 space-y-4">
                 <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                    <Crown className="h-4 w-4" /> Official Event
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black font-headline text-white drop-shadow-lg">
                   {activeBanner?.title || 'Grand Opening:'} <br/><span className="text-primary">Ummy Music Fest</span>
                 </h2>
                 <p className="text-white/60 text-sm md:text-lg max-w-xl font-body">
                   Join 10,000+ users in the main stage. Send special gifts to win a unique entry wave!
                 </p>
              </div>
            </div>
          </Link>
        </section>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-headline text-4xl font-bold tracking-tight flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              Explore Rooms
            </h1>
            <p className="text-muted-foreground">Real-time voice communities. Join the vibe.</p>
          </div>
          <CreateRoomDialog />
        </header>

        {/* AI Recommendations Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-2xl font-semibold">Smart Connect</h2>
          </div>
          <Card className="border-primary/20 bg-primary/5 rounded-[2rem]">
            <CardContent className="p-8">
              <RecommendationsForm />
            </CardContent>
          </Card>
        </section>

        {/* My Rooms Section */}
        {myRooms.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
               <LayoutPanelTop className="h-5 w-5 text-primary" /> My Managed Rooms
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {myRooms.map((room: any) => (
                <ChatRoomCard key={room.id} room={{ ...room, slug: room.id, title: room.name, topic: room.description, coverUrl: room.coverUrl || `https://picsum.photos/seed/${room.id}/400/225`} as any} />
              ))}
            </div>
          </section>
        )}

        {/* Categorized Rooms Section */}
        <Tabs defaultValue="Popular" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="border-none h-14 bg-muted/30 p-1.5 rounded-full mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-10 rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-bold">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {roomsByCategory(category).map((room: any) => (
                      <ChatRoomCard key={room.id} room={{ ...room, slug: room.id, title: room.name, topic: room.description, coverUrl: room.coverUrl || `https://picsum.photos/seed/${room.id}/400/225`} as any} />
                    ))}
                  </div>
                  {roomsByCategory(category).length === 0 && (
                    <div className="py-24 text-center text-muted-foreground bg-muted/10 rounded-[3rem] border-2 border-dashed">
                      <p className="mb-4">No live rooms in this category. Be the leader!</p>
                      <CreateRoomDialog />
                    </div>
                  )}
                </TabsContent>
              ))
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}