export const UmmyLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="teddyGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFC1CC" />
                <stop offset="100%" stopColor="#FF89B5" />
            </linearGradient>
            <linearGradient id="earGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF89B5" />
                <stop offset="100%" stopColor="#E85A90" />
            </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="50" cy="50" r="35" fill="url(#teddyGradient)" />

        {/* Ears */}
        <circle cx="25" cy="25" r="15" fill="url(#earGradient)" />
        <circle cx="75" cy="25" r="15" fill="url(#earGradient)" />
        
        {/* Inner Ears */}
        <circle cx="28" cy="28" r="8" fill="url(#teddyGradient)" />
        <circle cx="72" cy="28" r="8" fill="url(#teddyGradient)" />
        
        {/* Snout */}
        <ellipse cx="50" cy="58" rx="20" ry="15" fill="#FFFFFF" fillOpacity="0.7" />
        
        {/* Nose */}
        <path d="M 50 55 a 5 4 0 1 1 0.001 0" fill="#5F3A70"/>
        
        {/* Eyes */}
        <circle cx="40" cy="45" r="4" fill="#5F3A70" />
        <circle cx="60" cy="45" r="4" fill="#5F3A70" />
        
        {/* Smile */}
        <path d="M 45 65 Q 50 70 55 65" stroke="#5F3A70" strokeWidth="2" fill="none" strokeLinecap="round"/>
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