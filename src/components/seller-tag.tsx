'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * High-Fidelity Seller Tag Component.
 * Purple/Magenta glossy background, 3D bright yellow bear icon, and golden "Seller" typography.
 */
export function SellerTag({ className, size = 'md' }: { className?: string, size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.2 : 1;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center select-none group", className)} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 blur-md opacity-50 animate-pulse" />
      <div className={cn(
        "relative flex items-center gap-1.5 pl-1.5 pr-4 py-1 bg-gradient-to-b from-[#9333ea] via-[#7e22ce] to-[#581c87] rounded-full border-[2.5px] border-[#d946ef] shadow-[0_0_15px_rgba(168,85,247,0.5),inset_0_0_8px_rgba(0,0,0,0.4)] overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2"
      )}>
        <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[-30deg] -translate-x-[200%] animate-shine pointer-events-none" />
        <div className="relative shrink-0 w-7 h-7 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sellerBearGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fff176" /><stop offset="100%" stopColor="#fbc02d" /></linearGradient>
                <linearGradient id="sellerEarGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffa000" /><stop offset="100%" stopColor="#ef6c00" /></linearGradient>
              </defs>
              <circle cx="30" cy="35" r="15" fill="url(#sellerEarGrad)" stroke="#e65100" strokeWidth="2" />
              <circle cx="70" cy="35" r="15" fill="url(#sellerEarGrad)" stroke="#e65100" strokeWidth="2" />
              <circle cx="50" cy="55" r="35" fill="url(#sellerBearGrad)" stroke="#f9a825" strokeWidth="2" />
              <circle cx="40" cy="50" r="4" fill="#1A1A1A" />
              <circle cx="60" cy="50" r="4" fill="#1A1A1A" />
              <ellipse cx="50" cy="65" rx="12" ry="10" fill="#FFF9E3" stroke="#fbc02d" strokeWidth="0.5" />
              <circle cx="50" cy="62" r="4" fill="#1A1A1A" />
              <path d="M 44 70 Q 50 74 56 70" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
           </svg>
        </div>
        <span className="font-headline text-[14px] font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-yellow-100 to-yellow-400">Seller</span>
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1 left-12 w-0.5 h-0.5 bg-white rounded-full animate-ping" /><div className="absolute bottom-1 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse" /></div>
      </div>
    </div>
  );
}
