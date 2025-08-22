import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPage from './components/HeroPage';
import AboutPage from './components/AboutPage';
import VirtualTour from './components/VirtualTour';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;