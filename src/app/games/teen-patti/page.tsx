
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
  History,
  HelpCircle,
  Trophy,
  Users,
  RefreshCcw,
  MessageCircle,
  Plus
} from 'lucide-react';
import { GoldCoinIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CompactRoomView } from '@/components/compact-room-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const CHIPS = [
  { value: 20, color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/50' },
  { value: 100, color: 'from-green-400 to-green-600', shadow: 'shadow-green-500/50' },
  { value: 1000, label: '1K', color: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-500/50' },
  { value: 10000, label: '10K', color: 'from-red-400 to-red-600', shadow: 'shadow-red-500/50' },
  { value: 100000, label: '100K', color: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/50' },
];

const SECTIONS = [
  { id: 'A', label: 'A', characterId: 'tp-char-a', color: 'border-white/20' },
  { id: 'B', label: 'B', characterId: 'tp-char-b', color: 'border-yellow-500/40' },
  { id: 'C', label: 'C', characterId: 'tp-char-c', color: 'border-amber-700/40' },
];

export default function TeenPattiPalacePage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'betting' | 'calculating' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedChip, setSelectedChip] = useState(100);
  const [myBets, setMyBets] = useState<Record<string, number>>({ A: 0, B: 0, C: 0 });
  const [lastBets, setLastBets] = useState<Record<string, number>>({ A: 0, B: 0, C: 0 });
  const [totalPots, setTotalPots] = useState<Record<string, number>>({ A: 0, B: 0, C: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<any[]>([]);

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
      const winId = SECTIONS[Math.floor(Math.random() * 3)].id;
      showResult(winId);
    }, 3000);
  };

  const showResult = (winId: string) => {
    setWinner(winId);
    const winAmount = (myBets[winId] || 0) * 2.95;
    const sessionWinners = [];

    if (winAmount > 0 && userProfile) {
      sessionWinners.push({ name: userProfile.username, win: Math.floor(winAmount), avatar: userProfile.avatarUrl, isMe: true });
    }

    setWinners(sessionWinners);
    setGameState('result');

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
      setLastBets(myBets);
      setMyBets({ A: 0, B: 0, C: 0 });
      setTotalPots({ A: 0, B: 0, C: 0 });
      setWinner(null);
      setWinners([]);
      setGameState('betting');
      setTimeLeft(15);
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
    setTotalPots(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip + Math.floor(Math.random() * 500) }));
  };

  const handleRepeat = () => {
    if (gameState !== 'betting' || !currentUser || !userProfile) return;
    const totalCost = Object.values(lastBets).reduce((a, b) => a + b, 0);
    if (totalCost === 0) return;
    if ((userProfile.wallet?.coins || 0) < totalCost) {
      toast({ variant: 'destructive', title: 'Insufficient Coins' });
      return;
    }

    playBetSound();
    const updateData = { 'wallet.coins': increment(-totalCost), updatedAt: serverTimestamp() };
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
    setMyBets(lastBets);
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#1a0a05] flex flex-col items-center justify-center space-y-6">
        <div className="text-8xl animate-bounce">🏰</div>
        <h1 className="text-4xl font-black text-yellow-500 uppercase italic tracking-tighter">Teen Patti Palace</h1>
        <p className="text-white/40 uppercase tracking-widest text-[10px] animate-pulse">Entering the Ballroom...</p>
      </div>
    );
  }

  const backgroundAsset = PlaceHolderImages.find(img => img.id === 'teen-patti-bg');

  return (
    <AppLayout fullScreen>
      <div className="h-[100dvh] w-full bg-black flex flex-col relative overflow-hidden font-headline text-white animate-in fade-in duration-1000">
        <CompactRoomView />

        {/* Backdrop Layer */}
        <div className="absolute inset-0 z-0">
           {backgroundAsset && (
             <img 
               src={backgroundAsset.imageUrl} 
               className="h-full w-full object-cover opacity-40 grayscale-[0.2]" 
               alt={backgroundAsset.description} 
               data-ai-hint={backgroundAsset.imageHint}
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>

        {/* Top Header UI */}
        <div className="relative z-[110] flex items-center justify-between p-4 pt-32">
           <div className="flex gap-2">
              <button onClick={() => router.back()} className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><HelpCircle className="h-5 w-5" /></button>
           </div>
           <div className="flex gap-2">
              <button className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><MessageCircle className="h-5 w-5" /></button>
              <button className="bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md"><History className="h-5 w-5" /></button>
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 px-4 py-1.5 shadow-xl">
                <GoldCoinIcon className="h-5 w-5" />
                <span className="text-sm font-black text-yellow-500 italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
                <button className="bg-yellow-500 text-black rounded-full h-5 w-5 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
              </div>
           </div>
        </div>

        {/* Game Title */}
        <div className="relative z-10 text-center mt-2">
           <h1 className="text-3xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 drop-shadow-lg">
             Teenpatti
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500/60 -mt-1">Palace Ball</p>
        </div>

        {/* Central Arena */}
        <main className="flex-1 relative z-10 flex flex-col items-center pt-4">
           
           {/* Cards Layout */}
           <div className="w-full flex justify-around px-4 mb-8">
              {SECTIONS.map(s => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                   <div className="flex gap-0.5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={cn(
                          "w-10 h-14 rounded-md border border-yellow-500/30 transition-all duration-500 bg-[#3d2b1f] flex items-center justify-center overflow-hidden",
                          winner === s.id && "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)] scale-110 -translate-y-2"
                        )}>
                           <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-yellow-500/20 rounded-full flex items-center justify-center">
                                 <div className="w-3 h-3 bg-yellow-500/10 rounded-full" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-2xl italic font-serif font-black text-yellow-500">{s.label}</span>
                      <span className="text-sm font-black text-white/60">2.95</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Circular Timer */}
           <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-white/5 flex items-center justify-center bg-black/40 backdrop-blur-md">
                 <div className="absolute inset-0 border-4 border-yellow-500 rounded-full" style={{ clipPath: `inset(0 0 ${100 - (timeLeft/15)*100}% 0)` }} />
                 <span className="text-2xl font-black italic">{timeLeft}s</span>
              </div>
           </div>

           {/* Character & Betting Areas */}
           <div className="flex-1 w-full flex items-end justify-between px-4 pb-32 relative">
              {SECTIONS.map(s => {
                const asset = PlaceHolderImages.find(img => img.id === s.characterId);
                return (
                  <div key={s.id} className="relative w-1/3 h-full flex flex-col justify-end group">
                     {/* 3D Character Visual */}
                     <div className={cn(
                       "absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-72 transition-all duration-700 pointer-events-none transform-gpu",
                       winner === s.id ? "scale-125 z-20" : "scale-100 z-10 opacity-80"
                     )}>
                        {asset && (
                          <img 
                            src={asset.imageUrl} 
                            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" 
                            alt={s.label} 
                            data-ai-hint={asset.imageHint}
                          />
                        )}
                     </div>

                     {/* Bet Area Box */}
                     <button 
                       onClick={() => handlePlaceBet(s.id)}
                       disabled={gameState !== 'betting'}
                       className={cn(
                         "relative h-32 rounded-2xl border-2 transition-all duration-300 p-3 bg-black/40 backdrop-blur-md flex flex-col justify-between overflow-hidden active:scale-95 active:bg-yellow-500/10",
                         s.color,
                         winner === s.id ? "border-yellow-500 ring-4 ring-yellow-500/20" : "hover:border-white/40"
                       )}
                     >
                        {/* Coin Animation Container */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full flex flex-wrap justify-center gap-0.5 opacity-80 pointer-events-none">
                           {Array.from({ length: Math.min(15, Math.ceil((totalPots[s.id] || 0) / 100)) }).map((_, i) => (
                             <GoldCoinIcon key={i} className="h-2.5 w-2.5 text-yellow-500" />
                           ))}
                        </div>

                        <div className="mt-auto space-y-0.5">
                           <p className="text-[10px] font-black uppercase text-white/40">Pot: <span className="text-white">{totalPots[s.id].toLocaleString()}</span></p>
                           <p className="text-[10px] font-black uppercase text-white/40">You: <span className="text-yellow-500">{myBets[s.id].toLocaleString()}</span></p>
                        </div>
                     </button>
                  </div>
                );
              })}
           </div>
        </main>

        {/* Footer Interaction Bar */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent z-[120]">
           <div className="max-w-md mx-auto flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-2xl p-2 rounded-full border border-white/10 flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar shadow-2xl">
                 {CHIPS.map(chip => (
                   <button 
                    key={chip.value} 
                    onClick={() => setSelectedChip(chip.value)} 
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center transition-all border-2 border-white/20 shrink-0 shadow-lg relative bg-gradient-to-b",
                      chip.color,
                      selectedChip === chip.value ? "scale-110 border-white ring-4 ring-white/20 z-10 " + chip.shadow : "opacity-60 grayscale-[0.3]"
                    )}
                   >
                      <span className="text-[11px] font-black text-white italic drop-shadow-md">{chip.label || chip.value}</span>
                   </button>
                 ))}
              </div>
              
              <button className="bg-white/10 p-3 rounded-full border border-white/10 backdrop-blur-md">
                 <Users className="h-6 w-6 text-white" />
              </button>

              <button 
                onClick={handleRepeat}
                className="bg-gradient-to-b from-gray-200 to-gray-400 px-6 h-12 rounded-full font-black uppercase italic text-xs text-black shadow-xl active:scale-90 transition-all"
              >
                Repeat
              </button>
           </div>
        </footer>

        {/* Win Overlay */}
        {gameState === 'result' && winners.length > 0 && (
          <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in zoom-in duration-500 p-6">
             <Trophy className="h-20 w-20 text-yellow-400 animate-bounce mb-4" />
             <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter text-center mb-8">Tribe Winner</h2>
             <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-4 border-yellow-400 shadow-2xl">
                   <AvatarImage src={winners[0].avatar} />
                   <AvatarFallback>W</AvatarFallback>
                </Avatar>
                <div className="text-center">
                   <p className="text-2xl font-black text-white uppercase italic">{winners[0].name}</p>
                   <p className="text-3xl font-black text-yellow-500">+{winners[0].win.toLocaleString()} Coins</p>
                </div>
             </div>
          </div>
        )}

        <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </AppLayout>
  );
}
