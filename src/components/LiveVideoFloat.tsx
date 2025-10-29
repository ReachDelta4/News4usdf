import React, { useEffect, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "./ui/button";
import { VideoPlayer } from './VideoPlayer';
import { api } from '../lib/api';

export function LiveVideoFloat() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mini, setMini] = useState<null | { videoId: string; title: string; isLive?: boolean }>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.settings.get<any[]>('video_news');
        const chosen = Array.isArray(list) ? list.find(v => v.miniPlayer) : null;
        if (chosen && chosen.videoId) setMini({ videoId: chosen.videoId, title: chosen.title || 'Live', isLive: !!chosen.isLive });
        else setMini(null);
      } catch {}
    })();
  }, []);

  if (!isVisible || !mini) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isExpanded ? 'w-80 h-60' : 'w-64 h-40'
    }`}>
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Live Badge */}
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE NOW</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-2 right-2 z-10 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-black/50 text-white hover:bg-black/70 p-1 h-auto"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="bg-black/50 text-white hover:bg-black/70 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Video Content */}
        <div className="relative w-full h-full">
          <VideoPlayer videoId={mini.videoId} title={mini.title} isLive={mini.isLive} autoPlay className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
