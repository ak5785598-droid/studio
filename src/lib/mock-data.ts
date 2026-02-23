import type { User, Room, Message, Game, CoinPackage, Task } from './types';
import { PlaceHolderImages } from './placeholder-images';

const users: User[] = [
  { 
    id: 'u1', 
    name: 'Priya', 
    avatarUrl: PlaceHolderImages.find(i => i.id === 'user-avatar-1')?.imageUrl!, 
    isOnline: true, 
    bio: 'Just vibing and connecting with new people! Music and art lover.',
    coverUrl: PlaceHolderImages.find(i => i.id === 'profile-header')?.imageUrl,
    level: { rich: 45, charm: 32 },
    frame: 'Official',
    tags: ['Admin', 'Official'],
    specialId: '10001',
    stats: { sent: 6450359, followers: 8, fans: 44 },
    details: {
      age: 24,
      emotionalState: 'Keep secret',
      occupation: 'Anchor',
      hometown: 'Mumbai',
      personalitySignature: 'Happy every day'
    },
    wallet: {
      coins: 1250,
      diamonds: 450,
      totalSpent: 50000
    }
  },
  { 
    id: 'u2', 
    name: 'Rohan', 
    avatarUrl: PlaceHolderImages.find(i => i.id === 'user-avatar-2')?.imageUrl!, 
    isOnline: true,
    level: { rich: 12, charm: 8 },
    frame: 'CG',
    tags: ['VIP'],
    stats: { sent: 12345, followers: 120, fans: 88 },
     details: { hometown: 'Delhi' },
     wallet: { coins: 100, diamonds: 0, totalSpent: 12345 }
  },
];

const rooms: Room[] = []; // ALL MOCK ROOMS REMOVED

const games: Game[] = [
  { id: 'g1', title: 'Ludo Party', slug: 'ludo', coverUrl: 'https://picsum.photos/seed/ludo/300/200', cost: 0, imageHint: 'ludo board' },
  { id: 'g2', title: 'Carrom Clash', slug: 'carrom', coverUrl: 'https://picsum.photos/seed/carrom/300/200', cost: 0, imageHint: 'carrom board' },
];

const coinPackages: CoinPackage[] = [
  { id: 'cp01', amount: 2000, price: 25 },
  { id: 'cp02', amount: 4200, price: 50, bonus: 200 },
];

const dailyTasks: Task[] = [
  { id: 'dt1', title: 'Morning Check-in', description: 'Open the app today.', coinReward: 10, isCompleted: true, cta: { label: 'Go', href: '/tasks' } },
];

const achievementTasks: Task[] = [
  { id: 'at1', title: 'First Room', description: 'Create your very first chat room.', coinReward: 500, isCompleted: false, cta: { label: 'Create', href: '/rooms' } },
];

export const getPopularRooms = (): Room[] => rooms;
export const getPopularUsers = (): User[] => users;
export const getRoomBySlug = (slug: string): Room | undefined => rooms.find(r => r.slug === slug);
export const getAllRooms = (): Room[] => rooms;
export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getFreeGames = (): Game[] => games.filter(g => g.cost === 0);
export const getPremiumGames = (): Game[] => games.filter(g => g.cost > 0);
export const getCoinPackages = (): CoinPackage[] => coinPackages;
export const getDailyTasks = (): Task[] => dailyTasks;
export const getAchievementTasks = (): Task[] => achievementTasks;
