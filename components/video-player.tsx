'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import HLS from 'hls.js';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
  category_id: string;
  num: number;
}

interface VideoPlayerProps {
  channel: Channel;
}

export default function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HLS | null>(null);

  const streamUrl = `https://www.superstuff.online/live/${channel.stream_id}/live.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initializePlayer = () => {
      if (HLS.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new HLS({
          debug: false,
          enableWorker: true,
          lowLevelLogger: undefined,
        });

        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(HLS.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded');
        });

        hls.on(HLS.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = streamUrl;
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-lg overflow-hidden aspect-video w-full">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full h-full bg-black"
          crossOrigin="anonymous"
          enablePictureInPicture
        />
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground break-words">
              {channel.name}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Stream ID: {channel.stream_id}
            </p>
            <p className="text-muted-foreground text-sm">
              Category ID: {channel.category_id}
            </p>
          </div>
          
          {channel.stream_icon && (
            <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={channel.stream_icon}
                alt={channel.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm break-all"
          >
            {streamUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
