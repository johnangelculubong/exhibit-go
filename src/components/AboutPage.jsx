import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from './translations';

const AboutPage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Get from localStorage or default to 'EN'
    return localStorage.getItem('selectedLanguage') || 'EN';
  });

  // Update language
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLanguage = localStorage.getItem('selectedLanguage') || 'EN';
      setSelectedLanguage(storedLanguage);
    };

    window.addEventListener('storage', handleStorageChange);
    
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← {getTranslation(selectedLanguage, 'about.backToHome')}
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {getTranslation(selectedLanguage, 'about.title')}
          </h1>
          
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              {getTranslation(selectedLanguage, 'about.welcome')}
            </p>
            
            <p className="mb-4">
              {getTranslation(selectedLanguage, 'about.mission')}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              {getTranslation(selectedLanguage, 'about.visionTitle')}
            </h2>
            <p className="mb-4">
              {getTranslation(selectedLanguage, 'about.visionDescription')}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              {getTranslation(selectedLanguage, 'about.featuresTitle')}
            </h2>
            <ul className="list-disc pl-6 mb-6">
              <li>{getTranslation(selectedLanguage, 'about.feature1')}</li>
              <li>{getTranslation(selectedLanguage, 'about.feature2')}</li>
              <li>{getTranslation(selectedLanguage, 'about.feature3')}</li>
              <li>{getTranslation(selectedLanguage, 'about.feature4')}</li>
              <li>{getTranslation(selectedLanguage, 'about.feature5')}</li>
            </ul>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {getTranslation(selectedLanguage, 'about.readyTitle')}
              </h3>
              <p className="text-blue-700 mb-4">
                {getTranslation(selectedLanguage, 'about.readyDescription')}
              </p>
              <button 
                onClick={() => navigate('/gallery')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                {getTranslation(selectedLanguage, 'hero.explore')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;