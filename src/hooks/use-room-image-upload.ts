'use client';

import { useState } from 'react';
import { useStorage, useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './use-toast';

/**
 * Elite Frequency Cover Sync Hook.
 * Handles room cover image updates with high-fidelity resilience.
 */
export function useRoomImageUpload(roomId: string) {
  const storage = useStorage();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadRoomImage = async (file: File) => {
    if (!user || !storage || !firestore || !roomId) {
      toast({
        variant: 'destructive',
        title: 'Sync Error',
        description: 'Authorization context or Room ID missing.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Storage Upload
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const storagePath = `chatRooms/${roomId}/cover_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Firestore Sync (Non-Blocking)
      const roomRef = doc(firestore, 'chatRooms', roomId);
      
      const updateData = { 
        id: roomId,
        coverUrl: downloadURL,
        updatedAt: serverTimestamp()
      };

      setDocumentNonBlocking(roomRef, updateData, { merge: true });

      toast({
        title: 'Frequency Cover Updated!',
        description: 'The new visual vibe has been synchronized.',
      });
    } catch (error: any) {
      console.error('[Visual Sync] Room Cover Failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not broadcast the new visual vibe.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadRoomImage };
}
