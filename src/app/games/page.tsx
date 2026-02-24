import Image from "next/image";
import Link from "next/link";
import { getFreeGames } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { GameControllerIcon } from "@/components/icons";
import { Play, Sparkles, Zap, Flame, Star, Trophy, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function GamesPage() {
  const games = getFreeGames();
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0a0514] text-white relative">
        {/* Theatrical Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10 space-y-10 max-w-7xl mx-auto p-6 pb-32">
          
          {/* Elite Arcade Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-3xl shadow-[0_0_30px_rgba(147,51,234,0.3)] animate-pulse">
                 <GameControllerIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                 <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                   Tribe Game Zone
                 </h1>
                 <p className="text-muted-foreground font-body text-lg italic opacity-60">Infinite frequencies. One tribe.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-white/5 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-black italic tracking-tight">12,450 LIVE</span>
               </div>
            </div>
          </header>

          {/* Featured Spotlight */}
          <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
             <Link href="/games/lucky-slot-777" className="block group">
                <div className="relative aspect-[21/7] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5">
                   <Image 
                     src="https://picsum.photos/seed/arcadelight/1200/600" 
                     alt="Featured Jackpot" 
                     fill 
                     className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                     data-ai-hint="casino slot"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-[#0a0514] via-[#0a0514]/40 to-transparent flex flex-col justify-center px-12 space-y-4">
                      <Badge className="w-fit bg-yellow-400 text-black font-black uppercase italic text-[10px] px-4 py-1 animate-bounce">Hot Strike</Badge>
                      <h2 className="text-6xl font-black uppercase italic tracking-tighter drop-shadow-2xl">Lucky Slot 777</h2>
                      <p className="text-white/70 max-w-md font-body text-lg italic">The ultimate frequency jackpot. High-fidelity rewards await.</p>
                      <Button size="lg" className="w-fit rounded-full px-12 font-black uppercase italic bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                         <Play className="mr-2 h-5 w-5 fill-current" /> Enter Now
                      </Button>
                   </div>
                </div>
             </Link>
          </section>

          {/* Unlimited Game Grid */}
          <section className="space-y-8">
             <div className="flex items-center gap-3 px-2">
                <Flame className="h-6 w-6 text-orange-500 fill-current" />
                <h3 className="font-headline text-2xl font-black uppercase italic tracking-widest text-white/80">Active Frequencies</h3>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {games.map((game, i) => (
                  <Link 
                    key={game.id} 
                    href={`/games/${game.slug}`} 
                    className="group relative flex flex-col animate-in fade-in zoom-in duration-500"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-xl transition-all duration-500 group-hover:border-purple-500 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:-translate-y-2">
                       <Image 
                         src={game.coverUrl} 
                         alt={game.title} 
                         fill 
                         className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                         data-ai-hint={game.imageHint}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-transparent to-transparent opacity-60" />
                       
                       {/* Floating UI Elements */}
                       <div className="absolute top-4 left-4">
                          {i % 3 === 0 && <Badge className="bg-rose-600 text-white text-[8px] font-black uppercase">NEW</Badge>}
                          {i % 4 === 0 && <Badge className="bg-purple-600 text-white text-[8px] font-black uppercase">HOT</Badge>}
                       </div>

                       <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-black text-white/80">{(Math.floor(Math.random() * 500) + 100).toLocaleString()}</span>
                       </div>
                    </div>
                    
                    <div className="mt-4 px-2 space-y-1">
                       <h4 className="font-black text-sm uppercase italic truncate group-hover:text-purple-400 transition-colors">{game.title}</h4>
                       <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Skill Frequency</span>
                       </div>
                    </div>
                  </Link>
                ))}
             </div>
          </section>

          {/* Bottom Call to Action */}
          <section className="pt-16">
             <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-12 rounded-[4rem] border border-white/5 flex flex-col items-center text-center space-y-6">
                <Trophy className="h-16 w-10 text-yellow-500" />
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Become a Frequency Master</h3>
                <p className="text-white/40 max-w-md font-body text-base">Top tribe members earn exclusive avatar frames and elite badges every 24 hours. Start your win streak today.</p>
                <div className="flex gap-4">
                   <Button variant="outline" className="rounded-full px-8 border-white/10 text-white/60 font-black uppercase italic text-xs hover:bg-white/5">Ranking History</Button>
                   <Button className="rounded-full px-8 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase italic text-xs shadow-xl shadow-purple-600/20">Claim Rewards</Button>
                </div>
             </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
