
'use client';

import React, { ReactNode } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

// Initialize Firebase on the client.
const { firebaseApp, auth, firestore } = initializeFirebase();

/**
 * A client-side component that wraps the main FirebaseProvider.
 * This ensures that Firebase is initialized only once, on the client,
 * and provides the necessary instances to the rest of the application.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
