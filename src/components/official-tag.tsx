'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * High-Fidelity Official Tag Component.
 * Designed to mirror the provided blueprint with glossy green gradients,
 * a 3D bear icon, and golden reflective borders with shine effects.
 */
export function OfficialTag({ className, size = 'md' }: { className?: string, size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.2 : 1;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center select-none group", className)} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      {/* Ambient Rainbow Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 blur-md opacity-40 animate-pulse" />
      
      {/* Main Tag Container */}
      <div className={cn(
        "relative flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-gradient-to-b from-[#10b981] via-[#059669] to-[#064e3b] rounded-full border-[2.5px] border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.5),inset_0_0_8px_rgba(0,0,0,0.4)] overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:h-1/2"
      )}>
        {/* Dynamic Shine Animation Streak */}
        <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[-30deg] -translate-x-[200%] animate-shine pointer-events-none" />
        
        {/* 3D Bear Icon */}
        <div className="relative shrink-0 w-7 h-7 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bearFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              {/* Ears */}
              <circle cx="30" cy="35" r="15" fill="#FF5F00" stroke="#8B4513" strokeWidth="2" />
              <circle cx="70" cy="35" r="15" fill="#FF5F00" stroke="#8B4513" strokeWidth="2" />
              {/* Face */}
              <circle cx="50" cy="55" r="35" fill="url(#bearFaceGrad)" stroke="#8B4513" strokeWidth="2" />
              {/* Eyes */}
              <circle cx="40" cy="50" r="4" fill="#1A1A1A" />
              <circle cx="60" cy="50" r="4" fill="#1A1A1A" />
              {/* Muzzle */}
              <ellipse cx="50" cy="65" rx="12" ry="10" fill="#FFF9E3" stroke="#8B4513" strokeWidth="0.5" />
              <circle cx="50" cy="62" r="4" fill="#1A1A1A" />
              <path d="M 44 70 Q 50 74 56 70" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
           </svg>
        </div>

        {/* Official Text with Gold Gradient */}
        <span className="font-headline text-[14px] font-black italic text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-yellow-100 to-yellow-400">
          Official
        </span>
        
        {/* Top Right Star Particle */}
        <div className="absolute -top-1 -right-1">
           <svg viewBox="0 0 24 24" className="w-4 h-4 text-pink-400 fill-current animate-pulse drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
           </svg>
        </div>

        {/* Scattered Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1 left-10 w-0.5 h-0.5 bg-white rounded-full animate-ping" />
           <div className="absolute bottom-1 right-4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
