'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Search, Loader, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DiscoverPage() {
  return (
    <AppLayout>
      <div className="min-h-full bg-[#f8f9fa] font-headline p-6 pb-32">
        <header className="space-y-6 pt-4">
           <h1 className="text-4xl font-black uppercase italic tracking-tighter">Discover</h1>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              <Input placeholder="Find tribe members or frequencies..." className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white" />
           </div>
        </header>

        <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 space-y-4">
           <Sparkles className="h-12 w-12" />
           <p className="font-black uppercase italic tracking-widest text-xs">Finding new frequencies...</p>
        </div>
      </div>
    </AppLayout>
  );
}