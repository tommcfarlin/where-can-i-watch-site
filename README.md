# Where Can I Watch 🎬

A modern, responsive web application that helps you find where to stream your favorite movies and TV shows. Built with Next.js 15 and featuring intelligent search with typo correction.

🔗 **Live Demo**: [wciw.tunelink.io](https://wciw.tunelink.io)

## ✨ Features

### Core Functionality
- **Multi-Search**: Search for both movies and TV shows simultaneously
- **Streaming Providers**: See all available streaming platforms at a glance
- **Smart Search**: Fuzzy search with "Did you mean?" suggestions for typos
- **Franchise Detection**: Automatically finds related content (e.g., searching "Star Wars" includes "Andor", "The Mandalorian")

### User Experience
- **Lightning Fast**: Optimized API calls with intelligent caching
- **Mobile First**: Fully responsive design that works beautifully on all devices
- **Dark Mode**: Smart theme switching that respects OS preferences
- **Filter Tabs**: Easily filter between TV Shows, Movies, or see All results
- **Provider Preview**: See top 3 streaming providers directly on search results

### Design
- **Modern UI**: Clean, Google-inspired search interface
- **Smooth Animations**: Subtle transitions for a polished feel
- **Accessibility**: WCAG compliant with proper focus states
- **Beautiful Colors**: Warm teal/blue-green theme that's easy on the eyes

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Search**: Fuse.js for fuzzy matching
- **API**: TMDB (The Movie Database)
- **Font**: Inter for optimal readability
- **Hosting**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/where-can-i-watch-site.git
cd where-can-i-watch-site
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
TMDB_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/
│   ├── api/          # API routes (search, providers, init)
│   ├── components/   # React components
│   ├── globals.css   # Global styles and design tokens
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── lib/
│   ├── tmdb.ts      # TMDB API client
│   ├── fuzzy-search.ts # Search logic
│   └── franchise-mappings.ts # Franchise detection
├── types/           # TypeScript type definitions
└── docs/           # Project documentation
```

## 🎨 Design System

### Colors
- **Primary**: Teal (`hsl(173 58% 39%)`)
- **Background**: Warm whites/deep blues
- **Cards**: Distinct from background for clarity

### Features
- Responsive breakpoints: mobile, tablet, desktop
- Dark mode with OS sync and persistence
- Smooth transitions and hover states
- Consistent spacing and typography

## 🧪 Key Features Explained

### Fuzzy Search
The app uses Fuse.js to provide typo-tolerant search:
- Handles common misspellings
- Suggests corrections with "Did you mean?"
- Searches across multiple fields (title, original title, overview)

### Franchise Detection
Automatically expands searches for major franchises:
- Star Wars → includes Andor, Mandalorian, etc.
- Marvel → includes all MCU content
- DC → includes DCEU and related shows
- Lord of the Rings → includes The Hobbit
- Game of Thrones → includes House of the Dragon

### Dark Mode
Intelligent theme management:
- Detects OS preference on first visit
- Syncs with OS theme changes in real-time
- Remembers manual preference
- Smooth transitions between themes

## 📊 Performance

- **Fast Initial Load**: Optimized bundle size
- **Image Optimization**: Lazy loading with blur placeholders
- **API Efficiency**: Debounced search, parallel provider fetching
- **Caching**: Popular titles cached for instant fuzzy search

## 🔐 Security

- API keys stored in environment variables
- Rate limiting on API routes
- Input sanitization
- No sensitive data stored client-side

## 📚 Documentation

For detailed documentation, see:
- [Full Documentation](docs/README.md)
- [API Documentation](docs/internal/API_FINDINGS.md)
- [Design Decisions](docs/internal/DECISIONS.md)
- [Future Roadmap](docs/internal/FUTURE_SCOPE.md)

## 🤝 Contributing

This project is currently in active development. For contribution guidelines, please check back soon.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the comprehensive movie/TV database
- [Vercel](https://vercel.com/) for hosting and deployment
- [Fuse.js](https://fusejs.io/) for fuzzy search capabilities

---

Built with ❤️ by [Your Name]