'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Mic, MicOff, Send, LogOut, Power, Minimize2, Smile, Zap, Gift as GiftIcon, Users, ChevronDown, ChevronLeft } from 'lucide-react';
import { GoldCoinIcon, GameControllerIcon } from '@/components/icons';
import type { Room, RoomParticipant, Gift } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { collection, serverTimestamp, query, orderBy, limitToLast, doc, increment } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useRoomContext } from '@/components/room-provider';
import { useWebRTC } from '@/hooks/use-webrtc';
import { cn } from '@/lib/utils';

export function RoomClient({ room }: { room: Room }) {
  const [messageText, setMessageText] = useState('');
  const [isExitPortalOpen, setIsExitPortalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { setActiveRoom, setIsMinimized } = useRoomContext();

  const participantsQuery = useMemoFirebase(() => {
    if (!firestore || !room.id) return null;
    return query(collection(firestore, 'chatRooms', room.id, 'participants'));
  }, [firestore, room.id]);

  const { data: participants } = useCollection<RoomParticipant>(participantsQuery);
  const currentUserParticipant = participants?.find(p => p.uid === currentUser?.uid);
  const isInSeat = !!currentUserParticipant && currentUserParticipant.seatIndex > 0;
  
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !room.id) return null;
    return query(collection(firestore, 'chatRooms', room.id, 'messages'), orderBy('timestamp', 'asc'), limitToLast(50));
  }, [firestore, room.id]);

  const { data: firestoreMessages } = useCollection(messagesQuery);
  
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [firestoreMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser || !firestore) return;
    addDocumentNonBlocking(collection(firestore, 'chatRooms', room.id, 'messages'), {
      content: messageText, senderId: currentUser.uid, senderName: userProfile?.username || 'User', timestamp: serverTimestamp(), type: 'text'
    });
    setMessageText('');
  };

  const handleMicToggle = () => { 
    if (!isInSeat || !firestore || !currentUser || !room.id) return;
    updateDocumentNonBlocking(doc(firestore, 'chatRooms', room.id, 'participants', currentUser.uid), { isMuted: !currentUserParticipant?.isMuted }); 
  };

  return (
    <div className="relative flex flex-col h-full bg-black overflow-hidden text-white font-headline rounded-[2.5rem]">
      <div className="absolute inset-0 z-0">
        <Image src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=2000" alt="BG" fill className="object-cover opacity-40" />
      </div>

      <header className="relative z-50 flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-xl border-2 border-white/20">
            <AvatarImage src={room.coverUrl} />
            <AvatarFallback>UM</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-black text-sm uppercase tracking-tighter">{room.title}</h1>
            <p className="text-[8px] font-bold text-white/40 uppercase">ID:{room.roomNumber}</p>
          </div>
        </div>
        <button onClick={() => setIsExitPortalOpen(true)} className="p-2 bg-white/10 rounded-full"><Power className="h-4 w-4" /></button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col overflow-hidden pt-4 px-4">
        <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-4">
           {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <Users className="h-6 w-6 text-white/10" />
                </div>
                <span className="text-[8px] font-black uppercase text-white/40">Seat {i+1}</span>
             </div>
           ))}
        </div>
        <ScrollArea className="flex-1 mt-auto h-48" ref={scrollRef}>
           <div className="space-y-1">
              {firestoreMessages?.map((msg: any) => (
                <div key={msg.id} className="bg-black/20 p-1.5 rounded-lg border border-white/5 text-[10px]">
                   <span className="font-black text-blue-400 mr-2 uppercase">{msg.senderName}:</span>
                   <span className="text-white/80">{msg.content}</span>
                </div>
              ))}
           </div>
        </ScrollArea>
      </main>

      <footer className="relative z-50 px-4 pb-10 flex items-center justify-between gap-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-4">
        <button onClick={handleMicToggle} className={cn("p-3 rounded-full transition-all", isInSeat && !currentUserParticipant?.isMuted ? "bg-green-500" : "bg-white/10")}>{isInSeat && !currentUserParticipant?.isMuted ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}</button>
        <form className="flex-1 bg-white/10 rounded-full h-12 px-4 flex items-center" onSubmit={handleSendMessage}><Input placeholder="Say Hi" className="bg-transparent border-none text-xs font-black uppercase placeholder:text-white/40 focus-visible:ring-0" value={messageText} onChange={(e) => setMessageText(e.target.value)} /></form>
        <div className="flex items-center gap-2">
          <button className="bg-white/10 p-3 rounded-full"><Smile className="h-5 w-5" /></button>
          <button className="bg-gradient-to-br from-pink-400 to-indigo-600 p-3 rounded-full shadow-lg"><GiftIcon className="h-5 w-5 text-white" /></button>
        </div>
      </footer>

      <Dialog open={isExitPortalOpen} onOpenChange={setIsExitPortalOpen}>
        <DialogContent className="sm:max-w-md bg-black/90 text-white border-none rounded-t-[3rem]">
          <DialogHeader><DialogTitle className="text-center font-black uppercase">Exit Frequency?</DialogTitle></DialogHeader>
          <div className="p-8 flex justify-around">
            <button onClick={() => { setIsMinimized(true); router.push('/rooms'); }} className="flex flex-col items-center gap-2"><div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-black"><Minimize2 /></div><span className="text-[10px] font-black uppercase">Minimize</span></button>
            <button onClick={() => { setActiveRoom(null); router.push('/rooms'); }} className="flex flex-col items-center gap-2"><div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-red-500"><LogOut /></div><span className="text-[10px] font-black uppercase">Exit</span></button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}