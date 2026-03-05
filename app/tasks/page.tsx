'use client';

import { useState, useEffect } from 'react';
import { getDailyTasks, getAchievementTasks } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  CheckCircle, 
  Sparkles, 
  Trophy, 
  Star, 
  CalendarCheck, 
  Loader,
  Award,
  Bike,
  Image as ImageIcon,
  Rocket
} from 'lucide-react';
import { GoldCoinIcon } from '@/components/icons';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { doc, increment, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function TasksPage() {
  const { user } = useUser();
  const { userProfile, isLoading } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    if (userProfile) {
      const lastSignIn = userProfile.lastSignInAt?.toDate();
      const today = new Date();
      const alreadySignedIn = lastSignIn && lastSignIn.getDate() === today.getDate() && lastSignIn.getMonth() === today.getMonth() && lastSignIn.getFullYear() === today.getFullYear();
      setIsCheckedIn(!!alreadySignedIn);
    }
  }, [userProfile]);

  const handleSignIn = async () => {
    if (!user || !firestore || !userProfile || isCheckedIn) return;
    setIsSigningIn(true);
    const rewardAmount = 5000;
    const updateData = { 'wallet.coins': increment(rewardAmount), 'lastSignInAt': serverTimestamp(), 'updatedAt': serverTimestamp() };
    updateDocumentNonBlocking(doc(firestore, 'users', user.uid), updateData);
    updateDocumentNonBlocking(doc(firestore, 'users', user.uid, 'profile', user.uid), updateData);
    toast({ title: 'Check-In Successful!', description: `Received ${rewardAmount.toLocaleString()} Gold Coins.` });
    setIsCheckedIn(true);
    setIsSigningIn(false);
  };

  const dailyTasks = getDailyTasks();
  const achievementTasks = getAchievementTasks();
  const completedDailyCount = dailyTasks.filter(t => t.isCompleted).length;
  const dailyProgress = (completedDailyCount / dailyTasks.length) * 100;

  const AttendanceCard = ({ day, amount, label, icon: Icon, isBig = false }: any) => (
    <div className={cn("relative p-3 rounded-2xl border-2 flex flex-col items-center gap-1 bg-white shadow-sm", day === 1 && !isCheckedIn ? "border-primary bg-primary/5" : "border-gray-100", isBig ? "bg-orange-50 border-orange-100" : "")}>
      <span className="text-[8px] font-black uppercase text-muted-foreground">Day {day}</span>
      <div className="py-2">{Icon ? <Icon className={cn("h-6 w-6", isBig ? "text-orange-500" : "text-blue-400")} /> : <GoldCoinIcon className="h-6 w-6" />}</div>
      <div className="flex items-center gap-1">{!Icon && <GoldCoinIcon className="h-2.5 w-2.5" />}<span className="text-[10px] font-bold text-gray-700">{amount || label}</span></div>
      {day === 1 && isCheckedIn && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl"><CheckCircle className="h-6 w-6 text-green-500 fill-white" /></div>}
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto p-4 animate-in fade-in duration-700 font-headline">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3"><ClipboardList className="h-8 w-8 text-primary" /><h1 className="text-4xl font-black uppercase italic tracking-tighter">Task Center</h1></div>
          <p className="text-muted-foreground font-body text-lg italic">Complete tribal duties to earn Gold.</p>
        </header>

        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2"><CalendarCheck className="h-6 w-6 text-orange-500" /><CardTitle className="text-2xl uppercase italic">Daily Attendance</CardTitle></div>
               <Badge variant="outline" className="border-orange-200 text-orange-600 font-black italic">7-Day Streak</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {[1,2,3,4,5,6,7].map(d => <AttendanceCard key={d} day={d} amount={d===1?5000:d===4?10000:null} label={d===3||d===5?'x1 Day':d===6?'x3 Days':'Elite'} icon={d===3?Award:d===5?Bike:d===6?ImageIcon:d===7?Rocket:null} isBig={d===7} />)}
            </div>
            <Button onClick={handleSignIn} disabled={isSigningIn || isCheckedIn} className={cn("w-full h-14 rounded-2xl text-lg font-black uppercase italic shadow-lg", isCheckedIn ? "bg-green-500 hover:bg-green-500" : "bg-primary")}>
              {isSigningIn ? <Loader className="animate-spin mr-2 h-5 w-5" /> : isCheckedIn ? <CheckCircle className="mr-2 h-5 w-5" /> : <CalendarCheck className="mr-2 h-5 w-5" />}
              {isCheckedIn ? 'Checked In Today' : 'Claim Daily Reward'}
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2"><h2 className="text-2xl font-black uppercase italic flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Daily Tasks</h2><span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Resets in 12h</span></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyTasks.map((task) => (
              <Card key={task.id} className="rounded-[2rem] border-none shadow-sm bg-white">
                <CardHeader className="pb-2"><CardTitle className="text-lg uppercase italic tracking-tight">{task.title}</CardTitle><CardDescription className="text-xs font-body italic">{task.description}</CardDescription></CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary font-black italic"><GoldCoinIcon className="h-4 w-4" /><span>+{task.coinReward}</span></div>
                  {task.isCompleted ? <div className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase italic"><CheckCircle className="h-4 w-4" />Done</div> : <Button asChild size="sm" className="rounded-full px-6 font-black uppercase italic text-[10px]"><Link href={task.cta.href}>{task.cta.label}</Link></Button>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
