'use client';

interface TabsProps {
  activeTab: 'all' | 'movie' | 'tv'; // | 'not-streaming'; // Temporarily hidden
  onTabChange: (tab: 'all' | 'movie' | 'tv') => void; // | 'not-streaming') => void; // Temporarily hidden
  movieCount: number;
  tvCount: number;
  notStreamingCount: number;
}

export default function Tabs({ activeTab, onTabChange, movieCount, tvCount, notStreamingCount }: TabsProps) {
  const tabs = [
    { id: 'tv', label: 'TV Shows', count: tvCount },
    { id: 'movie', label: 'Movies', count: movieCount },
    { id: 'all', label: 'All', count: movieCount + tvCount },
    // Temporarily hidden: { id: 'not-streaming', label: 'Not Streaming', count: notStreamingCount },
  ] as const;

  return (
    <div className="mt-ios-md mb-ios-lg">
      {/* iOS Segmented Control Style Navigation */}
      <div className="bg-ios-tertiary-system-background p-ios-xs rounded-ios-button">
        <nav className="flex gap-ios-xs" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative min-h-[44px] px-ios-sm py-ios-sm rounded-ios-button font-ios-medium text-ios-subhead ios-transition-spring ios-scale-button flex items-center justify-center gap-ios-xs whitespace-nowrap flex-1 touch-manipulation ios-tab-button
                ${
                  activeTab === tab.id
                    ? 'bg-ios-secondary-system-background text-ios-label shadow-sm'
                    : 'text-ios-secondary-label hover:text-ios-label hover:bg-ios-system-fill active:bg-ios-secondary-system-fill'
                }
              `}
                          >
                <span className="font-ios-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-ios-xs text-ios-caption-2 font-ios-semibold rounded-full ios-transition-quick ${
                    activeTab === tab.id
                      ? 'bg-ios-link text-white'
                      : 'bg-ios-secondary-label text-ios-system-background'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}