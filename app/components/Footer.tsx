export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-muted bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Where Can I Watch? All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
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
