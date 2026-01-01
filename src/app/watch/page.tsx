
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Youtube, Clapperboard, AlertTriangle, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/app-layout';
import { searchVideosAction } from '@/actions/get-videos';
import type { VideoSearchResult } from '@/ai/flows/youtube-video-search';

export default function WatchPage() {
  const [videoId, setVideoId] = useState<string | null>('dQw4w9WgXcQ'); // Default video
  const [searchResults, setSearchResults] = useState<VideoSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSearchResults([]);
    const formData = new FormData(event.currentTarget);
    const query = formData.get('youtube_query') as string;

    if (query) {
      startTransition(async () => {
        const result = await searchVideosAction(query);
        if (result.success && result.data) {
          setSearchResults(result.data);
        } else {
          setError(result.error || 'An unknown error occurred.');
        }
      });
    }
  };

  const videoEmbedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-3">
          <Youtube className="h-8 w-8 text-red-500" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Watch Party
          </h1>
        </header>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-2 md:p-4">
                {videoEmbedUrl ? (
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full rounded-lg"
                      src={videoEmbedUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg">
                     <Alert className="bg-secondary max-w-md">
                      <Clapperboard className="h-4 w-4" />
                      <AlertTitle>Start a Watch Party!</AlertTitle>
                      <AlertDescription>
                        Search for a video to begin.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Search Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
          </div>
          
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Search /> Find a Video
                </CardTitle>
                <CardDescription>
                  Search for a video on YouTube to watch with your friends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <Input
                    type="search"
                    name="youtube_query"
                    placeholder="e.g., 'lofi hip hop radio'"
                    className="flex-1"
                    disabled={isPending}
                  />
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader className="animate-spin" /> : <Search />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {searchResults.map((video) => (
                <Card 
                  key={video.videoId} 
                  className="flex gap-4 p-2 cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => setVideoId(video.videoId)}
                >
                  <div className="relative aspect-video w-28 flex-shrink-0">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="rounded-md object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" title={video.title}>
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {video.videoId}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
