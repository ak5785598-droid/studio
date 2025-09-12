export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  isOnline?: boolean;
  coverUrl?: string;
  stats?: {
    sent?: number;
    followers?: number;
    fans?: number;
  };
  details?: {
    age?: number;
    emotionalState?: string;
    occupation?: string;
    hometown?: string;
    personalitySignature?: string;
  };
};

export type Message = {
  id: string;
  text: string;
  user: User;
  timestamp: string;
};

export type Room = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  coverUrl: string;
  participants: User[];
  messages: Message[];
};
