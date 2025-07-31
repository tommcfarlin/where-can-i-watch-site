export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-ios-separator bg-ios-secondary-system-background z-30" style={{ paddingBottom: 'var(--ios-safe-padding-bottom)' }}>
      <div className="max-w-7xl mx-auto px-ios-md py-ios-md">
        <div className="flex items-center justify-center gap-1 min-h-[44px]">
          <span className="text-ios-caption-1 text-ios-secondary-label font-ios-regular">
            © {currentYear} Tom McFarlin
          </span>
          <span className="text-ios-caption-1 text-ios-tertiary-label font-ios-regular">
            •
          </span>
          <span className="text-ios-caption-1 text-ios-secondary-label font-ios-regular">
            Data by
          </span>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ios-caption-1 text-ios-label font-ios-regular hover:text-ios-secondary-label ios-transition-quick ios-scale-press focus:outline-none focus:ring-2 focus:ring-ios-label/30 rounded-ios-button px-ios-xs py-ios-xs touch-manipulation"
          >
            TMDB
          </a>
          <span className="text-ios-caption-1 text-ios-tertiary-label font-ios-regular ml-0.5" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </footer>
  );
}
