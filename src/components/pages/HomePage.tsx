import React, { useEffect, useMemo, useState } from 'react';
import { BreakingNewsTicker } from "../BreakingNewsTicker";
import { HeroSection } from "../HeroSection";
import { LiveMarketUpdates } from "../LiveMarketUpdates";
import { VideoNews } from "../VideoNews";
import { CategorySection } from "../CategorySection";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { FileText } from 'lucide-react';
import { api } from '../../lib/api';
import type { Article as DbArticle } from '../../lib/api';

interface HomePageProps {
  isDarkMode: boolean;
  isQuickRead: boolean;
  setIsQuickRead: (value: boolean) => void;
}

export function HomePage({ isDarkMode, isQuickRead, setIsQuickRead }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState<DbArticle[]>([]);

  const toUi = (a: DbArticle) => ({
    id: String(a.id),
    title: a.title,
    summary: a.summary || '',
    imageUrl: a.featured_image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1080&q=80&auto=format&fit=crop',
    category: (a as any).categories?.name?.toUpperCase?.() || 'NEWS',
    timeAgo: a.publish_date ? timeAgo(new Date(a.publish_date)) : 'Just now',
    author: (a as any).users?.name || undefined,
    readTime: a.read_time ? `${a.read_time} min read` : undefined,
  });

  const timeAgo = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 60) return `${diff} min ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
    const days = Math.floor(h / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.articles.getAll({ status: 'published', limit: 50 });
        setFetched(rows || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, ReturnType<typeof toUi>[]> = {};
    for (const a of fetched) {
      const cat = ((a as any).categories?.name || 'News').toLowerCase();
      const key = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!groups[key]) groups[key] = [];
      groups[key].push(toUi(a));
    }
    return groups;
  }, [fetched]);

  return (
    <>
      <BreakingNewsTicker />
      
      {/* Quick Read Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Button
          onClick={() => setIsQuickRead(!isQuickRead)}
          variant={isQuickRead ? "default" : "outline"}
          className={`${isQuickRead ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-red-50 dark:hover:bg-red-900/20'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          {isQuickRead ? 'Exit Quick Read Mode' : 'Quick Read Mode'}
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            <HeroSection isQuickRead={isQuickRead} />
            <LiveMarketUpdates />
            <VideoNews />
            
            <CategorySection
              title="Politics"
              highlightColor="red"
              articles={grouped.Politics?.slice(0, 6) || []}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Health"
              highlightColor="teal"
              articles={grouped.Health?.slice(0, 6) || []}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Sports"
              highlightColor="green"
              articles={grouped.Sports?.slice(0, 6) || []}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Entertainment"
              highlightColor="purple"
              articles={grouped.Entertainment?.slice(0, 6) || []}
              isQuickRead={isQuickRead}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
