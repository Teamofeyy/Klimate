import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout';
import { ThemeProvider } from './context/theme-provider';
import WetherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';
import { QueryClientProvider, QueryClient, } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 100,
      gcTime: 10 * 60 * 100,
      retry: false,
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
              <Route path='/' element={<WetherDashboard />} />
              <Route path='/city/:cityName' element={<CityPage />} />
            </Routes>
            <SpeedInsights />
          </Layout>
          <Toaster richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
