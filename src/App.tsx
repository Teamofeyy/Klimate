import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout';
import { ThemeProvider } from './context/theme-provider';
import WeatherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';
import { QueryClientProvider, QueryClient, } from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { WeatherApiError } from './api/weather';

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false
        if (error instanceof WeatherApiError) {
          return Boolean(error.status && error.status >= 500)
        }
        return error instanceof TypeError
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
      refetchOnWindowFocus: false,
    }
  }
})

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme='light'>
          <Layout>
            <Routes>
              <Route path='/' element={<WeatherDashboard />} />
              <Route path='/city/:cityName' element={<CityPage />} />
            </Routes>
            <SpeedInsights />
          </Layout>
          <Toaster richColors />
          {ReactQueryDevtools && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
