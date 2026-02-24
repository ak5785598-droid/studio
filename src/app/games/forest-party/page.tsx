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
  Zap,
  Volume2,
  VolumeX,
  History,
  Trees,
  CloudSun,
  Trophy,
  Star,
  Crown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const ANIMALS = [
  { id: 'rabbit', emoji: '🐰', multiplier: 5, label: '5x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'deer', emoji: '🦌', multiplier: 5, label: '5x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'dog', emoji: '🐕', multiplier: 5, label: '5x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'camel', emoji: '🐪', multiplier: 5, label: '5x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'eagle', emoji: '🦅', multiplier: 10, label: '10x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'leopard', emoji: '🐆', multiplier: 15, label: '15x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'tiger', emoji: '🐅', multiplier: 25, label: '25x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
  { id: 'lion', emoji: '🦁', multiplier: 45, label: '45x', color: 'bg-emerald-50/10', shadow: 'shadow-emerald-500/20' },
];

const CHIPS = [
  { value: 100, color: 'bg-blue-600', label: '100' },
  { value: 1000, color: 'bg-yellow-500', label: '1K' },
  { value: 10000, color: 'bg-red-600', label: '10K' },
  { value: 100000, color: 'bg-purple-600', label: '100K' },
  { value: 500000, color: 'bg-emerald-600', label: '500K' },
  { value: 1000000, color: 'bg-slate-900', label: '1M' },
];

type RoundWinner = {
  name: string;
  amount: number;
  avatar: string;
  isMe?: boolean;
};

export default function ForestPartyPage() {
  const router = useRouter();
  const { activeRoom } = useRoomContext();
  const { user: currentUser } = useUser();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedChip, setSelectedChip] = useState(100);
  const [myBets, setMyBets] = useState<Record<string, number>>({});
  const [spinningIndex, setSpinningIndex] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [lastWinners, setLastWinners] = useState<RoundWinner[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);
  const [showWinOverlay, setShowWinOverlay] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const participantsQuery = useMemoFirebase(() => {
    if (!firestore || !activeRoom?.id || !currentUser) return null;
    return query(collection(firestore, 'chatRooms', activeRoom.id, 'participants'));
  }, [firestore, activeRoom?.id, currentUser]);

  const { data: participants } = useCollection(participantsQuery);
  const currentUserParticipant = participants?.find(p => p.uid === currentUser?.uid);
  const activeSpeakers = participants?.filter(p => !p.isMuted && p.seatIndex > 0) || [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLaunching) return;

    const interval = setInterval(() => {
      if (gameState === 'betting') {
        if (timeLeft > 0) {
          setTimeLeft(prev => prev - 1);
        } else {
          setGameState('spinning');
          const randomResult = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
          setResultId(randomResult.id);
          startSpin(randomResult.id);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft, isLaunching]);

  const startSpin = (targetId: string) => {
    let current = 0;
    const targetIdx = ANIMALS.findIndex(i => i.id === targetId);
    const spins = 24 + targetIdx; 
    let speed = 50;

    const runSpin = () => {
      setSpinningIndex(current % ANIMALS.length);
      if (current < spins) {
        current++;
        speed += current * 1.2;
        setTimeout(runSpin, speed > 250 ? 250 : speed);
      } else {
        setTimeout(() => showResult(targetId), 1000);
      }
    };
    runSpin();
  };

  const showResult = (id: string) => {
    setGameState('result');
    setHistory(prev => [id, ...prev].slice(0, 10));
    
    const winningAnimal = ANIMALS.find(i => i.id === id);
    const multiplier = winningAnimal?.multiplier || 0;
    const winAmount = (myBets[id] || 0) * multiplier;
    
    // Generate Round Winners for "Game Show" effect
    const mockWinners: RoundWinner[] = [
      { name: 'AlphaWolf', amount: 50000 * multiplier, avatar: 'https://picsum.photos/seed/wolf/100' },
      { name: 'TribeLeader', amount: 15000 * multiplier, avatar: 'https://picsum.photos/seed/leader/100' },
      { name: 'MistShadow', amount: 2500 * multiplier, avatar: 'https://picsum.photos/seed/ghost/100' },
    ];

    if (winAmount > 0 && currentUser && firestore && userProfile) {
      setLastWinAmount(winAmount);
      setShowWinOverlay(true);
      
      const userRef = doc(firestore, 'users', currentUser.uid);
      const profileRef = doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid);
      const updateData = { 'wallet.coins': increment(winAmount), updatedAt: serverTimestamp() };
      
      updateDocumentNonBlocking(userRef, updateData);
      updateDocumentNonBlocking(profileRef, updateData);
      
      mockWinners.unshift({ 
        name: userProfile.username, 
        amount: winAmount, 
        avatar: userProfile.avatarUrl,
        isMe: true 
      });

      setTimeout(() => setShowWinOverlay(false), 3500);
    }

    setLastWinners(mockWinners.sort((a, b) => b.amount - a.amount).slice(0, 3));

    setTimeout(() => {
      setMyBets({});
      setGameState('betting');
      setTimeLeft(10);
      setResultId(null);
      setLastWinners([]);
    }, 7000); // Extended result time for podium visibility
  };

  const handlePlaceBet = (itemId: string) => {
    if (gameState !== 'betting' || !currentUser || !firestore || !userProfile) return;
    
    const currentBalance = userProfile.wallet?.coins || 0;

    if (currentBalance < selectedChip) {
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

  const toggleMic = () => {
    if (!firestore || !activeRoom?.id || !currentUser || !currentUserParticipant) return;
    updateDocumentNonBlocking(
      doc(firestore, 'chatRooms', activeRoom.id, 'participants', currentUser.uid),
      { isMuted: !currentUserParticipant.isMuted }
    );
  };

  const formatAmount = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v.toString();
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#0a1a0a] flex flex-col items-center justify-center space-y-6 overflow-hidden">
        <div className="relative">
           <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
           <Trees className="h-32 w-32 text-green-500 animate-bounce relative z-10" />
        </div>
        <div className="text-center space-y-2">
           <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Forest Party</h1>
           <p className="text-green-400 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Entering the Misty Wild...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout fullScreen>
      <div className="h-screen w-full bg-gradient-to-b from-[#0f1612] via-[#1b2621] to-[#0f1612] flex flex-col relative overflow-hidden font-headline">
        
        {/* Animated Mist & Fireflies */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
           <div className="absolute top-20 left-10 text-emerald-400/20 blur-xl animate-float h-40 w-40 bg-emerald-500/10 rounded-full" />
           <div className="absolute bottom-40 right-20 text-emerald-400/20 blur-xl animate-float h-60 w-60 bg-emerald-500/10 rounded-full" style={{ animationDelay: '1s' }} />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-[20rem] opacity-10">🌲</div>
        </div>

        <audio 
          ref={audioRef} 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
          autoPlay 
          loop 
          muted={isMuted} 
        />

        {/* High-Fidelity Champions Podium Overlay */}
        {gameState === 'result' && lastWinners.length > 0 && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
             <div className="bg-black/90 backdrop-blur-2xl absolute inset-0" />
             <div className="relative z-10 text-center space-y-12 max-w-2xl w-full px-6">
                
                <div className="relative space-y-2">
                   <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse rounded-full" />
                   <div className="flex justify-center mb-4">
                      <div className="bg-emerald-500 p-4 rounded-3xl shadow-2xl shadow-emerald-500/40">
                         <Trophy className="h-12 w-12 text-white animate-bounce" />
                      </div>
                   </div>
                   <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Champions Circle</h2>
                   <p className="text-emerald-400 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" /> Frequency Legends <Sparkles className="h-4 w-4" />
                   </p>
                </div>

                {/* The Podium */}
                <div className="flex items-end justify-center gap-4 h-[300px]">
                   {/* Rank 2 */}
                   {lastWinners[1] && (
                     <div className="flex flex-col items-center w-1/3 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-200">
                        <div className="relative">
                           <Avatar className="h-20 w-20 border-4 border-slate-400 shadow-2xl">
                              <AvatarImage src={lastWinners[1].avatar} />
                              <AvatarFallback>U</AvatarFallback>
                           </Avatar>
                           <div className="absolute -top-2 -left-2 bg-slate-400 text-black text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-black">2</div>
                        </div>
                        <div className="bg-slate-400/10 border-2 border-slate-400/30 p-4 rounded-t-3xl w-full text-center space-y-1 backdrop-blur-md">
                           <p className="text-sm font-black text-white truncate uppercase italic">{lastWinners[1].name}</p>
                           <p className="text-lg font-black text-slate-400 italic">+{formatAmount(lastWinners[1].amount)}</p>
                        </div>
                     </div>
                   )}

                   {/* Rank 1 (The Winner) */}
                   {lastWinners[0] && (
                     <div className="flex flex-col items-center w-1/3 space-y-4 animate-in slide-in-from-bottom-20 duration-1000">
                        <div className="relative">
                           <div className="absolute -inset-4 bg-yellow-400/20 blur-2xl animate-pulse rounded-full" />
                           <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 h-12 w-12 text-yellow-400 drop-shadow-xl animate-bounce" />
                           <Avatar className="h-28 w-28 border-4 border-yellow-400 shadow-[0_0_40px_rgba(251,191,36,0.6)]">
                              <AvatarImage src={lastWinners[0].avatar} />
                              <AvatarFallback>U</AvatarFallback>
                           </Avatar>
                           <div className="absolute -top-2 -left-2 bg-yellow-400 text-black text-sm font-black h-10 w-10 rounded-full flex items-center justify-center border-4 border-black ring-2 ring-yellow-400/50">1</div>
                        </div>
                        <div className="bg-yellow-400/20 border-2 border-yellow-400/50 p-6 rounded-t-[2.5rem] w-full text-center space-y-1 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shine-gloss" />
                           <p className="text-lg font-black text-white uppercase italic tracking-tighter">{lastWinners[0].name}</p>
                           <p className="text-2xl font-black text-yellow-400 italic flex items-center justify-center gap-1">
                              <Zap className="h-5 w-5 fill-current" />
                              {formatAmount(lastWinners[0].amount)}
                           </p>
                           {lastWinners[0].isMe && <Badge className="bg-yellow-400 text-black text-[10px] font-black uppercase mt-2">You Won!</Badge>}
                        </div>
                     </div>
                   )}

                   {/* Rank 3 */}
                   {lastWinners[2] && (
                     <div className="flex flex-col items-center w-1/3 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-400">
                        <div className="relative">
                           <Avatar className="h-20 w-20 border-4 border-amber-700 shadow-2xl">
                              <AvatarImage src={lastWinners[2].avatar} />
                              <AvatarFallback>U</AvatarFallback>
                           </Avatar>
                           <div className="absolute -top-2 -left-2 bg-amber-700 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-black">3</div>
                        </div>
                        <div className="bg-amber-700/10 border-2 border-amber-700/30 p-4 rounded-t-3xl w-full text-center space-y-1 backdrop-blur-md">
                           <p className="text-sm font-black text-white truncate uppercase italic">{lastWinners[2].name}</p>
                           <p className="text-lg font-black text-amber-700 italic">+{formatAmount(lastWinners[2].amount)}</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="pt-8">
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Next Frequency...</p>
                </div>
             </div>
          </div>
        )}

        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="bg-white/5 backdrop-blur-xl p-3 rounded-full border border-white/10 text-white hover:scale-110 transition-all shadow-xl"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="bg-emerald-900/20 backdrop-blur-xl px-6 py-3 rounded-[1.5rem] border border-emerald-500/20 flex items-center gap-4 shadow-2xl">
                 <div className="flex -space-x-3">
                    {activeSpeakers.slice(0, 3).map(p => (
                      <Avatar key={p.uid} className="h-8 w-8 border-2 border-emerald-500 shadow-lg animate-voice-wave">
                        <AvatarImage src={p.avatarUrl} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                 </div>
                 <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Misty Tribe</p>
                    <p className="text-xs font-black text-white uppercase truncate w-28 italic">{activeRoom?.title || 'Wild Hub'}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-[1.5rem] border-4 border-emerald-600 flex items-center gap-3 shadow-2xl">
                 <Zap className="h-5 w-5 fill-current text-yellow-400" />
                 <span className="text-xl font-black italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full h-12 w-12 bg-white/5 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:scale-110 transition-all shadow-xl"
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
           </div>
        </header>

        {/* Misty Wheel Section */}
        <main className="flex-1 flex flex-col items-center justify-center pt-20 px-4 space-y-8">
           
           <div className="relative w-[24rem] h-[24rem] flex items-center justify-center mt-4">
              <div className="absolute inset-0 border-[16px] border-emerald-900/20 rounded-full" />
              <div className="absolute inset-6 border-[2px] border-emerald-500/10 border-dashed animate-spin-slow" />
              
              {/* Animal Pods - Glass Styled */}
              {ANIMALS.map((animal, index) => {
                const angle = (index / ANIMALS.length) * 360;
                const isActive = spinningIndex === index;
                const isWinner = gameState === 'result' && resultId === animal.id;
                const hasBet = !!myBets[animal.id];
                
                return (
                  <button 
                    key={animal.id}
                    onClick={() => handlePlaceBet(animal.id)}
                    disabled={gameState !== 'betting'}
                    className={cn(
                      "absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-2 active:scale-90 group z-10 backdrop-blur-xl",
                      isActive ? "scale-125 z-30 border-white shadow-[0_0_40px_rgba(52,211,153,0.6)]" : "border-emerald-500/20 shadow-xl",
                      isWinner && "animate-bounce scale-150 z-[40] ring-8 ring-emerald-400 border-white",
                      hasBet ? "border-emerald-400 ring-4 ring-emerald-400/20" : "opacity-100",
                      gameState !== 'betting' && !isActive && !isWinner && "grayscale-[0.5] opacity-50",
                      animal.color
                    )}
                    style={{
                      transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`
                    }}
                  >
                    <span className="text-4xl group-hover:scale-125 transition-transform drop-shadow-md">{animal.emoji}</span>
                    <p className="text-[10px] font-black text-emerald-400 uppercase italic mt-1">{animal.label}</p>
                    
                    {hasBet && (
                      <div className="absolute -top-4 -right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg animate-in zoom-in bounce-in ring-2 ring-white z-50 flex items-center gap-1">
                         <Zap className="h-2 w-2 fill-current text-yellow-400" />
                         {formatAmount(myBets[animal.id])}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Central Hub */}
              <div className="relative z-20 w-44 h-44 bg-[#0f1a15] rounded-full shadow-2xl flex flex-col items-center justify-center border-[10px] border-emerald-900 group overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                 {gameState === 'betting' ? (
                   <div className="relative z-10 flex flex-col items-center animate-in fade-in">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 text-center">Select<br/>Wild One</span>
                    <span className="text-5xl font-black text-white italic tracking-tighter drop-shadow-sm">{timeLeft}s</span>
                   </div>
                 ) : (
                   <div className="relative z-10 flex flex-col items-center animate-in zoom-in">
                      <span className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest mb-1">Frequency</span>
                      <span className="text-7xl animate-bounce">{ANIMALS[spinningIndex].emoji}</span>
                   </div>
                 )}
              </div>
           </div>

           {/* High-Stakes Deck */}
           <div className="w-full max-w-lg bg-black/40 backdrop-blur-2xl rounded-[3rem] border-2 border-white/10 p-6 space-y-4 shadow-2xl relative overflow-hidden mt-8">
              <div className="flex justify-between items-center px-4">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Tribe Wager Bar</p>
                 <CloudSun className="h-4 w-4 text-emerald-500" />
              </div>
              
              <div className="flex justify-between gap-3 px-2 h-20 items-center overflow-x-auto no-scrollbar">
                 {CHIPS.map(chip => (
                   <button 
                    key={chip.value}
                    onClick={() => setSelectedChip(chip.value)}
                    className={cn(
                      "flex-1 h-16 min-w-[64px] rounded-full flex flex-col items-center justify-center transition-all border-4 active:scale-90 relative",
                      selectedChip === chip.value 
                        ? "border-emerald-400 shadow-2xl -translate-y-2 scale-110 z-10 " + chip.color
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                   >
                      <span className="text-xs font-black italic">{chip.label}</span>
                      {selectedChip === chip.value && <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />}
                   </button>
                 ))}
              </div>
           </div>

           {/* Mist Log History */}
           <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-xl overflow-hidden max-w-[90vw]">
              <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                 <History className="h-4 w-4 text-emerald-500" />
                 <span className="text-[8px] font-black text-white uppercase">Misty Log</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {history.map((id, i) => (
                  <div key={i} className="h-8 w-8 bg-emerald-500/10 rounded-full flex items-center justify-center text-xl border border-emerald-500/20 animate-in slide-in-from-right-10 duration-500">
                    {ANIMALS.find(item => item.id === id)?.emoji}
                  </div>
                ))}
                {history.length === 0 && <span className="text-[8px] font-black text-white/40 uppercase italic tracking-widest px-4 py-2">Waiting for first strike...</span>}
              </div>
           </div>
        </main>

        <footer className="p-8 flex justify-center items-center gap-10 pb-12 relative z-50">
           <Button 
             onClick={toggleMic}
             className={cn(
               "rounded-full h-20 w-20 shadow-2xl transition-all scale-110 border-4",
               currentUserParticipant?.isMuted 
                ? "bg-rose-600 border-rose-400 text-white" 
                : "bg-emerald-600 border-emerald-400 text-white hover:scale-125"
             )}
           >
             {currentUserParticipant?.isMuted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8 animate-voice-wave" />}
           </Button>
        </footer>

      </div>
    </AppLayout>
  );
}
