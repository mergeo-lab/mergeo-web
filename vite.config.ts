import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
    TanStackRouterVite(),
    tsconfigPaths(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    (visualizer as any)({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    process.env.ANALYZE === 'true' &&
      bundleAnalyzer({
        analyzerMode: 'static',
        openBrowser: true,
        statsFilename: 'bundle-stats.json',
      }),
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
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
    },
    open: true,
    cors: true,
    fs: {
      strict: true,
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser', // switched from 'esbuild'
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: process.env.NODE_ENV !== 'production',
    reportCompressedSize: true,
    emptyOutDir: true,
    outDir: 'dist',
    assetsInlineLimit: 4096,
    // Commented out manualChunks to avoid chunking issues
    /*
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Custom chunking logic here
        },
      },
    },
    */
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
