'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Gift,
  Heart,
  ThumbsUp,
  PartyPopper,
  Crown,
  Cake,
} from 'lucide-react';
import { getRoomBySlug } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function RoomPage({ params }: { params: { slug: string } }) {
  const room = getRoomBySlug(params.slug);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    if (!room) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * room.participants.length);
      const randomParticipant = room.participants[randomIndex];
      setSpeakingId(randomParticipant.id);
      setTimeout(() => setSpeakingId(null), 1500);
    }, 3000);
    return () => clearInterval(interval);
  }, [room]);

  if (!room) {
    notFound();
  }

  const reactions = [
    { icon: Heart, label: 'Love' },
    { icon: ThumbsUp, label: 'Like' },
    { icon: PartyPopper, label: 'Celebrate' },
  ];
  const gifts = [
    { icon: Gift, label: 'Gift' },
    { icon: Cake, label: 'Cake' },
    { icon: Crown, label: 'Crown' },
  ];

  return (
    <div className="grid h-[calc(100vh-10rem)] md:h-full gap-4 lg:grid-cols-3 xl:grid-cols-4">
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
        <Card>
           <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-2xl">{room.title}</CardTitle>
              <Badge variant="secondary" className="mt-1">{room.topic}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline"><Mic className="h-5 w-5"/></Button>
              <Button size="icon" variant="outline"><Video className="h-5 w-5"/></Button>
              <Button size="icon" variant="destructive"><PhoneOff className="h-5 w-5"/></Button>
            </div>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4 h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {room.participants.map((p) => (
                <div key={p.id} className="relative flex flex-col items-center gap-2">
                  <Avatar className={cn(
                    "h-24 w-24 border-4 border-transparent transition-all",
                    speakingId === p.id && "border-primary shadow-lg"
                  )}>
                    <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-center">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-1 xl:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {room.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.user.avatarUrl} alt={msg.user.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">{msg.user.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <Separator />
        <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
                {reactions.map(r => (
                     <Button key={r.label} variant="outline" size="icon" className="h-9 w-9">
                        <r.icon className="h-5 w-5"/>
                     </Button>
                ))}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Gift className="h-5 w-5 text-primary"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex gap-2">
                        {gifts.map(g => (
                            <Button key={g.label} variant="ghost" size="icon">
                                <g.icon className="h-6 w-6"/>
                            </Button>
                        ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <form className="flex items-center gap-2">
              <Input placeholder="Send a message..." />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
        </div>
      </Card>
    </div>
  );
}
