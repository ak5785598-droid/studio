
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { GoldCoinIcon } from '@/components/icons';
import { useUser, useFirestore, updateDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, increment, serverTimestamp, collection, query, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Loader, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const COIN_PACKAGES = [
  { id: 'p1', amount: '50,000', price: '10 INR', bonus: null },
  { id: 'p2', amount: '500,000', price: '100 INR', bonus: null },
  { id: 'p3', amount: '2,500,000', price: '500 INR', bonus: '+250000' },
  { id: 'p4', amount: '5,000,000', price: '1000 INR', bonus: '+750000' },
  { id: 'p5', amount: '12,500,000', price: '2500 INR', bonus: '+2500000' },
  { id: 'p6', amount: '50,000,000', price: '10000 INR', bonus: '+13500000' },
];

/**
 * Tribal Vault - High-Fidelity Economic Dimension.
 * Re-engineered to match the official Ummy Wallet blueprint.
 */
export default function WalletPage() {
  const router = useRouter();
  const { user } = useUser();
  const { userProfile, isLoading } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'Coins' | 'Diamonds'>('Coins');
  const [showRecords, setShowRecords] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('p1');
  const [isProcessing, setIsProcessing] = useState(false);

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'diamondExchanges'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [firestore, user]);

  const { data: exchangeHistory, isLoading: isHistoryLoading } = useCollection(historyQuery);

  const handleRechargeNow = () => {
    if (!user || !firestore) return;
    const pkg = COIN_PACKAGES.find(p => p.id === selectedPackageId);
    if (!pkg) return;

    setIsProcessing(true);
    // Simulation of secure payment handshake
    setTimeout(() => {
      const amountValue = parseInt(pkg.amount.replace(/,/g, ''));
      const bonusValue = pkg.bonus ? parseInt(pkg.bonus.replace('+', '')) : 0;
      const totalGain = amountValue + bonusValue;

      const userRef = doc(firestore, 'users', user.uid);
      const profileRef = doc(firestore, 'users', user.uid, 'profile', user.uid);
      
      updateDocumentNonBlocking(userRef, { 'wallet.coins': increment(totalGain), updatedAt: serverTimestamp() });
      updateDocumentNonBlocking(profileRef, { 'wallet.coins': increment(totalGain), updatedAt: serverTimestamp() });
      
      toast({ title: 'Recharge Successful', description: `Synchronized ${totalGain.toLocaleString()} Coins to your vault.` });
      setIsProcessing(false);
    }, 1500);
  };

  if (isLoading) return <AppLayout><div className="flex h-screen items-center justify-center bg-white"><Loader className="animate-spin text-primary h-8 w-8" /></div></AppLayout>;

  return (
    <AppLayout hideSidebarOnMobile>
      <div className="min-h-full bg-white font-headline flex flex-col animate-in fade-in duration-700">
        
        {/* Header Protocol */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
           <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-all">
              <ChevronLeft className="h-6 w-6 text-gray-800" />
           </button>
           <h1 className="text-xl font-black uppercase tracking-tight">Wallet</h1>
           <button onClick={() => setShowRecords(!showRecords)} className="text-gray-400 font-bold uppercase text-sm tracking-tight px-2">
              {showRecords ? 'Close' : 'Record'}
           </button>
        </header>

        {showRecords ? (
          <div className="flex-1 p-6 space-y-4 animate-in slide-in-from-right duration-300">
             <h2 className="text-sm font-black uppercase text-gray-400 mb-6">Transaction History</h2>
             {isHistoryLoading ? <Loader className="animate-spin text-primary mx-auto mt-20" /> : exchangeHistory?.length === 0 ? (
               <div className="py-40 text-center opacity-20 italic uppercase font-black text-xs">No Records Found</div>
             ) : exchangeHistory?.map((record: any) => (
               <div key={record.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{record.timestamp ? format(record.timestamp.toDate(), 'MMM d, HH:mm') : 'Syncing...'}</p>
                    <p className="font-black text-sm uppercase italic">Purchase Coins</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-green-600">+{record.coinAmount?.toLocaleString()}</span>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Category Frequencies */}
            <div className="flex justify-around border-b border-gray-50 bg-white">
               <button 
                 onClick={() => setActiveTab('Coins')}
                 className={cn(
                   "py-4 px-8 text-lg font-black uppercase italic tracking-tighter relative transition-all",
                   activeTab === 'Coins' ? "text-gray-900" : "text-gray-300"
                 )}
               >
                  Coins
                  {activeTab === 'Coins' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full" />}
               </button>
               <button 
                 onClick={() => setActiveTab('Diamonds')}
                 className={cn(
                   "py-4 px-8 text-lg font-black uppercase italic tracking-tighter relative transition-all",
                   activeTab === 'Diamonds' ? "text-gray-900" : "text-gray-300"
                 )}
               >
                  Diamonds
                  {activeTab === 'Diamonds' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full" />}
               </button>
            </div>

            <ScrollArea className="flex-1 p-4">
               {/* Main Balance Vibe Card */}
               <div className="relative h-48 w-full rounded-[2.5rem] bg-gradient-to-br from-[#ff9d2f] via-[#ffa726] to-[#ffc107] p-8 text-white shadow-2xl overflow-hidden mb-4 group active:scale-[0.98] transition-all">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="flex justify-between items-start">
                        <p className="text-sm font-bold uppercase tracking-tight opacity-90">My Coins</p>
                        <button className="bg-white/20 backdrop-blur-md pl-3 pr-1 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-white/10">
                           History <ChevronRight className="h-3 w-3" />
                        </button>
                     </div>
                     <h2 className="text-5xl font-black italic tracking-tighter drop-shadow-md">
                        {(userProfile?.wallet?.coins || 0).toLocaleString()}
                     </h2>
                  </div>
                  {/* Sovereign Large Coin Visual */}
                  <div className="absolute -top-4 -right-10 w-56 h-56 opacity-40 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <GoldCoinIcon className="w-full h-full" />
                  </div>
               </div>

               {/* Promotional Broadcast */}
               <div className="relative h-20 w-full rounded-2xl overflow-hidden mb-6 shadow-md border-2 border-red-100">
                  <img 
                    src="https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=1000" 
                    className="w-full h-full object-cover brightness-75" 
                    alt="Promo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-transparent flex items-center px-6">
                     <div className="flex flex-col">
                        <span className="text-white font-black uppercase italic text-xl tracking-tighter">$1 = 800,000 coins</span>
                        <span className="text-[8px] text-white/80 font-bold uppercase tracking-widest">01/03 - 12/03 23:59</span>
                     </div>
                  </div>
               </div>

               {/* Recharge Package Grid */}
               <div className="grid grid-cols-3 gap-3 mb-10">
                  {COIN_PACKAGES.map((pkg) => (
                    <button 
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-between rounded-2xl border-2 transition-all p-3 h-44 group",
                        selectedPackageId === pkg.id 
                          ? "bg-[#fffde7] border-yellow-400 shadow-lg scale-[1.02]" 
                          : "bg-white border-gray-100 hover:border-gray-200"
                      )}
                    >
                       <div className="w-14 h-14 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">
                          <GoldCoinIcon className="w-full h-full" />
                       </div>
                       
                       <div className="text-center flex-1 flex flex-col justify-center">
                          <p className="font-black text-[13px] tracking-tight leading-none text-gray-900">{pkg.amount}</p>
                          {pkg.bonus && (
                            <p className="text-[10px] font-bold text-[#ff9800] mt-1">{pkg.bonus}</p>
                          )}
                       </div>

                       <div className={cn(
                         "w-full py-1.5 rounded-lg text-[10px] font-black uppercase italic transition-all",
                         selectedPackageId === pkg.id ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-400"
                       )}>
                          {pkg.price}
                       </div>
                    </button>
                  ))}
               </div>

               {/* Help Link Dimension */}
               <div className="space-y-4 px-2 pb-10">
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                    If your recharge can not be completed, please click here for help
                  </p>
                  <button onClick={() => router.push('/help-center')} className="text-yellow-500 font-black text-sm uppercase italic flex items-center gap-1">
                     Help Center <ChevronRight className="h-4 w-4" />
                  </button>
               </div>
            </ScrollArea>

            {/* Bottom Sovereign Portal */}
            <footer className="p-6 bg-white border-t border-gray-50">
               <Button 
                 onClick={handleRechargeNow}
                 disabled={isProcessing}
                 className="w-full h-16 rounded-full bg-[#ffcc00] hover:bg-[#ffb300] text-black font-black uppercase italic text-xl shadow-xl shadow-yellow-500/20 active:scale-[0.98] transition-all"
               >
                  {isProcessing ? <Loader className="animate-spin mr-2" /> : 'Recharge Now'}
               </Button>
            </footer>
          </div>
        )}
      </div>
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </AppLayout>
  );
}

const ScrollArea = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("overflow-y-auto no-scrollbar", className)}>{children}</div>
);
