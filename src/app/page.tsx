'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { UmmyLogoIcon } from '@/components/icons';

/**
 * Root Application Entry / Splash Screen.
 * Now precisely matching the provided Yari design with solid yellow background and Bear logo.
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Redirection happens immediately upon auth resolution to maximize speed.
    if (!isLoading) {
      setTimeout(() => {
        if (user) {
          router.replace('/rooms');
        } else {
          router.replace('/login');
        }
      }, 2000); // Slight delay to show the high-fidelity splash
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FFCC00] overflow-hidden relative font-headline">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="relative h-48 w-48 flex items-center justify-center">
           <UmmyLogoIcon className="h-full w-full drop-shadow-xl" />
        </div>
        
        <div className="flex flex-col items-center gap-2 mt-4">
           <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase italic drop-shadow-sm">
             Ummy
           </h1>
           <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] opacity-90">
             Connecting Vibe...
           </p>
        </div>
      </div>
      
      <div className="absolute bottom-20 flex flex-col items-center gap-4 w-full px-12">
         <div className="h-[2px] w-48 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-loading-bar" style={{ width: '40%' }} />
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
