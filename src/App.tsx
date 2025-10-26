import React, { useEffect, useState } from 'react';
import { Router, Route } from "./components/Router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LiveVideoFloat } from "./components/LiveVideoFloat";
import { BackToTop } from "./components/BackToTop";
import { SocialShare } from "./components/SocialShare";
import { ErrorPage } from "./components/ErrorPage";
import { Toaster } from "./components/ui/sonner";

// Import pages
import { HomePage } from "./components/pages/HomePage";
import { CategoryPage } from "./components/pages/CategoryPage";
import { ArticlePage } from "./components/pages/ArticlePage";
import { AdminLoginPage } from "./components/pages/AdminLoginPage";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { AuthPage } from "./components/pages/AuthPage";
import { AboutPage } from "./components/pages/AboutPage";
import { EPaperPage } from "./components/pages/EPaperPage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuickRead, setIsQuickRead] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Router Routes */}
        <Route path="/" exact component={() => (
          <HomePage 
            isDarkMode={isDarkMode} 
            isQuickRead={isQuickRead} 
            setIsQuickRead={setIsQuickRead} 
          />
        )} />
        
        <Route path="/category" component={() => (
          <CategoryPage 
            category="News"
            isQuickRead={isQuickRead} 
          />
        )} />
        
        <Route path="/politics" component={() => (
          <CategoryPage 
            category="Politics"
            isQuickRead={isQuickRead} 
          />
        )} />
        
        <Route path="/health" component={() => (
          <CategoryPage 
            category="Health"
            isQuickRead={isQuickRead} 
          />
        )} />
        
        <Route path="/sports" component={() => (
          <CategoryPage 
            category="Sports"
            isQuickRead={isQuickRead} 
          />
        )} />
        
        <Route path="/entertainment" component={() => (
          <CategoryPage 
            category="Entertainment"
            isQuickRead={isQuickRead} 
          />
        )} />
        
        <Route path="/article" component={() => (
          <ArticlePage 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
        )} />
        
        <Route path="/about" component={AboutPage} />
        <Route path="/e-paper" component={EPaperPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/admin-login" component={AdminLoginPage} />
        <Route path="/admin" component={AdminDashboard} />
        
        {/* 404 Error Page - Default route */}
        <Route path="/404" component={() => <ErrorPage />} />

        <Footer />
        <LiveVideoFloat />
        <BackToTop />
        
        {/* Floating Social Share */}
        <SocialShare 
          variant="floating"
          className="hidden xl:block"
        />
        
        <Toaster />
      </div>
    </Router>
  );
}
