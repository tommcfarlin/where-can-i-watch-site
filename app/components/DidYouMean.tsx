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
      <p className="text-sm">
        <span className="text-muted-foreground">
          Showing results for
        </span>
        <span className="font-semibold text-foreground mx-1">
          &ldquo;{suggestion}&rdquo;
        </span>
        <span className="text-muted-foreground">
          instead of &ldquo;{searchQuery}&rdquo;
        </span>
      </p>

      <div className="flex items-center gap-ios-md mt-ios-sm">
        <p className="text-xs text-muted-foreground">
          ({Math.round(confidence * 100)}% confidence)
        </p>

        <button
          onClick={handleClick}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          Search for &ldquo;{searchQuery}&rdquo; instead
        </button>
      </div>
    </div>
  );
}