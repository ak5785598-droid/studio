'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useRoomContext } from '@/components/room-provider';
import { useUser, useFirestore, useUserProfile, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { 
  ChevronLeft, 
  Mic, 
  MicOff, 
  Users, 
  Trophy, 
  Gamepad2, 
  Loader,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Maximize2,
  Plus,
  Star,
  Settings,
  CircleSlash
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * High-Fidelity Ludo Quick Page.
 * Architecturally identical to user reference image.
 * No betting logic as requested.
 */
export default function LudoGamePage() {
  const router = useRouter();
  const { activeRoom } = useRoomContext();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const [isLaunching, setIsLaunching] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleMic = () => {
    if (!firestore || !activeRoom?.id || !currentUser) return;
    updateDocumentNonBlocking(
      doc(firestore, 'chatRooms', activeRoom.id, 'participants', currentUser.uid),
      { isMuted: !isMuted }
    );
    setIsMuted(!isMuted);
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#0a1a4a] flex flex-col items-center justify-center space-y-6 font-headline">
        <div className="relative">
           <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
           <Gamepad2 className="h-20 w-20 text-yellow-500 relative z-10 animate-bounce" />
        </div>
        <div className="text-center space-y-2">
           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Ludo Quick</h1>
           <p className="text-muted-foreground text-xs font-black uppercase tracking-widest animate-pulse">Syncing Tribe Board...</p>
        </div>
      </div>
    );
  }

  const SafetySpot = ({ type, color }: { type: 'star' | 'slash', color?: string }) => (
    <div className="flex items-center justify-center w-full h-full relative">
       {type === 'star' ? (
         <Star className={cn("h-5 w-5 fill-current", color || "text-green-800/40")} />
       ) : (
         <div className="h-5 w-5 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-px h-full bg-white/40 rotate-45" />
         </div>
       )}
    </div>
  );

  const Bridge = ({ orientation }: { orientation: 'h' | 'v' }) => (
    <div className={cn(
      "bg-[#f0ad4e] border-2 border-[#8b4513] rounded-sm shadow-md flex items-center justify-center gap-0.5 z-20",
      orientation === 'h' ? "w-10 h-6 flex-col" : "w-6 h-10"
    )}>
       {Array.from({ length: 3 }).map((_, i) => (
         <div key={i} className={cn("bg-[#8b4513]/30", orientation === 'h' ? "h-[1px] w-full" : "w-[1px] h-full")} />
       ))}
    </div>
  );

  return (
    <AppLayout fullScreen>
      <div className="h-screen w-full bg-gradient-to-b from-[#0a1a4a] via-[#050c2a] to-[#000000] flex flex-col relative overflow-hidden font-headline">
        
        {/* Sky Background Stars */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute top-20 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
           <div className="absolute top-40 left-[80%] w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700" />
           <div className="absolute bottom-60 left-[30%] w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
           <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] animate-ping" />
        </div>

        {/* Top High-Fidelity Header */}
        <header className="relative z-50 p-4 px-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg">
                <Maximize2 className="h-5 w-5" />
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-white/10 p-2 rounded-full border border-white/10 text-white shadow-lg">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white shadow-lg">
                <RefreshCw className="h-5 w-5" />
              </button>
           </div>

           <div className="text-center">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] italic">Ludo • Quick</h1>
           </div>

           <div className="flex items-center gap-2">
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white shadow-lg">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white shadow-lg">
                <ChevronDown className="h-5 w-5" />
              </button>
              <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-full border border-white/10 text-white shadow-lg">
                <X className="h-5 w-5" />
              </button>
           </div>
        </header>

        {/* The Game Stage */}
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
           
           <div className="relative w-[min(95vw,95vh)] aspect-square bg-[#7cb342] rounded-[3.5rem] p-5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-b-[12px] border-[#558b2f]">
              
              {/* Ornate Corner Protrusions & Plus Buttons */}
              <div className="absolute -top-4 -left-4 h-24 w-24 bg-[#8bc34a] rounded-[2.5rem] -rotate-12 -z-10 shadow-xl" />
              <button className="absolute -top-2 -left-2 h-14 w-14 bg-[#d9534f] rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95">
                 <Plus className="h-8 w-8 text-white/80" />
              </button>

              <div className="absolute -top-4 -right-4 h-24 w-24 bg-[#8bc34a] rounded-[2.5rem] rotate-12 -z-10 shadow-xl" />
              <button className="absolute -top-2 -right-2 h-14 w-14 bg-[#5cb85c] rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95">
                 <Plus className="h-8 w-8 text-white/80" />
              </button>

              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-[#8bc34a] rounded-[2.5rem] -rotate-12 -z-10 shadow-xl" />
              <button className="absolute -bottom-2 -right-2 h-14 w-14 bg-[#f0ad4e] rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95">
                 <Plus className="h-8 w-8 text-white/80" />
              </button>

              <div className="grid grid-cols-15 grid-rows-15 h-full w-full gap-1">
                 
                 {/* RED HOUSE (6x6) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-[2.5rem] p-4 border-4 border-[#558b2f]/20 shadow-inner relative overflow-hidden group">
                    <div className="w-full h-full bg-[#d9534f] rounded-[2rem] grid grid-cols-2 grid-rows-2 gap-4 p-6 shadow-2xl">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-black/20 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] border-2 border-[#d9534f]/50" />
                       ))}
                    </div>
                 </div>

                 {/* TOP PATH (3x6) */}
                 <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 gap-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "rounded-md shadow-sm flex items-center justify-center border border-black/5",
                        i >= 4 && i <= 16 && (i % 3 === 1) ? "bg-[#5cb85c]" : "bg-[#9ccc65]",
                      )}>
                        {i === 4 && <SafetySpot type="slash" />}
                        {i === 5 && <SafetySpot type="star" color="text-[#5cb85c]" />}
                        {i === 10 && <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />}
                      </div>
                    ))}
                 </div>

                 {/* GREEN HOUSE (6x6) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-[2.5rem] p-4 border-4 border-[#558b2f]/20 shadow-inner">
                    <div className="w-full h-full bg-[#5cb85c] rounded-[2rem] grid grid-cols-2 grid-rows-2 gap-4 p-6 shadow-2xl">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-black/20 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] border-2 border-[#5cb85c]/50" />
                       ))}
                    </div>
                 </div>

                 {/* LEFT PATH (6x3) */}
                 <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 gap-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "rounded-md shadow-sm flex items-center justify-center border border-black/5",
                        i >= 7 && i <= 11 ? "bg-[#d9534f]" : "bg-[#9ccc65]"
                      )}>
                        {i === 1 && <SafetySpot type="star" color="text-[#d9534f]" />}
                        {i === 12 && <SafetySpot type="slash" />}
                        {i === 13 && <SafetySpot type="star" color="text-[#5cb85c]" />}
                      </div>
                    ))}
                 </div>

                 {/* CENTER PLAY BUTTON (3x3) */}
                 <div className="col-span-3 row-span-3 flex items-center justify-center p-1 bg-[#8bc34a]">
                    <button className="w-full h-full bg-gradient-to-b from-[#ffeb3b] to-[#fbc02d] rounded-[2rem] border-[6px] border-[#f9a825] shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex items-center justify-center group active:scale-90 transition-all relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/30 h-1/2 rounded-t-full opacity-50" />
                       <span className="text-white text-4xl font-black italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">Play</span>
                    </button>
                 </div>

                 {/* RIGHT PATH (6x3) */}
                 <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 gap-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "rounded-md shadow-sm flex items-center justify-center border border-black/5",
                        i >= 6 && i <= 10 ? "bg-[#f0ad4e]" : "bg-[#9ccc65]"
                      )}>
                        {i === 4 && <SafetySpot type="slash" />}
                        {i === 16 && <SafetySpot type="star" color="text-[#fbc02d]" />}
                      </div>
                    ))}
                 </div>

                 {/* BLUE HOUSE (6x6) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-[2.5rem] p-4 border-4 border-[#558b2f]/20 shadow-inner">
                    <div className="w-full h-full bg-[#0275d8] rounded-[2rem] grid grid-cols-2 grid-rows-2 gap-4 p-6 shadow-2xl">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-black/20 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] border-2 border-[#0275d8]/50" />
                       ))}
                    </div>
                 </div>

                 {/* BOTTOM PATH (3x6) */}
                 <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 gap-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "rounded-md shadow-sm flex items-center justify-center border border-black/5",
                        i >= 1 && i <= 13 && (i % 3 === 1) ? "bg-[#0275d8]" : "bg-[#9ccc65]"
                      )}>
                        {i === 12 && <SafetySpot type="star" color="text-[#0275d8]" />}
                        {i === 13 && <SafetySpot type="slash" />}
                      </div>
                    ))}
                 </div>

                 {/* YELLOW HOUSE (6x6) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-[2.5rem] p-4 border-4 border-[#558b2f]/20 shadow-inner relative">
                    <div className="w-full h-full bg-[#fbc02d] rounded-[2rem] grid grid-cols-2 grid-rows-2 gap-4 p-6 shadow-2xl">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-black/20 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] border-2 border-[#fbc02d]/50" />
                       ))}
                    </div>
                 </div>

              </div>

              {/* Wooden Bridges Architecture */}
              <div className="absolute top-[40%] left-[38%] translate-x-[-50%]"><Bridge orientation="v" /></div>
              <div className="absolute bottom-[40%] left-[38%] translate-x-[-50%]"><Bridge orientation="v" /></div>
              <div className="absolute top-[38%] right-[40%] translate-y-[-50%]"><Bridge orientation="h" /></div>
              <div className="absolute top-[38%] left-[40%] translate-y-[-50%]"><Bridge orientation="h" /></div>

           </div>

           {/* User Profile Identity Overlay (Bottom Left) */}
           <div className="absolute bottom-10 left-10 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl animate-in slide-in-from-left-4 duration-700">
              <Avatar className="h-14 w-14 border-4 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                 <AvatarImage src={userProfile?.avatarUrl} />
                 <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                 <p className="text-white font-black text-base uppercase italic tracking-tighter">{userProfile?.username || 'SHUBH'}</p>
                 <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_10px_rgba(0,229,255,1)]" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Live Frequency</span>
                 </div>
              </div>
           </div>

        </main>

        {/* High-Fidelity Interactive Footer */}
        <footer className="relative z-50 p-10 flex justify-center">
           <div className="bg-black/60 backdrop-blur-2xl px-12 py-4 rounded-full border border-white/10 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Tribe Capacity</span>
                 <div className="flex items-center gap-2 text-[#00E5FF]">
                    <Users className="h-5 w-5" />
                    <span className="text-lg font-black italic">4/4</span>
                 </div>
              </div>
              
              <div className="h-12 w-px bg-white/10" />
              
              <button 
                onClick={handleToggleMic} 
                className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 active:scale-90",
                  isMuted 
                    ? "bg-rose-600 border-rose-400 text-white" 
                    : "bg-[#00E5FF] border-[#00E5FF] text-black scale-110 shadow-[0_0_30px_rgba(0,229,255,0.4)]"
                )}
              >
                {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7 animate-voice-wave" />}
              </button>
              
              <div className="h-12 w-px bg-white/10" />
              
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Game Type</span>
                 <Badge className="bg-yellow-500 text-black font-black uppercase text-xs italic px-4 py-1 rounded-lg border-b-4 border-yellow-700">Quick Mode</Badge>
              </div>
           </div>
        </footer>

      </div>
    </AppLayout>
  );
}
