import React, { useMemo } from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import BugsnagPerformance from '@bugsnag/browser-performance'
import { AuthProvider } from "@/auth"
import { useAuth } from "@/hooks"
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query"
import { RouterProvider, createRouter, Link } from '@tanstack/react-router'
import { ErrorInfo } from "react"
import { Bug } from 'lucide-react';
import { routeTree } from '@/routeTree.gen'
import { APIProvider } from '@vis.gl/react-google-maps'
import { Button } from '@/components/ui/button'

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultNotFoundComponent: () => {
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center'>
        <h1 className='text-5xl font-bold'>UPS!</h1>
        <h1 className='text-xl'> Not encontramos la pagina que estas buscandos!</h1>
        <img className='w-1/3 aspect-squares' src="/404-computer.jpg" alt="" />
        <Link to="/">
          <Button variant="link">
            Ir al inicio
          </Button>
        </Link>
      </div>
    )
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a client
const queryClient = new QueryClient();

Bugsnag.start({
  apiKey: '667be40e7f392b57b0f07f6cd23f2de1',
  plugins: [new BugsnagPluginReact()],
  releaseStage: import.meta.env.PROD ? 'production' : '',
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

const InnerApp = React.memo(() => {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
})

export default function App() {
  const apiKeyMemo = useMemo(() => googleMapsApiKey, []);

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
              <APIProvider apiKey={apiKeyMemo} libraries={['places']}>
                <InnerApp />
              </APIProvider>
            </AuthProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  )
}