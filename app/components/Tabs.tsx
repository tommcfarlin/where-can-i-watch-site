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
    <div className="border-b border-muted mb-6">
      <nav className="-mb-px flex space-x-4 sm:space-x-6 md:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm md:text-base transition-all duration-300 flex items-center gap-1 sm:gap-2
              ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }
            `}
          >
            <span className="text-base md:text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2 rounded-full text-xs transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
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