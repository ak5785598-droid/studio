
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GiftAnimationOverlayProps {
  giftId: string | null;
  onComplete: () => void;
}

/**
 * High-Fidelity Gift Animation Engine.
 * Features SVGA-style cinematic sequences for high-tier tribal gifts.
 */
export function GiftAnimationOverlay({ giftId, onComplete }: GiftAnimationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    if (giftId) {
      setIsVisible(true);
      setTriggerKey(prev => prev + 1);
      
      // Animation duration protocol
      let duration = 3000;
      if (['galaxy', 'rolex', 'color-carnival'].includes(giftId)) duration = 4500;
      if (['dragon', 'celebration', 'propose-ring'].includes(giftId)) duration = 6000;

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [giftId, onComplete]);

  if (!giftId || !isVisible) return null;

  const getEmoji = () => {
    switch (giftId) {
      case 'rose': return '🌹';
      case 'heart': return '💖';
      case 'ring': return '💍';
      case 'car': return '🏎️';
      case 'jet': return '🛩️';
      case 'dragon': return '🐉';
      case 'rocket': return '🚀';
      case 'castle': return '🏰';
      case 'galaxy': return '🌌';
      case 'supernova': return '💥';
      case 'rolex': return '⌚';
      case 'celebration': return '🥳';
      default: return '🎁';
    }
  };

  return (
    <div key={triggerKey} className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center overflow-hidden">
      
      {/* Screen Flash Protocol */}
      {['dragon', 'supernova', 'rolex', 'celebration'].includes(giftId) && (
        <div className="absolute inset-0 animate-screen-flash bg-white pointer-events-none z-[301]" />
      )}

      {/* Holographic Petal storm for 'Color Carnival' feel */}
      {giftId === 'color-carnival' && (
        <div className="absolute inset-0 z-[305]">
           {Array.from({ length: 30 }).map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "absolute top-[-20px] h-4 w-4 rounded-full opacity-0 animate-petal-fall",
                 ['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-purple-400'][i % 4]
               )}
               style={{ 
                 left: `${Math.random() * 100}%`, 
                 animationDelay: `${Math.random() * 2}s`,
                 filter: 'blur(2px) brightness(1.2)'
               }}
             />
           ))}
        </div>
      )}

      {/* High-Fidelity Propose Ring Animation */}
      {giftId === 'propose-ring' && <ProposeRingAnimation />}

      {/* Galaxy Zoom Effect */}
      {giftId === 'galaxy' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-1000">
           <div className="absolute inset-0 bg-gradient-radial from-indigo-500/20 to-transparent animate-pulse" />
           <div className="w-full h-full flex items-center justify-center">
              <span className="text-[20rem] animate-galaxy-zoom opacity-0">🌌</span>
           </div>
        </div>
      )}

      {/* Standard High-Tier Animated Emojis */}
      {!['propose-ring', 'galaxy', 'color-carnival'].includes(giftId) && (
        <div className={cn(
          "text-9xl filter drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all",
          giftId === 'rolex' ? "animate-rolex-sync" : 
          giftId === 'celebration' ? "animate-celebration-pop" : "animate-bounce scale-[2.0]"
        )}>
          {getEmoji()}
        </div>
      )}

      <style jsx>{`
        @keyframes screen-flash { 0% { opacity: 0; } 10% { opacity: 0.8; } 100% { opacity: 0; } }
        .animate-screen-flash { animation: screen-flash 0.5s ease-out forwards; }
        
        @keyframes rolex-sync {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; filter: brightness(2) sepia(1) saturate(10) hue-rotate(5deg); }
          20% { transform: scale(1.3) rotate(0deg); opacity: 1; filter: brightness(1.5) sepia(1) saturate(10) hue-rotate(5deg); }
          40% { transform: scale(1) rotate(0deg); filter: brightness(1.2) sepia(1) saturate(10) hue-rotate(5deg) drop-shadow(0 0 50px rgba(255, 215, 0, 1)); }
          100% { transform: scale(2) rotate(0deg); opacity: 0; }
        }
        .animate-rolex-sync { animation: rolex-sync 4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes galaxy-zoom {
          0% { transform: scale(0) rotate(0); opacity: 0; }
          20% { opacity: 1; transform: scale(1) rotate(45deg); }
          100% { transform: scale(5) rotate(360deg); opacity: 0; }
        }
        .animate-galaxy-zoom { animation: galaxy-zoom 4s linear forwards; }

        @keyframes celebration-pop {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1.5) rotate(10deg); opacity: 1; }
          80% { transform: scale(1.2) rotate(-5deg); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .animate-celebration-pop { animation: celebration-pop 5s ease-in-out forwards; }
      `}</style>
    </div>
  );
}

const ProposeRingAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-700">
    <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center perspective-1000">
      <div className="relative transform-gpu animate-box-entrance">
         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-black/40 blur-xl rounded-full scale-x-150" />
         <div className="relative w-80 h-80">
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
               <defs>
                  <linearGradient id="boxRedGift" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#ff1a1a" />
                     <stop offset="100%" stopColor="#990000" />
                  </linearGradient>
               </defs>
               <path d="M100 180 C40 160 10 110 10 80 C10 50 40 35 100 70 C160 35 190 50 190 80 C190 110 160 160 100 180" fill="url(#boxRedGift)" stroke="#4d0000" strokeWidth="1" />
            </svg>
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 animate-ring-rise text-8xl">💍</div>
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-30 origin-[50%_40%] animate-lid-open">
               <path d="M100 180 C40 160 10 110 10 80 C10 50 40 35 100 70 C160 35 190 50 190 80 C190 110 160 160 100 180" fill="#800000" opacity="0.9" />
            </svg>
         </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes box-entrance { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes lid-open { 0%, 20% { transform: rotateX(0); } 60%, 100% { transform: rotateX(-110deg) translateY(-100px); opacity: 0; } }
      @keyframes ring-rise { 0%, 40% { opacity: 0; transform: translate(-50%, 20px); } 70% { opacity: 1; transform: translate(-50%, -40px) scale(1.5); } 100% { opacity: 0; transform: translate(-50%, -80px) scale(2); } }
      .animate-box-entrance { animation: box-entrance 1.5s forwards; }
      .animate-lid-open { animation: lid-open 5s forwards; }
      .animate-ring-rise { animation: ring-rise 5s forwards; }
    `}</style>
  </div>
);
