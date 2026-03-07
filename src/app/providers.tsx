'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProfileInitializer } from '@/components/profile-initializer';
import { RoomProvider } from '@/components/room-provider';
import { RoomPresenceManager } from '@/components/room-presence-manager';
import { GlobalPresenceManager } from '@/components/global-presence-manager';
import type { ReactNode } from 'react';

/**
 * The main providers component for the application.
 * Includes Firebase context, Real-time Profile Initializer, and Global Room Frequency Management.
 * GlobalBroadcastBanner has been removed.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ProfileInitializer />
      <GlobalPresenceManager />
      <RoomProvider>
        <RoomPresenceManager />
        {children}
      </RoomProvider>
    </FirebaseClientProvider>
  );
}
