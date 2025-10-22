import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { ChevronUp } from 'lucide-react';

interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

export function BackToTop({ showAfter = 300, className = '' }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className={`
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 
        bg-red-600 hover:bg-red-700 
        text-white 
        w-12 h-12 sm:w-14 sm:h-14
        rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        hover:scale-110
        flex items-center justify-center
        animate-in fade-in slide-in-from-bottom-4
        ${className}
      `}
      title="Back to top"
      aria-label="Scroll back to top"
    >
      <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7" />
    </Button>
  );
}