import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from './components/layout';
import { ThemeProvider } from './context/theme-provider';
import WetherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='light'>
        <Layout>
          <Routes>
             <Route path='/' element={<WetherDashboard />} />
             <Route path='/city/:cityName' element={<CityPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
