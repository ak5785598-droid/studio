
'use client';

import { useState } from 'react';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/app-layout';

export default function WatchPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleWatchClick = () => {
    // Basic URL validation
    if (inputValue.includes('youtube.com') || inputValue.includes('youtu.be')) {
      let videoId = '';
      if (inputValue.includes('watch?v=')) {
        videoId = new URL(inputValue).searchParams.get('v') || '';
      } else if (inputValue.includes('youtu.be/')) {
        videoId = inputValue.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert('Invalid YouTube URL format.');
      }
    } else {
      // Placeholder for search functionality
      alert('Search functionality is not implemented yet. Please enter a valid YouTube URL.');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-3">
          <Youtube className="h-8 w-8 text-red-500" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Watch Party
          </h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Watch a YouTube Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for a YouTube video by name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleWatchClick}>Search</Button>
            </div>

            {videoUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full rounded-lg"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
                <Alert className="bg-secondary">
                  <Youtube className="h-4 w-4" />
                  <AlertTitle>No video loaded</AlertTitle>
                  <AlertDescription>
                    Search for a YouTube video above and click "Search" to start a watch party.
                  </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
