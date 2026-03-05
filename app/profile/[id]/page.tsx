'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { AppLayout } from '@/components/layout/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Copy, 
  Settings, 
  ShieldCheck, 
  Crown, 
  Briefcase, 
  UserPlus, 
  Star, 
  Users, 
  Heart, 
  ShoppingBag, 
  Shirt, 
  Package, 
  Loader,
  MessageCircle
} from 'lucide-react';
import { GoldCoinIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { OfficialTag } from '@/components/official-tag';
import { SellerTag } from '@/components/seller-tag';

const ProfileStat = ({ label, value, hasAlert }: { label: string, value: number, hasAlert?: boolean }) => (
  <div className="flex flex-col items-center gap-1 flex-1 relative">
    <span className="text-lg font-black tracking-tight">{value}</span>
    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{label}</span>
    {hasAlert && <div className="absolute top-0 right-4 h-2 w-2 bg-red-500 rounded-full border border-white" />}
  </div>
);

const BannerCard = ({ label, sublabel, icon: Icon, gradient, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex-1 h-20 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden shadow-md active:scale-95 transition-all cursor-pointer",
      gradient
    )}
  >
    <div className="relative z-10 flex flex-col">
       <span className="text-[11px] font-black uppercase text-white leading-none">{label}</span>
       <span className="text-[8px] font-bold text-white/60 uppercase mt-0.5">{sublabel}</span>
    </div>
    <div className="absolute bottom-2 right-2 opacity-40">
       <Icon className="h-8 w-8 text-white" />
    </div>
  </div>
);

const MenuListItem = ({ label, extra, icon: Icon, badge, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <span className="text-sm font-black uppercase text-gray-800 italic tracking-tight">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <div className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic">{badge}</div>}
      {extra && <span className="text-[10px] font-bold text-gray-300 uppercase">{extra}</span>}
      <ChevronRight className="h-4 w-4 text-gray-200" />
    </div>
  </div>
);

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const { userProfile: profile, isLoading } = useUserProfile(profileId);
  const { toast } = useToast();

  if (isLoading) return <AppLayout><div className="flex h-full items-center justify-center"><Loader className="animate-spin text-primary" /></div></AppLayout>;
  if (!profile) return <AppLayout><div className="p-20 text-center">Identity Sync Failed</div></AppLayout>;

  const isMe = user?.uid === profileId;

  return (
    <AppLayout>
      <div className="min-h-full bg-white font-headline pb-32">
        {/* Modern White Header */}
        <header className="p-6 pt-10 flex flex-col items-center">
           <div className="w-full flex justify-between items-center mb-6">
              <button onClick={() => router.back()} className="text-gray-400"><ChevronRight className="h-6 w-6 rotate-180" /></button>
              <div className="flex gap-4">
                 <button className="text-gray-400"><MessageCircle className="h-6 w-6" /></button>
                 <button onClick={() => router.push('/settings')} className="text-gray-400"><Settings className="h-6 w-6" /></button>
              </div>
           </div>

           <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-2 border-gray-100 shadow-xl">
                 <AvatarImage src={profile.avatarUrl} />
                 <AvatarFallback className="text-3xl bg-slate-50">{(profile.username || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 rounded-full border-4 border-white" />
           </div>

           <h1 className="text-2xl font-black uppercase tracking-tighter italic mb-1">{profile.username}</h1>
           
           <div className="flex items-center gap-2 mb-4">
              <span className="text-xs">🇮🇳</span>
              <div className="bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[8px] font-black">♂</div>
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full" onClick={() => { navigator.clipboard.writeText(profile.specialId); toast({ title: 'ID Copied' }); }}>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID:{profile.specialId}</span>
                 <Copy className="h-3 w-3 text-gray-300" />
              </div>
           </div>

           <div className="flex gap-2 flex-wrap justify-center mb-8">
              <Badge className="bg-gradient-to-r from-cyan-400 to-blue-600 border-none text-[8px] h-4 font-black uppercase px-2">Rich Lv.{profile.level?.rich || 1}</Badge>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-600 border-none text-[8px] h-4 font-black uppercase px-2">Charm Lv.{profile.level?.charm || 1}</Badge>
              <OfficialTag size="sm" />
              <SellerTag size="sm" />
           </div>

           {/* Stats Roster */}
           <div className="w-full flex items-center justify-between border-y border-gray-50 py-4 mb-6">
              <ProfileStat label="Friend" value={0} />
              <div className="h-6 w-px bg-gray-100" />
              <ProfileStat label="Following" value={0} />
              <div className="h-6 w-px bg-gray-100" />
              <ProfileStat label="Fans" value={profile.stats?.fans || 0} />
              <div className="h-6 w-px bg-gray-100" />
              <ProfileStat label="Visitors" value={0} hasAlert />
           </div>

           {/* Visual Banners */}
           <div className="w-full flex gap-3 mb-8">
              <BannerCard 
                label="SVIP Club" 
                sublabel="Privilege sync" 
                icon={Crown} 
                gradient="bg-gradient-to-br from-slate-800 to-black" 
              />
              <BannerCard 
                label="My Wallet" 
                sublabel={`${(profile.wallet?.coins || 0).toLocaleString()} Coins`} 
                icon={Briefcase} 
                gradient="bg-gradient-to-br from-blue-400 to-blue-600"
                onClick={() => router.push('/wallet')}
              />
           </div>

           {/* Sequential Menu */}
           <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden mb-10">
              <MenuListItem label="Invite Friends" icon={UserPlus} />
              <MenuListItem label="Aristocracy" icon={Star} />
              <MenuListItem label="Treasure Vault" icon={ShieldCheck} onClick={() => router.push('/wallet')} />
              <MenuListItem label="Family" icon={Users} badge="GAME TIME" />
              <MenuListItem label="CP Space" icon={Heart} onClick={() => router.push('/cp-house')} />
              <MenuListItem label="Store" icon={ShoppingBag} onClick={() => router.push('/store')} />
              <MenuListItem label="Dress" icon={Shirt} />
              <MenuListItem label="Bag" icon={Package} />
           </div>
        </header>
      </div>
    </AppLayout>
  );
}