'use client';

import * as React from "react";
import { Zap, Mail, Crown, Search, Settings, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { FloatingRoomBar } from "@/components/floating-room-bar";
import Image from 'next/image';

const mobileNavItems = [
  { href: "/rooms", label: "Rooms", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/messages", label: "Message", icon: Mail },
  { href: "/profile", label: "Mine", icon: 'green-smiley' },
];

export function AppLayout({ children, hideSidebarOnMobile = false, fullScreen = false }: { children: React.ReactNode; hideSidebarOnMobile?: boolean; fullScreen?: boolean; }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (isUserLoading) return <div className="h-dvh w-full bg-[#FFCC00] flex items-center justify-center" />;
  if (fullScreen || pathname.startsWith('/login') || pathname === '/') return <main className="h-full w-full relative">{children}</main>;

  const isInsideRoom = pathname.startsWith('/rooms/') && pathname !== '/rooms';

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-[100dvh] w-full bg-white font-headline overflow-hidden relative">
        <SidebarInset className="bg-white flex-1 overflow-hidden flex flex-col p-0">
          <main className="flex-1 w-full overflow-y-auto no-scrollbar relative">{children}</main>
          
          {!isInsideRoom && (
            <nav className="flex items-center justify-around bg-white border-t border-gray-100 h-16 pb-safe shrink-0 relative z-50 px-4">
              {mobileNavItems.map((item) => {
                const isProfile = item.href === '/profile';
                const isActive = pathname === item.href || (isProfile && pathname.startsWith('/profile'));
                
                return (
                  <Link key={item.label} href={item.href} className={cn("flex flex-col items-center gap-1 p-2 transition-all active:scale-90", isActive ? "text-primary" : "text-gray-300")}>
                    {item.icon === 'green-smiley' ? (
                      <div className={cn("relative h-6 w-6 transition-all", isActive ? "grayscale-0 scale-110" : "grayscale opacity-40")}>
                        <Image src="https://img.icons8.com/color/96/smiling-face-with-smiling-eyes.png" alt="Mine" fill />
                      </div>
                    ) : (
                      <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                    )}
                    <span className={cn("text-[10px] font-black uppercase italic tracking-widest", isActive ? "text-primary" : "text-gray-300")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
          
          <FloatingRoomBar />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}