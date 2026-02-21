import { getDailyTasks, getAchievementTasks } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Gem, CheckCircle, Sparkles, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Progress } from '@/components/ui/progress';

export default function TasksPage() {
  const dailyTasks = getDailyTasks();
  const achievementTasks = getAchievementTasks();

  const completedDailyCount = dailyTasks.filter(t => t.isCompleted).length;
  const dailyProgress = (completedDailyCount / dailyTasks.length) * 100;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              Task Center
            </h1>
          </div>
          <p className="text-muted-foreground">Complete tasks to earn free coins and level up your status.</p>
        </header>

        {/* Daily Progress Overview */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Daily Progress
                </h3>
                <p className="text-sm text-muted-foreground">Complete all daily tasks to get a bonus 500 Coin chest!</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{completedDailyCount} / {dailyTasks.length} Completed</span>
                    <span>{Math.round(dailyProgress)}%</span>
                  </div>
                  <Progress value={dailyProgress} className="h-2" />
                </div>
              </div>
              <Button disabled={dailyProgress < 100} className="rounded-full px-8 shadow-lg">
                Claim Chest
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-primary" /> Daily Tasks
            </h2>
            <span className="text-xs text-muted-foreground font-mono">Resets in 12h 45m</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyTasks.map((task) => (
              <Card key={task.id} className={task.isCompleted ? 'bg-secondary/20 opacity-80' : 'hover:shadow-md transition-shadow'}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-lg">{task.title}</CardTitle>
                  <CardDescription className="text-xs">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-primary font-bold">
                          <Gem className="h-4 w-4" />
                          <span>+{task.coinReward}</span>
                      </div>
                      {task.isCompleted ? (
                          <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                             <CheckCircle className="h-4 w-4" />
                              Done
                          </div>
                      ) : (
                          <Button asChild size="sm" className="rounded-full">
                              <Link href={task.cta.href}>{task.cta.label}</Link>
                          </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {achievementTasks.map((task) => (
              <Card key={task.id} className={task.isCompleted ? 'bg-secondary/20' : 'hover:shadow-md transition-shadow'}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-headline text-lg font-bold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-xs">
                            <Gem className="h-3 w-3" />
                            <span>+{task.coinReward} Coins</span>
                        </div>
                      </div>
                    </div>
                    {task.isCompleted ? (
                        <Button disabled variant="outline" className="gap-2 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Claimed
                        </Button>
                    ) : (
                        <Button asChild className="rounded-full">
                            <Link href={task.cta.href}>{task.cta.label}</Link>
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
