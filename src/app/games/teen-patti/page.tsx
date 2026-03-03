'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, increment, serverTimestamp } from 'firebase/firestore';
import { 
  ChevronLeft, 
  ChevronRight,
  Volume2, 
  VolumeX, 
  HelpCircle, 
  History, 
  MoreHorizontal,
  Users,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { GoldCoinIcon, UmmyLogoIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CompactRoomView } from '@/components/compact-room-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const CHIPS = [
  { value: 10000, label: '10k', color: 'bg-[#00E5FF] border-[#00E5FF]/50 shadow-[#00E5FF]/40' },
  { value: 100000, label: '100k', color: 'bg-[#2196F3] border-[#2196F3]/50 shadow-[#2196F3]/40' },
  { value: 300000, label: '300k', color: 'bg-[#9C27B0] border-[#9C27B0]/50 shadow-[#9C27B0]/40' },
  { value: 1000000, label: '1000k', color: 'bg-[#F44336] border-[#F44336]/50 shadow-[#F44336]/40' },
  { value: 2000000, label: '2000k', color: 'bg-[#795548] border-[#795548]/50 shadow-[#795548]/40' },
  { value: 5000000, label: '5000k', color: 'bg-[#FFD700] border-[#FFD700]/50 shadow-[#FFD700]/40' },
];

const FACTIONS = [
  { 
    id: 'WOLF', 
    label: 'Wolf', 
    bannerUrl: 'https://img.icons8.com/color/144/game-of-thrones-stark.png', 
    color: 'from-gray-400 to-gray-600' 
  },
  { 
    id: 'LION', 
    label: 'Lion', 
    bannerUrl: 'https://img.icons8.com/color/144/game-of-thrones-lannister.png', 
    color: 'from-yellow-400 to-red-600' 
  },
  { 
    id: 'FISH', 
    label: 'Fish', 
    bannerUrl: 'https://img.icons8.com/color/144/game-of-thrones-tully.png', 
    color: 'from-green-400 to-green-700' 
  },
];

const CARDS = ['A', 'JOKER', 'B', 'K', 'Q', '10', '9'];

