import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function LiveMarketUpdates() {
  const marketData = [
    { symbol: 'S&P 500', value: '4,234.56', change: '+1.2%', changeValue: '+52.34', isPositive: true },
    { symbol: 'NASDAQ', value: '13,567.89', change: '+0.8%', changeValue: '+108.45', isPositive: true },
    { symbol: 'DOW JONES', value: '34,123.45', change: '-0.3%', changeValue: '-102.33', isPositive: false },
    { symbol: 'BITCOIN', value: '$45,678', change: '+2.1%', changeValue: '+$958', isPositive: true },
    { symbol: 'GOLD', value: '$1,987.45', change: '-0.5%', changeValue: '-$9.87', isPositive: false },
    { symbol: 'CRUDE OIL', value: '$72.34', change: '+1.8%', changeValue: '+$1.28', isPositive: true }
  ];

  const marketNews = [
    "Tech stocks surge after positive earnings reports",
    "Federal Reserve signals potential rate adjustments", 
    "Energy sector gains momentum on supply concerns",
    "Healthcare stocks show strong quarterly performance"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-6">
        <DollarSign className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Market Updates</h2>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Data Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((stock, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{stock.symbol}</h3>
                  {stock.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stock.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      stock.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change}
                    </span>
                    <span className={`text-xs ${
                      stock.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stock.changeValue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Market Headlines</h3>
            <div className="space-y-4">
              {marketNews.map((news, index) => (
                <div key={index} className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-relaxed">
                    {news}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live updates every 30 seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}