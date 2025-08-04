/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
    // Dark mode only - no theme switching needed
  theme: {
    extend: {
      colors: {
        // iOS semantic color system
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // iOS Semantic Colors - Direct Access
        'ios-label': 'hsl(var(--ios-label))',
        'ios-secondary-label': 'hsl(var(--ios-secondary-label))',
        'ios-tertiary-label': 'hsl(var(--ios-tertiary-label))',
        'ios-quaternary-label': 'hsl(var(--ios-quaternary-label))',
        'ios-system-background': 'hsl(var(--ios-system-background))',
        'ios-secondary-system-background': 'hsl(var(--ios-secondary-system-background))',
        'ios-tertiary-system-background': 'hsl(var(--ios-tertiary-system-background))',
        'ios-separator': 'hsl(var(--ios-separator))',
        'ios-link': 'hsl(var(--ios-link))',
        // Additional grays following Vercel's system
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['var(--font-sf-pro)', 'system-ui', 'sans-serif'],
        sf: ['var(--font-sf-pro)', 'system-ui', 'sans-serif'], // iOS SF Pro
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        // iOS Text Styles
        'ios-large-title': ['var(--text-large-title)', { lineHeight: 'var(--line-height-large-title)', letterSpacing: 'var(--letter-spacing-large-title)' }],
        'ios-title-1': ['var(--text-title-1)', { lineHeight: 'var(--line-height-title-1)', letterSpacing: 'var(--letter-spacing-title-1)' }],
        'ios-title-2': ['var(--text-title-2)', { lineHeight: 'var(--line-height-title-2)', letterSpacing: 'var(--letter-spacing-title-2)' }],
        'ios-title-3': ['var(--text-title-3)', { lineHeight: 'var(--line-height-title-3)', letterSpacing: 'var(--letter-spacing-title-3)' }],
        'ios-headline': ['var(--text-headline)', { lineHeight: 'var(--line-height-headline)', letterSpacing: 'var(--letter-spacing-headline)' }],
        'ios-body': ['var(--text-body)', { lineHeight: 'var(--line-height-body)', letterSpacing: 'var(--letter-spacing-body)' }],
        'ios-callout': ['var(--text-callout)', { lineHeight: 'var(--line-height-callout)', letterSpacing: 'var(--letter-spacing-callout)' }],
        'ios-subhead': ['var(--text-subhead)', { lineHeight: 'var(--line-height-subhead)', letterSpacing: 'var(--letter-spacing-subhead)' }],
        'ios-footnote': ['var(--text-footnote)', { lineHeight: 'var(--line-height-footnote)', letterSpacing: 'var(--letter-spacing-footnote)' }],
        'ios-caption-1': ['var(--text-caption-1)', { lineHeight: 'var(--line-height-caption-1)', letterSpacing: 'var(--letter-spacing-caption-1)' }],
        'ios-caption-2': ['var(--text-caption-2)', { lineHeight: 'var(--line-height-caption-2)', letterSpacing: 'var(--letter-spacing-caption-2)' }],
      },
      fontWeight: {
        // iOS Font Weights
        'ios-regular': 'var(--font-weight-regular)',
        'ios-medium': 'var(--font-weight-medium)',
        'ios-semibold': 'var(--font-weight-semibold)',
        'ios-bold': 'var(--font-weight-bold)',
      },
      spacing: {
        // iOS 8pt Spacing System
        'ios-xs': 'var(--spacing-xs)',     // 4px
        'ios-sm': 'var(--spacing-sm)',     // 8px - base unit
        'ios-md': 'var(--spacing-md)',     // 16px
        'ios-lg': 'var(--spacing-lg)',     // 24px
        'ios-xl': 'var(--spacing-xl)',     // 32px
        'ios-2xl': 'var(--spacing-2xl)',   // 40px
        'ios-3xl': 'var(--spacing-3xl)',   // 48px
        'ios-4xl': 'var(--spacing-4xl)',   // 64px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        // iOS-style spring animations
        'ios-spring': 'iosSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ios-ease': 'iosEase 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-scale-in': 'iosScaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ios-tab-switch': 'iosTabSwitch 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // iOS-style animations
        iosSpring: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosEase: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        iosScaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosTabSwitch: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // iOS-specific radius values
        'ios-card': 'var(--radius-card)',   // 16px
        'ios-button': 'var(--radius)',      // 12px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'subtle-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [],
}