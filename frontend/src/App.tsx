// FloraFarm — App Router
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import CropAI from './pages/CropAI';
import FertilizerAI from './pages/FertilizerAI';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop-ai" element={<CropAI />} />
          <Route path="/fertilizer-ai" element={<FertilizerAI />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
