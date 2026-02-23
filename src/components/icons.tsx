export const UmmyLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Circular Background Ring */}
        <circle cx="50" cy="45" r="35" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />

        {/* High-Fidelity Flames */}
        <g filter="url(#glow)">
            <path 
                d="M50 10 Q60 25 55 35 Q75 20 70 45 Q85 35 80 60 Q50 75 20 60 Q15 35 30 45 Q25 20 45 35 Q40 25 50 10" 
                fill="url(#fireGradient)"
            />
            <path 
                d="M50 15 Q55 25 53 32 Q65 22 62 40 Q75 32 72 50 Q50 60 28 50 Q25 32 38 40 Q35 22 47 32 Q45 25 50 15" 
                fill="#fbbf24" opacity="0.6"
            />
        </g>

        {/* Equalizer Bars on sides */}
        <g opacity="0.8">
            <rect x="15" y="45" width="3" height="12" rx="1.5" fill="#f472b6" />
            <rect x="20" y="40" width="3" height="18" rx="1.5" fill="#f472b6" />
            <rect x="25" y="35" width="3" height="25" rx="1.5" fill="#f472b6" />
            
            <rect x="72" y="35" width="3" height="25" rx="1.5" fill="#8b5cf6" />
            <rect x="77" y="40" width="3" height="18" rx="1.5" fill="#8b5cf6" />
            <rect x="82" y="45" width="3" height="12" rx="1.5" fill="#8b5cf6" />
        </g>

        {/* Lightning Bolts */}
        <path d="M10 30 L22 42 L16 42 L28 55" stroke="#fbbf24" strokeWidth="2" fill="none" filter="url(#glow)" />
        <path d="M90 30 L78 42 L84 42 L72 55" stroke="#fbbf24" strokeWidth="2" fill="none" filter="url(#glow)" />

        {/* Microphone Body (Detailed) */}
        <rect x="40" y="25" width="20" height="30" rx="10" fill="url(#micGradient)" stroke="#1f2937" strokeWidth="1.5" />
        <path d="M40 35 H60 M40 40 H60 M40 45 H60" stroke="#1f2937" strokeWidth="0.5" />
        <path d="M48 25 V55 M52 25 V55" stroke="#1f2937" strokeWidth="0.5" opacity="0.2" />
        
        {/* Mic Holder/Stand */}
        <path d="M38 45 Q38 60 50 60 Q62 60 62 45" fill="none" stroke="#9ca3af" strokeWidth="2" />
        <rect x="48" y="60" width="4" height="4" fill="#4b5563" />

        {/* UMMY Logo Shield Base */}
        <path 
            d="M10 70 L90 70 L80 92 L50 98 L20 92 Z" 
            fill="#0f172a" 
            stroke="#4f46e5" 
            strokeWidth="1.5" 
        />
        
        {/* Neon Frequency Line inside shield */}
        <path 
            d="M20 85 L35 85 L40 78 L45 92 L50 85 L55 78 L60 92 L65 85 L80 85" 
            fill="none" 
            stroke="#00f2ff" 
            strokeWidth="1.5" 
            filter="url(#glow)" 
        />

        {/* UMMY Text in high-energy font style */}
        <text 
            x="50" 
            y="82" 
            textAnchor="middle" 
            fill="url(#textGradient)" 
            style={{ 
                fontSize: '14px', 
                fontWeight: '900', 
                fontFamily: 'system-ui', 
                fontStyle: 'italic',
                textShadow: '0 0 5px rgba(244,114,182,0.8)' 
            }}
        >
            UMMY
        </text>
    </svg>
);


export const GameControllerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.14 8.36a2.5 2.5 0 0 0-3.54 0" />
    <path d="M12 12H4" />
    <path d="M8 8V4" />
    <path d="M8.03 16.03a2.5 2.5 0 0 0 0-3.53" />
    <path d="M16 12h-4" />
    <path d="M12.46 12.46a2.5 2.5 0 0 0 3.53 3.53" />
    <path d="M17.64 17.64a2.5 2.5 0 0 0 0-3.53" />
    <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
  </svg>
);
