'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GiftAnimationOverlayProps {
  giftId: string | null;
  onComplete: () => void;
}

/**
 * Enhanced Gift Animation Overlay.
 * Features full-screen visual effects, screen flashes, and unique high-tier animations.
 */
export function GiftAnimationOverlay({ giftId, onComplete }: GiftAnimationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    if (giftId) {
      setIsVisible(true);
      setTriggerKey(prev => prev + 1); // Force re-render for consecutive same gifts
      const duration = (giftId === 'dragon' || giftId === 'supernova') ? 4000 : 3000;
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
      default: return 'animate-bounce scale-150';
    }
  };

  const isHighTier = ['dragon', 'rocket', 'castle', 'galaxy', 'supernova'].includes(giftId);
  const isUltimate = giftId === 'supernova' || giftId === 'galaxy';

  return (
    <div key={triggerKey} className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Screen Flash for High Tier */}
      {isHighTier && (
        <div className="absolute inset-0 animate-screen-flash pointer-events-none" />
      )}

      {/* Screen Overlay for Ultimate */}
      {isUltimate && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] animate-pulse" />
      )}

      <div className={cn(
        "text-9xl filter transition-all duration-300",
        isUltimate ? "drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]" : "drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]",
        getAnimationClass()
      )}>
        {getEmoji()}
      </div>
      
      {/* Visual Particle Hints for massive gifts */}
      {isUltimate && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-full bg-gradient-radial from-white/20 to-transparent opacity-50 animate-ping" />
        </div>
      )}
    </div>
  );
}
