/**
 * @fileOverview Centralized Room Theme Ledger.
 * Defines the high-fidelity visual frequencies available for chat rooms.
 */

export interface RoomTheme {
  id: string;
  name: string;
  url: string;
  isOfficial?: boolean;
}

export const ROOM_THEMES: RoomTheme[] = [
  { id: 'misty', name: 'Misty Forest', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000' },
  { id: 'neon', name: 'Neon Party', url: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=2000' },
  { id: 'royal', name: 'Royal Palace', url: 'https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=2000' },
  { id: 'sakura', name: 'Sakura Bloom', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2000' },
  { id: 'crystal', name: 'Crystal Cave', url: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?q=80&w=2000' },
  { id: 'cyber', name: 'Cyber Punk', url: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=2000' },
  { id: 'ocean', name: 'Ocean Deep', url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2000' },
  { id: 'aurora', name: 'Midnight Aurora', url: 'https://images.unsplash.com/photo-1531366930477-4f209593bae3?q=80&w=2000' },
  { id: 'horizon', name: 'Golden Horizon', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2000' },
  { id: 'retro', name: 'Retro Wave', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000' },
  { id: 'zen', name: 'Zen Garden', url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000' },
  // Restricted Official Themes
  { id: 'official_ummy', name: 'Official Ummy', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000', isOfficial: true },
  { id: 'help_center', name: 'Support Blue', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000', isOfficial: true },
];
