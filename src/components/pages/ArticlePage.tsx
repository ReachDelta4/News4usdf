import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { SocialShare } from '../SocialShare';
import { VideoPlayer } from '../VideoPlayer';
import { ArticleCard } from '../ArticleCard';
import { Sidebar } from '../Sidebar';
import { Link, useRouter } from '../Router';
import { Calendar, Clock, User, Bookmark, Share2, Type, Sun, Moon } from 'lucide-react';

interface ArticlePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function ArticlePage({ isDarkMode, toggleDarkMode }: ArticlePageProps) {
  const { params } = useRouter();
  const [fontSize, setFontSize] = useState('base');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Mock article data - in real app, this would be fetched based on params.id
  const article = {
    id: params.id || '1',
    title: "Revolutionary Cancer Treatment Shows Promise in Clinical Trials",
    summary: "Clinical trials demonstrate significant improvement in patient outcomes using innovative immunotherapy approach.",
    content: `
      <p>In a groundbreaking development for cancer treatment, researchers at leading medical institutions have reported remarkable success with a new immunotherapy approach that could revolutionize how we treat various forms of cancer.</p>
      
      <p>The clinical trials, conducted over 18 months with 200 patients across different cancer types, showed a 75% improvement in treatment response rates compared to conventional chemotherapy methods. This represents one of the most significant advances in cancer treatment in the past decade.</p>
      
      <blockquote>"What we're seeing is not just incremental improvement, but a fundamental shift in how the immune system can be harnessed to fight cancer," said Dr. Sarah Martinez, lead researcher on the project.</blockquote>
      
      <h2>How the Treatment Works</h2>
      
      <p>The new immunotherapy approach works by enhancing the body's natural immune response to cancer cells. Unlike traditional chemotherapy, which can damage healthy cells along with cancerous ones, this treatment specifically targets the mechanisms that cancer cells use to evade immune detection.</p>
      
      <p>Key aspects of the treatment include:</p>
      
      <ul>
        <li>Personalized immune cell modification based on individual patient profiles</li>
        <li>Targeted delivery systems that concentrate treatment at tumor sites</li>
        <li>Minimal side effects compared to traditional chemotherapy</li>
        <li>Faster recovery times and improved quality of life during treatment</li>
      </ul>
      
      <h2>Clinical Trial Results</h2>
      
      <p>The results from the clinical trials have exceeded researchers' expectations:</p>
      
      <ul>
        <li>75% of patients showed significant tumor reduction</li>
        <li>50% achieved complete remission within 6 months</li>
        <li>Side effects were reduced by 60% compared to standard treatments</li>
        <li>Patient quality of life scores improved by 40%</li>
      </ul>
      
      <h2>Next Steps</h2>
      
      <p>The research team is now preparing for Phase III trials, which will involve a larger patient population across multiple countries. If successful, the treatment could be available to patients within the next 2-3 years.</p>
      
      <p>The FDA has granted fast-track designation to this treatment, recognizing its potential to address a significant unmet medical need in cancer care.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    category: "HEALTH",
    author: "Dr. Emily Rodriguez",
    publishDate: "January 15, 2024",
    timeAgo: "2 hours ago",
    readTime: "8 min read",
    tags: ["Health", "Medical Research", "Cancer Treatment", "Immunotherapy"]
  };

  // Mock related articles
  const relatedArticles = [
    {
      id: "2",
      title: "Breakthrough in Alzheimer's Research Offers New Hope",
      summary: "Scientists identify new biomarkers that could lead to earlier detection and more effective treatments.",
      imageUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "HEALTH",
      timeAgo: "4 hours ago",
      author: "Dr. Michael Chen",
      readTime: "6 min read"
    },
    {
      id: "3",
      title: "Mental Health Initiative Receives Major Funding",
      summary: "Government announces $500M investment in mental health services and research programs.",
      imageUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "HEALTH",
      timeAgo: "6 hours ago",
      author: "Sarah Thompson",
      readTime: "5 min read"
    }
  ];

  const fontSizeClasses = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

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
            <BreadcrumbLink asChild>
              <Link to="/category" params={{ category: article.category.toLowerCase() }}>
                {article.category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold line-clamp-1">
              {article.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-3">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Article Header */}
            <div className="p-6 pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                  {article.category}
                </span>
                {article.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {article.summary}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Action Buttons */}
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
                    url={`/article/${article.id}`}
                    title={article.title}
                    variant="button"
                  />
                </div>
              </div>
            </div>

            {/* Featured Media */}
            <div className="px-6">
              {article.videoUrl ? (
                <VideoPlayer
                  src={article.videoUrl}
                  poster={article.imageUrl}
                  title={article.title}
                  className="mb-6"
                />
              ) : (
                <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className={`px-6 pb-6 prose prose-lg max-w-none dark:prose-invert ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}>
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Share this article:</span>
                  <SocialShare 
                    url={`/article/${article.id}`}
                    title={article.title}
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
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  variant="card"
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