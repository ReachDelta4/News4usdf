import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Menu, X, Moon, Sun, Newspaper } from 'lucide-react';
import { Link, useRouter } from './Router';
import newsLogo from 'figma:asset/46a273f432049c736ccfb63a159ffee93dbd7bdf.png';
import brandImage from 'figma:asset/e465bbd90453757b67bdbd6f68b53e083c3b6284.png';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const NAVIGATION_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'News', path: '/category' },
  { name: 'Politics', path: '/politics' },
  { name: 'Health', path: '/health' },
  { name: 'Sports', path: '/sports' },
  { name: 'Entertainment', path: '/entertainment' },
  { name: 'About Us', path: '/about' },
  { name: 'E-Paper', path: '/e-paper' }
];

export function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const { currentRoute } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Logo Section - Always visible */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src={newsLogo} 
              alt="NEWS4US Official Logo" 
              className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
            />
            <Link to="/">
              <h1 className="text-lg sm:text-2xl font-bold cursor-pointer whitespace-nowrap">
                <span className="text-red-600">NEWS</span>
                <span className="text-gray-900 dark:text-white">4US</span>
              </h1>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center mx-4">
            <div className="flex space-x-6">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap ${
                    currentRoute === item.path
                      ? 'text-red-600 font-semibold dark:text-red-400'
                      : item.name === 'E-Paper' 
                        ? 'text-red-600 font-semibold dark:text-red-400' 
                        : 'text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
                  }`}
                >
                  {item.name === 'E-Paper' && <Newspaper className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Right: Controls and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Brand/Sponsor Section - Hidden on smaller screens */}
            <div className="hidden xl:flex items-center space-x-3">
              <img 
                src={brandImage} 
                alt="NEWS4US Brand Image" 
                className="h-8 w-auto object-contain"
              />
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">▶</span>
                </div>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md transition-all duration-200 ${
                    currentRoute === item.path
                      ? 'bg-red-600 text-white font-semibold shadow-md'
                      : item.name === 'E-Paper'
                        ? 'text-red-600 font-semibold dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    {item.name === 'E-Paper' && <Newspaper className="w-5 h-5" />}
                    <span className="text-base">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}