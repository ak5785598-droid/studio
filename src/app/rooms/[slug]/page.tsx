import { getRoomBySlug } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { RoomClient } from './room-client';

export default function RoomPage({ params }: { params: { slug: string } }) {
  const room = getRoomBySlug(params.slug);

  if (!room) {
    notFound();
  }

  return <RoomClient room={room} />;
}
