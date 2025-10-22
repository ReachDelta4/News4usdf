import React from 'react';
import { BreakingNewsTicker } from "../BreakingNewsTicker";
import { HeroSection } from "../HeroSection";
import { LiveMarketUpdates } from "../LiveMarketUpdates";
import { VideoNews } from "../VideoNews";
import { CategorySection } from "../CategorySection";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { FileText } from 'lucide-react';

interface HomePageProps {
  isDarkMode: boolean;
  isQuickRead: boolean;
  setIsQuickRead: (value: boolean) => void;
}

export function HomePage({ isDarkMode, isQuickRead, setIsQuickRead }: HomePageProps) {
  const politicsArticles = [
    {
      title: "Senate Passes Landmark Infrastructure Bill",
      summary: "Historic bipartisan legislation includes major investments in transportation, broadband, and clean energy infrastructure.",
      imageUrl: "https://images.unsplash.com/photo-1740645580404-3a58c3b98182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBwb2xpdGljc3xlbnwxfHx8fDE3NTgwMTA4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "POLITICS",
      timeAgo: "1 hour ago"
    },
    {
      title: "International Trade Agreement Signed",
      summary: "New multilateral trade deal expected to boost economic cooperation and reduce tariffs across participating nations.",
      imageUrl: "https://images.unsplash.com/photo-1740645580404-3a58c3b98182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBwb2xpdGljc3xlbnwxfHx8fDE3NTgwMTA4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "POLITICS",
      timeAgo: "3 hours ago"
    }
  ];

  const healthArticles = [
    {
      title: "Revolutionary Cancer Treatment Shows Promise",
      summary: "Clinical trials demonstrate significant improvement in patient outcomes using innovative immunotherapy approach.",
      imageUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "HEALTH",
      timeAgo: "2 hours ago"
    },
    {
      title: "Mental Health Awareness Initiative Launched",
      summary: "Comprehensive program aims to reduce stigma and improve access to mental health services nationwide.",
      imageUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG5ld3N8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "HEALTH",
      timeAgo: "4 hours ago"
    }
  ];

  const sportsArticles = [
    {
      title: "Championship Finals Break Attendance Records",
      summary: "Historic match draws largest crowd in stadium history as fans witness thrilling playoff conclusion.",
      imageUrl: "https://images.unsplash.com/photo-1631746410377-b0e23f61d083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzU3OTQ0ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "SPORTS",
      timeAgo: "30 minutes ago"
    },
    {
      title: "Olympic Preparations Underway",
      summary: "Athletes from around the world gear up for upcoming Olympic Games with intensive training programs.",
      imageUrl: "https://images.unsplash.com/photo-1631746410377-b0e23f61d083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzU3OTQ0ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "SPORTS",
      timeAgo: "2 hours ago"
    }
  ];

  const entertainmentArticles = [
    {
      title: "Award Season Highlights Industry Excellence",
      summary: "Annual ceremony celebrates outstanding achievements in film, television, and digital entertainment platforms.",
      imageUrl: "https://images.unsplash.com/photo-1675295275119-b3ffe5448c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnRhaW5tZW50JTIwbW92aWVzJTIwY2VsZWJyaXR5fGVufDF8fHx8MTc1ODAxMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ENTERTAINMENT",
      timeAgo: "1 hour ago"
    },
    {
      title: "Streaming Services Launch Original Content",
      summary: "Major platforms unveil ambitious slate of exclusive series and films targeting diverse global audiences.",
      imageUrl: "https://images.unsplash.com/photo-1675295275119-b3ffe5448c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnRhaW5tZW50JTIwbW92aWVzJTIwY2VsZWJyaXR5fGVufDF8fHx8MTc1ODAxMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ENTERTAINMENT",
      timeAgo: "3 hours ago"
    }
  ];

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
              articles={politicsArticles}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Health"
              highlightColor="teal"
              articles={healthArticles}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Sports"
              highlightColor="green"
              articles={sportsArticles}
              isQuickRead={isQuickRead}
            />
            
            <CategorySection
              title="Entertainment"
              highlightColor="purple"
              articles={entertainmentArticles}
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