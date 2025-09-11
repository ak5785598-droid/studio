import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import type { Room } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatRoomCardProps {
  room: Room;
}

export function ChatRoomCard({ room }: ChatRoomCardProps) {
  return (
    <Link href={`/rooms/${room.slug}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={room.coverUrl}
              alt={room.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="abstract vibrant"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg truncate">{room.title}</CardTitle>
          <Badge variant="outline" className="mt-2 font-normal">
            {room.topic}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{room.participants.length} online</span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
