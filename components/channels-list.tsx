'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getLiveCredentials } from '@/lib/credentials';
import axios from 'axios';

interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
  category_id: string;
  num: number;
}

interface ChannelsListProps {
  categoryId: string;
  categoryName: string;
  onSelectChannel: (channel: Channel) => void;
  horizontal?: boolean;
  vertical?: boolean;
}

export default function ChannelsList({
  categoryId,
  categoryName,
  onSelectChannel,
  horizontal = false,
  vertical = false,
}: ChannelsListProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/channels?categoryId=${categoryId}`);
        const data = await response.data;
        setChannels(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching channels:', error);
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [categoryId]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-4">
        <h2 className="text-2xl font-bold text-foreground">{categoryName}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {channels.length} channels available
        </p>
      </div>

      <div>
        {loading ? (
          horizontal ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-32 flex-shrink-0 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          )
        ) : channels.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No channels found in this category</p>
          </div>
        ) : horizontal ? (
          <div className="  gap-4 overflow-x-auto pb-4">
            {channels.map((channel) => (
              <Button
                key={channel.stream_id}
                onClick={() => onSelectChannel(channel)}
                variant="outline"
                className="h-auto   p-3 space-y-2 hover:bg-accent flex w-32"
              >
                <div className="relative w-24 h-24 bg-muted rounded-md overflow-hidden">
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
                <span className="text-xs font-medium text-foreground text-center line-clamp-2">
                  {channel.name}
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {channels.map((channel) => (
              <Button
                key={channel.stream_id}
                onClick={() => onSelectChannel(channel)}
                variant="outline"
                className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-accent"
              >
                <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                  <Image
                    src={channel.stream_icon}
                    alt={channel.name}
                    fill
                    className="p-3"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground text-center line-clamp-2">
                  {channel.name}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
