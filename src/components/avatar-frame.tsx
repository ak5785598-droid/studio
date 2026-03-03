'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarFrameProps {
  frameId?: string | null;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * High-fidelity Avatar Frame component.
 * Expanded to support f1-f7 including the new high-tier Celestial Wings frame.
 */
export function AvatarFrame({ frameId, children, className, size = 'md' }: AvatarFrameProps) {
  if (!frameId || frameId === 'None' || frameId === 'Default') {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  const isImperial = frameId === 'f4'; // Imperial Bloom
  const isGolden = frameId === 'f1' || frameId === 'Official'; // Golden Official
  const isCyber = frameId === 'f2'; // Cyberpunk Red
  const isRoyal = frameId === 'f3'; // Royal Purple
  const isWings = frameId === 'f5'; // Golden wings
  const isBronzeSky = frameId === 'f6'; // Bronze Sky
  const isCelestial = frameId === 'f7'; // Celestial Wings

  return (
    <div className={cn('relative flex items-center justify-center p-1', className)}>
      {/* Frame Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none scale-110">
        {isCelestial && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl animate-in fade-in duration-1000 overflow-visible">
            <defs>
              <linearGradient id="celestialBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c7d2fe" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="celestialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
              <filter id="celestialGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Top Spikes (Gold) */}
            <g fill="url(#celestialGold)" stroke="#854d0e" strokeWidth="0.2">
               {/* Left Spike */}
               <path d="M25 15 L35 10 L30 25 Z" />
               {/* Center Spike */}
               <path d="M40 5 L60 5 L50 15 Z" />
               {/* Right Spike */}
               <path d="M75 15 L65 10 L70 25 Z" />
            </g>

            {/* Side Wings (Lavender Blue) */}
            <g fill="url(#celestialBlue)" stroke="#3730a3" strokeWidth="0.2" className="animate-wing-flap origin-center">
               {/* Left Wing Layers */}
               <path d="M15 50 C 0 45, -10 60, 5 70 L15 65 Z" />
               <path d="M12 60 C -5 55, -15 75, 5 85 L12 75 Z" opacity="0.8" />
               <path d="M18 40 C 5 35, -5 50, 10 55 L18 50 Z" opacity="0.9" />
               {/* Right Wing Layers */}
               <path d="M85 50 C 100 45, 110 60, 95 70 L85 65 Z" />
               <path d="M88 60 C 105 55, 115 75, 95 85 L88 75 Z" opacity="0.8" />
               <path d="M82 40 C 95 35, 105 50, 90 55 L82 50 Z" opacity="0.9" />
            </g>

            {/* Main Ring Structure */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#celestialBlue)" strokeWidth="5" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#celestialGold)" strokeWidth="2" className="animate-shimmer-gold" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#celestialBlue)" strokeWidth="1.5" />

            {/* Bottom Talons */}
            <g fill="url(#celestialBlue)" stroke="#3730a3" strokeWidth="0.2">
               <path d="M35 92 L30 98 L40 95 Z" />
               <path d="M65 92 L70 98 L60 95 Z" />
            </g>

            {/* Animated Shine Streak */}
            <rect x="0" y="0" width="10" height="150" fill="white" opacity="0.2" transform="rotate(45) translate(0, -100)">
               <animateTransform attributeName="transform" type="translate" from="-100, -100" to="200, 100" dur="4s" repeatCount="indefinite" />
            </rect>
          </svg>
        )}

        {isBronzeSky && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl animate-in fade-in duration-1000 overflow-visible">
            <defs>
              <linearGradient id="bronzeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id="pinkGemGrad" cx="35%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#ff80ab" />
                <stop offset="100%" stopColor="#c2185b" />
              </radialGradient>
              <radialGradient id="cyanGemGrad" cx="35%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0891b2" />
              </radialGradient>
              <filter id="gemGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Bronze Laurel Wreath */}
            <g fill="url(#bronzeLeaf)" stroke="#451a03" strokeWidth="0.2">
               {/* Left Wreath */}
               <path d="M50 90 C30 90 10 75 5 50 C5 25 25 10 45 5 L48 8 C30 12 15 25 15 50 C15 70 30 85 50 85 Z" />
               {/* Right Wreath */}
               <path d="M50 90 C70 90 90 75 95 50 C95 25 75 10 55 5 L52 8 C70 12 85 25 85 50 C85 70 70 85 50 85 Z" />
               
               {/* Individual Leaf Accents */}
               {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                 <g key={deg} transform={`rotate(${deg}, 50, 50)`}>
                    <path d="M50 4 L54 12 L50 10 L46 12 Z" opacity={0.8} />
                 </g>
               ))}
            </g>

            {/* Shining Streak Overlay */}
            <rect x="0" y="0" width="10" height="150" fill="white" opacity="0.2" transform="rotate(45) translate(0, -100)">
               <animateTransform attributeName="transform" type="translate" from="-100, -100" to="200, 100" dur="3s" repeatCount="indefinite" />
            </rect>

            {/* Side Cyan Gems */}
            <circle cx="15" cy="35" r="3" fill="url(#cyanGemGrad)" filter="url(#gemGlow)" className="animate-pulse" />
            <circle cx="85" cy="35" r="3" fill="url(#cyanGemGrad)" filter="url(#gemGlow)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="10" cy="55" r="2.5" fill="url(#cyanGemGrad)" opacity="0.8" />
            <circle cx="90" cy="55" r="2.5" fill="url(#cyanGemGrad)" opacity="0.8" />

            {/* Bottom Sovereign Pink Diamond */}
            <g transform="translate(50, 90)" className="animate-reaction-heartbeat">
               <circle cx="0" cy="0" r="10" fill="#f472b6" opacity="0.2" className="animate-pulse" />
               <path 
                 d="M 0 8 L -7 0 L 0 -8 L 7 0 Z" 
                 fill="url(#pinkGemGrad)" 
                 stroke="#880e4f" 
                 strokeWidth="0.5" 
                 filter="url(#gemGlow)" 
               />
               <path d="M -3 0 L 0 -5 L 3 0 L 0 5 Z" fill="white" opacity="0.3" />
               <path d="M 0 -8 L 2 -2 L 0 0 L -2 -2 Z" fill="white" opacity="0.2" />
            </g>
          </svg>
        )}

        {isWings && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl animate-in fade-in duration-1000 overflow-visible">
            <defs>
              <linearGradient id="goldWings" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF281" />
                <stop offset="20%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <filter id="goldGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <radialGradient id="rubyGem" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#800000" />
              </radialGradient>
              <radialGradient id="sapphireGem" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#4d4dff" />
                <stop offset="100%" stopColor="#000080" />
              </radialGradient>
              <radialGradient id="emeraldGem" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#4dff4d" />
                <stop offset="100%" stopColor="#008000" />
              </radialGradient>
            </defs>
            
            {/* Angelic Wings */}
            <g className="animate-wing-flap origin-center">
              {/* Left Wing */}
              <g transform="translate(15, 50) rotate(-15)">
                <path d="M0 0 C -25 -10, -45 -45, -35 -65 C -30 -75, -15 -65, 0 -45 Z" fill="url(#goldWings)" opacity="0.9" filter="url(#goldGlow)" />
                <path d="M-5 -5 C -25 -15, -40 -40, -30 -55 C -25 -65, -10 -55, -5 -40 Z" fill="url(#goldWings)" opacity="0.7" />
                <path d="M-10 -10 C -30 -25, -45 -35, -35 -45 C -30 -50, -15 -45, -10 -35 Z" fill="url(#goldWings)" opacity="0.5" />
              </g>
              {/* Right Wing */}
              <g transform="translate(85, 50) rotate(15)">
                <path d="M0 0 C 25 -10, 45 -45, 35 -65 C 30 -75, 15 -65, 0 -45 Z" fill="url(#goldWings)" opacity="0.9" filter="url(#goldGlow)" />
                <path d="M5 -5 C 25 -15, 40 -40, 30 -55 C 25 -65, 10 -55, 5 -40 Z" fill="url(#goldWings)" opacity="0.7" />
                <path d="M10 -10 C 30 -25, 45 -35, 35 -45 C 30 -50, 15 -45, 10 -35 Z" fill="url(#goldWings)" opacity="0.5" />
              </g>
            </g>

            {/* Main Gold Frame Ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldWings)" strokeWidth="4.5" className="animate-shimmer-gold" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            
            {/* Gemstone Inlays */}
            <circle cx="50" cy="4" r="3.2" fill="url(#rubyGem)" className="animate-pulse" />
            <circle cx="15" cy="15" r="2.2" fill="url(#sapphireGem)" />
            <circle cx="85" cy="15" r="2.2" fill="url(#sapphireGem)" />
            <circle cx="4" cy="50" r="2.2" fill="url(#emeraldGem)" />
            <circle cx="96" cy="50" r="2.2" fill="url(#emeraldGem)" />
            <circle cx="15" cy="85" r="2.2" fill="url(#sapphireGem)" />
            <circle cx="85" cy="85" r="2.2" fill="url(#sapphireGem)" />

            {/* Bottom Elite VIP Emblem */}
            <g transform="translate(50, 92)">
              <path d="M-8 -8 L0 4 L8 -8 L0 -12 Z" fill="url(#goldWings)" stroke="#000" strokeWidth="0.3" filter="url(#goldGlow)" />
              <text y="-2" fontSize="5.5" textAnchor="middle" fill="black" fontWeight="black" style={{fontFamily: 'serif'}}>VIP</text>
            </g>
          </svg>
        )}

        {isImperial && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl animate-in fade-in duration-1000">
            <defs>
              <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="royalGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#imperialGold)" strokeWidth="3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#7e22ce" strokeWidth="1.5" opacity="0.6" className="animate-pulse" />
            <g transform="translate(30, -5) scale(0.4)" filter="url(#royalGlow)">
               <path d="M50 10 L65 40 L85 40 L70 60 L80 90 L50 75 L20 90 L30 60 L15 40 L35 40 Z" fill="url(#imperialGold)" stroke="#000" strokeWidth="2" />
               <circle cx="50" cy="30" r="5" fill="#ef4444" className="animate-pulse" />
            </g>
            <g className="animate-bounce" style={{ animationDuration: '3s' }}>
               <circle cx="15" cy="30" r="8" fill="#7e22ce" stroke="#581c87" strokeWidth="1" />
               <circle cx="85" cy="30" r="8" fill="#7e22ce" stroke="#581c87" strokeWidth="1" />
            </g>
          </svg>
        )}

        {isGolden && (
          <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-glow shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
        )}

        {isCyber && (
          <div className="absolute inset-0 border-4 border-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-red-500" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-red-500" />
          </div>
        )}

        {isRoyal && (
          <div className="absolute inset-0 border-[3px] border-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]">
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-purple-600">👑</div>
          </div>
        )}
      </div>

      {/* Avatar Content */}
      <div className="relative z-10 rounded-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
