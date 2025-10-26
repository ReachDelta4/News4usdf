import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

const fallbackBreaking = [
  'Breaking: Major economic reforms announced by government officials',
  'Live: International summit concludes with historic agreement',
  'Update: Stock markets reach all-time high amid positive economic indicators',
  'Alert: Weather advisory issued for coastal regions',
  'Breaking: Technology sector shows unprecedented growth'
];

export function BreakingNewsTicker() {
  const [items, setItems] = useState<string[]>(fallbackBreaking);

  useEffect(() => {
    (async () => {
      try {
        const configured = await api.settings.get<string[]>('breaking_news');
        if (configured && configured.length) {
          setItems(configured);
          return;
        }
        const rows = await api.articles.getAll({ status: 'published', limit: 10 });
        const titles = (rows || []).map((r: any) => r.title).filter(Boolean);
        if (titles.length) setItems(titles);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-red-800 px-4 py-1 text-sm font-bold whitespace-nowrap">
          BREAKING NEWS
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [1200, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {items.map((news, index) => (
              <span key={index} className="mx-8 text-sm">
                • {news}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
