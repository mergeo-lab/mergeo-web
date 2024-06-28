import React, { useEffect } from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import BugsnagPerformance from '@bugsnag/browser-performance'
import { AuthProvider } from "@/auth"
import { useAuth } from "@/hooks"
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query"
import { RouterProvider, createRouter, useRouter } from '@tanstack/react-router'
import { ErrorInfo } from "react"
import { Bug } from 'lucide-react';
import { routeTree } from '@/routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Handle email redirection
const channel = new BroadcastChannel('verification_channel');

// Create a client
const queryClient = new QueryClient();

Bugsnag.start({
  apiKey: '667be40e7f392b57b0f07f6cd23f2de1',
  plugins: [new BugsnagPluginReact()],
  releaseStage: process.env.NODE_ENV,
  enabledReleaseStages: ['production', 'staging'],
})
BugsnagPerformance.start({ apiKey: '667be40e7f392b57b0f07f6cd23f2de1' })

const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

function fallbackRender({ error, clearError }: { error: Error; info: ErrorInfo; clearError: () => void }) {
  return (
    <div className="container flex h-full flex-col justify-center">
      <div role="alert">
        <div className="flex flex-col items-center space-y-4">
          <Bug className="h-10 w-10" />
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-bold">¡Algo salió mal!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Estamos trabajando para solucionar el problema. Por favor, intenta recargar la página.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Código de error: <code>{error.message}</code>
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => clearError()}>
              Recargar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            FallbackComponent={({ error, info }) =>
              fallbackRender({
                error,
                info,
                clearError: reset,
              })
            }
          >
            <AuthProvider>
              <InnerApp />
            </AuthProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  )
}