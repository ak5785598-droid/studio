'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, MessageCircle, UserPlus, Star, ShieldCheck, ChevronRight, Search, Loader } from 'lucide-react';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import Link from 'next/link';
import { UmmyLogoIcon } from '@/components/icons';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

/**
 * Message Center - High-fidelity Elite Inbox.
 * Dynamically fetches system notifications and user chats.
 */
export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'notifications'), orderBy('timestamp', 'desc'));
  }, [firestore, user]);

  const { data: systemMessages, isLoading } = useCollection(notificationsQuery);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700 p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Messages</h1>
          <div className="flex gap-2">
             <button className="bg-secondary/50 p-2.5 rounded-full"><Search className="h-5 w-5" /></button>
             <button className="bg-secondary/50 p-2.5 rounded-full"><UserPlus className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-4">
           <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                 <Bell className="text-white h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground">Alerts</span>
           </div>
           <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                 <Star className="text-white h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground">Moments</span>
           </div>
           <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                 <UserPlus className="text-white h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground">Friends</span>
           </div>
           <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-14 w-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground">Groups</span>
           </div>
        </div>

        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="bg-transparent border-b border-gray-100 rounded-none w-full h-12 justify-start gap-8 p-0">
            <TabsTrigger value="chats" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black uppercase text-xs tracking-widest px-0">Chats</TabsTrigger>
            <TabsTrigger value="official" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-black uppercase text-xs tracking-widest px-0">Official</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="pt-6">
             <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <MessageCircle className="h-16 w-16 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">No Recent Conversations</p>
                <p className="text-[10px] uppercase font-bold mt-1">Start vibing in rooms to find your tribe.</p>
             </div>
          </TabsContent>

          <TabsContent value="official" className="pt-6 space-y-4">
             {isLoading ? (
               <div className="flex justify-center py-10"><Loader className="animate-spin text-primary" /></div>
             ) : systemMessages?.length === 0 ? (
               <div className="py-20 text-center text-muted-foreground uppercase font-black text-[10px] tracking-widest italic opacity-40">No System Broadcasts</div>
             ) : (
               systemMessages?.map((msg: any) => (
                 <div 
                   key={msg.id} 
                   onClick={() => setSelectedMessage(msg)}
                   className="p-4 bg-white rounded-3xl border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
                 >
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                       <UmmyLogoIcon className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-sm uppercase italic">{msg.title || 'Ummy Assistant'}</h3>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {msg.timestamp ? format(msg.timestamp.toDate(), 'MMM d') : 'Now'}
                          </span>
                       </div>
                       <p className="text-xs text-muted-foreground line-clamp-2">{msg.content}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 self-center text-gray-300" />
                 </div>
               ))
             )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md bg-white text-black p-0 rounded-t-[2.5rem] md:rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <DialogHeader className="p-8 pb-4 border-b border-gray-50 flex flex-row items-center gap-4">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
               <UmmyLogoIcon className="h-10 w-10" />
            </div>
            <div className="flex-1 text-left">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                {selectedMessage?.title || 'Official Broadcast'}
              </DialogTitle>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                {selectedMessage?.timestamp ? format(selectedMessage.timestamp.toDate(), 'MMMM d, yyyy • HH:mm') : 'Recently'}
              </p>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 min-h-[200px]">
               <p className="text-lg font-body leading-relaxed text-gray-800 whitespace-pre-wrap italic">
                 {selectedMessage?.content}
               </p>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
               <ShieldCheck className="h-4 w-4 text-green-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Official Ummy Identity Sync Verified</span>
            </div>
          </div>
          <div className="p-8 pt-0">
            <button 
              onClick={() => setSelectedMessage(null)}
              className="w-full h-16 bg-primary text-white rounded-[1.5rem] font-black uppercase italic text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              Sync Acknowledged
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
