# Where Can I Watch?

A modern, iOS-optimized web application to discover where you can stream your favorite movies and TV shows across various platforms.

## ✨ Features

### 🎬 Content Discovery
- **Intelligent Search**: Find movies and TV shows with fuzzy search and typo correction
- **Franchise Detection**: Automatically expands searches for popular franchises
- **Provider Information**: Shows streaming availability across all major platforms
- **IMDB Integration**: Direct links to IMDB for additional information

### 📱 iOS-Native Experience
- **Native Typography**: SF Pro font system with proper iOS text styles
- **8pt Grid System**: Consistent spacing following iOS design guidelines
- **Semantic Colors**: iOS dark mode color palette for authentic feel
- **Touch Optimized**: 44pt minimum touch targets and gesture feedback
- **Safe Area Support**: Proper handling of iPhone notches and home indicators
- **Progressive Loading**: Optimized for various network conditions

### 🎨 Performance & Accessibility
- **60fps Animations**: Hardware-accelerated transitions and micro-interactions
- **Progressive Images**: Blur-to-sharp loading with WebP/AVIF support
- **Reduced Motion**: Comprehensive support for accessibility preferences
- **Screen Reader**: Full ARIA labels and semantic HTML structure
- **Keyboard Navigation**: Complete keyboard accessibility for all interactions

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom iOS design system
- **Images**: Next.js Image optimization with progressive loading
- **API**: The Movie Database (TMDB) API
- **Search**: Fuse.js for fuzzy search capabilities
- **Deployment**: Vercel with performance optimizations

## 📱 iOS Design System

### Typography
- **SF Pro Display/Text**: Native iOS font stack with system fallbacks
- **Text Styles**: title1, title2, title3, headline, body, callout, subhead, footnote, caption1, caption2
- **Dynamic Sizing**: Responsive text sizing for different device sizes

### Spacing
- **8pt Grid**: Consistent spacing using iOS 8-point grid system
- **Touch Targets**: Minimum 44pt touch targets for accessibility
- **Safe Areas**: Dynamic padding for iPhone notches and home indicators

### Colors
- **Semantic Colors**: iOS system colors (label, secondary, tertiary)
- **Background Hierarchy**: System, secondary, tertiary, quaternary backgrounds
- **Dark Mode Only**: Optimized for dark mode viewing experience

### Animations
- **Spring Physics**: Native iOS spring animation curves
- **Micro-interactions**: Subtle button press and card hover feedback
- **Entrance Animations**: Staggered card reveals with bounce effects
- **Performance**: Hardware-accelerated with 60fps optimization

## 🛠️ Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### Performance Monitoring

Development mode includes performance monitoring:
- Render time tracking
- Animation frame rate monitoring
- Bundle size analysis
- Image loading optimization

## 🧪 Testing

### Browser Compatibility
- **Mobile Safari**: Primary target for iOS devices
- **Chrome Mobile**: Android compatibility
- **Desktop**: Responsive design for larger screens

### Device Testing
- **iPhone SE**: Minimum viewport (375px)
- **iPhone 12/13/14**: Standard viewport (390px)
- **iPhone 14 Pro Max**: Large viewport (430px)
- **iPad**: Tablet layout optimization

### Accessibility Testing
- **Screen Readers**: VoiceOver (iOS), NVDA, JAWS
- **Keyboard Navigation**: Full tab order and focus management
- **Color Contrast**: WCAG AA compliance
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 📊 Performance Optimizations

### Image Loading
- **Progressive Enhancement**: Blur-to-sharp transitions
- **Lazy Loading**: Intersection Observer API
- **Format Optimization**: WebP/AVIF with JPEG fallback
- **Size Optimization**: Responsive images with proper sizing

### Bundle Optimization
- **Tree Shaking**: Eliminates unused code
- **Code Splitting**: Dynamic imports for large components
- **Compression**: Gzip/Brotli compression
- **Caching**: Static asset caching with cache busting

