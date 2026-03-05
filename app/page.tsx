'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { UmmyLogoIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const [showFailSafe, setShowFailSafe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowFailSafe(true), 2500);

    if (!isUserLoading) {
      const destination = user ? '/rooms' : '/login';
      router.replace(destination);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, user, router]);

  const handleManualEntry = () => {
    window.location.href = user ? '/rooms' : '/login';
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[#FFCC00] overflow-hidden relative font-headline select-none touch-none">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700 relative z-10">
        <UmmyLogoIcon className="h-48 w-48 drop-shadow-2xl" />
        <div className="text-center">
           <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Ummy</h1>
           <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] opacity-80 mt-2">Connecting Your Tribe</p>
        </div>
      </div>
      
      <div className="absolute bottom-24 w-full px-12 flex flex-col items-center gap-6">
         {showFailSafe ? (
           <Button onClick={handleManualEntry} className="bg-white text-[#FFCC00] rounded-full px-10 h-14 font-black uppercase shadow-2xl">
             Enter Frequency <ArrowRight className="ml-2 h-5 w-5" />
           </Button>
         ) : (
           <div className="flex flex-col items-center gap-4">
              <div className="h-1 w-48 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-loading-bar" style={{ width: '45%' }} />
              </div>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Syncing Social Graph...</p>
           </div>
         )}
      </div>
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-loading-bar { animation: loading-bar 1.5s linear infinite; }
      `}</style>
    </div>
  );
}