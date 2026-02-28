'use client';

import * as React from "react";
import { Home, Settings, LogOut, ShoppingBag, Mail, Crown, Gamepad2, Menu, Power } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser, useAuth } from "@/firebase";
import { UmmyLogoIcon } from "@/components/icons";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { FloatingRoomBar } from "@/components/floating-room-bar";

const sidebarItems = [
  { href: "/rooms", label: "Home", icon: Home },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/store", label: "Boutique", icon: ShoppingBag },
  { href: "/leaderboard", label: "Rankings", icon: Crown },
  { href: "/games", label: "Game Zone", icon: Gamepad2 },
];

export function AppLayout({ 
  children, 
  hideSidebarOnMobile = false,
  fullScreen = false
}: { 
  children: React.ReactNode; 
  hideSidebarOnMobile?: boolean; 
  fullScreen?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user && !pathname.startsWith('/login') && pathname !== '/') {
      router.replace('/login');
    }
  }, [user, isUserLoading, pathname, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: error.message });
    }
  };

  if (!mounted) return null;

  if (isUserLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#FFCC00]">
        <UmmyLogoIcon className="h-16 w-16 text-white animate-pulse" />
      </div>
    );
  }

  if (fullScreen || pathname.startsWith('/login') || pathname === '/') {
    return <main className="h-full w-full relative">{children}</main>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-[100dvh] w-full bg-[#FFCC00] font-headline overflow-hidden relative">
        <Sidebar className="bg-[#FFCC00] border-none text-black">
          <SidebarHeader className="bg-transparent p-6 pb-10">
            <div className="flex items-center gap-3">
              <UmmyLogoIcon className="h-8 w-8 drop-shadow-sm" />
              <span className="font-black text-3xl italic tracking-tighter uppercase">
                Ummy
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-transparent px-2">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    className={cn(
                      "hover:bg-black/5 active:scale-95 transition-all h-12 rounded-xl px-4",
                      pathname.startsWith(item.href) && "bg-black/10 font-black"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-4">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase italic tracking-tight">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="bg-transparent p-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} className="hover:bg-black/5 h-12 rounded-xl mb-2">
                  <Link href="/settings" className="flex items-center gap-4">
                    <Settings className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase italic tracking-tight">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 h-12 w-full text-black hover:bg-black/5 transition-all group"
                >
                  <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-[#FFCC00] group-active:scale-90 transition-transform">
                    <Power className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-black uppercase italic tracking-tight">Sign Out</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-[#FFCC00] flex-1 overflow-hidden flex flex-col p-0">
          <header className="md:hidden flex items-center justify-between p-4 bg-black/5 backdrop-blur-md h-14 shrink-0 relative z-50">
             <div className="flex items-center gap-2 text-black">
                <UmmyLogoIcon className="h-6 w-6" />
                <span className="font-black italic uppercase tracking-tighter">Ummy</span>
             </div>
             <SidebarTrigger className="text-black hover:bg-black/10 p-2 rounded-full" />
          </header>
          <main className="flex-1 w-full overflow-y-auto bg-white rounded-tl-[2.5rem] shadow-2xl relative">
            {children}
          </main>
          <FloatingRoomBar />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
