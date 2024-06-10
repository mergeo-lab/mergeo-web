/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      maxWidth: {
        DEFAULT: '67.5rem',
      },
      boxShadow: {
        DEFAULT: '0 1px 10px 1px rgb(0, 0, 0, 0.10)',
        lg: '0 2px 10px 2px rgb(0, 0, 0, 0.20)',
        none: 'none',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        inputText: 'hsl(var(--input-text))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        highlight: 'hsl(var(--highlight))',
        info: 'hsl(var(--info))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          background: 'hsl(var(--secondary-background))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) + 2px)',
        md: 'calc(var(--radius) + 8px)',
        lg: 'calc(var(--radius) + 10px)',
      },
      fontSize: {
        DEFAULT: 'var(--font-size)',
        xs: '0.75rem',
        sm: '0.875rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-down': {
          from: {
            opacity: 0,
            transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: 1,
            transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('tailwindcss-animate')],
};
