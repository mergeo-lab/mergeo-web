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
        sm: 'calc(var(--radius) - 2px)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) + 4px)',
        lg: 'calc(var(--radius) + 8px)',
      },
      fontSize: {
        xs: 'calc(var(--font-size) - 0.5rem)',
        sm: 'calc(var(--font-size) - 0.2rem)',
        DEFAULT: 'var(--font-size)',
        md: 'calc(var(--font-size) + 0.5rem)',
        lg: 'calc(var(--font-size) + 0.8rem)',
        xl: 'calc(var(--font-size) + 1rem)',
        '2xl': 'calc(var(--font-size) + 1.2rem)',
        '3xl': 'calc(var(--font-size) + 1.5rem)',
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
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
        'slide-in-blurred-top': {
          from: {
            transform: 'translateY(-1000px) scaleY(2.5) scaleX(0.2)',
            transformOrigin: '50% 0%',
            filter:'blur(40px)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0) scaleY(1) scaleX(1)',
            transformOrigin: '50% 50%',
            filter:' blur(0)',
            opacity: 1
          }
        }
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'slide-in-blurred-top': '0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both'
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('tailwindcss-animate'), require('tailwindcss-multi'),
  ],
};
