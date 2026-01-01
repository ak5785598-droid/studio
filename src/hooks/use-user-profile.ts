
'use client';
import { useMemo } from 'react';
import { useFirestore, useDoc, WithId } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';

// Assuming a UserProfile type is defined somewhere, e.g., in @/lib/types
// If not, you should define it based on your data structure.
// For this example, let's assume it looks like this:
export interface UserProfile {
    id: string;
    username: string;
    avatarUrl: string;
    bio?: string;
    email: string;
    interests?: string[];
    coins?: number;
}


/**
 * Hook to fetch a specific user's profile from Firestore.
 * 
 * @param userId The ID of the user whose profile is to be fetched.
 * @returns An object containing the user profile data, loading state, and any error.
 */
export function useUserProfile(userId: string | undefined) {
    const firestore = useFirestore();

    const userProfileRef = useMemo(() => {
        if (!firestore || !userId) return null;
        // The path must match exactly how it's stored in Firestore.
        // Based on backend.json, it seems to be /users/{userId}/profile/{userId}
        return doc(firestore, 'users', userId, 'profile', userId);
    }, [firestore, userId]);
    
    const { data, isLoading, error } = useDoc<UserProfile>(userProfileRef);

    return { userProfile: data, isLoading, error };
}
