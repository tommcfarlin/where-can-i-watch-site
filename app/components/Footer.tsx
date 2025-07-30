export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-muted bg-card z-30">
      <div className="max-w-7xl mx-auto px-ios-md py-ios-sm">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Where Can I Watch? All rights reserved.
          </p>
          <p className="text-ios-caption-1 text-ios-quaternary-label mt-ios-sm">
            Created by Tom McFarlin • Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
