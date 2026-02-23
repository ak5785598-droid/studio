'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { UmmyLogoIcon } from '@/components/icons';

/**
 * Root Application Entry / Splash Screen.
 * Displays the high-energy Ummy logo with a deep galaxy theme.
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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050510] overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-1/4 w-[100%] h-[100%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[100%] h-[100%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="relative h-56 w-56 flex items-center justify-center">
           <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
           <UmmyLogoIcon className="h-full w-full drop-shadow-[0_0_40px_rgba(251,191,36,0.5)]" />
        </div>
        <div className="flex flex-col items-center gap-3">
           <h1 className="font-headline text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl">
             UMMY
           </h1>
           <p className="text-primary font-black uppercase tracking-[0.5em] text-xs animate-pulse">
             Syncing Frequency...
           </p>
        </div>
      </div>
      
      <div className="absolute bottom-16 flex flex-col items-center gap-4 w-full px-12">
         <div className="h-1.5 w-full max-w-xs bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-loading-bar" style={{ width: '40%' }} />
         </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
