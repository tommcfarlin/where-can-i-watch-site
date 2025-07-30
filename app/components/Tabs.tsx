'use client';

interface TabsProps {
  activeTab: 'all' | 'movie' | 'tv' | 'not-streaming';
  onTabChange: (tab: 'all' | 'movie' | 'tv' | 'not-streaming') => void;
  movieCount: number;
  tvCount: number;
  notStreamingCount: number;
}

export default function Tabs({ activeTab, onTabChange, movieCount, tvCount, notStreamingCount }: TabsProps) {
  const tabs = [
    { id: 'tv', label: 'TV Shows', icon: '📺', count: tvCount },
    { id: 'movie', label: 'Movies', icon: '🎬', count: movieCount },
    { id: 'all', label: 'All', icon: '🎯', count: movieCount + tvCount },
    { id: 'not-streaming', label: 'Not Streaming', icon: '⚠️', count: notStreamingCount },
  ] as const;

  return (
                <div className="border-b border-ios-separator mb-ios-lg">
      <nav className="-mb-px flex gap-ios-md" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-ios-sm px-ios-xs border-b-2 font-medium text-ios-footnote transition-all duration-200 flex items-center gap-ios-xs whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }
            `}
          >
            <span className="text-ios-callout">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`ml-ios-xs py-ios-xs px-ios-sm rounded-full text-ios-caption-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-card border border-muted text-foreground'
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