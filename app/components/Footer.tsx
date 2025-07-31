export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-ios-separator bg-ios-secondary-system-background z-30" style={{ paddingBottom: 'var(--ios-safe-padding-bottom)' }}>
      <div className="max-w-7xl mx-auto px-ios-md py-ios-md">
        <div className="flex flex-col items-center justify-center gap-ios-xs min-h-[44px]">
          {/* Primary: Data Source Attribution */}
          <div className="flex items-center gap-1">
            <span className="text-ios-footnote text-ios-secondary-label font-ios-regular">
              Data provided by
            </span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ios-footnote text-ios-link font-ios-regular hover:text-ios-link hover:underline ios-transition-quick ios-scale-press focus:outline-none focus:ring-2 focus:ring-ios-link/50 rounded-ios-button px-ios-xs py-ios-xs touch-manipulation underline-offset-2"
              aria-label="The Movie Database - opens in new tab"
            >
              TMDB
            </a>
            <span className="text-ios-footnote text-ios-secondary-label font-ios-regular ml-0.5" aria-hidden="true">
              ↗
            </span>
          </div>

          {/* Secondary: Copyright */}
          <span className="text-ios-caption-2 text-ios-quaternary-label font-ios-regular">
            © {currentYear} Tom McFarlin
          </span>
        </div>
      </div>
    </footer>
  );
}
