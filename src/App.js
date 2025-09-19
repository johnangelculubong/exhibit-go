import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPage from './components/HeroPage';
import AboutPage from './components/AboutPage';
import VirtualTour from './components/VirtualTour';
import ArtFacts from './components/ArtFacts';
import Entrance from './components/Entrance'; // 👈 add this

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/art-facts" element={<ArtFacts />} />
          <Route path="/entrance" element={<Entrance />} /> {/* 👈 new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
