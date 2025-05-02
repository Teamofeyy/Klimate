import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from './components/layout';
import { ThemeProvider } from './context/theme-provider';
import WetherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';
import {QueryClientProvider, QueryClient,} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

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
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
