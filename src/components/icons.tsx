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
