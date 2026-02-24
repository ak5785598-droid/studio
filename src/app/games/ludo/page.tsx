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
  Settings
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
      <div className="h-screen w-full bg-[#0a1a4a] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
           <Gamepad2 className="h-20 w-20 text-yellow-500 relative z-10 animate-bounce" />
        </div>
        <div className="text-center space-y-2">
           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Ludo Quick</h1>
           <p className="text-muted-foreground text-xs font-black uppercase tracking-widest animate-pulse">Syncing with Frequency...</p>
        </div>
      </div>
    );
  }

  const SafetySpot = ({ color }: { color?: string }) => (
    <div className="flex items-center justify-center w-full h-full relative">
       {color ? (
         <Star className={cn("h-4 w-4 fill-current", color)} />
       ) : (
         <div className="h-4 w-4 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-px h-full bg-white/40 rotate-45" />
         </div>
       )}
    </div>
  );

  const Bridge = ({ orientation }: { orientation: 'h' | 'v' }) => (
    <div className={cn(
      "bg-orange-400 border-2 border-orange-600 rounded-sm shadow-sm flex items-center justify-center gap-0.5",
      orientation === 'h' ? "w-6 h-4 flex-col" : "w-4 h-6"
    )}>
       {Array.from({ length: 3 }).map((_, i) => (
         <div key={i} className={cn("bg-orange-600/40", orientation === 'h' ? "h-[1px] w-full" : "w-[1px] h-full")} />
       ))}
    </div>
  );

  return (
    <AppLayout fullScreen>
      <div className="h-screen w-full bg-[#0a1a4a] flex flex-col relative overflow-hidden font-headline">
        
        {/* Sky Background Stars */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute top-20 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
           <div className="absolute top-40 left-[80%] w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700" />
           <div className="absolute bottom-60 left-[30%] w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/20 rounded-full blur-xl animate-ping" />
        </div>

        {/* High-Fidelity Header */}
        <header className="relative z-50 p-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all">
                <Maximize2 className="h-4 w-4" />
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-white/10 p-2 rounded-full border border-white/10 text-white">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white">
                <RefreshCw className="h-4 w-4" />
              </button>
           </div>

           <div className="text-center">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-lg">Ludo • Quick</h1>
           </div>

           <div className="flex items-center gap-2">
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white">
                <HelpCircle className="h-4 w-4" />
              </button>
              <button className="bg-white/10 p-2 rounded-full border border-white/10 text-white">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-full border border-white/10 text-white">
                <X className="h-4 w-4" />
              </button>
           </div>
        </header>

        {/* The Game Board */}
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
           
           <div className="relative w-[min(90vw,90vh)] aspect-square bg-[#7cb342] rounded-[3rem] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-b-8 border-[#558b2f]">
              
              {/* Corner Plus Buttons */}
              <button className="absolute -top-2 -left-2 h-12 w-12 bg-rose-500 rounded-full border-4 border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Plus className="h-6 w-6 text-white/60" />
              </button>
              <button className="absolute -top-2 -right-2 h-12 w-12 bg-green-500 rounded-full border-4 border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Plus className="h-6 w-6 text-white/60" />
              </button>
              <button className="absolute -bottom-2 -right-2 h-12 w-12 bg-orange-400 rounded-full border-4 border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Plus className="h-6 w-6 text-white/60" />
              </button>

              <div className="grid grid-cols-15 grid-rows-15 h-full w-full gap-0.5">
                 
                 {/* Red House (Top Left) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-3xl p-3 border-4 border-[#558b2f]/30">
                    <div className="w-full h-full bg-rose-500 rounded-2xl grid grid-cols-2 grid-rows-2 gap-2 p-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-rose-900/40 rounded-full shadow-inner" />
                       ))}
                    </div>
                 </div>

                 {/* Top Track (Vertical) */}
                 <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "border-[0.5px] border-black/10 rounded-sm flex items-center justify-center",
                        i >= 4 && i <= 16 && (i % 3 === 1) ? "bg-green-600" : "bg-[#9ccc65]",
                        i === 4 && "relative"
                      )}>
                        {i === 4 && <SafetySpot />}
                        {i === 5 && <SafetySpot color="text-green-800" />}
                      </div>
                    ))}
                 </div>

                 {/* Green House (Top Right) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-3xl p-3 border-4 border-[#558b2f]/30">
                    <div className="w-full h-full bg-green-800 rounded-2xl grid grid-cols-2 grid-rows-2 gap-2 p-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-black/40 rounded-full shadow-inner" />
                       ))}
                    </div>
                 </div>

                 {/* Middle Track Left */}
                 <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "border-[0.5px] border-black/10 rounded-sm flex items-center justify-center",
                        i >= 7 && i <= 11 ? "bg-rose-500" : "bg-[#9ccc65]"
                      )}>
                        {i === 1 && <SafetySpot color="text-rose-700" />}
                        {i === 12 && <SafetySpot />}
                        {i === 13 && <SafetySpot color="text-green-800" />}
                      </div>
                    ))}
                 </div>

                 {/* Center Play Button */}
                 <div className="col-span-3 row-span-3 bg-[#8bc34a] flex items-center justify-center p-1">
                    <button className="w-full h-full bg-gradient-to-b from-orange-300 to-orange-500 rounded-2xl border-4 border-orange-600 shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center group active:scale-95 transition-all">
                       <span className="text-white text-3xl font-black italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">Play</span>
                    </button>
                 </div>

                 {/* Middle Track Right */}
                 <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "border-[0.5px] border-black/10 rounded-sm flex items-center justify-center",
                        i >= 6 && i <= 10 ? "bg-yellow-500" : "bg-[#9ccc65]"
                      )}>
                        {i === 4 && <SafetySpot />}
                        {i === 16 && <SafetySpot color="text-yellow-700" />}
                      </div>
                    ))}
                 </div>

                 {/* Blue House (Bottom Left) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-3xl p-3 border-4 border-[#558b2f]/30">
                    <div className="w-full h-full bg-blue-600 rounded-2xl grid grid-cols-2 grid-rows-2 gap-2 p-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-blue-900/40 rounded-full shadow-inner" />
                       ))}
                    </div>
                 </div>

                 {/* Bottom Track */}
                 <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={cn(
                        "border-[0.5px] border-black/10 rounded-sm flex items-center justify-center",
                        i >= 1 && i <= 13 && (i % 3 === 1) ? "bg-blue-600" : "bg-[#9ccc65]"
                      )}>
                        {i === 12 && <SafetySpot color="text-blue-800" />}
                        {i === 13 && <SafetySpot />}
                      </div>
                    ))}
                 </div>

                 {/* Yellow House (Bottom Right) */}
                 <div className="col-span-6 row-span-6 bg-[#8bc34a] rounded-3xl p-3 border-4 border-[#558b2f]/30">
                    <div className="w-full h-full bg-yellow-500 rounded-2xl grid grid-cols-2 grid-rows-2 gap-2 p-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="bg-orange-900/40 rounded-full shadow-inner" />
                       ))}
                    </div>
                 </div>

              </div>

              {/* Bridges */}
              <div className="absolute top-[40%] left-[38%]"><Bridge orientation="v" /></div>
              <div className="absolute bottom-[40%] left-[38%]"><Bridge orientation="v" /></div>
              <div className="absolute top-[38%] right-[40%]"><Bridge orientation="h" /></div>
              <div className="absolute top-[38%] left-[40%]"><Bridge orientation="h" /></div>

           </div>

           {/* User Profile Indicator (Matching SHUBH layout) */}
           <div className="absolute bottom-10 left-10 flex items-center gap-3 bg-green-800/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
              <Avatar className="h-12 w-12 border-2 border-[#00E5FF] shadow-lg">
                 <AvatarImage src={userProfile?.avatarUrl} />
                 <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                 <p className="text-white font-black text-sm uppercase italic tracking-tighter">{userProfile?.username || 'Ummy Player'}</p>
                 <div className="flex items-center gap-1 opacity-60">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">In Frequency</span>
                 </div>
              </div>
           </div>

        </main>

        {/* High-Fidelity Footer Overlay */}
        <footer className="relative z-50 p-6 flex justify-center">
           <div className="bg-black/40 backdrop-blur-xl px-10 py-3 rounded-full border border-white/10 flex items-center gap-8 shadow-2xl">
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Players</span>
                 <div className="flex items-center gap-1.5 text-primary">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-black">4/4</span>
                 </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <button onClick={handleToggleMic} className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-lg border-2",
                isMuted ? "bg-rose-500 border-rose-400 text-white" : "bg-[#00E5FF] border-[#00E5FF] text-black scale-110"
              )}>
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Mode</span>
                 <Badge className="bg-yellow-500 text-black font-black uppercase text-[10px] italic">Quick</Badge>
              </div>
           </div>
        </footer>

      </div>
    </AppLayout>
  );
}
