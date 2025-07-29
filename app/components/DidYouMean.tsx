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
    <div className="mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
      <p className="text-sm">
        <span className="text-gray-300">
          Showing results for
        </span>
        <span className="font-semibold text-blue-300 mx-1">
          &ldquo;{suggestion}&rdquo;
        </span>
        <span className="text-gray-300">
          instead of &ldquo;{searchQuery}&rdquo;
        </span>
      </p>

      <div className="flex items-center gap-4 mt-2">
        <p className="text-xs text-gray-400">
          ({Math.round(confidence * 100)}% confidence)
        </p>

        <button
          onClick={handleClick}
          className="text-xs text-blue-400 hover:underline"
        >
          Search for &ldquo;{searchQuery}&rdquo; instead
        </button>
      </div>
    </div>
  );
}