import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React production builds
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
    TanStackRouterVite(),
    tsconfigPaths(),
    // Compress assets for production builds
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Generate bundle visualization in stats.html
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    // Interactive bundle analyzer (only when ANALYZE env is set)
    process.env.ANALYZE === 'true' &&
      bundleAnalyzer({
        analyzerMode: 'static',
        openBrowser: true,
        statsFilename: 'bundle-stats.json',
      }),
    // Copy static assets that don't need processing
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/*.{jpg,png,svg,webp}',
          dest: 'assets',
        },
      ],
    }),
  ],
  server: {
    port: 3000,
    // Enable HMR with better error overlay
    hmr: {
      overlay: true,
    },
    // Enable faster HMR
    watch: {
      usePolling: false,
    },
    // Automatically open browser on start
    open: true,
    // Configure CORS
    cors: true,
    // Cache static assets effectively
    fs: {
      strict: true,
      allow: ['..'],
    },
  },
  // Configure path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Production build optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    // Increase chunk size warning to avoid noise
    chunkSizeWarningLimit: 1000,
    // Improve source maps for debugging
    sourcemap: process.env.NODE_ENV !== 'production',
    // Report build time and chunk sizes
    reportCompressedSize: true,
    // Emit clear build errors
    emptyOutDir: true,
    // Use modern JS output
    outDir: 'dist',
    // Set performance budgets and thresholds
    assetsInlineLimit: 4096, // 4kb - small assets are inlined
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 10000, // 10kb - avoid tiny chunks
        manualChunks: (id) => {
          // Core React libraries
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-reconciler/')
          ) {
            return 'vendor-react';
          }

          // Data management libraries
          if (
            id.includes('node_modules/@tanstack/react-query') ||
            id.includes('node_modules/zustand/') ||
            id.includes('node_modules/axios/')
          ) {
            return 'vendor-data';
          }

          // Form libraries
          if (
            id.includes('node_modules/react-hook-form/') ||
            id.includes('node_modules/@hookform/')
          ) {
            return 'vendor-forms';
          }

          // Form validation
          if (id.includes('node_modules/zod/')) {
            return 'vendor-validation';
          }

          // UI Input Components
          if (
            id.includes('node_modules/@radix-ui/react-select') ||
            id.includes('node_modules/@radix-ui/react-checkbox') ||
            id.includes('node_modules/@radix-ui/react-radio-group') ||
            id.includes('node_modules/@radix-ui/react-switch') ||
            id.includes('node_modules/@radix-ui/react-label') ||
            id.includes('node_modules/input-otp') ||
            id.includes('components/ui/input') ||
            id.includes('components/ui/select') ||
            id.includes('components/ui/checkbox') ||
            id.includes('components/ui/radio-group') ||
            id.includes('components/ui/form') ||
            id.includes('components/ui/input-otp') ||
            id.includes('components/ui/textarea') ||
            id.includes('components/ui/label') ||
            id.includes('components/ui/switch')
          ) {
            return 'ui-inputs';
          }

          // UI Navigation Components
          if (
            id.includes('node_modules/@radix-ui/react-navigation-menu') ||
            id.includes('node_modules/@radix-ui/react-tabs') ||
            id.includes('node_modules/@radix-ui/react-dropdown-menu') ||
            id.includes('node_modules/@radix-ui/react-hover-card') ||
            id.includes('components/ui/navigation-menu') ||
            id.includes('components/ui/pagination') ||
            id.includes('components/ui/hover-card') ||
            id.includes('components/ui/tabs') ||
            id.includes('components/ui/dropdown-menu')
          ) {
            return 'ui-navigation';
          }

          // UI Modal Components
          if (
            id.includes('node_modules/@radix-ui/react-dialog') ||
            id.includes('node_modules/@radix-ui/react-popover') ||
            id.includes('node_modules/@radix-ui/react-toast') ||
            id.includes('node_modules/@radix-ui/react-tooltip') ||
            id.includes('components/ui/dialog') ||
            id.includes('components/ui/alert') ||
            id.includes('components/ui/sheet') ||
            id.includes('components/ui/popover') ||
            id.includes('components/ui/tooltip') ||
            id.includes('components/ui/toast')
          ) {
            return 'ui-modals';
          }

          // UI Layout Components
          if (
            id.includes('node_modules/@radix-ui/react-accordion') ||
            id.includes('node_modules/@radix-ui/react-collapsible') ||
            id.includes('node_modules/@radix-ui/react-scroll-area') ||
            id.includes('components/ui/accordion') ||
            id.includes('components/ui/collapsible') ||
            id.includes('components/ui/scroll-area') ||
            id.includes('components/ui/card')
          ) {
            return 'ui-layout';
          }

          // UI Data Display Components
          if (
            id.includes('node_modules/@radix-ui/react-avatar') ||
            id.includes('node_modules/@radix-ui/react-progress') ||
            id.includes('components/ui/avatar') ||
            id.includes('components/ui/badge') ||
            id.includes('components/ui/progress') ||
            id.includes('components/ui/skeleton') ||
            id.includes('components/ui/table')
          ) {
            return 'ui-data-display';
          }

          // Data Visualization - Core Recharts
          if (
            id.includes('node_modules/recharts/es6/component/') ||
            id.includes('node_modules/recharts/es6/util/')
          ) {
            return 'data-viz-core';
          }

          // Data Visualization - Charts Types
          if (
            id.includes('node_modules/recharts/es6/chart/') ||
            id.includes('node_modules/recharts/es6/polar/')
          ) {
            return 'data-viz-charts';
          }

          // Data Visualization - App Components
          if (
            id.includes('components/dashboard/chart') ||
            (id.includes('recharts') &&
              !id.includes('node_modules/recharts/es6/'))
          ) {
            return 'data-viz-app';
          }

          // Map core components
          if (
            id.includes(
              'node_modules/@vis.gl/react-google-maps/dist/components/'
            )
          ) {
            return 'maps-core';
          }

          // Map utils and hooks
          if (
            id.includes('node_modules/@vis.gl/react-google-maps/dist/hooks/') ||
            id.includes('node_modules/@vis.gl/react-google-maps/dist/utils/')
          ) {
            return 'maps-utils';
          }

          // Application map components
          if (id.includes('components/map/')) {
            return 'maps-app';
          }

          // Other map dependencies
          if (id.includes('node_modules/@vis.gl/react-google-maps')) {
            return 'maps-vendors';
          }

          // Date handling (these are heavy and used across the app)
          if (id.includes('node_modules/date-fns/')) {
            return 'vendor-dates';
          }

          // Utility libraries
          if (
            id.includes('node_modules/lodash/') ||
            id.includes('node_modules/clsx/') ||
            id.includes('node_modules/tailwind-merge/') ||
            id.includes('node_modules/class-variance-authority/')
          ) {
            return 'vendor-utils';
          }

          // Icon libraries
          if (
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/react-icons/')
          ) {
            return 'vendor-icons';
          }

          // App modules - Dashboard
          if (
            id.includes('/components/dashboard/') &&
            !id.includes('/components/dashboard/chart')
          ) {
            return 'app-dashboard';
          }

          // App modules - Configuration
          if (id.includes('/components/configuration/')) {
            return 'app-configuration';
          }

          // App modules - Orders
          if (
            id.includes('/components/orders/') ||
            id.includes(
              '/routes/_authenticated/_dashboardLayout/_accountType/client/orders/'
            ) ||
            id.includes(
              '/routes/_authenticated/_dashboardLayout/_accountType/provider/orders/'
            )
          ) {
            return 'app-orders';
          }

          // All other UI components
          if (id.includes('components/ui/')) {
            return 'ui-components';
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
