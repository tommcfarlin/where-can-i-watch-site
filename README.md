# Where Can I Watch 🎬

A modern, responsive web application that helps you find where to stream your favorite movies and TV shows. Built with Next.js 15 and featuring intelligent search with typo correction.

🔗 **Live Demo**: [wciw.tommcfarlin.com](https://wciw.tommcfarlin.com)

## ✨ Features

### Core Functionality
- **Multi-Search**: Search for both movies and TV shows simultaneously
- **Streaming Providers**: See all available streaming platforms at a glance
- **Smart Search**: Fuzzy search with "Did you mean?" suggestions for typos
- **Franchise Detection**: Automatically finds related content (e.g., searching "Star Wars" includes "Andor", "The Mandalorian")

### User Experience
- **Lightning Fast**: Optimized API calls with intelligent caching
- **Mobile First**: Fully responsive design that works beautifully on all devices
- **Permanent Dark Mode**: Clean Vercel-inspired dark theme for optimal viewing
- **Smart Filtering**: Filter between TV Shows, Movies, All results, or Not Streaming content
- **Provider Preview**: See streaming providers directly on search results
- **External Links**: Direct access to IMDB pages for movies and TV shows

### Design
- **Modern UI**: Clean, Vercel-inspired dark interface
- **Smooth Animations**: Subtle transitions for a polished feel
- **Accessibility**: WCAG compliant with proper focus states and motion preferences
- **Minimalist Aesthetic**: Pure blacks, clean whites, and subtle gray accents

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
- **Background**: Pure black (`hsl(0 0% 0%)`)
- **Foreground**: Clean white (`hsl(0 0% 100%)`)
- **Cards**: Subtle dark gray for contrast
- **Accents**: Minimal blue highlights for links

### Features
- Responsive breakpoints: mobile, tablet, desktop
- Permanent dark mode with Vercel aesthetic
- Smooth transitions and hover states
- Consistent spacing and typography
- Motion-reduced animations for accessibility

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

### External Integration
Direct access to additional content information:
- IMDB links with proper validation and error handling
- Favicon integration with emoji fallbacks
- Opens in new tabs for seamless browsing experience

### Streaming Detection
Advanced content filtering:
- Differentiates between streaming, purchase, and rental options
- Separates truly unavailable content into "Not Streaming" tab
- Batch API optimization for faster provider data loading
- Intelligent caching to reduce redundant API calls

## 📊 Performance

- **Fast Initial Load**: Optimized bundle size
- **Image Optimization**: Lazy loading with blur placeholders
- **API Efficiency**: Batch provider fetching, debounced external ID requests
- **Caching**: Popular titles and provider data cached for instant results
- **Smart Loading**: Provider data fetched after search results for better UX

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
