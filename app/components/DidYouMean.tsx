'use client';

interface DidYouMeanProps {
  suggestion: string;
  confidence: number;
  searchQuery: string;
}

export default function DidYouMean({ suggestion, confidence, searchQuery }: DidYouMeanProps) {
  const handleClick = () => {
    // Trigger a new search with the suggestion
    const searchBar = document.querySelector<HTMLInputElement>('input[type="text"]');
    if (searchBar) {
      searchBar.value = suggestion;
      searchBar.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="mb-ios-lg p-ios-md bg-card rounded-ios-card border border-muted">
      <p className="text-ios-subhead">
        <span className="text-ios-secondary-label">
          Showing results for
        </span>
        <span className="font-ios-semibold text-ios-label mx-ios-xs">
          &ldquo;{suggestion}&rdquo;
        </span>
        <span className="text-ios-secondary-label">
          instead of &ldquo;{searchQuery}&rdquo;
        </span>
      </p>

      <div className="flex items-center gap-ios-md mt-ios-sm">
        <p className="text-ios-caption-1 text-ios-tertiary-label">
          ({Math.round(confidence * 100)}% confidence)
        </p>

        <button
          onClick={handleClick}
          className="text-ios-caption-1 text-ios-tertiary-label hover:text-ios-label hover:underline ios-transition-quick ios-scale-press focus:outline-none focus:ring-2 focus:ring-ios-link/50 rounded-ios-button px-ios-xs py-ios-xs touch-manipulation"
        >
          Search for &ldquo;{searchQuery}&rdquo; instead
        </button>
      </div>
    </div>
  );
}