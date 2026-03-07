/**
 * @fileOverview Centralized Room Theme Ledger.
 * Defines the high-fidelity visual frequencies available for chat rooms.
 */

export interface RoomTheme {
  id: string;
  name: string;
  url: string;
  isOfficial?: boolean;
  seatColor?: string;
  accentColor?: string;
}

export const ROOM_THEMES: RoomTheme[] = [
  { 
    id: 'misty', 
    name: 'Misty Forest', 
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000',
    seatColor: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#4ade80'
  },
  { 
    id: 'neon', 
    name: 'Neon Party', 
    url: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=2000',
    seatColor: 'rgba(147, 51, 234, 0.2)',
    accentColor: '#d946ef'
  },
  { 
    id: 'royal', 
    name: 'Royal Palace', 
    url: 'https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=2000',
    seatColor: 'rgba(184, 138, 68, 0.2)',
    accentColor: '#fbbf24'
  },
  { id: 'sakura', name: 'Sakura Bloom', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2000', seatColor: 'rgba(244, 114, 182, 0.2)', accentColor: '#f472b6' },
  { id: 'crystal', name: 'Crystal Cave', url: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?q=80&w=2000', seatColor: 'rgba(103, 232, 249, 0.2)', accentColor: '#22d3ee' },
  { id: 'cyber', name: 'Cyber Punk', url: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=2000', seatColor: 'rgba(239, 68, 68, 0.2)', accentColor: '#f87171' },
  { id: 'ocean', name: 'Ocean Deep', url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2000', seatColor: 'rgba(37, 99, 235, 0.2)', accentColor: '#60a5fa' },
  { id: 'aurora', name: 'Midnight Aurora', url: 'https://images.unsplash.com/photo-1531366930477-4f209593bae3?q=80&w=2000', seatColor: 'rgba(168, 85, 247, 0.2)', accentColor: '#c084fc' },
  { id: 'horizon', name: 'Golden Horizon', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2000', seatColor: 'rgba(245, 158, 11, 0.2)', accentColor: '#fbbf24' },
  { id: 'retro', name: 'Retro Wave', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000', seatColor: 'rgba(236, 72, 153, 0.2)', accentColor: '#f472b6' },
  { id: 'zen', name: 'Zen Garden', url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000', seatColor: 'rgba(101, 163, 13, 0.2)', accentColor: '#84cc16' },
  // Restricted Official Themes
  { id: 'official_ummy', name: 'Official Ummy', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000', isOfficial: true, seatColor: 'rgba(255, 204, 0, 0.2)', accentColor: '#FFCC00' },
  { id: 'help_center', name: 'Support Blue', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000', isOfficial: true, seatColor: 'rgba(33, 150, 243, 0.2)', accentColor: '#2196F3' },
];
