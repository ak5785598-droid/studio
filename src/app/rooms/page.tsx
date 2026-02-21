'use client';

import { useMemo } from 'react';
import { ChatRoomCard } from '@/components/chat-room-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllRooms, getPkBattles } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { LifeBuoy, Loader, Compass, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/app-layout';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { RecommendationsForm } from '@/components/recommendations-form';
import { PkBattleCard } from '@/components/pk-battle-card';
import type { Room } from '@/lib/types';

export default function RoomsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Mock data setup
  const allMockRooms = getAllRooms();
  const pkBattles = getPkBattles();
  const officialHelpRoom = allMockRooms.find(
    (room) => room.slug === 'official-help-room'
  );
  const otherMockRooms = allMockRooms.filter(
    (room) => room.slug !== 'official-help-room'
  );

  // Real Firestore data for "My Rooms"
  const myRoomsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'chatRooms'),
      where('ownerId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: myRealRooms, isLoading: isLoadingMyRooms } = useCollection(myRoomsQuery);

  const categories = ['Popular', 'Game', 'Chat', 'Singing', 'Battle'];

  const roomsByCategory = (category: string) => {
    if (category === 'Popular') {
      return [...otherMockRooms]
        .sort((a, b) => b.participants.length - a.participants.length)
        .slice(0, 8);
    }
    return otherMockRooms.filter((room) => room.category === category);
  };

  const myRooms: Room[] = useMemo(() => {
    if (!myRealRooms) return [];
    
    const sorted = [...myRealRooms].sort((a: any, b: any) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

    return sorted.map((r: any) => ({
      id: r.id,
      slug: r.id,
      title: r.name,
      topic: r.description,
      category: r.category as any,
      coverUrl: `https://picsum.photos/seed/${r.id}/400/225`,
      participants: [],
      messages: [],
    }));
  }, [myRealRooms]);

  return (
    <AppLayout>
      <div className="space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              Explore Rooms
            </h1>
            <p className="text-muted-foreground">
              Find a room that matches your vibe or create your own.
            </p>
          </div>
          <CreateRoomDialog />
        </header>

        {/* AI Recommendations Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-2xl font-semibold">AI Recommendations</h2>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Find Your Tribe</CardTitle>
              <CardDescription>Tell us what you like, and our AI will suggest the perfect rooms for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationsForm />
            </CardContent>
          </Card>
        </section>

        {/* Live PK Battles Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-destructive" />
            <h2 className="font-headline text-2xl font-semibold">Live PK Battles</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pkBattles.map((battle) => (
              <PkBattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        </section>

        {/* My Rooms Section */}
        {(myRooms.length > 0 || isLoadingMyRooms) && (
          <section className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold">My Rooms</h2>
            {isLoadingMyRooms ? (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {myRooms.map((room) => (
                  <ChatRoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Help Room Section */}
        {officialHelpRoom && (
          <Card className="bg-secondary/50 border-none">
            <CardHeader>
              <CardTitle className="font-headline">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/rooms/${officialHelpRoom.slug}`}>
                <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{officialHelpRoom.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Get live support from our team.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Join Room</Button>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Categorized Rooms Section */}
        <Tabs defaultValue="Popular" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="border-none h-12 bg-muted/50 p-1 rounded-full mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-8 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roomsByCategory(category).map((room) => (
                  <ChatRoomCard key={room.id} room={room} />
                ))}
              </div>
              {roomsByCategory(category).length === 0 && (
                <div className="py-16 text-center text-muted-foreground bg-muted/20 rounded-xl">
                  <p>No rooms available in this category yet.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
