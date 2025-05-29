import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Determine if we're in development or production mode
const isDevelopment = process.env.NODE_ENV !== 'production';

export default [
  // Explicitly ignore directories first (to ensure they take precedence)
  {
    ignores: [
      'dist/**', 
      '.vite/**', // More general pattern to catch all .vite files
      'node_modules/**', 
      'build/**', 
      'coverage/**',
      '**/*.min.js',
    ],
  },
  // Base ESLint recommended configuration
  eslint.configs.recommended,
  
  // TypeScript configuration for all TypeScript files (excluding vite.config.ts)
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['vite.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-expressions': ['warn', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  
  // React configuration
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      'react': reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },
  
  // React Hooks
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': ['warn', {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)'
      }],
    },
  },
  
  // React Refresh
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  
  // Configuration for all JavaScript/TypeScript files
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Additional globals
        React: 'readable',
        ReactDOM: 'readable',
        JSX: 'readable',
        google: 'readable',
        
        // Browser API globals
        window: 'readable',
        document: 'readable',
        navigator: 'readable',
        localStorage: 'readable',
        sessionStorage: 'readable',
        fetch: 'readable',
        console: 'readable',
        performance: 'readable',
        location: 'readable',
        history: 'readable',
        
        // DOM-related
        HTMLElement: 'readable',
        HTMLDivElement: 'readable',
        HTMLInputElement: 'readable',
        HTMLButtonElement: 'readable',
        HTMLTextAreaElement: 'readable',
        HTMLSpanElement: 'readable',
        HTMLTableElement: 'readable',
        HTMLTableSectionElement: 'readable',
        HTMLTableRowElement: 'readable',
        HTMLTableCellElement: 'readable',
        HTMLTableCaptionElement: 'readable',
        HTMLLIElement: 'readable',
        HTMLUListElement: 'readable',
        HTMLHeadingElement: 'readable',
        HTMLParagraphElement: 'readable',
        HTMLImageElement: 'readable',
        HTMLIFrameElement: 'readable',
        HTMLVideoElement: 'readable',
        HTMLSelectElement: 'readable',
        Event: 'readable',
        CustomEvent: 'readable',
        DocumentFragment: 'readable',
        NodeFilter: 'readable',
        Node: 'readable',
        Element: 'readable',
        ShadowRoot: 'readable',
        
        // Web APIs
        File: 'readable',
        FileList: 'readable',
        FormData: 'readable',
        URLSearchParams: 'readable',
        URL: 'readable',
        Blob: 'readable',
        TextEncoder: 'readable',
        crypto: 'readable',
        ResizeObserver: 'readable',
        IntersectionObserver: 'readable',
        MutationObserver: 'readable',
        AbortController: 'readable',
        Response: 'readable',
        Request: 'readable',
        Headers: 'readable',
        ReadableStream: 'readable',
        
        // Timer functions
        setTimeout: 'readable',
        clearTimeout: 'readable',
        setInterval: 'readable',
        clearInterval: 'readable',
        requestAnimationFrame: 'readable',
        cancelAnimationFrame: 'readable',
        queueMicrotask: 'readable',

        // Additional Web APIs
        MediaQueryList: 'readable',
        DOMParser: 'readable',
        XMLHttpRequest: 'readable',
        WebSocket: 'readable',
        Worker: 'readable',
        ServiceWorker: 'readable',
        ServiceWorkerRegistration: 'readable',
        Notification: 'readable',
        atob: 'readable',
        btoa: 'readable',
        Promise: 'readable',
        Map: 'readable',
        Set: 'readable',
        WeakMap: 'readable',
        WeakSet: 'readable',
        Symbol: 'readable',
        Proxy: 'readable',
        Reflect: 'readable',
        Int8Array: 'readable',
        Uint8Array: 'readable',
        Uint8ClampedArray: 'readable',
        Int16Array: 'readable',
        Uint16Array: 'readable',
        Int32Array: 'readable',
        Uint32Array: 'readable',
        Float32Array: 'readable',
        Float64Array: 'readable',
        ArrayBuffer: 'readable',
        DataView: 'readable',
        JSON: 'readable',
        Math: 'readable',
        Intl: 'readable',
        
        // Vite-specific globals
        import: 'readable',
        require: 'readable',
        module: 'readable',
        process: 'readable',
        __dirname: 'readable',
        __filename: 'readable',
      },
    },
    
    // Additional files to ignore at this level
    ignores: [
      'dist/**', 
      '.vite/**', 
      'node_modules/**', 
      'build/**', 
      'coverage/**',
      '**/*.min.js',
    ],
    
    // Rules configuration
    rules: {
      // Set no-undef to warn instead of error to reduce noise
      'no-undef': 'warn',
      'no-unused-vars': 'off', // Handled by TypeScript
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Allow console in development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Allow debugger in development
      'no-alert': 'warn',
      'no-prototype-builtins': 'warn',
      'no-constant-condition': 'warn',
      'no-empty': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-case-declarations': 'warn',
      'no-fallthrough': 'warn',
      'no-async-promise-executor': 'warn',
      'no-control-regex': 'warn',
      'no-misleading-character-class': 'warn',
      'no-useless-escape': 'warn',
      'no-func-assign': 'warn',
      'no-unsafe-finally': 'warn',
      'no-redeclare': 'warn',
      'no-self-assign': 'warn',
      'no-unreachable': 'warn',
      'no-sparse-arrays': 'warn',
      'no-shadow-restricted-names': 'error',
      'no-cond-assign': 'warn',
      'getter-return': 'error',
      'require-yield': 'warn',
      'valid-typeof': 'error',
    },
  },
  
  // Special configuration for vite.config.ts
  {
    files: ['vite.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.node.json',
      },
      globals: {
        ...globals.node,
        process: 'readable',
        __dirname: 'readable',
        __filename: 'readable',
        require: 'readable',
        module: 'readable',
        exports: 'readable',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Configuration for JavaScript config files
  {
    files: [
      'tailwind.config.js',
      'postcss.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readable',
        __dirname: 'readable',
        __filename: 'readable',
        require: 'readable',
        module: 'readable',
        exports: 'readable',
      },
    },
  },
  
  // Configuration for generated files and dependencies that might still get parsed
  {
    files: ['.vite/**/*', 'node_modules/**/*'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  
  // Configuration for test files
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.js', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
        describe: 'readable',
        it: 'readable',
        test: 'readable',
        expect: 'readable',
        beforeEach: 'readable',
        afterEach: 'readable',
        beforeAll: 'readable',
        afterAll: 'readable',
        jest: 'readable',
      },
    },
    rules: {
      'no-console': 'off', // Allow console in test files
      'no-debugger': 'off', // Allow debugger in test files
      '@typescript-eslint/no-unused-expressions': 'off', // Allow unused expressions in test assertions
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests for flexibility
    },
  },
];
