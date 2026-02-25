'use client';

import { useState } from 'react';
import { useStorage, useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './use-toast';

/**
 * Hook to handle room image uploads to Firebase Storage and update Firestore.
 * Synchronized with Ummy production non-blocking protocol.
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
        title: 'Error',
        description: 'Authorization context missing.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Create a storage reference
      const storagePath = `chatRooms/${roomId}/cover.jpg`;
      const storageRef = ref(storage, storagePath);

      // 2. Upload the file
      const uploadResult = await uploadBytes(storageRef, file);

      // 3. Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // 4. Update Firestore room document (Non-Blocking)
      const roomRef = doc(firestore, 'chatRooms', roomId);
      
      const updateData = { 
        coverUrl: downloadURL,
        updatedAt: serverTimestamp()
      };

      updateDocumentNonBlocking(roomRef, updateData);

      toast({
        title: 'Room DP Updated!',
        description: 'The frequency visual identity has been synchronized across the tribe.',
      });
    } catch (error: any) {
      console.error('Error uploading room image:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload the new image. Check owner permissions.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadRoomImage };
}
