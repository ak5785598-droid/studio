'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Search, Loader, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

/**
 * High-Fidelity User Search Dialog.
 * Allows tribe members to find each other by their unique 6-digit ID.
 */
export function UserSearchDialog() {
  const [open, setOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!firestore || searchId.length < 6) return;

    setIsSearching(true);
    try {
      const q = query(
        collection(firestore, 'users'),
        where('specialId', '==', searchId),
        limit(1)
      );
      
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const userId = snap.docs[0].id;
        setOpen(false);
        setSearchId('');
        router.push(`/profile/${userId}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Identity Not Found',
          description: `No tribe member exists with ID ${searchId}.`,
        });
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'Synchronizing with social graph failed.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1 hover:scale-110 active:scale-90 transition-all">
          <Search className="h-6 w-6 text-gray-800" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-t-[2.5rem] border-none shadow-2xl bg-white text-black p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogHeader className="text-center">
            <DialogTitle className="font-headline text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-3">
              <Search className="h-8 w-8 text-primary" />
              Find Tribe
            </DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Locate Members by 6-Digit ID
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="e.g. 100042" 
                className="pl-12 h-14 rounded-2xl border-2 border-gray-100 focus:border-primary transition-all text-lg font-bold tracking-widest"
                maxLength={6}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && searchId.length === 6 && handleSearch()}
              />
            </div>
            
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || searchId.length < 6}
              className="w-full h-16 text-xl font-black uppercase italic rounded-3xl bg-primary text-white shadow-xl shadow-yellow-500/20 hover:scale-[1.02] transition-transform"
            >
              {isSearching ? <Loader className="animate-spin h-6 w-6 mr-2" /> : null}
              {isSearching ? 'Locating...' : 'Locate Member'}
            </Button>
          </div>
          
          <p className="text-center text-[9px] text-muted-foreground uppercase font-bold tracking-widest italic">
            Search result will open the user profile instantly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
