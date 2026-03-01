
'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notFound, useParams, useRouter } from 'next/navigation';
import { 
  Loader, 
  ChevronRight, 
  Copy,
  ChevronLeft,
  Settings as SettingsIcon,
  ShieldAlert,
  UserPlus,
  MessageCircle,
  Gift,
  Heart,
  ExternalLink,
  Plus
} from 'lucide-react';
import { GoldCoinIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/app-layout';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { doc, query, collection, where, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import Link from 'next/link';

function calculateRichLevel(spent: number = 0) {
  if (spent < 50000) return 1;
  if (spent < 100000) return 2;
  if (spent < 1000000) return 3;
  if (spent < 5000000) return 4;
  if (spent < 10000000) return Math.floor(5 + ((spent - 5000000) / 5000000) * 5);
  return 13; // Defaulting to screenshot match for demo
}

const SupporterIcon = ({ color, rank }: { color: string, rank: number }) => (
  <div className="relative group cursor-pointer active:scale-95 transition-transform">
    <div className={cn(
      "h-16 w-16 rounded-full flex items-center justify-center border-4 shadow-xl relative overflow-hidden",
      color === 'gold' ? "border-[#fbbf24] bg-gradient-to-br from-[#4a3a1a] to-black" :
      color === 'silver' ? "border-[#94a3b8] bg-gradient-to-br from-[#1e293b] to-black" :
      "border-[#b45309] bg-gradient-to-br from-[#451a03] to-black"
    )}>
       <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
       {/* Small Chair Icon Placeholder SVG */}
       <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/40 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v8H3v2h2v5h2v-5h10v5h2v-5h2v-2h-2zm-2-8v8H7V5h10z"/>
       </svg>
    </div>
    {/* Crown Overlay */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
       <span className="text-2xl drop-shadow-md">👑</span>
    </div>
  </div>
);

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const profileId = Array.isArray(params?.id) ? params.id[0] : params?.id as string;
  const { user: currentUser, isLoading: isAuthLoading } = useUser();
  const { userProfile: profile, isLoading: isProfileLoading } = useUserProfile(profileId);

  useEffect(() => { 
    if (!isAuthLoading && !currentUser) router.replace('/login'); 
  }, [currentUser, isAuthLoading, router]);

  const userRoomQuery = useMemoFirebase(() => {
    if (!firestore || !profileId) return null;
    return query(collection(firestore, 'chatRooms'), where('ownerId', '==', profileId), limit(1));
  }, [firestore, profileId]);
  
  const { data: rooms } = useCollection(userRoomQuery);
  const activeRoom = rooms?.[0];

  if (isAuthLoading || isProfileLoading) return <AppLayout fullScreen><div className="flex h-screen w-full flex-col items-center justify-center bg-[#064e3b] text-white space-y-4"><Loader className="animate-spin h-8 w-8 text-yellow-500" /><p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Identity...</p></div></AppLayout>;
  if (!profile) { notFound(); return null; }

  const isOwnProfile = currentUser?.uid === profileId;
  const richLevel = calculateRichLevel(profile.wallet?.totalSpent || 0);

  return (
    <AppLayout fullScreen>
      <div className="min-h-screen bg-[#051a05] text-white font-headline relative flex flex-col overflow-x-hidden pb-32">
        
        {/* Immersive Blurred Background */}
        <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden">
           <div className="absolute inset-0 bg-black/40 z-10" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#051a05]/80 to-[#051a05] z-20" />
           <Image 
             src={profile.avatarUrl || 'https://picsum.photos/seed/bg/800/1200'} 
             alt="Blurred Background" 
             fill 
             className="object-cover blur-3xl scale-125 opacity-60"
           />
           {/* Top image as seen in screenshot */}
           <div className="relative h-full w-full">
              <Image 
                src={profile.avatarUrl || 'https://picsum.photos/seed/ammy/800/1200'} 
                alt="Identity Banner" 
                fill 
                className="object-cover"
              />
           </div>
        </div>

        {/* Floating Header UI */}
        <header className="relative z-50 flex items-center justify-between p-6 pt-10">
           <button onClick={() => router.back()} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white active:scale-90 transition-transform">
              <ChevronLeft className="h-6 w-6" />
           </button>
           <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
              <ShieldAlert className="h-6 w-6" />
           </button>
        </header>

        {/* Identity Dimension */}
        <div className="relative z-30 flex flex-col items-center px-6 mt-[20vh] space-y-6">
           
           {/* Main Large Avatar */}
           <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white/20 p-1 shadow-2xl backdrop-blur-md bg-white/5">
                 <Avatar className="h-full w-full border-2 border-white">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="text-4xl font-black bg-slate-100 text-black">{(profile.username || 'A').charAt(0)}</AvatarFallback>
                 </Avatar>
              </div>
           </div>

           {/* Name & ID Portals */}
           <div className="text-center space-y-2">
              <h1 className="text-4xl font-black italic tracking-tighter drop-shadow-lg">{profile.username || 'Ammy'}</h1>
              <div className="flex items-center justify-center gap-2">
                 <span className="text-xl">🇮🇳</span>
                 <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black">♂</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-white/80 bg-black/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                    <span className="text-xs font-black uppercase tracking-tight italic">ID:{profile.specialId}</span>
                    <button onClick={() => { navigator.clipboard.writeText(profile.specialId); toast({ title: 'ID Copied' }); }}>
                       <Copy className="h-3 w-3 text-white/40" />
                    </button>
                 </div>
              </div>

              {/* Rich & Charm Badge Dimension */}
              <div className="flex items-center justify-center gap-3 mt-2">
                 <div className="bg-gradient-to-r from-blue-400 to-indigo-600 px-3 py-0.5 rounded-full flex items-center gap-1 shadow-xl border border-white/20">
                    <span className="text-[10px] font-black italic">🛡️ {richLevel}</span>
                 </div>
                 <div className="bg-gradient-to-r from-[#10b981] to-[#059669] px-3 py-0.5 rounded-full flex items-center gap-1 shadow-xl border border-white/20">
                    <span className="text-[10px] font-black italic">💎 {profile.level?.charm || 3}</span>
                 </div>
              </div>
           </div>

           {/* User's Frequency Link */}
           {activeRoom && (
             <Link href={`/rooms/${activeRoom.id}`} className="w-full max-w-xs">
                <div className="bg-[#0a2e1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 flex items-center justify-between group active:scale-95 transition-transform shadow-lg">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden relative border border-white/10">
                         <Image src={activeRoom.coverUrl || 'https://picsum.photos/seed/room/200/200'} alt="Room" fill className="object-cover" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase italic tracking-tight">{activeRoom.name || 'Tik tak'}</p>
                         <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">My Room</p>
                      </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
             </Link>
           )}

           {/* Stats Matrix Container */}
           <div className="w-full bg-black/30 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex justify-around items-center shadow-inner relative">
              <div className="flex flex-col items-center gap-1">
                 <span className="text-xl font-black italic">1</span>
                 <span className="text-[9px] font-black uppercase text-[#10b981] tracking-widest">Friends</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                 <span className="text-xl font-black italic">1</span>
                 <span className="text-[9px] font-black uppercase text-[#10b981] tracking-widest">Following</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                 <span className="text-xl font-black italic">{profile.stats?.followers || 78}</span>
                 <span className="text-[9px] font-black uppercase text-[#10b981] tracking-widest">Followers</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                 <span className="text-xl font-black italic">0</span>
                 <span className="text-[9px] font-black uppercase text-[#10b981] tracking-widest">Visitors</span>
              </div>
           </div>

           {/* Bio Fragment */}
           <div className="w-full text-left px-2">
              <p className="text-xs text-white/60 font-body italic flex items-center gap-2">
                 <span className="text-white/20">🍃</span> {profile.bio || '.'}
              </p>
           </div>

           {/* Supporter Ranking Dimension */}
           <section className="w-full space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black uppercase italic text-yellow-500 tracking-widest">Supporter</h3>
                 <button className="flex items-center gap-1 text-[9px] font-black uppercase text-white/40 tracking-widest">View list <ChevronRight className="h-3 w-3" /></button>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 flex gap-6 overflow-x-auto no-scrollbar border border-white/5">
                 <SupporterIcon color="gold" rank={1} />
                 <SupporterIcon color="silver" rank={2} />
                 <SupporterIcon color="bronze" rank={3} />
              </div>
           </section>
        </div>

        {/* Global Elite Footer Actions */}
        <footer className="fixed bottom-0 left-0 right-0 p-6 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent z-[100] flex justify-center gap-10 border-t border-white/5">
           <div className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-transform">
              <div className="h-16 w-16 rounded-3xl bg-[#10b981] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] border-2 border-white/20">
                 <div className="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                 </div>
              </div>
              <span className="text-[10px] font-black uppercase italic tracking-tighter">Follow</span>
           </div>

           <div className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-transform">
              <div className="h-16 w-16 rounded-3xl bg-[#0ea5e9] flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.4)] border-2 border-white/20">
                 <MessageCircle className="h-10 w-10 text-white fill-current opacity-80" />
              </div>
              <span className="text-[10px] font-black uppercase italic tracking-tighter">Chat</span>
           </div>

           <div className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-transform">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#d946ef] via-[#a855f7] to-[#7c3aed] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] border-2 border-white/20">
                 <div className="p-2 bg-white/20 rounded-xl">
                    <Gift className="h-8 w-8 text-white fill-current" />
                 </div>
              </div>
              <span className="text-[10px] font-black uppercase italic tracking-tighter">Gift</span>
           </div>
        </footer>

        <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </AppLayout>
  );
}
