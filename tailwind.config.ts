// tailwind.config.ts

import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * Tailwind CSS configuration for the project.
 *
 * - Includes dark mode support via class strategy.
 * - Scans relevant directories for class usage.
 * - Extends theme with custom fonts, colors (CSS vars + static), and radius utilities.
 */
const config: Config = {
  // Enable dark mode via class strategy
  darkMode: ['class'],

  // Directories Tailwind will scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Custom font families
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
      },

      // Custom colors including CSS variable-based themes and static colors
      colors: {
        // Static custom colors
        'custom-gray': '#D5D5D5',
        pearl: '#F5F5F5',

        // Dynamic theme colors using CSS variables (used with CSS theming systems)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Global UI elements
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Chart-specific variables (great for data viz color schemes)
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // Border radius using CSS custom properties for theming flexibility
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  // Additional plugins
  plugins: [tailwindcssAnimate],
};

export default config;
