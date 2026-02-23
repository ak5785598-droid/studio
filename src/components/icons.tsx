export const UmmyLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#9ca3af" />
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
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Flames Background */}
        <path 
            d="M50 10 Q60 25 55 35 Q75 20 70 45 Q85 35 80 60 Q50 75 20 60 Q15 35 30 45 Q25 20 45 35 Q40 25 50 10" 
            fill="url(#fireGradient)"
            filter="url(#glow)"
        />

        {/* Equalizer Bars */}
        <rect x="20" y="50" width="4" height="10" fill="#f472b6" opacity="0.6" />
        <rect x="26" y="45" width="4" height="15" fill="#f472b6" opacity="0.8" />
        <rect x="32" y="40" width="4" height="20" fill="#f472b6" />
        <rect x="64" y="40" width="4" height="20" fill="#8b5cf6" />
        <rect x="70" y="45" width="4" height="15" fill="#8b5cf6" opacity="0.8" />
        <rect x="76" y="50" width="4" height="10" fill="#8b5cf6" opacity="0.6" />

        {/* Lightning Bolts */}
        <path d="M15 35 L25 45 L20 45 L30 55" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <path d="M85 35 L75 45 L80 45 L70 55" stroke="#fbbf24" strokeWidth="2" fill="none" />

        {/* Microphone Body */}
        <rect x="42" y="30" width="16" height="25" rx="8" fill="url(#micGradient)" stroke="#1f2937" strokeWidth="1" />
        <path d="M42 42 H58" stroke="#1f2937" strokeWidth="0.5" />
        <path d="M42 36 H58" stroke="#1f2937" strokeWidth="0.5" />
        <path d="M42 48 H58" stroke="#1f2937" strokeWidth="0.5" />
        
        {/* Mic Stand */}
        <path d="M40 50 Q40 65 50 65 Q60 65 60 50" fill="none" stroke="#9ca3af" strokeWidth="2" />
        <rect x="48" y="65" width="4" height="5" fill="#4b5563" />

        {/* UMMY Shield/Text Base */}
        <path d="M15 75 L85 75 L75 90 L50 95 L25 90 Z" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
        <path d="M30 85 Q50 80 70 85" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />

        {/* UMMY Text (Simplified) */}
        <text 
            x="50" 
            y="85" 
            textAnchor="middle" 
            fill="url(#textGradient)" 
            style={{ fontSize: '12px', fontWeight: '900', fontFamily: 'sans-serif', fontStyle: 'italic' }}
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
