import React, { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsCard } from './NewsCard';
import { api } from '../lib/api';

interface HeroSectionProps {
  isQuickRead: boolean;
}

export function HeroSection({ isQuickRead }: HeroSectionProps) {
  const [featured, setFeatured] = useState({
    title: 'Global Economic Summit Reaches Historic Climate Agreement',
    summary:
      'World leaders from 195 countries have reached a groundbreaking consensus on climate action and economic recovery, marking a pivotal moment in international cooperation. The agreement includes unprecedented commitments to renewable energy investments and sustainable development goals.',
    imageUrl:
      'https://images.unsplash.com/photo-1650984661525-7e6b1b874e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBuZXdzcm9vbXxlbnwxfHx8fDE3NTgwMTA4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'WORLD NEWS',
    timeAgo: '2 hours ago'
  });
  const [trending, setTrending] = useState<any[]>([]);
  const [bannerUrls, setBannerUrls] = useState<string[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // Get a featured article or latest published
        let rows = await api.articles.getAll({ status: 'published', featured: true, limit: 1 });
        if (!rows || rows.length === 0) rows = await api.articles.getAll({ status: 'published', limit: 1 });
        const [banners, countSetting] = await Promise.all([
          api.mediaFiles.getAll('banner'),
          api.settings.get<number>('homepage_banner_count'),
        ]);
        const count = typeof countSetting === 'number' && countSetting > 0 ? countSetting : 1;
        const selected = (banners || []).slice(0, count).map((b: any) => b.file_url).filter(Boolean);
        setBannerUrls(selected);
        const a = rows && rows[0];
        if (a) {
          setFeatured({
            title: a.title,
            summary: a.summary || '',
            imageUrl: (selected[0] || a.featured_image_url || featured.imageUrl),
            category: ((a as any).categories?.name || 'NEWS').toUpperCase(),
            timeAgo: a.publish_date ? new Date(a.publish_date).toLocaleString() : 'Recently'
          });
        }
        const many = await api.articles.getAll({ status: 'published', limit: 12 });
        const sorted = (many || []).sort((x: any, y: any) => (y.views || 0) - (x.views || 0)).slice(0, 3);
        setTrending(sorted.map((r: any) => ({
          id: String(r.id),
          title: r.title,
          summary: r.summary || '',
          imageUrl: r.featured_image_url || featured.imageUrl,
          category: ((r as any).categories?.name || 'NEWS').toUpperCase(),
          timeAgo: r.publish_date ? new Date(r.publish_date).toLocaleDateString() : 'Recently'
        })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Rotate banners if multiple
  useEffect(() => {
    if (!bannerUrls.length) return;
    setBannerIndex(0);
    const id = setInterval(() => {
      setBannerIndex((i) => {
        const next = (i + 1) % bannerUrls.length;
        setFeatured((f) => ({ ...f, imageUrl: bannerUrls[next] || f.imageUrl }));
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [bannerUrls.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Story */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-80">
              <ImageWithFallback
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded font-medium">
                  {featured.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {featured.title}
              </h1>
              {isQuickRead ? (
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">195 countries reach climate consensus at global summit</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">Unprecedented renewable energy investment commitments announced</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">Implementation timeline set for sustainable development goals</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {featured.summary}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">{featured.timeAgo}</p>
            </div>
          </div>
        </div>

        {/* Trending Stories */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
          {(trending.length ? trending : []).map((story: any, index) => (
            <NewsCard
              key={index}
              id={story.id}
              title={story.title}
              summary={story.summary}
              imageUrl={story.imageUrl}
              category={story.category}
              timeAgo={story.timeAgo}
              size="small"
              isQuickRead={isQuickRead}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
