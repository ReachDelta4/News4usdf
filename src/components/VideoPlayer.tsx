import React from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ExternalLink, X, Play } from 'lucide-react';
import { AspectRatio } from './ui/aspect-ratio';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  isLive?: boolean;
  autoPlay?: boolean;
  showModal?: boolean;
  onClose?: () => void;
  className?: string;
}

export function VideoPlayer({
  videoId,
  title,
  thumbnail,
  isLive = false,
  autoPlay = false,
  showModal = false,
  onClose,
  className = ""
}: VideoPlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=0&controls=1&rel=0`;

  const VideoContent = () => (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <AspectRatio ratio={16/9}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </AspectRatio>
      {isLive && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
          className="bg-black/40 text-white hover:bg-black/60"
          title="Open in YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (showModal) {
    return (
      <Dialog open={showModal} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-6 pt-4">
            <VideoContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <VideoContent />;
}

// Simple video thumbnail component for VideoNews section
interface VideoThumbnailProps {
  videoId: string;
  title: string;
  duration?: string;
  isLive?: boolean;
  onClick: () => void;
  className?: string;
}

export function VideoThumbnail({
  videoId,
  title,
  duration,
  isLive = false,
  onClick,
  className = ""
}: VideoThumbnailProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: '16/9' }}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-3">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>

        {/* LIVE Badge */}
        {isLive && (
          <div className="absolute top-2 left-2">
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        )}

        {/* Duration */}
        {duration && !isLive && (
          <div className="absolute bottom-2 right-2">
            <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs">
              {duration}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
}
