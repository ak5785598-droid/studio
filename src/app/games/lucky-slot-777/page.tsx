'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useUser, useFirestore, useUserProfile, updateDocumentNonBlocking } from '@/firebase';
import { doc, increment, serverTimestamp } from 'firebase/firestore';
import { 
  Zap,
  History,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CompactRoomView } from '@/components/compact-room-view';

const WHEEL_DISTRIBUTION = ['watermelon', 'peach', 'watermelon', 'peach', 'watermelon', 'watermelon', 'peach', 'seven'];
const CHIPS = [
  { value: 100, color: 'bg-blue-600', label: '100' },
  { value: 1000, color: 'bg-yellow-500', label: '1K' },
  { value: 100000, color: 'bg-purple-600', label: '100K' },
  { value: 500000, color: 'bg-emerald-600', label: '500K' },
];

export default function LuckySlot777Page() {
  const router = useRouter();
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
  const [history, setHistory] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLaunching) return;
    const interval = setInterval(() => {
      if (gameState === 'betting') {
        if (timeLeft > 0) setTimeLeft(prev => prev - 1);
        else startSpin();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, timeLeft, isLaunching]);

  const startSpin = () => {
    setGameState('spinning');
    const targetIdx = Math.floor(Math.random() * WHEEL_DISTRIBUTION.length);
    const sliceAngle = 360 / WHEEL_DISTRIBUTION.length;
    const extraSpins = 50; 
    const landingAngle = (360 - (targetIdx * sliceAngle)) % 360;
    const baseRotation = Math.floor(rotation / 360) * 360;
    const totalRotation = baseRotation + (360 * extraSpins) + landingAngle;
    
    setTimeout(() => setRotation(totalRotation), 50);
    setTimeout(() => showResult(WHEEL_DISTRIBUTION[targetIdx]), 5050);
  };

  const showResult = (id: string) => {
    setGameState('result');
    setHistory(prev => [id, ...prev].slice(0, 12));
    setTimeout(() => {
      setMyBets({});
      setGameState('betting');
      setTimeLeft(20);
    }, 4000);
  };

  const handlePlaceBet = (id: string) => {
    if (gameState !== 'betting' || !currentUser || !userProfile) return;
    if ((userProfile.wallet?.coins || 0) < selectedChip) {
      toast({ variant: 'destructive', title: 'Insufficient Coins' });
      return;
    }
    const updateData = { 'wallet.coins': increment(-selectedChip), updatedAt: serverTimestamp() };
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid), updateData);
    updateDocumentNonBlocking(doc(firestore, 'users', currentUser.uid, 'profile', currentUser.uid), updateData);
    setMyBets(prev => ({ ...prev, [id]: (prev[id] || 0) + selectedChip }));
  };

  if (isLaunching) {
    return (
      <div className="h-screen w-full bg-[#1a0a2e] flex flex-col items-center justify-center space-y-6">
        <div className="text-8xl animate-bounce">🎰</div>
        <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">Lucky Slot</h1>
      </div>
    );
  }

  return (
    <AppLayout fullScreen>
      <div className="h-screen w-full bg-[#1a0a2e] flex flex-col relative overflow-hidden font-headline">
        <CompactRoomView />

        <div className="flex-1 flex flex-col items-center pt-32 pb-32 px-4 z-10 overflow-y-auto">
           <header className="w-full flex items-center justify-between mb-6">
              <div className="bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                 <History className="h-3 w-3 text-yellow-500" />
                 <div className="flex gap-1">
                    {history.slice(0, 6).map((id, i) => (
                      <span key={i} className="text-xs">{id === 'seven' ? '7️⃣' : (id === 'peach' ? '🍑' : '🍉')}</span>
                    ))}
                 </div>
              </div>
              <button onClick={() => router.back()} className="bg-white/10 p-1.5 rounded-full text-white"><X className="h-4 w-4" /></button>
           </header>

           <div className="relative w-64 h-64 flex items-center justify-center scale-110 mt-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                 <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-900 rotate-45 border-2 border-yellow-500" />
                 <div className="w-4 h-6 bg-yellow-500 clip-path-triangle -mt-1 shadow-lg" />
              </div>
              <div className={cn("relative w-full h-full rounded-full border-[8px] border-yellow-500 shadow-2xl", gameState === 'spinning' ? "transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)" : "transition-none")} style={{ transform: `rotate(${rotation}deg)` }}>
                 <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
                    {WHEEL_DISTRIBUTION.map((id, i) => {
                      const angle = i * 45;
                      return (
                        <g key={i} transform={`rotate(${angle} 50 50)`}>
                           <path d="M 50 50 L 50 0 A 50 50 0 0 1 85.35 14.65 Z" fill={id === 'seven' ? '#ff00cc' : '#0099ff'} stroke="#fbbf24" strokeWidth="0.5" />
                           <text x="68" y="28" transform="rotate(22.5 68 28)" fontSize="8" textAnchor="middle" className="font-black fill-white">{id === 'seven' ? '777' : (id === 'peach' ? '🍑' : '🍉')}</text>
                        </g>
                      );
                    })}
                 </svg>
              </div>
              <div className="absolute z-20 w-20 h-24 bg-black rounded-full shadow-2xl flex flex-col items-center justify-center border-[4px] border-yellow-500">
                 <span className="text-3xl font-black text-white italic">{gameState === 'betting' ? timeLeft : '🎰'}</span>
              </div>
           </div>

           <div className="w-full max-w-sm grid grid-cols-3 gap-3 px-2 mt-12">
              {['peach', 'seven', 'watermelon'].map(id => (
                <button key={id} onClick={() => handlePlaceBet(id)} disabled={gameState !== 'betting'} className={cn("relative h-32 rounded-2xl border-2 transition-all flex flex-col items-center justify-center bg-gradient-to-b from-[#4a1d96] to-[#2d0b5a]", myBets[id] && "border-yellow-400 ring-2 ring-yellow-400/20")}>
                   <span className="text-4xl mb-1">{id === 'seven' ? '777' : (id === 'peach' ? '🍑' : '🍉')}</span>
                   <span className="text-xl font-black text-yellow-400 italic">{id === 'seven' ? 'x8' : 'x2'}</span>
                   {myBets[id] && <div className="absolute top-1 right-1 text-[8px] font-black text-white bg-black/40 px-1.5 rounded-full">{(myBets[id] / 1000).toFixed(0)}K</div>}
                </button>
              ))}
           </div>

           <div className="w-full max-w-sm fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2 bg-white/5 px-3 h-10 rounded-full">
                 <Zap className="h-3 w-3 text-yellow-400 fill-current" />
                 <span className="text-xs font-black text-white italic">{(userProfile?.wallet?.coins || 0).toLocaleString()}</span>
              </div>
              <div className="flex gap-1.5 px-2">
                 {CHIPS.map(chip => (
                   <button key={chip.value} onClick={() => setSelectedChip(chip.value)} className={cn("h-9 w-9 rounded-full flex items-center justify-center transition-all border-2", selectedChip === chip.value ? chip.color + " border-white scale-110" : "bg-black/40 border-white/10")}>
                      <span className="text-[7px] font-black text-white italic">{chip.label}</span>
                   </button>
                 ))}
              </div>
              <button className="h-12 w-12 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center active:scale-90"><Zap className="h-5 w-5 text-white" /></button>
           </div>
        </div>
        <style jsx global>{`.clip-path-triangle { clip-path: polygon(50% 100%, 0 0, 100% 0); }`}</style>
      </div>
    </AppLayout>
  );
}
