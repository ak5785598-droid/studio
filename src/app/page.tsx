
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { UmmyLogoIcon } from '@/components/icons';

/**
 * Root Application Entry / Splash Screen.
 * Handles the initial authentication handshake and routes the user.
 * Designed to match the high-energy, vibrant branding of the app.
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // We only want to redirect once the user's auth state is definitive.
    if (!isLoading) {
      if (user) {
        // If there's a user, go to the main app using replace to avoid history issues.
        router.replace('/rooms');
      } else {
        // If there's no user, go to the login page.
        router.replace('/login');
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
        <div className="relative h-32 w-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center p-4">
           <UmmyLogoIcon className="h-full w-full text-primary" />
        </div>
        <div className="flex flex-col items-center gap-2">
           <h1 className="font-headline text-5xl font-black text-white italic tracking-tighter drop-shadow-md">
             UMMY
           </h1>
           <p className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">
             Connecting Vibe...
           </p>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-4">
         <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-pulse" style={{ width: '40%' }} />
         </div>
      </div>
    </div>
  );
}
