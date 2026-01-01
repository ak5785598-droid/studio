
'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import type { ReactNode } from 'react';

/**
 * The main providers component for the application.
 * It currently includes the FirebaseClientProvider to enable Firebase services.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}
