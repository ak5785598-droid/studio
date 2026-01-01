'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    redirect(`/profile/${user.uid}`);
  } else {
    redirect('/login');
  }
  
  return null;
}
