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
  { value: 10000, label: '10K', color: 'bg-[#00E5FF] shadow-[#00E5FF]/50' },
  { value: 100000, label: '100K', color: 'bg-[#2196F3] shadow-[#2196F3]/50' },
  { value: 300000, label: '300K', color: 'bg-[#9C27B0] shadow-[#9C27B0]/50' },
  { value: 1000000, label: '1000K', color: 'bg-[#F44336] shadow-[#F44336]/50' },
  { value: 2000000, label: '2000K', color: 'bg-[#795548] shadow-[#795548]/50' },
  { value: 5000000, label: '5000K', color: 'bg-[#FFD700] shadow-[#FFD700]/50' },
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

    // After 3 seconds of card reveal animation
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
      "w-20 h-24 relative animate-in zoom-in duration-500",
      winner === factionId && "animate-reaction-pulse"
    )}>
       <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
       <img src={url} className="w-full h-full object-contain filter drop-shadow-lg" alt="Banner" />
    </div>
  );

  return (
    <AppLayout fullScreen>
      <div className="h-[100dvh] w-full bg-[#581c87] flex flex-col relative overflow-hidden font-headline text-white select-none">
        <CompactRoomView />

        {/* Ambient Spotlights */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-1/4 w-px h-full bg-white/10 blur-xl rotate-12" />
           <div className="absolute top-0 right-1/4 w-px h-full bg-white/10 blur-xl -rotate-12" />
           <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Top Header */}
        <header className="relative z-[110] flex items-center justify-between p-4 pt-32">
           <div className="flex gap-2">
              <button onClick={() => router.back()} className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md active:scale-90"><ChevronLeft className="h-5 w-5" /></button>
              <button className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><LayoutGrid className="h-5 w-5" /></button>
           </div>
           
           <div className="flex flex-col items-center">
              <div className="relative">
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-400 to-yellow-600 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">TEEN PATTI</h1>
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-10 bg-purple-900/80 border-2 border-purple-400 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
                    <span className="text-xs font-black uppercase italic tracking-widest text-white">Countdown {timeLeft}s</span>
                 </div>
              </div>
           </div>

           <div className="flex gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><HelpCircle className="h-5 w-5" /></button>
           </div>
        </header>

        {/* History Bar */}
        <div className="relative z-50 px-4 mt-8">
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              <div className="flex flex-col items-center shrink-0">
                 <div className="h-6 w-6 rounded bg-black/60 flex items-center justify-center text-[8px] font-black uppercase">Last</div>
              </div>
              {history.map((id, i) => (
                <div key={i} className="shrink-0 animate-in slide-in-from-right duration-500">
                   <img src={FACTIONS.find(f => f.id === id)?.bannerUrl} className="h-8 w-8 object-contain opacity-80" alt="Hist" />
                </div>
              ))}
              <button className="bg-black/40 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase italic ml-auto flex items-center gap-1">More <ChevronRight className="h-3 w-3" /></button>
           </div>
        </div>

        {/* Arena Body */}
        <main className="flex-1 flex flex-col pt-4 overflow-hidden relative z-10">
           
           {/* Card Sections Grid */}
           <div className="grid grid-cols-3 gap-2 px-4 h-48">
              {FACTIONS.map((f) => (
                <div key={f.id} className="flex flex-col items-center gap-2">
                   <div className={cn(
                     "w-full h-28 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden bg-black/20",
                     winner === f.id ? "border-yellow-400 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.4)] scale-105" : "border-white/5",
                     gameState === 'reveal' && "animate-pulse"
                   )}>
                      <div className="flex gap-0.5">
                         {[0, 1, 2].map((i) => (
                           <div key={i} className={cn(
                             "w-8 h-12 rounded border transition-all duration-1000 transform-gpu preserve-3d flex items-center justify-center bg-[#2a1a15]",
                             gameState !== 'betting' ? "rotate-y-180" : ""
                           )}>
                              {/* Front (Revealed) */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white flex flex-col items-center justify-center rounded">
                                 <span className="text-[10px] font-black text-black leading-none">{cardReveal[f.id]?.[i] || '?'}</span>
                                 <span className="text-[8px] text-red-500">♥</span>
                              </div>
                              {/* Back (Covered) */}
                              <div className="absolute inset-0 backface-hidden bg-[#2a1a15] rounded border border-yellow-500/20 flex items-center justify-center">
                                 <UmmyLogoIcon className="h-4 w-4 opacity-40 grayscale" />
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      {winner === f.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                           <img src="https://img.icons8.com/color/96/000000/crown.png" className="h-8 w-8 drop-shadow-lg" alt="Winner" />
                        </div>
                      )}
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] font-bold text-white/60">Pot:{totalPots[f.id].toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-white/60">Me:{myBets[f.id].toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Faction Banners (Betting Areas) */}
           <div className="flex justify-around items-end px-4 flex-1 pb-32">
              {FACTIONS.map((f) => (
                <button 
                  key={f.id} 
                  onClick={() => handlePlaceBet(f.id)}
                  disabled={gameState !== 'betting'}
                  className={cn(
                    "relative group active:scale-95 transition-all duration-300",
                    gameState !== 'betting' && "opacity-50"
                  )}
                >
                   {/* Bet Scatter Coins */}
                   <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 opacity-80 pointer-events-none z-20">
                      {Array.from({ length: Math.min(15, Math.ceil(myBets[f.id] / 10000)) }).map((_, i) => (
                        <GoldCoinIcon key={i} className="h-4 w-4 text-yellow-500 animate-in zoom-in" style={{ animationDelay: `${i * 0.05}s` }} />
                      ))}
                   </div>
                   <BannerIcon url={f.bannerUrl} factionId={f.id} />
                </button>
              ))}
           </div>

           {/* Active Tribal Members */}
           <div className="absolute bottom-24 left-0 right-0 px-6">
              <div className="flex items-center justify-between">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="relative">
                         <Avatar className="h-10 w-10 border-2 border-black/40 shadow-xl">
                            <AvatarImage src={`https://picsum.photos/seed/${i}/100`} />
                            <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <div className="absolute -bottom-1 -right-1">
                            <span className="text-xs drop-shadow-md">{i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : ''}</span>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="bg-black/40 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2 border border-white/10">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-black">21</span>
                 </div>
              </div>
           </div>
        </main>

        {/* Footer Navigation & Controls */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent z-[120]">
           <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 pl-3 pr-4 py-1.5 shadow-xl">
                <GoldCoinIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-black text-yellow-500 italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
                <ChevronRight className="h-3 w-3 text-white/40" />
              </div>

              {/* Chip Selector Bar */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
                 {CHIPS.map(chip => (
                   <button 
                    key={chip.value} 
                    onClick={() => setSelectedChip(chip.value)} 
                    className={cn(
                      "h-12 w-12 rounded-full flex flex-col items-center justify-center transition-all border-2 border-white/10 shrink-0 shadow-lg relative group",
                      chip.color,
                      selectedChip === chip.value ? "scale-110 border-white ring-4 ring-white/30 z-10 -translate-y-1" : "opacity-60 hover:opacity-100"
                    )}
                   >
                      <span className="text-[9px] font-black text-white italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] leading-none">{chip.label}</span>
                      {selectedChip === chip.value && (
                        <div className="absolute -inset-1 rounded-full border-2 border-white animate-pulse" />
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
        `}</style>
      </div>
    </AppLayout>
  );
}
