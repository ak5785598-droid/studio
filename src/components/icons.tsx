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
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Circular Background Ring */}
        <circle cx="50" cy="45" r="38" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2" />

        {/* High-Fidelity Flames */}
        <g filter="url(#glow)">
            <path 
                d="M50 8 Q65 25 58 35 Q80 20 75 45 Q90 35 85 65 Q50 80 15 65 Q10 35 25 45 Q20 20 42 35 Q35 25 50 8" 
                fill="url(#fireGradient)"
            />
            <path 
                d="M50 15 Q58 28 55 35 Q70 25 68 42 Q80 35 76 55 Q50 65 24 55 Q20 35 32 42 Q30 25 45 35 Q42 28 50 15" 
                fill="#fbbf24" opacity="0.6"
            />
        </g>

        {/* Equalizer Bars */}
        <g opacity="0.9">
            <rect x="12" y="48" width="3.5" height="15" rx="1.75" fill="#f472b6" />
            <rect x="18" y="42" width="3.5" height="22" rx="1.75" fill="#f472b6" />
            <rect x="24" y="38" width="3.5" height="28" rx="1.75" fill="#f472b6" />
            
            <rect x="72.5" y="38" width="3.5" height="28" rx="1.75" fill="#8b5cf6" />
            <rect x="78.5" y="42" width="3.5" height="22" rx="1.75" fill="#8b5cf6" />
            <rect x="84.5" y="48" width="3.5" height="15" rx="1.75" fill="#8b5cf6" />
        </g>

        {/* Microphone Body */}
        <rect x="38" y="28" width="24" height="32" rx="12" fill="url(#micGradient)" stroke="#1f2937" strokeWidth="1.5" />
        <path d="M38 40 H62 M38 46 H62 M38 52 H62" stroke="#1f2937" strokeWidth="0.5" />
        
        {/* Mic Holder */}
        <path d="M35 50 Q35 65 50 65 Q65 65 65 50" fill="none" stroke="#9ca3af" strokeWidth="2.5" />
        <rect x="47.5" y="65" width="5" height="6" fill="#4b5563" />

        {/* UMMY Shield Base */}
        <path 
            d="M10 72 L90 72 L82 94 L50 100 L18 94 Z" 
            fill="#0f172a" 
            stroke="#4f46e5" 
            strokeWidth="2" 
        />
        
        {/* Neon Frequency Line */}
        <path 
            d="M20 88 L32 88 L38 80 L44 96 L50 88 L56 80 L62 96 L68 88 L80 88" 
            fill="none" 
            stroke="#00f2ff" 
            strokeWidth="2" 
            filter="url(#glow)" 
        />

        {/* UMMY Text */}
        <text 
            x="50" 
            y="85" 
            textAnchor="middle" 
            fill="url(#textGradient)" 
            style={{ 
                fontSize: '15px', 
                fontWeight: '950', 
                fontFamily: 'system-ui', 
                fontStyle: 'italic',
                textShadow: '0 0 8px rgba(244,114,182,0.9)' 
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
