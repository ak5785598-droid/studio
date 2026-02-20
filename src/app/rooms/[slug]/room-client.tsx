'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
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
  Swords,
  Lock,
  UserPlus,
  ShieldX,
  VolumeX,
  Star,
  Gem,
  Car,
  Plane,
  Castle,
  HeartHandshake,
  HeartPulse,
  Ship,
  IceCream,
  Pizza,
  Gamepad2,
  Trophy,
  Rocket,
  Diamond,
  Watch,
  Palette,
  Music,
  Camera,
  Film,
  Sparkles,
  Sun,
  Moon,
  Cat,
  Lollipop,
  Cake,
  Feather,
  Mic2,
  Banana,
  Leaf,
  Droplet,
  Cloud,
  Flower,
  Anchor,
  Laptop,
  Briefcase,
  Bike,
  Bus,
  Train,
  ShoppingBag,
  GraduationCap,
  Guitar,
  Paintbrush,
  Clover,
  Dog,
  Umbrella,
  Brain,
  Building,
  Home,
  Globe,
  Loader,
} from 'lucide-react';
import type { Room, User as RoomUser } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase';

export function RoomClient({ room }: { room: Room }) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [isPkBattle, setIsPkBattle] = useState(false);
  const [pkProgress1, setPkProgress1] = useState(50);
  const [pkProgress2, setPkProgress2] = useState(50);
  const { user: currentUser } = useUser();
  
  const [pkContestant1, setPkContestant1] = useState<RoomUser | null>(null);
  const [pkContestant2, setPkContestant2] = useState<RoomUser | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setHasCameraPermission(true);
        setHasMicPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        setHasMicPermission(false);
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (!room || room.participants.length < 2) return;
    
    setPkContestant1(room.participants[0]);
    setPkContestant2(room.participants[1]);

    const interval = setInterval(() => {
      if (room.participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * room.participants.length);
        const randomParticipant = room.participants[randomIndex];
        setSpeakingId(randomParticipant.id);
        setTimeout(() => setSpeakingId(null), 1500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    if (isPkBattle) {
      setPkProgress1(30 + Math.random() * 40);
      setPkProgress2(30 + Math.random() * 40);
      const battleInterval = setInterval(() => {
        setPkProgress1(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
        setPkProgress2(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      }, 2000);
      return () => clearInterval(battleInterval);
    }
  }, [isPkBattle]);

  const toggleMic = () => setIsMicOn(prev => !prev);
  const toggleCamera = () => setIsCameraOn(prev => !prev);

  if (!room || !currentUser) return null;

  const reactions = [
    { icon: Heart, label: 'Love' },
    { icon: ThumbsUp, label: 'Like' },
    { icon: PartyPopper, label: 'Celebrate' },
  ];

  const gifts = {
    common: [
      { icon: Gift, name: 'Gift Box', cost: 10 },
      { icon: Star, name: 'Star', cost: 20 },
      { icon: Lollipop, name: 'Lollipop', cost: 15 },
      { icon: Flower, name: 'Flower', cost: 15 },
    ],
    premium: [
      { icon: Trophy, name: 'Trophy', cost: 250 },
      { icon: Crown, name: 'Crown', cost: 500 },
      { icon: Rocket, name: 'Rocket', cost: 750 },
      { icon: Gem, name: 'Gem', cost: 1000 },
    ],
    couple: [
      { icon: HeartPulse, name: 'Heartbeat', cost: 520 },
      { icon: Sparkles, name: 'Magic', cost: 1314 },
      { icon: HeartHandshake, name: 'Promise', cost: 8888 },
      { icon: Castle, name: 'Castle', cost: 50000 },
    ],
  };

  const otherParticipants = room.participants.filter(p => p.id !== currentUser.uid);

  return (
    <div className="grid h-[calc(100vh-10rem)] md:h-full gap-4 lg:grid-cols-3 xl:grid-cols-4">
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-2xl">{room.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{room.topic}</Badge>
                <Badge variant="outline">Online: {room.participants.length || 1}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => setIsPkBattle(p => !p)}>
                <Swords className="h-5 w-5 text-destructive" />
              </Button>
              <Button size="icon" variant={isMicOn ? "outline" : "secondary"} onClick={toggleMic} disabled={!hasMicPermission}>
                {isMicOn ? <Mic className="h-5 w-5"/> : <MicOff className="h-5 w-5"/>}
              </Button>
              <Button size="icon" variant={isCameraOn ? "outline" : "secondary"} onClick={toggleCamera} disabled={!hasCameraPermission}>
                {isCameraOn ? <Video className="h-5 w-5"/> : <VideoOff className="h-5 w-5"/>}
              </Button>
              <Button size="icon" variant="destructive" asChild>
                <a href="/rooms"><PhoneOff className="h-5 w-5"/></a>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {isPkBattle && pkContestant1 && pkContestant2 ? (
          <Card className="flex-1">
            <CardContent className="p-4 h-full flex flex-col items-center justify-center gap-8 relative">
              <Swords className="h-16 w-16 text-destructive absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-[-15deg] opacity-20" />
              <div className="flex w-full items-center justify-around z-10">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-32 w-32 border-4 border-blue-500 shadow-xl">
                    <AvatarImage src={pkContestant1.avatarUrl} alt={pkContestant1.name} />
                    <AvatarFallback>{pkContestant1.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-lg">{pkContestant1.name}</span>
                </div>
                <div className="font-headline text-5xl font-black text-muted-foreground/30 italic">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-32 w-32 border-4 border-red-500 shadow-xl">
                    <AvatarImage src={pkContestant2.avatarUrl} alt={pkContestant2.name} />
                    <AvatarFallback>{pkContestant2.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-lg">{pkContestant2.name}</span>
                </div>
              </div>
              <div className="w-full max-w-xl space-y-2">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-blue-500">{(pkProgress1 * 100).toFixed(0)}</span>
                  <span className="text-red-500">{(pkProgress2 * 100).toFixed(0)}</span>
                </div>
                <div className="flex w-full items-center gap-1">
                  <Progress value={pkProgress1} className="h-4 [&>div]:bg-blue-500" />
                  <Progress value={pkProgress2} className="h-4 [&>div]:bg-red-500 transform -scale-x-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1">
            <CardContent className="p-4 h-full">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* Your own video feed */}
                  <div className="relative aspect-square flex flex-col items-center justify-center gap-2 bg-muted rounded-md overflow-hidden ring-2 ring-primary">
                    <video ref={videoRef} className={cn("w-full h-full object-cover", (isCameraOn && hasCameraPermission) ? "block" : "hidden")} autoPlay muted />
                    {(!isCameraOn || !hasCameraPermission) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-secondary/50">
                        <VideoOff className="h-10 w-10"/>
                        <span className="text-xs">{ !hasCameraPermission ? "Camera Disabled" : "Camera Off" }</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 p-1 bg-black/60 rounded text-center backdrop-blur-sm">
                      <span className="font-semibold text-white text-xs truncate block">{currentUser.displayName} (Me)</span>
                    </div>
                  </div>

                  {/* Other participants (Mock or placeholder) */}
                  {otherParticipants.length > 0 ? (
                    otherParticipants.map((p) => (
                      <div key={p.id} className="relative aspect-square flex flex-col items-center justify-center gap-2 bg-secondary/20 rounded-md">
                        <Avatar className={cn(
                          "h-20 w-20 border-4 border-transparent transition-all",
                          speakingId === p.id && "border-primary shadow-lg scale-105"
                        )}>
                          <AvatarImage src={p.avatarUrl} alt={p.name} />
                          <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-center text-xs truncate w-full px-2">{p.name}</span>
                        {speakingId === p.id && (
                          <div className="absolute top-2 right-2 flex gap-0.5 h-3">
                            <div className="w-1 bg-primary animate-bounce h-full" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 bg-primary animate-bounce h-2/3" style={{ animationDelay: '100ms' }} />
                            <div className="w-1 bg-primary animate-bounce h-full" style={{ animationDelay: '200ms' }} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    // Empty seats
                    Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="aspect-square border-2 border-dashed border-muted flex items-center justify-center rounded-md text-muted-foreground/30">
                        <UserPlus className="h-8 w-8" />
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="lg:col-span-1 xl:col-span-1 flex flex-col">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="font-headline text-lg">Room Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 pt-4">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {room.messages.length > 0 ? (
                room.messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={msg.user.avatarUrl} alt={msg.user.name} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xs">{msg.user.name}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs bg-muted/30 p-2 rounded-md mt-1">{msg.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs italic">
                  Be the first to say hi!
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <Separator />
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            {reactions.map(r => (
              <Button key={r.label} variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 transition-transform">
                <r.icon className="h-4 w-4"/>
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10 ml-auto">
                  <Gift className="h-4 w-4"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Tabs defaultValue="common">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="common">Common</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                    <TabsTrigger value="couple">Couple</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-64">
                    <TabsContent value="common" className="p-2 grid grid-cols-4 gap-2">
                      {gifts.common.map((g) => (
                        <div key={g.name} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-secondary cursor-pointer">
                          <g.icon className="h-8 w-8 text-primary" />
                          <span className="text-[10px] text-center truncate w-full">{g.name}</span>
                          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Gem className="h-2 w-2" />
                            <span>{g.cost}</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    {/* Add Premium and Couple tabs content similarly if needed */}
                  </ScrollArea>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>
          <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Type a message..." className="h-9 text-xs" />
            <Button type="submit" size="icon" className="h-9 w-9">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
