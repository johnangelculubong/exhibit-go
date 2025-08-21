import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About ExhibitGo</h1>
          
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              Welcome to ExhibitGo, your gateway to the world's greatest cultural treasures and historical artifacts.
            </p>
            
            <p className="mb-4">
              Our mission is to make the world's most important museums, galleries, and cultural sites accessible to everyone, regardless of location or circumstance. Through cutting-edge virtual reality technology and immersive 360-degree experiences, we bring the nation's greatest stories directly to your home.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Vision</h2>
            <p className="mb-4">
              We believe that culture and history belong to everyone. ExhibitGo democratizes access to world-class exhibitions, allowing you to explore ancient civilizations, admire masterpieces, and learn from history's greatest minds from the comfort of your own space.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Immersive 360-degree virtual tours</li>
              <li>High-resolution artifact viewing</li>
              <li>Expert-guided audio narration</li>
              <li>Interactive learning experiences</li>
              <li>Multi-language support</li>
              <li>Accessible from any device</li>
            </ul>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Ready to Explore?</h3>
              <p className="text-blue-700 mb-4">
                Start your journey through history and culture today.
              </p>
              <button 
                onClick={() => navigate('/gallery')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;