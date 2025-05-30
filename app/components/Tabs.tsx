'use client';

interface TabsProps {
  activeTab: 'all' | 'movie' | 'tv';
  onTabChange: (tab: 'all' | 'movie' | 'tv') => void;
  movieCount: number;
  tvCount: number;
}

export default function Tabs({ activeTab, onTabChange, movieCount, tvCount }: TabsProps) {
  const tabs = [
    { id: 'tv', label: 'TV Shows', icon: '📺', count: tvCount },
    { id: 'movie', label: 'Movies', icon: '🎬', count: movieCount },
    { id: 'all', label: 'All', icon: '🎯', count: movieCount + tvCount },
  ] as const;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="-mb-px flex space-x-4 sm:space-x-6 md:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm md:text-base transition-colors flex items-center gap-1 sm:gap-2
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            <span className="text-base md:text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}