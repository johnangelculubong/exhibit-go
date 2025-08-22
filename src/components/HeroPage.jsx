import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { languages, translations, getTranslation } from './translations';
import Pepe from "../assets/images/Pepe.jpg";
import Andres from "../assets/images/Andres.jpg";
import bgImage from "../assets/images/background.jpg";

const HeroPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Get from localStorage or default to 'EN'
    return localStorage.getItem('selectedLanguage') || 'EN';
  });
  
  // Carousel images
  const carouselImages = [
    {
      src: Pepe,
      alt: getTranslation(selectedLanguage, 'carousel.Jose Rizal')
    },
    {
      src: Andres, 
      alt: getTranslation(selectedLanguage, 'carousel.Andres Bonifacio')
    }
  ];

  // Navigation handlers
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleExploreClick = () => {
    navigate('/gallery');
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageDropdownOpen && !event.target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full relative z-[1000] flex justify-between items-center px-[90px] py-6 overflow-visible">
        
        <div 
          className="text-white text-2xl font-lamora cursor-pointer hover:text-gray-300 transition-colors duration-200"
          onClick={handleLogoClick}
        >
          ExhibitGo
        </div>
        
        <div className="flex items-center space-x-6">
          
          <div 
            className="text-white text-m font-lamora tracking-wider hover:opacity-80 cursor-pointer transition-opacity duration-200"
            onClick={handleAboutClick}
          >
            {getTranslation(selectedLanguage, 'nav.about')}
          </div>
          
          
          <div className="relative language-dropdown">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200 group-hover:border-white/50">
                <Globe size={16} />
              </div>
              <span className="text-white text-sm font-medium group-hover:text-gray-300 transition-colors">
                {selectedLanguage}
              </span>
              <ChevronDown 
                size={14} 
                className={`text-white transition-all duration-200 group-hover:text-gray-300 ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 min-w-[140px] z-[9999] border border-white/20">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className={`px-4 py-3 text-sm cursor-pointer transition-all duration-200 hover:bg-black/10 ${
                      selectedLanguage === language.code 
                        ? 'bg-black/5 text-black font-medium border-l-2 border-red-500' 
                        : 'text-gray-800 hover:text-black'
                    }`}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{language.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </nav>
      <div className="absolute top-[72px] left-0 right-0 mx-[90px] border-b border-white/50"></div>



      {/* Main Content Container */}
      <div className="relative z-10 flex justify-between items-start min-h-[calc(100vh-100px)] px-[90px] gap-12 pt-24">
        <div className="max-w-2xl">
          {/* Main Heading  */}
          <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {getTranslation(selectedLanguage, 'hero.title').split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < getTranslation(selectedLanguage, 'hero.title').split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          {/* Description  */}
          <p className="text-white/90 text-base font-roboto mb-8 leading-relaxed max-w-md">
            {getTranslation(selectedLanguage, 'hero.description')}
          </p>

          {/* Explore Button */}
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            onClick={handleExploreClick}
          >
            {getTranslation(selectedLanguage, 'hero.explore')}
          </button>
        </div>
      </div>

      {/* Carousel Section  */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="flex items-center space-x-4">
          {/* Carousel Container */}
          <div className="relative">
            <div className="flex space-x-6 px-[90px]">
              {carouselImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative w-[150px] h-[200px] md:w-43 md:h-67 rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                    index === currentSlide 
                      ? 'opacity-100 scale-110 ring-2 ring-white ring-opacity-50' 
                      : 'opacity-70 scale-100 hover:opacity-90 hover:scale-105'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                  />
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow */}
          <div className="flex flex-col space-y-2">
            <button 
              onClick={nextSlide}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-6 p-4">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-40 hover:bg-opacity-70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Right Decorative Elements */}
      <div className="absolute bottom-0 right-0">
        <div className="w-32 h-32 relative">
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent"></div>
          <svg 
            className="absolute bottom-0 right-0 w-full h-full text-white/10"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M100,100 L100,70 Q100,50 80,50 L50,50 Q30,50 30,70 L30,100 Z" />
          </svg>
        </div>
      </div>

      {/* Top Right Decorative Circle */}
      <div className="absolute top-1/4 right-12 w-16 h-16 bg-white/5 rounded-full"></div>
    </div>
  );
};

export default HeroPage;