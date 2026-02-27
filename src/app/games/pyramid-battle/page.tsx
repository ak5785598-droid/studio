'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, increment, serverTimestamp } from 'firebase/firestore';
import { 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Trophy, 
  Users, 
  RefreshCcw, 
  Plus, 
  Clock, 
  LayoutGrid,
  Maximize2,
  X,
  Menu,
  ChevronDown,
  Activity
} from 'lucide-react';
import { GoldCoinIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CompactRoomView } from '@/components/compact-room-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const CHIPS = [
  { value: 5, color: 'bg-[#00E5FF] shadow-[#00E5FF]/50' },
  { value: 10, color: 'bg-[#2196F3] shadow-[#2196F3]/50' },
  { value: 100, color: 'bg-[#4CAF50] shadow-[#4CAF50]/50' },
  { value: 1000, label: '1K', color: 'bg-[#00BCD4] shadow-[#00BCD4]/50' },
  { value: 5000, label: '5K', color: 'bg-[#F44336] shadow-[#F44336]/50' },
];

const SIDE_BETS = [
  { id: 'PAIR', label: 'PAIR', multiplier: '5x' },
  { id: 'COLOR', label: 'COLOR', multiplier: '10x' },
  { id: 'SEQUENCE', label: 'SEQUENCE', multiplier: '15x' },
  { id: 'PURE_SEQ', label: 'PURE SEQ', multiplier: '100x' },
  { id: 'SET', label: 'SET', multiplier: '100x' },
];

