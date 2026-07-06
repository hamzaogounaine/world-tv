'use client';

import { useState, useEffect } from 'react';
import CategoriesList from '@/components/categories-list';
import ChannelsList from '@/components/channels-list';
import VideoPlayer from '@/components/video-player';
import axios from 'axios';


interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
  category_id: string;
  num: number;
}



export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/categories`);
        const data = await response.data;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">IPTV Player</h1>
          <p className="text-muted-foreground mt-2">Browse and play channels</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedCategory && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedChannel(null);
            }}
            className="mb-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← Back to Categories
          </button>
        )}

        {!selectedCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Categories */}
            <div className="lg:col-span-1">
              <CategoriesList
                categories={categories}
                loading={loading}
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  setSelectedCategory(category);
                  setSelectedChannel(null);
                }}
              />
            </div>

            {/* Placeholder for categories view */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  Select a category to view channels
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Channels List */}
            <div className="lg:col-span-1 max-h-screen overflow-y-auto">
              <ChannelsList
                categoryId={selectedCategory.category_id}
                categoryName={selectedCategory.category_name}
                onSelectChannel={setSelectedChannel}
                // vertical={true}
              />
            </div>

            {/* Main content - Video Player */}
            <div className="lg:col-span-3">
              {selectedChannel ? (
                <VideoPlayer channel={selectedChannel} />
              ) : (
                <div className="bg-card rounded-lg border border-border p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    Select a channel to play
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
