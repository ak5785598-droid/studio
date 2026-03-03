
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GiftAnimationOverlayProps {
  giftId: string | null;
  onComplete: () => void;
}

/**
 * High-Fidelity Propose Ring SVGA-style Animation component.
 */
const ProposeRingAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[2px] animate-in fade-in duration-700" />
      
      {/* SVGA Simulation Layer */}
      <div className="relative z-10 w-80 h-80 flex items-center justify-center">
        
        {/* Sparkles / Particles */}
        <div className="absolute inset-0 overflow-visible">
           {Array.from({ length: 15 }).map((_, i) => (
             <div 
               key={i} 
               className="absolute h-2 w-2 bg-white rounded-full animate-ping opacity-0"
               style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 animationDelay: `${2.5 + Math.random() * 2}s`,
                 animationFillMode: 'forwards'
               }} 
             />
           ))}
        </div>

        {/* The Heart Box - Base */}
        <div className="relative animate-in zoom-in duration-1000">
           <div className="relative w-64 h-64">
              {/* Bottom Box Piece */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-2xl">
                 <path 
                   d="M 50 95 C 20 80, 0 50, 0 35 C 0 15, 20 5, 50 30 C 80 5, 100 15, 100 35 C 100 50, 80 80, 50 95" 
                   fill="#cc0000" 
                   stroke="#800000" 
                   strokeWidth="2" 
                 />
                 <path 
                   d="M 50 85 C 25 75, 10 50, 10 40 C 10 25, 25 15, 50 40 C 75 15, 90 25, 90 40 C 90 50, 75 75, 50 85" 
                   fill="#f0f0f0" 
                 />
              </svg>

              {/* The Ring - Floating Hidden beneath lid initially */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-ring-reveal">
                 <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <circle cx="50" cy="65" r="25" fill="none" stroke="#fbbf24" strokeWidth="6" />
                    <path 
                      d="M 50 40 L 65 25 L 50 10 L 35 25 Z" 
                      fill="url(#diamondGrad)" 
                      stroke="#fff" 
                      strokeWidth="1" 
                    />
                    <defs>
                      <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="50%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>

              {/* The Box Lid - Animating Open */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-30 animate-box-lid-open origin-[50%_35%]">
                 <path 
                   d="M 50 95 C 20 80, 0 50, 0 35 C 0 15, 20 5, 50 30 C 80 5, 100 15, 100 35 C 100 50, 80 80, 50 95" 
                   fill="#ff0000" 
                   stroke="#800000" 
                   strokeWidth="1" 
                 />
                 <path 
                   d="M 50 25 L 55 15 L 50 5 L 45 15 Z" 
                   fill="white" 
                   className="animate-pulse"
                 />
              </svg>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes box-lid-open {
          0% { transform: scale(1) rotateX(0deg); opacity: 1; }
          30% { transform: scale(1.1) rotateX(0deg); }
          60% { transform: scale(1.1) rotateX(-110deg) translateY(-20px); opacity: 0.9; }
          100% { transform: scale(1.1) rotateX(-110deg) translateY(-40px); opacity: 0; }
        }
        @keyframes ring-reveal {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          60% { opacity: 0; transform: scale(0.5) translateY(20px); }
          80% { opacity: 1; transform: scale(1.2) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(-20px); }
        }
        .animate-box-lid-open {
          animation: box-lid-open 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-ring-reveal {
          animation: ring-reveal 5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

/**
 * High-Fidelity Gift Animation Overlay.
 * Features full-screen cinematic visual effects, screen flashes, and unique high-tier animations.
 * Added "Celebration" and "Propose Ring" cinematic sequences.
 */
export function GiftAnimationOverlay({ giftId, onComplete }: GiftAnimationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  const playProposeSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // Romantic Harpeggio Sync
      playNote(523.25, now + 1.5, 0.5); // C5
      playNote(659.25, now + 1.8, 0.5); // E5
      playNote(783.99, now + 2.1, 0.5); // G5
      playNote(1046.50, now + 2.4, 1.0, 'triangle'); // C6 Shine
    } catch (e) {}
  };

  const playCelebrationSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // Elite Party Horn Sequence (A-C#-E Chord)
      const now = ctx.currentTime;
      playNote(440, now, 0.3);
      playNote(554.37, now + 0.3, 0.3);
      playNote(659.25, now + 0.6, 0.8);
    } catch (e) {}
  };

  useEffect(() => {
    if (giftId) {
      setIsVisible(true);
      setTriggerKey(prev => prev + 1);
      
      if (giftId === 'celebration') {
        playCelebrationSound();
      } else if (giftId === 'propose-ring') {
        playProposeSound();
      }
      
      let duration = 3000;
      if (['supernova', 'galaxy', 'rolex'].includes(giftId)) duration = 4000;
      if (['dragon', 'celebration', 'propose-ring'].includes(giftId)) duration = 5500;

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

  const getAnimationClass = () => {
    switch (giftId) {
      case 'heart': return 'animate-heart-burst';
      case 'galaxy': return 'animate-galaxy-zoom';
      case 'rolex': return 'animate-rolex-sync';
      case 'celebration': return 'animate-celebration-pop';
      default: return 'animate-bounce scale-[2.0]';
    }
  };

  if (giftId === 'propose-ring') {
    return <div key={triggerKey} className="fixed inset-0 z-[300] overflow-hidden"><ProposeRingAnimation /></div>;
  }

  const isHighTier = ['dragon', 'rocket', 'castle', 'galaxy', 'supernova', 'rolex', 'celebration'].includes(giftId);
  const isUltimate = ['supernova', 'galaxy', 'rolex', 'celebration'].includes(giftId);

  return (
    <div key={triggerKey} className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center overflow-hidden">
      {isHighTier && <div className="absolute inset-0 animate-screen-flash pointer-events-none" />}
      {isUltimate && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[3px] animate-in fade-in duration-1000 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-50 animate-pulse" />
        </div>
      )}

      {giftId === 'celebration' && (
        <div className="absolute inset-0 z-[310] pointer-events-none">
           {Array.from({ length: 40 }).map((_, i) => {
             const colors = ['bg-pink-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
             const randomColor = colors[Math.floor(Math.random() * colors.length)];
             const left = `${Math.random() * 100}%`;
             const delay = `${Math.random() * 2}s`;
             return <div key={i} className={cn("absolute top-[-20px] animate-party-confetti", randomColor, Math.random() > 0.5 ? 'h-3 w-3' : 'h-2 w-4')} style={{ left, animationDelay: delay }} />;
           })}
        </div>
      )}

      <div className={cn(
        "text-9xl filter transition-all duration-500",
        giftId === 'rolex' ? "sepia(1) saturate(10) hue-rotate(5deg) brightness(1.2) drop-shadow-[0_0_60px_rgba(255,215,0,1)]" : 
        giftId === 'celebration' ? "drop-shadow-[0_0_80px_rgba(255,255,255,1)] brightness-110" :
        isUltimate ? "drop-shadow-[0_0_60px_rgba(255,255,255,0.9)] scale-125" : "drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]",
        getAnimationClass()
      )}>
        {getEmoji()}
      </div>
    </div>
  );
}