### Runtime Performance
- **GPU Acceleration**: translate3d() for smooth animations
- **Will-Change**: Optimized browser compositing
- **Batch Processing**: Large result sets processed in chunks
- **Idle Processing**: requestIdleCallback for non-critical work

## 🎯 User Experience

### Search Experience
- **Instant Search**: 500ms debounce with 3+ character minimum
- **Visual Feedback**: Loading states and progress indicators
- **Error Handling**: Graceful fallbacks for network issues
- **Smart Suggestions**: "Did you mean?" for typos

### Navigation
- **Tab System**: Movies, TV Shows, All results
- **Segmented Control**: iOS-native tab switching
- **State Persistence**: Maintains selection across searches
- **Touch Feedback**: Immediate visual response

### Content Display
- **Card Layout**: Poster-focused design with provider info
- **Expandable Details**: Progressive disclosure of information
- **Provider Badges**: Visual streaming service indicators
- **External Links**: Direct integration with IMDB

## 📝 API Integration

### TMDB API Usage
- **Multi-Search**: Combined movie and TV search
- **Provider Data**: Streaming availability by region
- **External IDs**: IMDB link integration
- **Image CDN**: Optimized poster and backdrop images

### Rate Limiting
- **Batch Processing**: Reduces API calls for large searches
- **Caching**: 5-minute provider data cache
- **Error Handling**: Graceful degradation on API failures

## 🔧 Configuration

### Next.js Optimizations
- **Image Domains**: Configured for TMDB and IMDB
- **Headers**: Security and performance headers
- **Compression**: Built-in asset compression
- **PWA Ready**: Manifest and service worker support

### Tailwind Configuration
- **Custom Spacing**: iOS 8pt grid utilities
- **Color Palette**: iOS semantic color tokens
- **Typography**: SF Pro font family integration
- **Animations**: iOS-native timing functions

## 📈 Analytics & Monitoring

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS optimization
- **Load Times**: Initial page load under 2 seconds
- **Animation Performance**: 60fps target for all interactions
- **Bundle Size**: Optimized for mobile networks

### Error Monitoring
- **API Failures**: Graceful fallback handling
- **Image Errors**: Progressive enhancement
- **Network Issues**: Offline-friendly design
- **User Feedback**: Clear error messaging

## 🚀 Deployment

### Vercel Configuration
- **Automatic Deploys**: Git-based deployment pipeline
- **Preview Branches**: Feature branch previews
- **Edge Functions**: API route optimization
- **CDN**: Global content delivery

### Production Optimizations
- **Static Assets**: Long-term caching
- **API Caching**: Strategic cache headers
- **Image Optimization**: Automatic format conversion
- **Bundle Analysis**: Webpack bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/amazing-feature`)
3. Follow the iOS design system guidelines
4. Ensure accessibility compliance
5. Test on mobile devices
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TMDB**: The Movie Database for comprehensive content data
- **Apple**: iOS design guidelines and human interface guidelines
- **Vercel**: Hosting and deployment platform
- **Next.js Team**: Framework and optimization tools

---

## 📱 iOS UI Implementation Status

**Current Progress: 92.5% Complete (37/40 tasks)**

### ✅ Completed Phases
- **Phase 1**: Foundation (Typography, Spacing, Colors)
- **Phase 2**: Interface Enhancement (Search, Cards, Navigation, Loading)
- **Phase 3.1-3.4**: Animations, Layout, Micro-interactions, Performance

### 🚧 In Progress
- **Phase 3.5**: Final Polish (Accessibility, Testing, Documentation)

The application now provides a genuine iOS-native feel with:
- SF Pro typography and iOS semantic colors
- Hardware-accelerated animations at 60fps
- Touch-optimized interactions and feedback
- Comprehensive accessibility support
- Progressive loading and performance optimization

Ready for production deployment with iOS app-quality user experience.
