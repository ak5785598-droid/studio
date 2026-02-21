
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Gift,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Gem,
  Star,
  Trophy,
  Crown,
  Rocket,
  Sparkles,
  Loader,
  MoreVertical,
  ShieldAlert,
  UserX,
  Trash2,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import type { Room, Message, User as RoomUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, doc, writeBatch } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function RoomClient({ room }: { room: Room }) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lockedSeats, setLockedSeats] = useState<number[]>([]);
  const [mutedSeats, setMutedSeats] = useState<number[]>([]);
  const [activeParticipants, setActiveParticipants] = useState<RoomUser[]>(room.participants || []);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const isOwner = currentUser?.uid === room.ownerId || room.slug === 'mumbai-adda';
  const isAdmin = room.moderatorIds?.includes(currentUser?.uid || '') || isOwner;

  // Real-time Chat Logic
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !room.id) return null;
    return query(
      collection(firestore, 'chatRooms', room.id, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
  }, [firestore, room.id]);

  const { data: firestoreMessages } = useCollection(messagesQuery);

  const activeMessages: Message[] = firestoreMessages?.map((m: any) => ({
    id: m.id,
    text: m.content,
    timestamp: m.timestamp?.toDate() ? new Date(m.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    user: {
      id: m.senderId,
      name: m.senderName || 'User',
      avatarUrl: m.senderAvatar || '',
    }
  })) || [];

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [activeMessages]);

  // WebRTC & Audio Logic
  const startAudioEngine = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true, 
          autoGainControl: true 
        }, 
        video: isCameraOn 
      });
      
      setMicPermissionStatus('granted');
      if (videoRef.current) videoRef.current.srcObject = stream;

      // Audio Metering for "Is Speaking" visual feedback
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
      }

      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < bufferLength; i++) values += dataArray[i];
        const average = values / bufferLength;
        setIsSpeaking(average > 15);
        requestAnimationFrame(checkVolume);
      };
      checkVolume();

    } catch (error) {
      console.error('Mic access denied:', error);
      setMicPermissionStatus('denied');
      setIsMicOn(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Required',
        description: 'Please enable microphone access in your Android settings to join the voice chat.',
      });
    }
  }, [isCameraOn, toast]);

  useEffect(() => {
    if (isMicOn || isCameraOn) {
      startAudioEngine();
    }
  }, [isMicOn, isCameraOn, startAudioEngine]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser || !firestore || isSending) return;
    setIsSending(true);
    
    const payload = {
      content: messageText,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderAvatar: currentUser.photoURL || '',
      chatRoomId: room.id, 
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, 'chatRooms', room.id, 'messages'), payload);
      setMessageText('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Send Error', description: 'Failed to send message.' });
    } finally {
      setIsSending(false);
    }
  };

  const toggleSeatLock = (index: number) => {
    const isCurrentlyLocked = lockedSeats.includes(index);
    setLockedSeats(prev => isCurrentlyLocked ? prev.filter(i => i !== index) : [...prev, index]);
    toast({ title: isCurrentlyLocked ? 'Seat Unlocked' : 'Seat Locked' });
  };

  const handleKickout = (id: string, name: string) => {
    setActiveParticipants(prev => prev.filter(p => p.id !== id));
    toast({ variant: 'destructive', title: 'User Kicked Out', description: `${name} is now invisible.` });
  };

  const handleClearChat = async () => {
    if (!firestore || !room.id || isClearing || !isOwner) return;
    setIsClearing(true);
    try {
      const batch = writeBatch(firestore);
      firestoreMessages?.forEach((msg) => {
        batch.delete(doc(firestore, 'chatRooms', room.id, 'messages', msg.id));
      });
      await batch.commit();
      toast({ title: 'Chat Cleared Permanently' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Clear Error', description: 'Action denied.' });
    } finally {
      setIsClearing(false);
    }
  };

  if (isUserLoading) return <div className="flex h-screen items-center justify-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!currentUser) return null;

  const totalSeats = 10;
  const otherParticipantsToDisplay = activeParticipants.filter(p => p.id !== currentUser.uid);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-full gap-4 overflow-hidden max-w-7xl mx-auto">
      {micPermissionStatus === 'denied' && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mic Access Denied</AlertTitle>
          <AlertDescription>
            You cannot talk in this room. Please update permissions in your browser or Android app settings.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid h-full gap-4 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-4">
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4 overflow-hidden">
          {/* Header Section */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden shadow-none border-none shrink-0">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
              <div className="flex-1 min-w-0 pr-2">
                <CardTitle className="font-headline text-xl sm:text-2xl truncate">{room.title}</CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{room.topic}</Badge>
                  {isOwner && <Badge className="bg-primary/80 text-[10px] sm:text-xs">Owner</Badge>}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Button 
                  size="icon" 
                  variant={isMicOn ? "default" : "secondary"} 
                  onClick={() => {
                    setIsMicOn(!isMicOn);
                    if (!isMicOn) startAudioEngine();
                  }} 
                  className={cn("rounded-full h-9 w-9 sm:h-10 sm:w-10", isMicOn && isSpeaking && "ring-2 ring-primary animate-pulse")}
                >
                  {isMicOn ? <Mic className="h-5 w-5"/> : <MicOff className="h-5 w-5"/>}
                </Button>
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isOwner && (
                        <DropdownMenuItem onClick={handleClearChat} className="text-destructive font-bold">
                          {isClearing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Permanently Clear Chat
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => toast({ title: 'Invites Sent' })}>
                        <UserPlus className="mr-2 h-4 w-4" /> Broadcast Invite
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <Button size="icon" variant="destructive" asChild className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                  <a href="/rooms"><PhoneOff className="h-5 w-5"/></a>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Seat Grid */}
          <Card className="flex-1 overflow-hidden border-none shadow-none bg-secondary/5">
            <CardContent className="p-2 sm:p-4 h-full">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-4">
                  {/* My Seat */}
                  <div className={cn(
                    "relative aspect-square flex flex-col items-center justify-center gap-2 bg-muted rounded-2xl overflow-hidden transition-all",
                    isMicOn && isSpeaking ? "ring-4 ring-primary shadow-lg scale-[1.02]" : "ring-1 ring-border"
                  )}>
                    <video ref={videoRef} className={cn("w-full h-full object-cover", isCameraOn ? "block" : "hidden")} autoPlay muted playsInline />
                    {!isCameraOn && (
                      <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                        <AvatarImage src={currentUser.photoURL || ''} />
                        <AvatarFallback>{currentUser.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute bottom-1.5 inset-x-1.5 p-1 bg-black/60 rounded-lg text-center backdrop-blur-sm">
                      <span className="font-bold text-white text-[9px] sm:text-[10px] truncate block uppercase">{currentUser.displayName} (Me)</span>
                    </div>
                  </div>

                  {/* Other Seats */}
                  {Array.from({ length: totalSeats - 1 }).map((_, i) => {
                    const participant = otherParticipantsToDisplay[i];
                    const seatIndex = i + 2;
                    const isLocked = lockedSeats.includes(seatIndex);
                    const isMuted = mutedSeats.includes(seatIndex);

                    return (
                      <div key={seatIndex} className={cn(
                        "relative aspect-square flex flex-col items-center justify-center gap-2 border rounded-2xl transition-all overflow-hidden",
                        isLocked ? "bg-slate-200 border-dashed" : "bg-card shadow-sm"
                      )}>
                        {isLocked ? (
                          <div className="flex flex-col items-center opacity-60">
                             <Lock className="h-6 w-6 text-slate-500" />
                             <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">Closed</span>
                          </div>
                        ) : participant ? (
                          <>
                            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border border-primary/10">
                              <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-center text-[9px] sm:text-[10px] truncate w-full px-2 uppercase">{participant.name}</span>
                            {isMuted && (
                              <div className="absolute top-1.5 left-1.5 bg-red-500/80 p-1 rounded-md">
                                <MicOff className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center opacity-30">
                            <Unlock className="h-5 w-5 text-muted-foreground" />
                            <span className="text-[8px] font-bold uppercase mt-1">Empty</span>
                          </div>
                        )}

                        {isAdmin && (
                          <div className="absolute top-1.5 right-1.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full bg-white/90 shadow-sm border border-primary/20">
                                  <MoreVertical className="h-4 w-4 text-primary" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel>Seat {seatIndex}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => toggleSeatLock(seatIndex)}>
                                  {isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                                  {isLocked ? 'Unlock Seat' : 'Lock Seat'}
                                </DropdownMenuItem>
                                {participant && (
                                  <>
                                    <DropdownMenuItem onClick={() => {
                                      const isMuted = mutedSeats.includes(seatIndex);
                                      setMutedSeats(prev => isMuted ? prev.filter(i => i !== seatIndex) : [...prev, seatIndex]);
                                    }}>
                                      {isMuted ? <Mic className="mr-2 h-4 w-4 text-green-500" /> : <MicOff className="mr-2 h-4 w-4 text-orange-500" />}
                                      {isMuted ? 'Unmute' : 'Mute'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleKickout(participant.id, participant.name)} className="text-destructive font-bold">
                                      <UserX className="mr-2 h-4 w-4" /> Kick & Hide
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <Card className="lg:col-span-1 xl:col-span-1 flex flex-col h-full shadow-lg border-none overflow-hidden shrink-0">
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-secondary/10 shrink-0">
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Live Chat
            </CardTitle>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 animate-pulse">LIVE</Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-3">
            <ScrollArea className="h-full pr-2" ref={scrollRef}>
              <div className="space-y-3">
                {activeMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2 animate-in slide-in-from-bottom-1 duration-300">
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarImage src={msg.user.avatarUrl} alt={msg.user.name} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-[10px] truncate">{msg.user.name}</span>
                        <span className="text-[8px] text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-[11px] sm:text-xs bg-muted p-2 rounded-xl rounded-tl-none mt-0.5 shadow-sm break-words inline-block">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-3 space-y-3 bg-secondary/10 shrink-0">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 text-primary rounded-xl bg-background shadow-sm">
                    <Gift className="h-4 w-4"/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-2 shadow-xl border-primary/10">
                   <div className="grid grid-cols-4 gap-2">
                      {['🎁', '⭐', '🏆', '👑', '🚀', '💎', '🔥', '❤️'].map(emoji => (
                         <button 
                          key={emoji} 
                          className="text-xl p-2 hover:bg-secondary rounded-lg transition-all"
                          onClick={() => setMessageText(prev => prev + emoji)}
                         >
                           {emoji}
                         </button>
                      ))}
                   </div>
                </PopoverContent>
              </Popover>
              <div className="flex-1 flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                 {['👋', '😂', '💯', '✨', '🔥'].map(emoji => (
                    <button key={emoji} className="text-lg active:scale-125 transition-transform" onClick={() => setMessageText(prev => prev + emoji)}>
                      {emoji}
                    </button>
                 ))}
              </div>
            </div>
            <form className="flex items-center gap-1.5" onSubmit={handleSendMessage}>
              <Input 
                placeholder="Chat here..." 
                className="h-10 text-xs sm:text-sm rounded-xl border-primary/10 bg-background" 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending}
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl bg-primary shrink-0 shadow-sm" disabled={isSending || !messageText.trim()}>
                {isSending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
