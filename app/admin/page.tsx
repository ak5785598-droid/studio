'use client';

import { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, useDoc, useUser, useCollection, useMemoFirebase, updateDocumentNonBlocking, errorEmitter, FirestorePermissionError, useStorage } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, increment, collection, query, orderBy, limit, serverTimestamp, addDoc, getDocs, where, writeBatch, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Shield, Loader, Search, ClipboardList, Gift, CheckCircle2, UserCheck, Star, Zap, Heart, MessageSquare, Tag, BadgeCheck, Upload, Type, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CREATOR_ID = '901piBzTQ0VzCtAvlyyobwvAaTs1';

export default function AdminPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const isCreator = user?.uid === CREATOR_ID;
  const [activeTab, setActiveTab] = useState('authority');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isCreator) return <AppLayout><div className="flex h-[50vh] items-center justify-center text-destructive font-headline"><Shield className="h-12 w-12 mr-2" /> Unauthorized Portal Access Restricted</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto p-4 animate-in fade-in duration-700 font-headline">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
             <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20"><Shield className="h-8 w-8 text-white" /></div>
             <div><h1 className="text-4xl font-bold uppercase italic tracking-tighter">Supreme Command</h1><p className="text-muted-foreground">Supreme Authority Protocol Active.</p></div>
          </div>
          <Badge className="bg-red-500 text-white font-black uppercase italic px-4 py-1.5 h-10 rounded-xl shadow-xl shadow-red-500/20">Supreme Creator</Badge>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-secondary/50 p-1.5 h-12 rounded-full border w-fit overflow-x-auto no-scrollbar">
            <TabsTrigger value="authority" className="rounded-full px-6 font-black uppercase text-[10px] data-[state=active]:bg-red-500 data-[state=active]:text-white">Authority Hub</TabsTrigger>
            <TabsTrigger value="overview" className="rounded-full px-6 font-black uppercase text-[10px]">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="authority" className="space-y-6">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-gradient-to-br from-red-500/10 to-transparent">
                <CardHeader><CardTitle className="text-2xl uppercase italic flex items-center gap-2 text-red-500"><Zap className="h-6 w-6" /> Tribal Authority Protocol</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex gap-4">
                      <Input placeholder="Search member to set role..." className="h-12 rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      <Button className="h-12 rounded-xl bg-red-500 text-white hover:bg-red-600">Search</Button>
                   </div>
                   <div className="py-20 text-center opacity-20 italic">Enter search query to manage authorities.</div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
