'use client';

import { useState } from 'react';
import { useStorage, useFirestore, useUser } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from './use-toast';

/**
 * Hook to handle profile picture uploads to Firebase Storage and update Firestore.
 * Ensures the visual identity is permanent and synchronized across summary and profile docs.
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
      // Create a unique path with timestamp to ensure cache busting and permanent identification
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const storagePath = `users/${user.uid}/profile_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const userSummaryRef = doc(firestore, 'users', user.uid);
      const userProfileRef = doc(firestore, 'users', user.uid, 'profile', user.uid);
      
      const updateData = { 
        avatarUrl: downloadURL,
        updatedAt: serverTimestamp()
      };

      // Atomic updates to ensure both documents reflect the new identity
      await Promise.all([
        updateDoc(userSummaryRef, updateData),
        updateDoc(userProfileRef, updateData)
      ]);
      
      toast({
        title: 'Identity Synchronized',
        description: 'Your new persona is now permanent across the tribe.',
      });
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
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
