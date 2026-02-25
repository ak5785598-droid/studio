export const UmmyLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF5F00" />
                <stop offset="100%" stopColor="#FFCC00" />
            </linearGradient>
        </defs>
        {/* Rounded white background box */}
        <rect x="10" y="10" width="80" height="80" rx="24" fill="white" />
        
        {/* Ears */}
        <circle cx="32" cy="38" r="14" fill="url(#earGradient)" />
        <circle cx="68" cy="38" r="14" fill="url(#earGradient)" />
        
        {/* Face */}
        <circle cx="50" cy="55" r="28" fill="#FFCC00" />
        
        {/* Features */}
        <circle cx="40" cy="50" r="3.5" fill="#1A1A1A" />
        <circle cx="60" cy="50" r="3.5" fill="#1A1A1A" />
        <circle cx="50" cy="60" r="4.5" fill="#1A1A1A" />
        
        {/* Simple Smile */}
        <path 
            d="M 42 68 Q 50 74 58 68" 
            fill="none" 
            stroke="#1A1A1A" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
        />
    </svg>
);

export const GoldCoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF281" />
        <stop offset="40%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id="bearEar" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    
    {/* Coin Body */}
    <circle cx="50" cy="50" r="48" fill="url(#goldBase)" stroke="#8B4513" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="#DAA520" strokeWidth="1.5" strokeDasharray="2 2" />
    
    {/* Wheat decoration */}
    <path d="M18 45 C 15 50, 15 60, 20 65" fill="none" stroke="#8B4513" strokeWidth="1" strokeLinecap="round" />
    <path d="M82 45 C 85 50, 85 60, 80 65" fill="none" stroke="#8B4513" strokeWidth="1" strokeLinecap="round" />
    
    {/* Top/Bottom Stars */}
    <path d="M50 10 L52 15 L58 15 L53 18 L55 24 L50 21 L45 24 L47 18 L42 15 L48 15 Z" fill="#8B4513" />
    <path d="M50 90 L52 85 L58 85 L53 82 L55 76 L50 79 L45 76 L47 82 L42 85 L48 85 Z" fill="#8B4513" />

    {/* The Bear Character */}
    <circle cx="35" cy="42" r="9" fill="url(#bearEar)" stroke="#8B4513" strokeWidth="0.5" />
    <circle cx="65" cy="42" r="9" fill="url(#bearEar)" stroke="#8B4513" strokeWidth="0.5" />
    <circle cx="50" cy="55" r="22" fill="#FFCC00" stroke="#8B4513" strokeWidth="0.5" />
    <ellipse cx="50" cy="62" rx="10" ry="8" fill="#FFF9E3" />
    <circle cx="43" cy="52" r="2.5" fill="#1A1A1A" />
    <circle cx="57" cy="52" r="2.5" fill="#1A1A1A" />
    <path d="M48 58 Q50 55 52 58 L50 61 Z" fill="#1A1A1A" />
    <path d="M46 65 Q50 68 54 65" fill="none" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" />
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
