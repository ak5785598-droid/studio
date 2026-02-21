
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Lock,
  Unlock,
  Sparkles,
  Loader,
  MoreVertical,
  UserX,
  Trash2,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Smile,
  Gift,
  Info,
  Armchair,
  MessageSquare,
} from 'lucide-react';
import type { Room, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, writeBatch, doc } from 'firebase/firestore';

export function RoomClient({ room }: { room: Room }) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lockedSeats, setLockedSeats] = useState<number[]>([]);
  const [mutedSeats, setMutedSeats] = useState<number[]>([]);
  const [kickedUserIds, setKickedUserIds] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  // Role Detection
  const isOwner = useMemo(() => {
    return currentUser?.uid === room.ownerId || room.slug === 'mumbai-adda';
  }, [currentUser, room]);

  const isAdmin = useMemo(() => {
    return room.moderatorIds?.includes(currentUser?.uid || '') || isOwner;
  }, [currentUser, room, isOwner]);

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

  const activeMessages: Message[] = useMemo(() => {
    return firestoreMessages?.map((m: any) => ({
      id: m.id,
      text: m.content,
      timestamp: m.timestamp?.toDate() ? new Date(m.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      user: {
        id: m.senderId,
        name: m.senderName || 'User',
        avatarUrl: m.senderAvatar || '',
      }
    })) || [];
  }, [firestoreMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [activeMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser || !firestore || isSending) return;
    setIsSending(true);
    
    try {
      await addDoc(collection(firestore, 'chatRooms', room.id, 'messages'), {
        content: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        senderAvatar: currentUser.photoURL || '',
        chatRoomId: room.id, 
        timestamp: serverTimestamp(),
      });
      setMessageText('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!firestore || !room.id || isClearing || !isOwner) return;
    setIsClearing(true);
    try {
      const msgsSnapshot = await getDocs(collection(firestore, 'chatRooms', room.id, 'messages'));
      const batch = writeBatch(firestore);
      msgsSnapshot.forEach((m) => {
        batch.delete(m.ref);
      });
      await batch.commit();
      toast({ title: 'Chat Cleared', description: 'History deleted permanently for everyone.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Failed', description: 'Only owner can clear chat.' });
    } finally {
      setIsClearing(false);
    }
  };

  const toggleSeatLock = (index: number) => {
    if (!isAdmin) return;
    setLockedSeats(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    toast({ title: lockedSeats.includes(index) ? 'Seat Unlocked' : 'Seat Locked' });
  };

  if (isUserLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;

  const totalSeats = 10;
  const otherParticipants = (room.participants || []).filter(p => !kickedUserIds.includes(p.id) && p.id !== currentUser?.uid);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden text-white font-sans">
      
      {/* Header Section */}
      <header className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
           <Avatar className="h-12 w-12 border-2 border-primary shadow-[0_0_10px_rgba(255,127,80,0.5)]">
             <AvatarImage src={`https://picsum.photos/seed/${room.ownerId}/200`} />
             <AvatarFallback>H</AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <h1 className="font-bold text-lg leading-none">{room.title}</h1>
             <div className="flex items-center gap-2 mt-1">
               <Badge className="bg-primary/20 text-primary text-[10px] py-0 px-2 h-4 border-primary/30">Host</Badge>
               <span className="text-[10px] text-white/60">ID: {room.id.substring(0, 8)}</span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1a1a2e] border-white/10 text-white">
                <DropdownMenuLabel>Room Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {isOwner && (
                  <DropdownMenuItem onClick={handleClearChat} className="text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Chat History
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="focus:bg-white/10">
                   <Info className="mr-2 h-4 w-4" /> Edit Topic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button size="icon" variant="destructive" asChild className="rounded-full h-10 w-10 shadow-lg shadow-red-500/30">
            <a href="/rooms"><PhoneOff className="h-5 w-5"/></a>
          </Button>
        </div>
      </header>

      {/* Announcements Section */}
      <div className="px-4 py-2 shrink-0">
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 text-[11px]">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span className="text-white/80 italic">{room.announcement || "Welcome to the room! Be kind and have fun."}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Seats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-4">
          {/* Seat 1 (Always User/Host) */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 animate-pulse"></div>
              <Avatar className="h-20 w-20 border-2 border-primary/50 relative">
                <AvatarImage src={currentUser?.photoURL || ''} />
                <AvatarFallback>{currentUser?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-[8px] font-bold px-1.5 rounded-full border border-black uppercase">No.1</div>
            </div>
            <span className="text-xs font-bold truncate max-w-[80px]">{currentUser?.displayName}</span>
          </div>

          {/* Dynamic Seats No.2 to No.10 */}
          {Array.from({ length: 9 }).map((_, i) => {
            const seatIndex = i + 2;
            const participant = otherParticipants[i];
            const isLocked = lockedSeats.includes(seatIndex);
            const isMuted = mutedSeats.includes(seatIndex);

            return (
              <div key={seatIndex} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 relative",
                    isLocked ? "bg-black/40 border border-white/5" : "bg-white/5 border border-white/10",
                    participant && !isLocked && "ring-2 ring-primary/50 shadow-[0_0_15px_rgba(255,127,80,0.2)]"
                  )}>
                    {isLocked ? (
                      <Lock className="h-8 w-8 text-white/20" />
                    ) : participant ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-40">
                        <Armchair className="h-8 w-8 text-white" />
                        <span className="text-[10px] font-bold">JOIN</span>
                      </div>
                    )}
                    
                    <div className="absolute -bottom-1 -right-1 bg-black/60 text-[8px] font-bold px-1.5 rounded-full border border-white/10 uppercase">
                      No.{seatIndex}
                    </div>

                    {isAdmin && (
                      <div className="absolute -top-1 -right-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-black/50 hover:bg-primary/20 border border-white/10">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1a1a2e] border-white/10 text-white w-48">
                            <DropdownMenuLabel>Seat {seatIndex} Admin</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => toggleSeatLock(seatIndex)} className="focus:bg-white/10">
                              {isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                              {isLocked ? 'Unlock Seat' : 'Lock Seat'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: 'Invite Sent' })} className="focus:bg-white/10">
                              <UserPlus className="mr-2 h-4 w-4" /> Invite
                            </DropdownMenuItem>
                            {participant && (
                              <>
                                <DropdownMenuItem onClick={() => setMutedSeats(prev => isMuted ? prev.filter(s => s !== seatIndex) : [...prev, seatIndex])} className="focus:bg-white/10">
                                  {isMuted ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
                                  {isMuted ? 'Unmute' : 'Mute'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setKickedUserIds(prev => [...prev, participant.id]);
                                  toast({ variant: 'destructive', title: 'User Kicked' });
                                }} className="text-destructive focus:bg-destructive/10">
                                  <UserX className="mr-2 h-4 w-4" /> Kick Out
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold truncate max-w-[80px]">
                  {isLocked ? "Locked" : participant ? participant.name : "Available"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Chat Panel */}
        <div className="mt-8 mb-20">
          <div className="flex items-center gap-2 mb-4 px-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold tracking-wider uppercase opacity-60">Live Conversation</h3>
          </div>
          <div className="space-y-4 px-2">
            {activeMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
                <Avatar className="h-8 w-8 flex-shrink-0 border border-white/10">
                  <AvatarImage src={msg.user.avatarUrl} alt={msg.user.name} />
                  <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-xs text-primary/90">{msg.user.name}</span>
                    <span className="text-[9px] text-white/30">{msg.timestamp}</span>
                  </div>
                  <div className="mt-1 bg-white/5 p-2.5 rounded-2xl rounded-tl-none border border-white/5 text-xs text-white/90 shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Navigation Bar */}
      <footer className="shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 pb-8 md:pb-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <form className="flex-1 flex gap-2" onSubmit={handleSendMessage}>
            <div className="relative flex-1">
              <Input 
                placeholder="Say something nice..." 
                className="bg-white/10 border-white/10 rounded-full h-11 px-5 focus:ring-primary/50 text-sm"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              type="submit" 
              className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              disabled={isSending || !messageText.trim()}
            >
              {isSending ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={isMicOn ? "default" : "secondary"} 
              size="icon" 
              onClick={() => setIsMicOn(!isMicOn)}
              className={cn(
                "rounded-full h-11 w-11 shadow-lg transition-all active:scale-95",
                isMicOn ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "bg-white/10 hover:bg-white/20"
              )}
            >
              {isMicOn ? <Mic className="h-5 w-5"/> : <MicOff className="h-5 w-5"/>}
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full h-11 w-11 bg-white/10 hover:bg-white/20 shadow-lg active:scale-95"
            >
              <Gift className="h-5 w-5 text-accent" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

