import { ChatRoomCard } from '@/components/chat-room-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllRooms } from '@/lib/mock-data';

export default function RoomsPage() {
  const allRooms = getAllRooms();

  const categories = ['Popular', 'Game', 'Chat', 'Singing', 'Battle'];

  const roomsByCategory = (category: string) => {
    if (category === 'Popular') {
        // Special case for popular, maybe based on participant count
        return [...allRooms].sort((a, b) => b.participants.length - a.participants.length).slice(0, 8);
    }
    return allRooms.filter((room) => room.category === category);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Explore Rooms
        </h1>
        <p className="text-muted-foreground">
          Find a room that matches your vibe.
        </p>
      </header>

      <Tabs defaultValue="Popular" className="w-full">
        <div className="overflow-x-auto">
            <TabsList className="border-none">
            {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-6">
                {category}
                </TabsTrigger>
            ))}
            </TabsList>
        </div>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {roomsByCategory(category).map((room) => (
                <ChatRoomCard key={room.id} room={room} />
              ))}
            </div>
            {roomsByCategory(category).length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No rooms available in this category yet.</p>
                </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
