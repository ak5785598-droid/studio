'use client';

import { useState } from 'react';
import { useStorage, useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './use-toast';

/**
 * Elite Visual Identity Sync Hook.
 * Handles profile picture uploads with high-fidelity resilience.
 */
export function useProfilePictureUpload() {
  const storage = useStorage();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePicture = async (file: File) => {
    if (!user || !storage || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Sync Error',
        description: 'Identity frequency missing. Please sign in again.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Storage Upload
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const storagePath = `users/${user.uid}/profile_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, storagePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Firestore Sync (Non-Blocking)
      const userSummaryRef = doc(firestore, 'users', user.uid);
      const userProfileRef = doc(firestore, 'users', user.uid, 'profile', user.uid);
      
      const updateData = { 
        avatarUrl: downloadURL,
        updatedAt: serverTimestamp()
      };

      setDocumentNonBlocking(userSummaryRef, updateData, { merge: true });
      setDocumentNonBlocking(userProfileRef, updateData, { merge: true });
      
      toast({
        title: 'Identity Synchronized',
        description: 'Your new persona is now live.',
      });
    } catch (error: any) {
      console.error('[Visual Sync] Upload Failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: error.message || 'Could not broadcast your new identity.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadProfilePicture };
}
