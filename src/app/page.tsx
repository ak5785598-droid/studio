'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { UmmyLogoIcon } from '@/components/icons';

/**
 * Root Application Entry / Splash Screen.
 * Handles the initial authentication handshake and routes the user.
 * Displays the high-energy Ummy logo.
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/rooms');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
        <div className="relative h-48 w-48 bg-transparent flex items-center justify-center">
           <UmmyLogoIcon className="h-full w-full drop-shadow-[0_0_30px_rgba(244,114,182,0.4)]" />
        </div>
        <div className="flex flex-col items-center gap-2">
           <h1 className="font-headline text-6xl font-black text-white italic tracking-tighter drop-shadow-lg">
             UMMY
           </h1>
           <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
             Synchronizing Frequency...
           </p>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-4">
         <div className="h-1.5 w-40 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left' }} />
         </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}
