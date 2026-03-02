'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * PRODUCTION FIREBASE INITIALIZATION
 * Re-engineered to explicitly use the firebaseConfig to ensure Storage Bucket availability.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    // Force use of firebaseConfig to guarantee storageBucket and apiKey presence in Studio environment
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  // Ensure bucket is prefixed correctly for maximum SDK compatibility
  const bucketUrl = firebaseConfig.storageBucket.startsWith('gs://') 
    ? firebaseConfig.storageBucket 
    : `gs://${firebaseConfig.storageBucket}`;

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp, bucketUrl)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
