
'use client';

import { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

/**
 * Ensures a user profile exists in Firestore after login.
 * This component is "Real" and prevents app features from failing due to missing data.
 * Initializes wallet with a new 'totalSpent' field for leaderboard tracking.
 */
export function ProfileInitializer() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !firestore) return;

    const initProfile = async () => {
      const profileRef = doc(firestore, 'users', user.uid, 'profile', user.uid);
      const userRef = doc(firestore, 'users', user.uid);
      
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        const initialData = {
          id: user.uid,
          username: user.displayName || `Ummy_${user.uid.substring(0, 5)}`,
          avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/400`,
          email: user.email || '',
          bio: 'Vibing on Ummy! Join my tribe.',
          wallet: { 
            coins: 500, 
            diamonds: 0,
            totalSpent: 0
          },
          inventory: { ownedItems: [], activeFrame: 'None', activeBubble: 'Default' },
          stats: { followers: 0, fans: 0 },
          level: { rich: 1, charm: 1 },
          tags: ['Newcomer'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          details: {
            gender: 'Secret',
            hometown: 'India',
            age: 22
          }
        };

        try {
          // Create initial production-ready profile in subcollection
          await setDoc(profileRef, initialData, { merge: true });
          
          // Also sync basic info to top-level user doc for rankings/leaderboard queries
          await setDoc(userRef, {
            id: user.uid,
            username: initialData.username,
            avatarUrl: initialData.avatarUrl,
            wallet: initialData.wallet,
            stats: initialData.stats,
            level: initialData.level,
            updatedAt: serverTimestamp(),
            joinedAt: serverTimestamp(),
          }, { merge: true });

          toast({
            title: 'Welcome to Ummy!',
            description: 'Your frequency is now synced. Enjoy 500 free coins!',
          });
        } catch (e) {
          console.error("Profile initialization error:", e);
        }
      }
    };

    initProfile();
  }, [user, firestore]);

  return null;
}
