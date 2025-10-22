import React, { useState } from 'react';
import { ArticleCard } from '../ArticleCard';
import { Sidebar } from '../Sidebar';
import { Button } from '../ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '../Router';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  timeAgo: string;
  author?: string;
  readTime?: string;
}

interface CategoryPageProps {
  category: string;
  isQuickRead: boolean;
}

export function CategoryPage({ category, isQuickRead }: CategoryPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // Mock articles data - in real app, this would come from API
  const generateMockArticles = (count: number): Article[] => {
    const articles: Article[] = [];
    const baseImages = {
      Politics: "https://images.unsplash.com/photo-1740645580404-3a58c3b98182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBwb2xpdGljc3xlbnwxfHx8fDE3NTgwMTA4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      Health: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      Sports: "https://images.unsplash.com/photo-1631746410377-b0e23f61d083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzU3OTQ0ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      Entertainment: "https://images.unsplash.com/photo-1675295275119-b3ffe5448c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnRhaW5tZW50JTIwbW92aWVzJTIwY2VsZWJyaXR5fGVufDF8fHx8MTc1ODAxMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      News: "https://images.unsplash.com/photo-1740645580404-3a58c3b98182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBwb2xpdGljc3xlbnwxfHx8fDE3NTgwMTA4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    };

    for (let i = 1; i <= count; i++) {
      articles.push({
        id: `${category.toLowerCase()}-${i}`,
        title: `${category} Article ${i}: Important Development`,
        summary: `Detailed coverage of recent developments in ${category.toLowerCase()}. This article provides comprehensive analysis and expert opinions on the matter.`,
        imageUrl: baseImages[category as keyof typeof baseImages] || baseImages.News,
        category: category.toUpperCase(),
        timeAgo: `${Math.floor(Math.random() * 12) + 1} hours ago`,
        author: `Reporter ${i}`,
        readTime: `${Math.floor(Math.random() * 5) + 2} min read`
      });
    }
    return articles;
  };

  const allArticles = generateMockArticles(25);
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = allArticles.slice(startIndex, startIndex + articlesPerPage);

  // Featured article (first article)
  const featuredArticle = allArticles[0];

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'politics': return 'red';
      case 'health': return 'teal';
      case 'sports': return 'green';
      case 'entertainment': return 'purple';
      default: return 'red';
    }
  };

  const colorClasses = {
    red: 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    teal: 'border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
    green: 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
  };

  const color = getCategoryColor(category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">{category}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-red-600 dark:text-red-400">{category}</span>
          <span className="text-gray-900 dark:text-white"> News</span>
        </h1>
        <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <span className="text-sm font-semibold">{allArticles.length} Articles</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Article */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Featured Story</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video">
                <img 
                  src={featuredArticle.imageUrl} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold mb-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
                  {featuredArticle.category}
                </div>
                <Link to="/article" params={{ id: featuredArticle.id }}>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    {featuredArticle.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredArticle.summary}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{featuredArticle.author}</span>
                  <div className="flex items-center space-x-4">
                    <span>{featuredArticle.timeAgo}</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">More {category} News</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Articles Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8" 
            : "space-y-6 mb-8"
          }>
            {currentArticles.slice(1).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isQuickRead={isQuickRead}
                variant={viewMode === 'list' ? 'list' : 'card'}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
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