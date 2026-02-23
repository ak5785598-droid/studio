'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GiftAnimationOverlayProps {
  giftId: string | null;
  onComplete: () => void;
}

/**
 * High-Fidelity Gift Animation Overlay.
 * Features full-screen cinematic visual effects, screen flashes, and unique high-tier animations.
 */
export function GiftAnimationOverlay({ giftId, onComplete }: GiftAnimationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    if (giftId) {
      setIsVisible(true);
      setTriggerKey(prev => prev + 1); // Force re-render for consecutive same gifts
      
      // Determine duration based on gift impact
      let duration = 3000;
      if (giftId === 'supernova' || giftId === 'galaxy') duration = 4000;
      if (giftId === 'dragon') duration = 4500;

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
      default: return '🎁';
    }
  };

  const getAnimationClass = () => {
    switch (giftId) {
      case 'heart': return 'animate-heart-burst';
      case 'car': return 'animate-car-drift';
      case 'jet': return 'animate-jet-fly';
      case 'dragon': return 'animate-dragon-soar';
      case 'rocket': return 'animate-rocket-launch';
      case 'galaxy': return 'animate-galaxy-zoom';
      case 'supernova': return 'animate-supernova-burst';
      default: return 'animate-bounce scale-[2.0]';
    }
  };

  const isHighTier = ['dragon', 'rocket', 'castle', 'galaxy', 'supernova'].includes(giftId);
  const isUltimate = giftId === 'supernova' || giftId === 'galaxy';

  return (
    <div key={triggerKey} className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Screen Flash for High Tier Impact */}
      {isHighTier && (
        <div className="absolute inset-0 animate-screen-flash pointer-events-none" />
      )}

      {/* Atmospheric Screen Overlay for Ultimate Tier */}
      {isUltimate && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[3px] animate-in fade-in duration-1000 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-50 animate-pulse" />
        </div>
      )}

      <div className={cn(
        "text-9xl filter transition-all duration-500",
        isUltimate ? "drop-shadow-[0_0_60px_rgba(255,255,255,0.9)] scale-125" : "drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]",
        getAnimationClass()
      )}>
        {getEmoji()}
      </div>
      
      {/* Explosive Visual "Particles" for Supernova */}
      {giftId === 'supernova' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-24 h-24 bg-white rounded-full blur-3xl animate-ping scale-[10]" />
           <div className="w-12 h-12 bg-yellow-400 rounded-full blur-2xl animate-ping scale-[15] delay-150" />
        </div>
      )}
    </div>
  );
}