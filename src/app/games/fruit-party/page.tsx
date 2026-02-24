'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useRoomContext } from '@/components/room-provider';
import { useUser, useFirestore, useUserProfile, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, increment, serverTimestamp } from 'firebase/firestore';
import { 
  ChevronLeft, 
  Mic, 
  MicOff, 
  Trophy, 
  Zap,
  Volume2,
  VolumeX,
  History,
  Crown,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ITEMS = [
  { id: 'apple', emoji: '🍎', multiplier: 5, label: '5x', color: 'bg-white' },
  { id: 'orange', emoji: '🍊', multiplier: 5, label: '5x', color: 'bg-white' },
  { id: 'lemon', emoji: '🍋', multiplier: 5, label: '5x', color: 'bg-white' },
  { id: 'cherry', emoji: '🍒', multiplier: 5, label: '5x', color: 'bg-white' },
  { id: 'strawberry', emoji: '🍓', multiplier: 10, label: '10x', color: 'bg-white' },
  { id: 'mango', emoji: '🥭', multiplier: 15, label: '15x', color: 'bg-white' },
  { id: 'grape', emoji: '🍇', multiplier: 45, label: '45x', color: 'bg-white' },
];

const CHIPS = [
  { value: 100, color: 'bg-green-500', label: '100' },
  { value: 1000, color: 'bg-blue-500', label: '1K' },
  { value: 100000, color: 'bg-purple-500', label: '100K' },
  { value: 500000, color: 'bg-emerald-600', label: '500K' },
  { value: 1000000, color: 'bg-slate-900', label: '1M' },
  { value: 10000000, color: 'bg-rose-600', label: '10M' },
  { value: 100000000, color: 'bg-amber-600', label: '100M' },
];

type RoundWinner = {
  name: string;
  amount: number;
  avatar: string;
  isMe?: boolean;
};

export default function FruitPartyPage() {
  const router = useRouter();
  const { activeRoom } = useRoomContext();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedChip, setSelectedChip] = useState(100);
  const [myBets, setMyBets] = useState<Record<string, number>>({});
  const [rotation, setRotation] = useState(0);
  const [spinningIndex, setSpinningIndex] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [lastWinners, setLastWinners] = useState<RoundWinner[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const participantsQuery = useMemoFirebase(() => {
    if (!firestore || !activeRoom?.id || !currentUser) return null;
    return query(collection(firestore, 'chatRooms', activeRoom.id, 'participants'));
  }, [firestore, activeRoom?.id, currentUser]);

  const { data: participants } = useCollection(participantsQuery);
  const currentUserParticipant = participants?.find(p => p.uid === currentUser?.uid);
  const activeSpeakers = participants?.filter(p => !p.isMuted && p.seatIndex > 0) || [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLaunching) return;

    const interval = setInterval(() => {
      if (gameState === 'betting') {
        if (timeLeft > 0) {
          setTimeLeft(prev => prev - 1);
        } else {
          const randomIndex = Math.floor(Math.random() * ITEMS.length);
          startSpin(randomIndex);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft, isLaunching]);

  const startSpin = (targetIdx: number) => {
    setGameState('spinning');
    
    const extraSpins = 40; 
    const sliceAngle = 360 / ITEMS.length;
    const landingAngle = (360 - (targetIdx * sliceAngle)) % 360;
    
    const baseRotation = Math.floor(rotation / 360) * 360;
    const totalRotation = baseRotation + (360 * extraSpins) + landingAngle;
    
    setTimeout(() => {
      setRotation(totalRotation);
      setResultId(ITEMS[targetIdx].id);
    }, 50);

    let cycleCount = 0;
    const cycleInterval = setInterval(() => {
      setSpinningIndex(prev => (prev + 1) % ITEMS.length);
      cycleCount++;
      if (cycleCount > 80) clearInterval(cycleInterval);
    }, 60);

    setTimeout(() => {
      clearInterval(cycleInterval);
      setSpinningIndex(targetIdx);
      showResult(ITEMS[targetIdx].id);
    }, 5050);
  };

  const showResult = (id: string) => {
    setGameState('result');
    setHistory(prev => [id, ...prev].slice(0, 12));
    
    const winningItem = ITEMS.find(i => i.id === id);
    const multiplier = winningItem?.multiplier || 0;
    const winAmount = (myBets[id] || 0) * multiplier;
    
    const realWinners: RoundWinner[] = [];

    if (winAmount > 0 && currentUser && firestore && userProfile) {
      setShowWinOverlay(true);
      const userRef = doc(firestore, 'users', currentUser.uid);
      const profileRef = doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid);
      const updateData = { 'wallet.coins': increment(winAmount), updatedAt: serverTimestamp() };
      
      updateDocumentNonBlocking(userRef, updateData);
      updateDocumentNonBlocking(profileRef, updateData);
      
      realWinners.push({ 
        name: userProfile.username, 
        amount: winAmount, 
        avatar: userProfile.avatarUrl,
        isMe: true 
      });

      setTimeout(() => setShowWinOverlay(false), 3000);
    }

    setLastWinners(realWinners);

    setTimeout(() => {
      setMyBets({});
      setGameState('betting');
      setTimeLeft(20);
      setResultId(null);
      setLastWinners([]);
    }, 6000); 
  };

  const handlePlaceBet = (itemId: string) => {
    if (gameState !== 'betting' || !currentUser || !firestore || !userProfile) return;
    if ((userProfile.wallet?.coins || 0) < selectedChip) {
      toast({ variant: 'destructive', title: 'Insufficient Coins' });
      return;
    }

    const userRef = doc(firestore, 'users', currentUser.uid);
    const profileRef = doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid);
    const updateData = { 'wallet.coins': increment(-selectedChip), updatedAt: serverTimestamp() };
    
    updateDocumentNonBlocking(userRef, updateData);
    updateDocumentNonBlocking(profileRef, updateData);

    setMyBets(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + selectedChip
    }));
  };

  const formatAmount = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    return v.toString();
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#87CEEB] flex flex-col items-center justify-center space-y-6 overflow-hidden">
        <div className="relative">
           <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl animate-pulse" />
           <div className="text-9xl animate-bounce relative z-10">🍓</div>
        </div>
        <div className="text-center space-y-2">
           <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Fruit Party</h1>
           <p className="text-white/80 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Syncing Tribe Frequencies...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout fullScreen>
      <div className="h-screen w-full bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#fad0c4] flex flex-col relative overflow-hidden font-headline">
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" autoPlay loop muted={isMuted} />

        {gameState === 'result' && lastWinners.length > 0 && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
             <div className="bg-black/90 backdrop-blur-2xl absolute inset-0" />
             <div className="relative z-10 text-center space-y-12 max-w-2xl w-full px-6">
                <div className="relative space-y-2">
                   <div className="absolute inset-0 bg-yellow-400/20 blur-[100px] animate-pulse rounded-full" />
                   <div className="flex justify-center mb-4"><Trophy className="h-16 w-16 text-yellow-400 animate-bounce" /></div>
                   <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Big Winner</h2>
                   <p className="text-orange-400 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" /> Party Legend Found <Sparkles className="h-4 w-4" />
                   </p>
                </div>
                <div className="flex flex-col items-center w-full max-w-xs mx-auto space-y-4">
                   <Avatar className="h-32 w-32 border-4 border-yellow-400 shadow-2xl">
                      <AvatarImage src={lastWinners[0].avatar} />
                      <AvatarFallback>U</AvatarFallback>
                   </Avatar>
                   <div className="bg-yellow-400/20 border-2 border-yellow-400/50 p-6 rounded-t-[2.5rem] w-full text-center space-y-1 backdrop-blur-xl">
                      <p className="text-lg font-black text-white uppercase italic tracking-tighter">{lastWinners[0].name}</p>
                      <p className="text-2xl font-black text-yellow-400 italic">+{formatAmount(lastWinners[0].amount)}</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
           <button onClick={() => router.back()} className="bg-black/20 backdrop-blur-xl p-3 rounded-full border-2 border-white/30 text-white hover:scale-110 transition-all shadow-xl">
              <ChevronLeft className="h-6 w-6" />
           </button>
           <div className="bg-yellow-400 text-black px-6 py-3 rounded-[1.5rem] border-4 border-white flex items-center gap-3 shadow-2xl">
              <Zap className="h-5 w-5 fill-current" />
              <span className="text-xl font-black italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
           </div>
           <button onClick={() => setIsMuted(!isMuted)} className="rounded-full h-12 w-12 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 flex items-center justify-center">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
           </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center pt-20 px-4 space-y-8">
           <div className="relative w-[22rem] h-[22rem] flex items-center justify-center">
              <div 
                className={cn(
                  "relative w-full h-full rounded-full border-[12px] border-white/40 shadow-2xl overflow-visible bg-white/10 backdrop-blur-md",
                  gameState === 'spinning' ? "transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)" : "transition-none"
                )}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                 {ITEMS.map((item, index) => {
                    const angle = (index / ITEMS.length) * 360;
                    const isWinner = gameState === 'result' && resultId === item.id;
                    const hasBet = !!myBets[item.id];
                    return (
                      <div 
                        key={item.id}
                        className="absolute w-24 h-24 flex items-center justify-center"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translate(140px)`
                        }}
                      >
                        <div 
                          className={cn(
                            "w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 border-4 bg-white shadow-xl",
                            gameState === 'spinning' ? "duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)" : "duration-300",
                            isWinner && "scale-125 z-50 ring-8 ring-yellow-400 border-white",
                            hasBet && "border-yellow-400 ring-4 ring-yellow-400/20"
                          )}
                          style={{ transform: `rotate(-${rotation + angle}deg)` }}
                        >
                           <span className="text-4xl drop-shadow-md">{item.emoji}</span>
                           <p className="text-[10px] font-black text-gray-500 uppercase italic">{item.label}</p>
                        </div>
                      </div>
                    );
                 })}
              </div>

              <div className="relative z-20 w-40 h-40 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center border-[8px] border-[#FFB347] overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#FFB347]/10 to-transparent" />
                 {gameState === 'betting' ? (
                   <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[10px] font-black text-[#FFB347] uppercase tracking-widest mb-1">Select Fruit</span>
                    <span className="text-5xl font-black text-[#FFB347] italic tracking-tighter">{timeLeft}s</span>
                   </div>
                 ) : (
                   <div className="relative z-10 flex flex-col items-center animate-in zoom-in">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Result</span>
                      <span className="text-7xl animate-bounce drop-shadow-xl">{ITEMS[spinningIndex].emoji}</span>
                   </div>
                 )}
              </div>
           </div>

           <div className="w-full max-w-lg bg-[#FFB347]/20 backdrop-blur-xl rounded-[3rem] border-4 border-white/40 p-6 space-y-4 shadow-2xl">
              <div className="grid grid-cols-4 gap-3">
                 {ITEMS.map(item => (
                   <button 
                    key={item.id} 
                    onClick={() => handlePlaceBet(item.id)}
                    disabled={gameState !== 'betting'}
                    className={cn(
                      "relative h-20 rounded-2xl bg-white border-2 flex flex-col items-center justify-center transition-all active:scale-95",
                      gameState !== 'betting' && "opacity-60",
                      myBets[item.id] && "border-yellow-400 ring-4 ring-yellow-400/20"
                    )}
                   >
                      <span className="text-3xl">{item.emoji}</span>
                      {myBets[item.id] && <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[8px] font-black border border-white">{formatAmount(myBets[item.id])}</div>}
                   </button>
                 ))}
              </div>
              
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                 {CHIPS.map(chip => (
                   <button 
                    key={chip.value} 
                    onClick={() => setSelectedChip(chip.value)}
                    className={cn(
                      "h-12 min-w-[48px] rounded-full flex items-center justify-center border-2 transition-all",
                      selectedChip === chip.value ? "bg-white text-black border-yellow-400 scale-110 shadow-lg" : "bg-white/10 text-white border-white/20"
                    )}
                   >
                      <span className="text-[10px] font-black italic">{chip.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </main>

        <footer className="p-8 flex justify-center items-center gap-10 relative z-50">
           <Button onClick={toggleMic} className={cn("rounded-full h-16 w-16 shadow-2xl", currentUserParticipant?.isMuted ? "bg-rose-500 text-white" : "bg-white text-blue-500")}>
             {currentUserParticipant?.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 animate-voice-wave" />}
           </Button>
        </footer>
      </div>
    </AppLayout>
  );
}
