import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, Globe, ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { languages, getTranslation } from './translations';
import Pepe from "../assets/images/Pepe.jpg";
import Andres from "../assets/images/Andres.jpg";
import bgImage from "../assets/images/background.jpg";

// Constants
const CAROUSEL_INTERVAL = 3000;
const CAROUSEL_IMAGES = [
  { src: Pepe, alt: 'carousel.Jose Rizal' },
  { src: Andres, alt: 'carousel.Andres Bonifacio' },
  { src: Pepe, alt: 'carousel.Jose Rizal' }
];

const HeroPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'EN';
  });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Memoize carousel images with translations
  const carouselImages = useMemo(() => 
    CAROUSEL_IMAGES.map(image => ({
      ...image,
      alt: getTranslation(selectedLanguage, image.alt)
    })),
    [selectedLanguage]
  );

  // Memoized navigation handlers
  const navigationHandlers = useMemo(() => ({
    handleLogoClick: () => navigate('/'),
    handleAboutClick: () => navigate('/about'),
    handleExploreClick: () => navigate('/virtual-tour')
  }), [navigate]);

  const handleLanguageChange = useCallback((languageCode) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    setIsLanguageDropdownOpen(false);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageDropdownOpen && !event.target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageDropdownOpen]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setCurrentSlide(prev => prev === 0 ? carouselImages.length - 1 : prev - 1);
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, carouselImages.length]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with enhanced overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        role="img"
        aria-label="Hero background"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        {/* Add subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Enhanced Navigation with glassmorphism */}
      <nav 
        className={`absolute top-0 left-0 w-full relative z-[1000] flex justify-between items-center px-[90px] py-6 transition-all duration-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Add subtle backdrop blur to nav area */}
        {/* <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-lg -mx-4 -my-2"></div> */}
        
        <button 
          className="relative text-white text-2xl font-lamora hover:text-red-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-3 py-2 transform hover:scale-105"
          onClick={navigationHandlers.handleLogoClick}
          aria-label="Go to homepage"
        >
          ExhibitGo
        </button>
        
        <div className="relative flex items-center space-x-6">
          <button 
            className="relative text-white text-m font-lamora tracking-wider hover:text-red-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-3 py-2 group"
            onClick={navigationHandlers.handleAboutClick}
          >
            {getTranslation(selectedLanguage, 'nav.about')}
            <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
          
          {/* Enhanced Language Dropdown */}
          <div className="relative language-dropdown">
            <button 
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-2 transition-all duration-300 relative hover:bg-white/10 backdrop-blur-sm"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              aria-expanded={isLanguageDropdownOpen}
              aria-haspopup="true"
              aria-label={`Current language: ${selectedLanguage}. Click to change language`}
            >
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/20">
                <Globe size={16} aria-hidden="true" />
              </div>
              <span className="text-white text-sm font-medium group-hover:text-red-400 transition-colors">
                {selectedLanguage}
              </span>
              <ChevronDown 
                size={14} 
                className={`text-white transition-all duration-300 group-hover:text-red-400 ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>

            {isLanguageDropdownOpen && (
              <div 
                className="absolute top-12 right-0 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl py-2 min-w-[140px] z-[9999] border border-white/30 animate-in fade-in slide-in-from-top-2 duration-200"
                role="menu"
                aria-label="Language selection"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`w-full px-4 py-3 text-sm text-left transition-all duration-200 hover:bg-black/10 focus:outline-none focus:bg-black/10 mx-1 rounded-lg ${
                      selectedLanguage === language.code 
                        ? 'bg-black/5 text-black font-medium border-l-2 border-red-500' 
                        : 'text-gray-800 hover:text-black'
                    }`}
                    onClick={() => handleLanguageChange(language.code)}
                    role="menuitem"
                    aria-current={selectedLanguage === language.code ? 'true' : 'false'}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg" aria-hidden="true">{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{language.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Enhanced HR line - moved outside nav */}
      <div className="absolute top-[88px] left-0 right-0 mx-[90px] border-b border-white/50 shadow-sm z-[999]" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-px"></div>
      </div>

      {/* Enhanced Hero Content */}
      <header className={`relative z-10 flex justify-between items-start min-h-[calc(100vh-100px)] px-[90px] gap-12 pt-24 transition-all duration-1000 delay-300 ${
        isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
      }`}>
        <div className="max-w-2xl">
          <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-2xl">
            {getTranslation(selectedLanguage, 'hero.title').split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < getTranslation(selectedLanguage, 'hero.title').split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          <p className="text-white/90 text-base font-roboto mb-8 leading-relaxed max-w-md drop-shadow-lg">
            {getTranslation(selectedLanguage, 'hero.description')}
          </p>

          <button 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-red-500/30 backdrop-blur-sm"
            onClick={navigationHandlers.handleExploreClick}
          >
            {getTranslation(selectedLanguage, 'hero.explore')}
          </button>
        </div>
      </header>

      {/* Enhanced Carousel Section */}
      <section 
        className={`absolute bottom-8 left-8 z-10 transition-all duration-1000 delay-500 ${
          isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
        aria-label="Historical figures carousel"
      >
        <div className="relative">
          <div className="flex space-x-6 px-[90px]">
            {carouselImages.map((image, index) => (
              <button 
                key={index}
                className={`relative w-[150px] h-[200px] md:w-43 md:h-67 rounded-xl overflow-hidden transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/50 transform group ${
                  index === currentSlide 
                    ? 'opacity-100 shadow-2xl shadow-white/30 scale-105' 
                    : 'opacity-70 hover:opacity-90 hover:scale-102'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`View ${image.alt}, slide ${index + 1} of ${carouselImages.length}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Enhanced overlay effects */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
                  index === currentSlide 
                    ? 'from-black/50 via-transparent to-transparent' 
                    : 'from-black/30 via-transparent to-transparent group-hover:from-black/40'
                }`} aria-hidden="true"></div>
                
                {/* Active indicator border with glow */}
                <div className={`absolute inset-0 border-2 rounded-xl transition-all duration-300 ${
                  index === currentSlide 
                    ? 'border-white/80 shadow-lg shadow-white/20' 
                    : 'border-transparent group-hover:border-white/40'
                }`}></div>
                
                {/* Enhanced glow effect for active slide */}
                {index === currentSlide && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur-md -z-10 animate-pulse" aria-hidden="true"></div>
                )}
              </button>
            ))}
          </div>

          {/* Enhanced Carousel Controls - positioned close like in Virmo */}
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-red-500 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:text-white font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:shadow-xl hover:shadow-red-500/25 border border-white/20 hover:border-red-500/50 hover:scale-110 transform"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Enhanced Carousel Indicators */}
        <div className="flex justify-center space-x-2 mt-6 p-4" role="tablist" aria-label="Carousel slides">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentSlide 
                  ? 'bg-white w-8 shadow-lg shadow-white/30' 
                  : 'bg-white/40 hover:bg-white/70 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              role="tab"
              aria-selected={index === currentSlide}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Decorative Elements */}
      <div className="absolute bottom-0 right-0" aria-hidden="true">
        <div className="w-32 h-32 relative">
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent"></div>
          <svg 
            className="absolute bottom-0 right-0 w-full h-full text-white/5"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M100,100 L100,70 Q100,50 80,50 L50,50 Q30,50 30,70 L30,100 Z" />
          </svg>
        </div>
      </div>

      {/* Add floating elements for visual interest */}
      <div className="absolute top-1/4 right-12 w-16 h-16 bg-white/5 rounded-full animate-pulse" aria-hidden="true"></div>
      <div className="absolute top-1/3 right-32 w-8 h-8 bg-red-500/20 rounded-full animate-pulse delay-1000" aria-hidden="true"></div>
    </div>
  );
};

export default HeroPage;