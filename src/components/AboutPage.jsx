import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTranslation } from "./translations";
import { motion } from "framer-motion";

const AboutPage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "EN";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLanguage = localStorage.getItem("selectedLanguage") || "EN";
      setSelectedLanguage(storedLanguage);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleExploreClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/virtual-tour");
    }, 1200); // 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 relative overflow-hidden">
      
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div
            className="absolute inset-0 bg-black"
            style={{
              clipPath: "circle(0% at center)",
              animation: "circleOpening 1.2s ease-out forwards",
            }}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-[110px] font-montserrat opacity-0"
                 style={{ animation: "welcomeText 1.5s ease-out 0.5s forwards" }}>
              Welcome to ExhibitGo
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes circleOpening {
          0% {
            clip-path: circle(0% at center);
          }
          100% {
            clip-path: circle(150% at center);
          }
        }

        @keyframes welcomeText {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -5 }}
          className="mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all"
        >
          ← {getTranslation(selectedLanguage, "about.backToHome")}
        </motion.button>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 rounded-2xl shadow-2xl p-10 border border-white/30 dark:border-gray-700"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
            {getTranslation(selectedLanguage, "about.title")}
          </h1>

          <div className="prose prose-lg text-gray-700 dark:text-gray-300 max-w-none">
            <p className="mb-4">{getTranslation(selectedLanguage, "about.welcome")}</p>
            <p className="mb-4">{getTranslation(selectedLanguage, "about.mission")}</p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              {getTranslation(selectedLanguage, "about.visionTitle")}
            </h2>
            <p className="mb-4">{getTranslation(selectedLanguage, "about.visionDescription")}</p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              {getTranslation(selectedLanguage, "about.featuresTitle")}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-6 mb-6">
              <li>{getTranslation(selectedLanguage, "about.feature1")}</li>
              <li>{getTranslation(selectedLanguage, "about.feature2")}</li>
              <li>{getTranslation(selectedLanguage, "about.feature3")}</li>
              <li>{getTranslation(selectedLanguage, "about.feature4")}</li>
              <li>{getTranslation(selectedLanguage, "about.feature5")}</li>
            </ul>

            {/* CTA Section */}
            <div className="mt-8 p-6 backdrop-blur-md bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {getTranslation(selectedLanguage, "about.readyTitle")}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                {getTranslation(selectedLanguage, "about.readyDescription")}
              </p>
              <motion.button
                onClick={handleExploreClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTransitioning}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                {isTransitioning ? "Opening..." : getTranslation(selectedLanguage, "hero.explore")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
