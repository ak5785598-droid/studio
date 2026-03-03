
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { AppLayout } from '@/components/layout/app-layout';
import { ChevronLeft, HelpCircle, Plus, Heart, Award, Home, CreditCard, Scroll } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * CP House - High-Fidelity Love House Dimension.
 * Designed to mirror the provided blueprint exactly.
 */
export default function CpHousePage() {
  const router = useRouter();
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);

  const backgroundAsset = PlaceHolderImages.find(img => img.id === 'cp-house-bg');

  return (
    <AppLayout fullScreen>
      <div className="h-[100dvh] w-full bg-pink-100 flex flex-col relative overflow-hidden font-headline text-white select-none">
        
        {/* Cinematic Romantic Background */}
        <div className="absolute inset-0 z-0">
           {backgroundAsset && (
             <Image 
               src={backgroundAsset.imageUrl} 
               alt="CP House Background" 
               fill 
               className="object-cover opacity-80" 
               priority
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-transparent to-pink-900/40" />
        </div>

        {/* Top Navigation Bar */}
        <header className="relative z-50 flex items-center justify-between p-6 pt-12">
           <button 
             onClick={() => router.back()} 
             className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg active:scale-90 transition-transform"
           >
              <ChevronLeft className="h-6 w-6" />
           </button>
           <h1 className="text-2xl font-black uppercase italic tracking-tighter drop-shadow-md">Love house</h1>
           <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg">
              <HelpCircle className="h-6 w-6" />
           </button>
        </header>

        {/* CP Rank Badge */}
        <div className="relative z-50 flex justify-end px-6 mt-4">
           <div className="bg-gradient-to-r from-orange-400 to-orange-600 pl-4 pr-1 py-1 rounded-full flex items-center gap-2 shadow-xl border border-white/20">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-white">CP Rank</span>
              <div className="bg-amber-200 rounded-full p-1 border border-amber-600 shadow-inner">
                 <Award className="h-3 w-3 text-amber-800" />
              </div>
           </div>
        </div>

        {/* Main Sync Portal: Dual Avatars */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-10">
           <div className="flex items-center gap-8 mb-12">
              {/* User Identity */}
              <div className="flex flex-col items-center gap-3">
                 <div className="relative">
                    <div className="h-28 w-28 rounded-full border-[6px] border-cyan-400 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md">
                       <Avatar className="h-full w-full">
                          <AvatarImage src={userProfile?.avatarUrl} />
                          <AvatarFallback className="text-3xl bg-slate-100 text-black">{(userProfile?.username || 'U').charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="absolute -top-2 -left-2 bg-cyan-500 h-8 w-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                       <span className="font-black text-xs">{(userProfile?.username || 'U').charAt(0)}</span>
                    </div>
                 </div>
                 <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 shadow-lg">
                    <p className="text-xs font-black uppercase tracking-tight truncate w-24 text-center">{userProfile?.username}</p>
                 </div>
              </div>

              {/* Heart Centerpiece */}
              <div className="relative animate-pulse">
                 <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-40 scale-150" />
                 <span className="text-6xl drop-shadow-2xl filter saturate-150">❤️</span>
              </div>

              {/* Partner Placeholder */}
              <div className="flex flex-col items-center gap-3">
                 <div className="relative group cursor-pointer active:scale-95 transition-transform">
                    <div className="h-28 w-28 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
                       <Plus className="h-12 w-12 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                 </div>
                 <button className="bg-gradient-to-r from-orange-400 to-red-500 px-8 py-1.5 rounded-full font-black uppercase text-xs shadow-xl border border-white/20 active:scale-90 transition-transform">
                    ADD
                 </button>
              </div>
           </div>

           {/* CP Decoration Vault */}
           <div className="w-full max-w-sm px-6">
              <div className="bg-pink-100/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border-4 border-pink-200/50">
                 {/* Decoration Header Pill */}
                 <div className="flex justify-center -mt-9 mb-8">
                    <div className="bg-gradient-to-r from-pink-400 to-pink-600 px-12 py-1.5 rounded-full shadow-lg border border-white/20">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">CP decoration</span>
                    </div>
                 </div>

                 {/* Icons Grid */}
                 <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'CP token', icon: Heart, color: 'text-pink-400' },
                      { label: 'CP house', icon: Home, color: 'text-pink-400' },
                      { label: 'CP card', icon: CreditCard, color: 'text-pink-400' },
                      { label: 'Entry strip', icon: Scroll, color: 'text-pink-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition-transform">
                         <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-md border border-pink-50 relative overflow-hidden group-hover:shadow-lg">
                            <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <item.icon className={cn("h-7 w-7 relative z-10", item.color)} />
                         </div>
                         <span className="text-[8px] font-black uppercase text-pink-400 text-center leading-tight tracking-tighter">
                            {item.label}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </main>

        {/* Footer Sync Indicator */}
        <footer className="relative z-50 p-10 text-center">
           <div className="inline-block h-1 w-12 bg-white/20 rounded-full" />
        </footer>

      </div>
    </AppLayout>
  );
}