export default function TeenPattiGamePage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'betting' | 'reveal' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedChip, setSelectedChip] = useState(10000);
  const [myBets, setMyBets] = useState<Record<string, number>>({ WOLF: 0, LION: 0, FISH: 0 });
  const [totalPots, setTotalPots] = useState<Record<string, number>>({ WOLF: 0, LION: 650000, FISH: 800000 });
  const [history, setHistory] = useState<string[]>(['WOLF', 'LION', 'FISH', 'WOLF', 'LION', 'WOLF', 'LION', 'FISH']);
  const [isMuted, setIsMuted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(true);
  const [cardReveal, setCardReveal] = useState<Record<string, string[]>>({});

  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((freq: number, dur: number) => {
    if (isMuted) return;
    const ctx = initAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }, [isMuted, initAudioContext]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLaunching) return;
    const interval = setInterval(() => {
      if (gameState === 'betting') {
        if (timeLeft > 0) {
          setTimeLeft(prev => prev - 1);
          if (timeLeft <= 5) playSound(800, 0.1);
        } else {
          startReveal();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, timeLeft, isLaunching, playSound]);

  const startReveal = () => {
    setGameState('reveal');
    const newCards: Record<string, string[]> = {};
    FACTIONS.forEach(f => {
      newCards[f.id] = [
        CARDS[Math.floor(Math.random() * CARDS.length)],
        CARDS[Math.floor(Math.random() * CARDS.length)],
        CARDS[Math.floor(Math.random() * CARDS.length)]
      ];
    });
    setCardReveal(newCards);

    setTimeout(() => {
      const winId = FACTIONS[Math.floor(Math.random() * FACTIONS.length)].id;
      finalizeRound(winId);
    }, 3000);
  };

  const finalizeRound = (winId: string) => {
    setWinner(winId);
    setHistory(prev => [winId, ...prev.slice(0, 7)]);
    setGameState('result');
    playSound(1200, 0.5);

    const winAmount = (myBets[winId] || 0) * 1.95;
    if (winAmount > 0 && currentUser && firestore) {
      const updateData = { 
        'wallet.coins': increment(Math.floor(winAmount)), 
        'stats.dailyGameWins': increment(Math.floor(winAmount)),
        updatedAt: serverTimestamp() 
      };
      updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
      updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
      toast({ title: 'You Won!', description: `Sync Successful: +${Math.floor(winAmount).toLocaleString()}` });
    }

    setTimeout(() => {
      setMyBets({ WOLF: 0, LION: 0, FISH: 0 });
      setTotalPots({ WOLF: 0, LION: 650000, FISH: 800000 });
      setWinner(null);
      setGameState('betting');
      setTimeLeft(20);
      setCardReveal({});
    }, 5000);
  };

  const handlePlaceBet = (id: string) => {
    if (gameState !== 'betting' || !currentUser || !userProfile) return;
    if ((userProfile.wallet?.coins || 0) < selectedChip) {
      toast({ variant: 'destructive', title: 'Insufficient Coins' });
      return;
    }
    
    playSound(1000, 0.1);
    const updateData = { 'wallet.coins': increment(-selectedChip), updatedAt: serverTimestamp() };
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
    
    setMyBets(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip }));
    setTotalPots(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip }));
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#1a0a2e] flex flex-col items-center justify-center space-y-6">
        <div className="text-8xl animate-bounce">🃏</div>
        <h1 className="text-5xl font-black text-yellow-500 uppercase italic tracking-tighter drop-shadow-2xl">Teen Patti</h1>
        <p className="text-white/40 uppercase tracking-widest text-[10px] animate-pulse">Syncing Tribal Arena...</p>
      </div>
    );
  }

  const BannerIcon = ({ url, factionId }: { url: string, factionId: string }) => (
    <div className={cn(
      "w-24 h-28 relative animate-in zoom-in duration-500",
      winner === factionId && "animate-reaction-pulse"
    )}>
       <img src={url} className="w-full h-full object-contain filter drop-shadow-lg" alt="Banner" />
    </div>
  );

  return (
    <AppLayout fullScreen>
      <div className="h-[100dvh] w-full bg-[#581c87] flex flex-col relative overflow-hidden font-headline text-white select-none">
        <CompactRoomView />

        {/* Immersive Background Spotlights */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-1/4 w-[2px] h-full bg-white/10 blur-2xl rotate-12" />
           <div className="absolute top-0 right-1/4 w-[2px] h-full bg-white/10 blur-2xl -rotate-12" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-[#7c3aed]/20 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Sovereign Header UI */}
        <header className="relative z-[110] flex items-center justify-between p-4 pt-32">
           <div className="flex gap-2">
              <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-full backdrop-blur-md active:scale-90 border border-white/5"><ChevronLeft className="h-5 w-5" /></button>
              <button className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/5"><LayoutGrid className="h-5 w-5" /></button>
           </div>
           
           <div className="flex flex-col items-center">
              <div className="relative">
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ffd700] to-[#b8860b] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">TEEN PATTI</h1>
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-52 h-10 bg-gradient-to-r from-[#4c1d95] via-[#7c3aed] to-[#4c1d95] border-2 border-white/20 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
                    <span className="text-[11px] font-black uppercase italic tracking-widest text-white">Countdown {timeLeft}s</span>
                 </div>
              </div>
           </div>

           <div className="flex gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/5">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/5"><HelpCircle className="h-5 w-5" /></button>
           </div>
        </header>

        {/* Win History Strip */}
        <div className="relative z-50 px-4 mt-10">
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              <div className="shrink-0">
                 <div className="h-6 w-8 rounded bg-black/60 flex items-center justify-center text-[8px] font-black uppercase border border-white/5">Last</div>
              </div>
              {history.map((id, i) => (
                <div key={i} className="shrink-0 animate-in slide-in-from-right duration-500">
                   <div className="h-8 w-8 relative flex items-center justify-center bg-black/20 rounded-md border border-white/5">
                      <img src={FACTIONS.find(f => f.id === id)?.bannerUrl} className="h-6 w-6 object-contain opacity-90" alt="Hist" />
                   </div>
                </div>
              ))}
              <button className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase italic ml-auto flex items-center gap-1 backdrop-blur-md">More <ChevronRight className="h-3 w-3" /></button>
           </div>
        </div>

        {/* Main Arena Dimension */}
        <main className="flex-1 flex flex-col pt-4 overflow-hidden relative z-10">
           
           {/* High-Tier Card Reveal Sections */}
           <div className="grid grid-cols-3 gap-2 px-4 h-44">
              {FACTIONS.map((f) => (
                <div key={f.id} className="flex flex-col items-center gap-2">
                   <div className={cn(
                     "w-full h-28 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden bg-black/30 backdrop-blur-sm shadow-inner",
                     winner === f.id ? "border-[#ffd700] bg-[#ffd700]/10 shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-105" : "border-white/5",
                     gameState === 'reveal' && "animate-pulse"
                   )}>
                      <div className="flex gap-0.5 mb-1 scale-110">
                         {[0, 1, 2].map((i) => (
                           <div key={i} className={cn(
                             "w-8 h-12 rounded border transition-all duration-1000 transform-gpu preserve-3d flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-black",
                             gameState !== 'betting' ? "rotate-y-180" : ""
                           )}>
                              {/* Card Front */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white flex flex-col items-center justify-center rounded">
                                 <span className="text-[10px] font-black text-black leading-none">{cardReveal[f.id]?.[i] || '?'}</span>
                                 <span className="text-[8px] text-[#f43f5e]">♥</span>
                              </div>
                              {/* Card Back (Blueprint Design) */}
                              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#3730a3] to-[#1e1b4b] rounded border border-[#ffd700]/30 flex items-center justify-center">
                                 <UmmyLogoIcon className="h-4 w-4 opacity-40 grayscale brightness-200" />
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      {winner === f.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                           <img src="https://img.icons8.com/color/96/000000/crown.png" className="h-10 w-10 drop-shadow-2xl" alt="Winner" />
                        </div>
                      )}
                   </div>
                   <div className="text-center space-y-0.5">
                      <p className="text-[9px] font-bold text-white/60 uppercase tracking-tighter">Pot:{(totalPots[f.id] || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-black text-[#ffd700] uppercase tracking-tighter italic">Me:{(myBets[f.id] || 0).toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Faction Banners (Active Betting Characters) */}
           <div className="flex justify-around items-end px-4 flex-1 pb-28">
              {FACTIONS.map((f) => (
                <button 
                  key={f.id} 
                  onClick={() => handlePlaceBet(f.id)}
                  disabled={gameState !== 'betting'}
                  className={cn(
                    "relative group active:scale-95 transition-all duration-300",
                    gameState !== 'betting' && "opacity-60"
                  )}
                >
                   {/* Bet Coin Scatter Sync */}
                   <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 opacity-90 pointer-events-none z-20">
                      {Array.from({ length: Math.min(12, Math.ceil((myBets[f.id] || 0) / 10000)) }).map((_, i) => (
                        <GoldCoinIcon key={i} className="h-4 w-4 text-yellow-500 animate-in zoom-in shadow-lg" style={{ animationDelay: `${i * 0.05}s` }} />
                      ))}
                   </div>
                   <BannerIcon url={f.bannerUrl} factionId={f.id} />
                </button>
              ))}
           </div>

           {/* High-Fidelity Social Ranking Row */}
           <div className="absolute bottom-24 left-0 right-0 px-6">
              <div className="flex items-center justify-between">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="relative group cursor-pointer active:scale-90 transition-transform">
                         <Avatar className="h-11 w-11 border-2 border-black/40 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            <AvatarImage src={`https://picsum.photos/seed/tribe_${i}/100`} />
                            <AvatarFallback className="bg-slate-800">U</AvatarFallback>
                         </Avatar>
                         {i <= 3 && (
                           <div className="absolute -bottom-1.5 -right-1.5 scale-75">
                              <span className="text-lg drop-shadow-lg">{i === 1 ? '🥇' : i === 2 ? '🥈' : '🥉'}</span>
                           </div>
                         )}
                         {i > 3 && (
                           <div className="absolute -bottom-1 -right-1 bg-black/60 rounded-full h-4 w-4 flex items-center justify-center border border-white/10">
                              <span className="text-[7px] font-black">{i}</span>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 border border-white/10 shadow-xl">
                    <Users className="h-4 w-4 text-[#a855f7]" />
                    <span className="text-[11px] font-black tracking-tight">21 Live</span>
                 </div>
              </div>
           </div>
        </main>

        {/* Global Interaction Footer */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent z-[120]">
           <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              {/* Tribal Balance Sync */}
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 pl-3 pr-4 py-2 shadow-2xl">
                <GoldCoinIcon className="h-5 w-5 text-[#ffd700]" />
                <span className="text-[15px] font-black text-[#ffd700] italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
                <ChevronRight className="h-3 w-3 text-white/20" />
              </div>

              {/* High-Fidelity Chip Selection Bar */}
              <div className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar px-2 py-1">
                 {CHIPS.map(chip => (
                   <button 
                    key={chip.value} 
                    onClick={() => setSelectedChip(chip.value)} 
                    className={cn(
                      "h-14 w-14 rounded-full flex flex-col items-center justify-center transition-all border-[3px] border-white/10 shrink-0 shadow-2xl relative group overflow-hidden",
                      chip.color,
                      selectedChip === chip.value ? "scale-115 border-white ring-[6px] ring-white/20 z-10 -translate-y-2" : "opacity-70 grayscale-[0.2] hover:opacity-100"
                    )}
                   >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 pointer-events-none" />
                      <span className="text-[10px] font-black text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-none tracking-tighter">{chip.label}</span>
                      {selectedChip === chip.value && (
                        <div className="absolute inset-0 border-2 border-white/40 rounded-full animate-pulse" />
                      )}
                   </button>
                 ))}
              </div>
           </div>
        </footer>

        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          @keyframes shine { 0% { transform: translateX(-200%) skewX(-30deg); } 100% { transform: translateX(200%) skewX(-30deg); } }
          .animate-shine { animation: shine 3s infinite; }
        `}</style>
      </div>
    </AppLayout>
  );
}
