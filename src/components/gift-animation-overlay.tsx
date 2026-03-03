'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GiftAnimationOverlayProps {
  giftId: string | null;
  onComplete: () => void;
}

/**
 * High-Fidelity Propose Ring SVGA-style Animation component.
 * Re-engineered to match the red heart jewelry box visual.
 * sequence: closed -> opening -> ring reveal -> sparkles.
 */
const ProposeRingAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-700" />
      
      {/* Container for the 3D-ish SVG animation */}
      <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center perspective-1000">
        
        {/* Sparkles Layer */}
        <div className="absolute inset-0 z-50">
           {[1, 2, 3, 4, 5, 6].map((_, i) => (
             <svg 
               key={i} 
               viewBox="0 0 24 24" 
               className="absolute h-8 w-8 text-white fill-current opacity-0 animate-sparkle-elite"
               style={{ 
                 top: `${20 + Math.random() * 60}%`, 
                 left: `${20 + Math.random() * 60}%`,
                 animationDelay: `${2.5 + i * 0.4}s`
               }}
             >
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
             </svg>
           ))}
        </div>

        <div className="relative transform-gpu animate-box-entrance">
           {/* Shadow */}
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-black/40 blur-xl rounded-full scale-x-150 animate-shadow-pulse" />

           <div className="relative w-80 h-80">
              {/* Box Base (Lower Part of Heart) */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
                 <defs>
                    <linearGradient id="boxRed" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#ff1a1a" />
                       <stop offset="100%" stopColor="#990000" />
                    </linearGradient>
                    <radialGradient id="cushionGrad" cx="50%" cy="50%" r="50%">
                       <stop offset="0%" stopColor="#ffffff" />
                       <stop offset="100%" stopColor="#e6e6e6" />
                    </radialGradient>
                 </defs>
                 {/* The 3D side/depth of the bottom part */}
                 <path d="M100 180 C40 160 10 110 10 80 C10 50 40 35 100 70 C160 35 190 50 190 80 C190 110 160 160 100 180" fill="#660000" transform="translate(0, 10)" />
                 {/* The main bottom face */}
                 <path d="M100 180 C40 160 10 110 10 80 C10 50 40 35 100 70 C160 35 190 50 190 80 C190 110 160 160 100 180" fill="url(#boxRed)" stroke="#4d0000" strokeWidth="1" />
                 {/* The white cushion inside (visible when open) */}
                 <path d="M100 170 C50 155 25 110 25 85 C25 60 50 50 100 80 C150 50 175 60 175 85 C175 110 150 155 100 170" fill="url(#cushionGrad)" className="animate-cushion-reveal opacity-0" />
              </svg>

              {/* The Diamond Ring */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 animate-ring-rise">
                 <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-2xl">
                    <defs>
                       <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fff281" />
                          <stop offset="50%" stopColor="#ffd700" />
                          <stop offset="100%" stopColor="#b8860b" />
                       </linearGradient>
                       <radialGradient id="diamondShine" cx="30%" cy="30%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="50%" stopColor="#e0f2fe" />
                          <stop offset="100%" stopColor="#bae6fd" />
                       </radialGradient>
                    </defs>
                    {/* Ring Band */}
                    <ellipse cx="50" cy="70" rx="25" ry="15" fill="none" stroke="url(#goldRing)" strokeWidth="6" />
                    {/* Ring Top Setting */}
                    <path d="M40 55 L50 65 L60 55" fill="url(#goldRing)" stroke="#b8860b" strokeWidth="1" />
                    {/* Large Diamond */}
                    <path d="M50 15 L75 40 L50 65 L25 40 Z" fill="url(#diamondShine)" stroke="#fff" strokeWidth="0.5" className="animate-diamond-glint" />
                    <path d="M50 15 L50 65 M25 40 L75 40" stroke="white" strokeWidth="0.5" opacity="0.5" />
                 </svg>
              </div>

              {/* Box Lid (Upper Part of Heart) */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-30 origin-[50%_40%] animate-lid-open">
                 <path d="M100 180 C40 160 10 110 10 80 C10 50 40 35 100 70 C160 35 190 50 190 80 C190 110 160 160 100 180" fill="url(#boxRed)" stroke="#4d0000" strokeWidth="1" />
                 {/* Lid inner side (darker red) */}
                 <path d="M100 170 C50 155 25 110 25 85 C25 60 50 50 100 80 C150 50 175 60 175 85 C175 110 150 155 100 170" fill="#800000" opacity="0.8" />
              </svg>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes box-entrance {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.4; }
          50% { transform: translateX(-50%) scaleX(1.2); opacity: 0.6; }
        }
        @keyframes lid-open {
          0% { transform: rotateX(0deg) translateY(0); }
          20% { transform: rotateX(0deg) translateY(0); }
          55% { transform: rotateX(-110deg) translateY(-40px) translateZ(50px); opacity: 1; }
          100% { transform: rotateX(-110deg) translateY(-100px) translateZ(100px); opacity: 0; }
        }
        @keyframes cushion-reveal {
          0%, 30% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
        @keyframes ring-rise {
          0%, 40% { opacity: 0; transform: translate(-50%, 20px) scale(0.5); }
          65% { opacity: 1; transform: translate(-50%, -20px) scale(1.3); }
          100% { opacity: 1; transform: translate(-50%, -40px) scale(1.1); }
        }
        @keyframes diamond-glint {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 white); }
          50% { filter: brightness(1.5) drop-shadow(0 0 25px rgba(255,255,255,0.8)); }
        }
        @keyframes sparkle-elite {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-box-entrance { animation: box-entrance 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-shadow-pulse { animation: shadow-pulse 3s ease-in-out infinite; }
        .animate-lid-open { animation: lid-open 6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-cushion-reveal { animation: cushion-reveal 6s forwards; }
        .animate-ring-rise { animation: ring-rise 6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-diamond-glint { animation: diamond-glint 2s ease-in-out infinite; }
        .animate-sparkle-elite { animation: sparkle-elite 2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

/**
 * High-Fidelity Gift Animation Overlay.
 * Features full-screen cinematic visual effects, screen flashes, and unique high-tier animations.
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
      playNote(523.25, now + 1.2, 0.6); // C5
      playNote(659.25, now + 1.5, 0.6); // E5
      playNote(783.99, now + 1.8, 0.6); // G5
      playNote(1046.50, now + 2.2, 1.2, 'triangle'); // C6 Shine
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

      // Elite Party Horn Sequence
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