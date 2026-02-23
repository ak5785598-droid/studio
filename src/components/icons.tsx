export const UmmyLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="micChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#3f3f46" />
            </linearGradient>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Golden Ring Background */}
        <circle cx="50" cy="42" r="38" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />

        {/* Dynamic Flames */}
        <g filter="url(#neonGlow)">
            <path 
                d="M50 5 Q65 22 58 35 Q80 20 75 45 Q90 35 85 65 Q50 80 15 65 Q10 35 25 45 Q20 20 42 35 Q35 22 50 5" 
                fill="url(#fireGrad)"
            />
        </g>

        {/* Lightning Bolts */}
        <path d="M15 35 L25 50 L20 50 L30 65" fill="#facc15" stroke="#ffffff" strokeWidth="0.5" filter="url(#neonGlow)" />
        <path d="M85 35 L75 50 L80 50 L70 65" fill="#facc15" stroke="#ffffff" strokeWidth="0.5" filter="url(#neonGlow)" />

        {/* Equalizer Bars */}
        <g opacity="0.9">
            <rect x="8" y="52" width="3.5" height="15" rx="1.75" fill="#f472b6" />
            <rect x="14" y="48" width="3.5" height="20" rx="1.75" fill="#f472b6" />
            <rect x="20" y="44" width="3.5" height="24" rx="1.75" fill="#f472b6" />
            
            <rect x="76.5" y="44" width="3.5" height="24" rx="1.75" fill="#8b5cf6" />
            <rect x="82.5" y="48" width="3.5" height="20" rx="1.75" fill="#8b5cf6" />
            <rect x="88.5" y="52" width="3.5" height="15" rx="1.75" fill="#8b5cf6" />
        </g>

        {/* Microphone Body */}
        <rect x="38" y="22" width="24" height="35" rx="12" fill="url(#micChrome)" stroke="#000" strokeWidth="1.2" />
        <path d="M38 32 H62 M38 39 H62 M38 46 H62" stroke="#000" strokeWidth="0.5" opacity="0.4" />
        
        {/* Mic Holder */}
        <path d="M35 48 Q35 65 50 65 Q65 65 65 48" fill="none" stroke="#a1a1aa" strokeWidth="2.5" />
        <rect x="47.5" y="65" width="5" height="8" fill="#3f3f46" />

        {/* UMMY Shield Base */}
        <path 
            d="M10 70 L90 70 L82 94 L50 100 L18 94 Z" 
            fill="#0f172a" 
            stroke="#4f46e5" 
            strokeWidth="2.5" 
        />
        
        {/* Neon Frequency Line */}
        <path 
            d="M20 88 L32 88 L38 82 L44 94 L50 88 L56 82 L62 94 L68 88 L80 88" 
            fill="none" 
            stroke="#00f2ff" 
            strokeWidth="2" 
            filter="url(#neonGlow)" 
        />

        {/* UMMY Text Styling */}
        <text 
            x="50" 
            y="85" 
            textAnchor="middle" 
            fill="url(#textGrad)" 
            style={{ 
                fontSize: '16px', 
                fontWeight: '950', 
                fontFamily: 'Arial Black, sans-serif', 
                fontStyle: 'italic',
                textShadow: '0 0 10px rgba(244,114,182,0.8)' 
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
