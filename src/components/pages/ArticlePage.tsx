import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { SocialShare } from '../SocialShare';
import { ArticleCard } from '../ArticleCard';
import { Sidebar } from '../Sidebar';
import { Link, useRouter } from '../Router';
import { Calendar, Clock, User, Bookmark, Type, Sun, Moon } from 'lucide-react';
import { api } from '../../lib/api';

function sanitizeHtml(html: string) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // remove scripts
    doc.querySelectorAll('script, iframe[src^="javascript:"]').forEach((el) => el.remove());
    // remove event handlers and javascript: links
    doc.querySelectorAll('*').forEach((el) => {
      // @ts-ignore
      for (const attr of Array.from(el.attributes)) {
        const n = attr.name.toLowerCase();
        const v = String(attr.value || '').toLowerCase();
        if (n.startsWith('on') || v.startsWith('javascript:')) {
          // @ts-ignore
          el.removeAttribute(attr.name);
        }
      }
    });
    return doc.body.innerHTML || '';
  } catch {
    return '';
  }
}

interface ArticlePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function ArticlePage({ isDarkMode, toggleDarkMode }: ArticlePageProps) {
  const { params } = useRouter();
  const [fontSize, setFontSize] = useState<'small' | 'base' | 'large' | 'xl'>('base');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);

  const idNum = useMemo(() => {
    const raw = params.id;
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.id]);

  useEffect(() => {
    (async () => {
      if (idNum == null) { setLoading(false); return; }
      try {
        const row = await api.articles.getById(idNum);
        setArticle(row);
        if (row?.category_id) {
          const list = await api.articles.getAll({ status: 'published', category_id: row.category_id, limit: 6 });
          setRelated((list || []).filter((a) => a.id !== idNum));
        }
        if (row?.id) api.articles.incrementViews(row.id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [idNum]);

  const fontSizeClasses = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  } as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/category" params={{ category: (article?.categories?.name || 'news').toLowerCase() }}>
                {(article?.categories?.name || 'NEWS').toUpperCase()}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold line-clamp-1">
              {article?.title || 'Article'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-3">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                  {(article?.categories?.name || 'NEWS').toUpperCase()}
                </span>
                {(article?.article_tags || []).map((t: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {t?.tags?.name || ''}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {article?.title || ''}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {article?.summary || ''}
              </p>

              <div className="flex flex-wrap items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{(article as any)?.users?.name || 'Staff'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article?.publish_date ? new Date(article.publish_date).toLocaleDateString() : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{article?.read_time ? `${article.read_time} min read` : ''}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(fontSize === 'xl' ? 'small' : fontSize === 'small' ? 'base' : fontSize === 'base' ? 'large' : 'xl')}
                  >
                    <Type className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDarkMode}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>

                  <SocialShare 
                    url={`/article/${article?.id || ''}`}
                    title={article?.title || ''}
                    variant="button"
                  />
                </div>
              </div>
            </div>

            {/* Featured Media */}
            <div className="px-6">
              <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                <img 
                  src={article?.featured_image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1080&q=80&auto=format&fit=crop'} 
                  alt={article?.title || 'Article image'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Article Content */}
            <div className={`px-6 pb-6 prose prose-lg max-w-none dark:prose-invert ${fontSizeClasses[fontSize]}`} dir="ltr">
              <div 
                dangerouslySetInnerHTML={{ __html: article?.content ? sanitizeHtml(article.content) : '' }}
                className="leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Share this article:</span>
                  <SocialShare 
                    url={`/article/${article?.id || ''}`}
                    title={article?.title || ''}
                    variant="inline"
                  />
                </div>
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((ra) => (
                <ArticleCard
                  key={ra.id}
                  article={{
                    id: String(ra.id),
                    title: ra.title,
                    summary: ra.summary || '',
                    imageUrl: ra.featured_image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1080&q=80&auto=format&fit=crop',
                    category: ((ra as any).categories?.name || 'NEWS').toUpperCase(),
                    timeAgo: ra.publish_date ? new Date(ra.publish_date).toLocaleDateString() : 'Recently',
                    author: (ra as any)?.users?.name || undefined,
                    readTime: ra.read_time ? `${ra.read_time} min read` : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