export default function PyramidBattlePage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'betting' | 'calculating' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(17);
  const [selectedChip, setSelectedChip] = useState(5);
  const [myBets, setMyBets] = useState<Record<string, number>>({ BLUE: 0, RED: 0, PAIR: 0, COLOR: 0, SEQUENCE: 0, PURE_SEQ: 0, SET: 0 });
  const [totalBets, setTotalBets] = useState<Record<string, number>>({ BLUE: 0, RED: 0, PAIR: 0, COLOR: 0, SEQUENCE: 0, PURE_SEQ: 0, SET: 0 });
  const [history, setHistory] = useState<('RED' | 'BLUE')[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [winner, setWinner] = useState<'RED' | 'BLUE' | null>(null);

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

  const playBetSound = useCallback(() => {
    if (isMuted) return;
    const ctx = initAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [isMuted, initAudioContext]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 2000);
    // Initial history
    setHistory(Array.from({ length: 24 }).map(() => Math.random() > 0.5 ? 'RED' : 'BLUE'));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLaunching) return;
    const interval = setInterval(() => {
      if (gameState === 'betting') {
        if (timeLeft > 0) setTimeLeft(prev => prev - 1);
        else transitionToCalculation();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, timeLeft, isLaunching]);

  const transitionToCalculation = () => {
    setGameState('calculating');
    setTimeout(() => {
      const winId = Math.random() > 0.5 ? 'RED' : 'BLUE';
      showResult(winId);
    }, 3000);
  };

  const showResult = (winId: 'RED' | 'BLUE') => {
    setWinner(winId);
    setHistory(prev => [winId, ...prev.slice(0, 23)]);
    setGameState('result');

    const winAmount = (myBets[winId] || 0) * 1.95;
    if (winAmount > 0 && currentUser && firestore) {
      const updateData = { 
        'wallet.coins': increment(Math.floor(winAmount)), 
        'stats.dailyGameWins': increment(Math.floor(winAmount)),
        updatedAt: serverTimestamp() 
      };
      updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
      updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
    }

    setTimeout(() => {
      setMyBets({ BLUE: 0, RED: 0, PAIR: 0, COLOR: 0, SEQUENCE: 0, PURE_SEQ: 0, SET: 0 });
      setTotalBets({ BLUE: 0, RED: 0, PAIR: 0, COLOR: 0, SEQUENCE: 0, PURE_SEQ: 0, SET: 0 });
      setWinner(null);
      setGameState('betting');
      setTimeLeft(17);
    }, 5000);
  };

  const handlePlaceBet = (id: string) => {
    if (gameState !== 'betting' || !currentUser || !userProfile) return;
    if ((userProfile.wallet?.coins || 0) < selectedChip) {
      toast({ variant: 'destructive', title: 'Insufficient Coins' });
      return;
    }
    
    playBetSound();
    const updateData = { 'wallet.coins': increment(-selectedChip), updatedAt: serverTimestamp() };
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
    
    setMyBets(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip }));
    setTotalBets(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip + Math.floor(Math.random() * 50) }));
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#3d2b1f] flex flex-col items-center justify-center space-y-6 font-headline">
        <div className="text-8xl animate-bounce">🏺</div>
        <h1 className="text-5xl font-black text-[#ffcc00] uppercase italic tracking-tighter drop-shadow-2xl">Pyramid Battle</h1>
        <p className="text-white/40 uppercase tracking-widest text-[10px] animate-pulse">Synchronizing with Ancient Gods...</p>
      </div>
    );
  }

  const backgroundAsset = PlaceHolderImages.find(img => img.id === 'pyramid-bg');
  const anubisAsset = PlaceHolderImages.find(img => img.id === 'anubis-char');
  const horusAsset = PlaceHolderImages.find(img => img.id === 'horus-char');
  const cardAsset = PlaceHolderImages.find(img => img.id === 'egypt-card');

  return (
    <AppLayout fullScreen>
      <div className="h-[100dvh] w-full bg-[#1a0a05] flex flex-col relative overflow-hidden font-headline text-white select-none">
        <CompactRoomView />

        {/* Backdrop Layer */}
        <div className="absolute inset-0 z-0">
           {backgroundAsset && (
             <img 
               src={backgroundAsset.imageUrl} 
               className="h-full w-full object-cover opacity-60" 
               alt="Pyramid Background" 
               data-ai-hint="egyptian pyramid"
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Top Header UI */}
        <div className="relative z-[110] flex items-center justify-between p-4 pt-32">
           <div className="flex gap-1.5">
              <button className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><Maximize2 className="h-4 w-4" /></button>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><HelpCircle className="h-4 w-4" /></button>
              <button className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><Trophy className="h-4 w-4" /></button>
           </div>
           
           <h1 className="text-2xl font-black uppercase italic tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Pyramid Battle</h1>

           <div className="flex gap-1.5">
              <button className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><Menu className="h-4 w-4" /></button>
              <button className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><ChevronDown className="h-4 w-4" /></button>
              <button onClick={() => router.back()} className="bg-white/20 p-1.5 rounded-md backdrop-blur-md border border-white/10"><X className="h-4 w-4" /></button>
           </div>
        </div>

        {/* Characters & Cards Arena */}
        <div className="relative z-10 flex-1 flex flex-col mt-2">
           
           <div className="flex justify-between items-center px-4 relative h-40">
              {/* Anubis (Left) */}
              <div className="w-1/4 h-full relative">
                 {anubisAsset && (
                   <img src={anubisAsset.imageUrl} className="h-full object-contain filter drop-shadow-2xl" alt="Anubis" data-ai-hint="anubis character" />
                 )}
              </div>

              {/* Central VS & Timer */}
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                 <div className="flex items-center gap-4">
                    {/* Left Cards */}
                    <div className="flex gap-0.5">
                       {[1, 2, 3].map(i => (
                         <div key={i} className={cn(
                           "w-10 h-14 rounded-sm border transition-all duration-500 overflow-hidden shadow-lg",
                           winner === 'BLUE' ? "border-yellow-400 scale-110 -translate-y-1" : "border-amber-900/40 bg-[#2a1a15]"
                         )}>
                            {cardAsset && <img src={cardAsset.imageUrl} className="w-full h-full object-cover" alt="Card" />}
                         </div>
                       ))}
                    </div>

                    <div className="relative">
                       <span className="text-xl font-black italic tracking-tighter text-blue-400 drop-shadow-md">VS</span>
                       <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
                    </div>

                    {/* Right Cards */}
                    <div className="flex gap-0.5">
                       {[1, 2, 3].map(i => (
                         <div key={i} className={cn(
                           "w-10 h-14 rounded-sm border transition-all duration-500 overflow-hidden shadow-lg",
                           winner === 'RED' ? "border-yellow-400 scale-110 -translate-y-1" : "border-amber-900/40 bg-[#2a1a15]"
                         )}>
                            {cardAsset && <img src={cardAsset.imageUrl} className="w-full h-full object-cover" alt="Card" />}
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Timer Circle */}
                 <div className="relative mt-2">
                    <div className="w-14 h-14 rounded-full border-4 border-[#ffcc00]/20 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden">
                       <div 
                         className="absolute inset-0 border-4 border-[#ffcc00] rounded-full transition-all duration-1000" 
                         style={{ clipPath: `inset(0 0 ${100 - (timeLeft/17)*100}% 0)` }} 
                       />
                       <span className="relative z-10 text-lg font-black text-white italic">{timeLeft}</span>
                    </div>
                 </div>
              </div>

              {/* Horus (Right) */}
              <div className="w-1/4 h-full relative flex justify-end">
                 {horusAsset && (
                   <img src={horusAsset.imageUrl} className="h-full object-contain filter drop-shadow-2xl" alt="Horus" data-ai-hint="horus character" />
                 )}
              </div>
           </div>

           {/* History Tracker */}
           <div className="px-4 py-2">
              <div className="bg-black/40 backdrop-blur-md rounded-full h-10 border border-white/5 flex items-center gap-1.5 px-4 overflow-hidden relative group">
                 {history.map((type, i) => (
                   <div 
                    key={i} 
                    className={cn(
                      "h-3 w-3 rounded-full shrink-0 shadow-lg transition-all",
                      type === 'RED' ? "bg-red-500" : "bg-blue-500",
                      i === 0 && "ring-2 ring-white scale-125 animate-pulse"
                    )} 
                   />
                 ))}
                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Activity className="h-4 w-4 text-yellow-500 opacity-60" />
                 </div>
              </div>
           </div>

           {/* Betting Grid */}
           <div className="px-4 pb-20 mt-4 space-y-1.5 flex-1 flex flex-col justify-end">
              {/* Top Row: Blue & Red */}
              <div className="flex gap-1.5 h-32">
                 {/* Blue Bet */}
                 <button 
                   onClick={() => handlePlaceBet('BLUE')}
                   disabled={gameState !== 'betting'}
                   className={cn(
                     "flex-1 relative rounded-xl border-2 transition-all duration-300 overflow-hidden group active:scale-95",
                     "bg-gradient-to-br from-blue-600/80 to-blue-900/80 border-blue-400/30",
                     winner === 'BLUE' ? "border-yellow-400 ring-4 ring-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.4)]" : "hover:border-white/20"
                   )}
                 >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                       <span className="text-[10px] font-black text-white/60">{(myBets.BLUE || 0)} / {(totalBets.BLUE || 0)}</span>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter mt-1">BLUE</h3>
                       <span className="text-xs font-black text-white/40">1.95x</span>
                    </div>
                    {/* Coin Scatter Layer */}
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center p-4 gap-0.5 pointer-events-none opacity-80 pt-16">
                       {Array.from({ length: Math.min(15, Math.ceil((totalBets.BLUE || 0) / 10)) }).map((_, i) => (
                         <GoldCoinIcon key={i} className="h-3 w-3 text-yellow-500 animate-in zoom-in" />
                       ))}
                    </div>
                 </button>

                 {/* Red Bet */}
                 <button 
                   onClick={() => handlePlaceBet('RED')}
                   disabled={gameState !== 'betting'}
                   className={cn(
                     "flex-1 relative rounded-xl border-2 transition-all duration-300 overflow-hidden group active:scale-95",
                     "bg-gradient-to-br from-red-600/80 to-red-900/80 border-red-400/30",
                     winner === 'RED' ? "border-yellow-400 ring-4 ring-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.4)]" : "hover:border-white/20"
                   )}
                 >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                       <span className="text-[10px] font-black text-white/60">{(myBets.RED || 0)} / {(totalBets.RED || 0)}</span>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter mt-1">RED</h3>
                       <span className="text-xs font-black text-white/40">1.95x</span>
                    </div>
                    {/* Coin Scatter Layer */}
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center p-4 gap-0.5 pointer-events-none opacity-80 pt-16">
                       {Array.from({ length: Math.min(15, Math.ceil((totalBets.RED || 0) / 10)) }).map((_, i) => (
                         <GoldCoinIcon key={i} className="h-3 w-3 text-yellow-500 animate-in zoom-in" />
                       ))}
                    </div>
                 </button>
              </div>

              {/* Bottom Row: Side Bets */}
              <div className="flex gap-1 h-24">
                 {SIDE_BETS.map(sb => (
                   <button 
                     key={sb.id}
                     onClick={() => handlePlaceBet(sb.id)}
                     disabled={gameState !== 'betting'}
                     className={cn(
                       "flex-1 relative rounded-lg border-2 transition-all duration-300 overflow-hidden group active:scale-95 bg-[#b88a44]/80 border-[#d4af37]/30",
                       "hover:border-white/20 flex flex-col items-center justify-center text-center p-1"
                     )}
                   >
                      <span className="text-[8px] font-black text-black/60">{(myBets[sb.id] || 0)} / {(totalBets[sb.id] || 0)}</span>
                      <h4 className="text-[9px] font-black uppercase leading-tight mt-1 text-black">{sb.label}</h4>
                      <span className="text-[10px] font-black text-black/40">{sb.multiplier}</span>
                      {/* Sparse Coin Scatter */}
                      <div className="absolute inset-0 flex flex-wrap items-center justify-center p-1 pointer-events-none opacity-60">
                         {Array.from({ length: Math.min(5, Math.ceil((totalBets[sb.id] || 0) / 5)) }).map((_, i) => (
                           <GoldCoinIcon key={i} className="h-2 w-2 text-yellow-600 animate-in zoom-in" />
                         ))}
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer Persistence */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-[#3d2b1f] to-transparent z-[120]">
           <div className="max-w-xl mx-auto flex flex-col gap-4">
              
              <div className="flex items-center justify-between">
                 <button className="bg-black/40 p-3 rounded-xl border border-white/10 text-white"><Users className="h-5 w-5" /></button>
                 
                 <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 pl-3 pr-1 py-1 shadow-xl">
                    <GoldCoinIcon className="h-5 w-5" />
                    <span className="text-sm font-black text-yellow-500 italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
                    <button className="bg-yellow-500 text-black rounded-full h-6 w-6 flex items-center justify-center ml-1"><RefreshCcw className="h-3 w-3" /></button>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="bg-[#dcdcdc] px-6 h-12 rounded-full font-black uppercase italic text-xs text-black shadow-xl active:scale-95 transition-all border-b-4 border-gray-400">
                    Repeat
                 </button>

                 <div className="flex-1 bg-black/40 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xl">
                    {CHIPS.map(chip => (
                      <button 
                       key={chip.value} 
                       onClick={() => setSelectedChip(chip.value)} 
                       className={cn(
                         "h-10 w-10 rounded-full flex items-center justify-center transition-all border-2 border-white/10 shrink-0 shadow-lg relative",
                         chip.color,
                         selectedChip === chip.value ? "scale-110 border-white ring-2 ring-white/30 z-10" : "opacity-60 hover:opacity-100"
                       )}
                      >
                         <span className="text-[10px] font-black text-white italic drop-shadow-md">{chip.label || chip.value}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </footer>

        <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </AppLayout>
  );
}
