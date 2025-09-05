import React, { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from '@iconify/react';

// Hero details with enhanced data structure including video data
const heroDetails = {
  "Hero 1": {
    name: "Andres Bonifacio",
    title: "Father of the Philippine Revolution",
    image: "/assets/heroes/andres.jpg",
    bio: "Known as the 'Father of the Philippine Revolution', he founded the Katipunan to fight Spanish rule. Born into a working-class family, Bonifacio was largely self-educated and worked various jobs before becoming a revolutionary leader.",
    legacy: "Symbol of courage and resistance; remembered every Bonifacio Day (Nov 30). His leadership style emphasized grassroots organization and direct action.",
    birthYear: "1863",
    significance: "Founded the Katipunan revolutionary society",
    keyContribution: "Organized the masses against Spanish colonial rule",
    color: "#8B5A3C",
    video: {
      title: "The Life of Andres Bonifacio",
      description: "A documentary about the Father of the Philippine Revolution",
      src: "/assets/videos/bonifacio-history.mp4",
      duration: "5:32"
    }
  },
  "Hero 2": {
    name: "Emilio Aguinaldo",
    title: "First President of the Philippines",
    image: "/assets/heroes/Emilio.jpg",
    bio: "First President of the Philippines; declared independence from Spain on June 12, 1898. A skilled military leader and politician who navigated the complex transition from Spanish to American colonial rule.",
    legacy: "His leadership marked the birth of the First Philippine Republic and established the foundation of Philippine statehood.",
    birthYear: "1869",
    significance: "Declared Philippine Independence",
    keyContribution: "Established the First Philippine Republic",
    color: "#1E40AF",
    video: {
      title: "Emilio Aguinaldo: First President",
      description: "The story of Philippine independence declaration",
      src: "/assets/videos/aguinaldo-history.mp4",
      duration: "4:18"
    }
  },
  "Hero 3": {
    name: "Apolinario Mabini",
    title: "The Brains of the Revolution",
    image: "/assets/heroes/Apolinario.jpg",
    bio: "The 'Brains of the Revolution'; despite being paralyzed, he was Aguinaldo's chief adviser. A brilliant political philosopher and lawyer who shaped the ideological foundation of the Philippine Republic.",
    legacy: "Advocate of good governance and people's rights; his writings shaped Philippine democracy and constitutional law.",
    birthYear: "1864",
    significance: "Chief Political Adviser and Constitutional Expert",
    keyContribution: "Drafted the Malolos Constitution",
    color: "#7C3AED",
    video: {
      title: "Apolinario Mabini: The Sublime Paralytic",
      description: "The intellectual architect of the Philippine Republic",
      src: "/assets/videos/mabini-history.mp4",
      duration: "6:45"
    }
  },
  "Hero 4": {
    name: "Antonio Luna",
    title: "The Fierce General",
    image: "/assets/heroes/Luna.jpg",
    bio: "General known for his military strategies and discipline during the Philippine–American War. A chemist-turned-general who brought scientific precision to military tactics.",
    legacy: "Inspired future generations with his bravery and unyielding patriotism. His military reforms modernized the Philippine Army.",
    birthYear: "1866",
    significance: "Supreme Military Strategist",
    keyContribution: "Modernized Filipino military tactics and discipline",
    color: "#DC2626",
    video: {
      title: "General Antonio Luna: Military Genius",
      description: "The fierce general who modernized Filipino warfare",
      src: "/assets/videos/luna-history.mp4",
      duration: "7:12"
    }
  },
  "Hero 5": {
    name: "Melchora Aquino",
    title: "Mother of the Revolution",
    image: "/assets/heroes/Melchora.jpg",
    bio: "Also called 'Tandang Sora'; she helped Katipuneros by giving them food, shelter, and medical care. At 84, she showed that age was no barrier to serving the revolution.",
    legacy: "Recognized as the 'Mother of the Revolution' for her maternal care of revolutionaries and unwavering support for independence.",
    birthYear: "1812",
    significance: "Revolutionary Support Network Leader",
    keyContribution: "Provided sanctuary and care for revolutionary fighters",
    color: "#059669",
    video: {
      title: "Tandang Sora: Mother of the Revolution",
      description: "The nurturing mother who supported Filipino revolutionaries",
      src: "/assets/videos/melchora-history.mp4",
      duration: "4:56"
    }
  },
  "Hero 6": {
    name: "Jose P. Rizal",
    title: "National Hero of the Philippines",
    image: "/assets/heroes/rizal.jpg",
    bio: "National Hero of the Philippines; his novels Noli Me Tangere and El Filibusterismo exposed Spanish abuses. A polymath who was a doctor, writer, artist, and reformist.",
    legacy: "Inspired Filipinos to unite for independence; executed on Dec 30, 1896. His peaceful approach to reform influenced the national character.",
    birthYear: "1861",
    significance: "National Awakening Through Literature",
    keyContribution: "Awakened Filipino consciousness through his writings",
    color: "#B45309",
    video: {
      title: "Dr. Jose Rizal: The National Hero",
      description: "The life and works of the Philippines' greatest hero",
      src: "/assets/videos/rizal-history.mp4",
      duration: "8:24"
    }
  },
};

// Video Modal Component
const VideoModal = ({ isOpen, onClose, video, heroColor, onVideoPlayingChange }) => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Video event handlers
  const handleVideoPlay = useCallback(() => {
    console.log("Video started playing - muting background audio");
    onVideoPlayingChange(true);
  }, [onVideoPlayingChange]);

  const handleVideoPause = useCallback(() => {
    console.log("Video paused - allowing background audio");
    onVideoPlayingChange(false);
  }, [onVideoPlayingChange]);

  const handleVideoEnded = useCallback(() => {
    console.log("Video ended - allowing background audio");
    onVideoPlayingChange(false);
  }, [onVideoPlayingChange]);

  const handleVideoError = useCallback(() => {
    console.log("Video error - allowing background audio");
    onVideoPlayingChange(false);
  }, [onVideoPlayingChange]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Reset video playing state when modal closes
      onVideoPlayingChange(false);
    };
  }, [isOpen, handleEscapeKey, onVideoPlayingChange]);

  if (!isOpen || !video) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video Header */}
          <div 
            className="p-4 text-white flex justify-between items-center"
            style={{ backgroundColor: heroColor }}
          >
            <div>
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm opacity-90">{video.description}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close video"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative bg-black">
            <video
              controls
              autoPlay
              className="w-full h-auto max-h-[60vh]"
              poster="/assets/video-posters/hero-thumbnail.jpg"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              onLoadedData={() => setIsVideoReady(true)}
            >
              <source src={video.src} type="video/mp4" />
              <p className="text-center p-4 text-gray-600">
                Your browser does not support the video tag.
              </p>
            </video>

            {/* Loading indicator */}
            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Icon icon="mdi:clock" className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="mdi:video" className="w-4 h-4" />
                  <span>Historical Documentary</span>
                </div>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Audio automatically managed
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ArtifactModal = ({ isOpen, onClose, artifact, onVideoPlayingChange }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Handle escape key press
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle click outside modal
  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Close video when modal closes
  const handleModalClose = useCallback(() => {
    setIsVideoOpen(false);
    onClose();
  }, [onClose]);

  // Add event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // Reset video playing state when artifact modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsVideoOpen(false);
      onVideoPlayingChange(false);
    }
  }, [isOpen, onVideoPlayingChange]);

  if (!isOpen || !artifact) return null;

  const hero = heroDetails[artifact.label] || null;
  if (!hero) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Modal Card */}
            <motion.div
              className="no-scrollbar bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.8, y: 50, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, opacity: 0, rotateX: -15 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.4 
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: `linear-gradient(135deg, ${hero.color}15 0%, white 30%, white 70%, ${hero.color}15 100%)`
              }}
            >
              {/* Header with colored accent */}
              <div 
                className="h-2 w-full rounded-t-3xl"
                style={{ backgroundColor: hero.color }}
              />

              {/* Close button */}
              <motion.button
                onClick={handleModalClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <Icon icon="mdi:close" className="w-5 h-5" />
              </motion.button>

              {/* Video Button - positioned near the image */}
              {hero.video && (
                <motion.button
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all z-10"
                  style={{ 
                    backgroundColor: hero.color,
                    boxShadow: `0 4px 15px ${hero.color}40`
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `0 6px 20px ${hero.color}50`
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Watch historical video"
                  title="Watch Historical Video"
                >
                  <Icon icon="mdi:play" className="w-5 h-5 ml-0.5" />
                </motion.button>
              )}

              <div className="p-6 sm:p-8">
                {/* Hero Image with enhanced styling */}
                {hero.image && (
                  <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div 
                      className="relative p-1 rounded-2xl shadow-lg"
                      style={{ 
                        background: `linear-gradient(45deg, ${hero.color}, ${hero.color}80)` 
                      }}
                    >
                      <motion.img
                        src={hero.image}
                        alt={hero.name}
                        className="max-h-48 sm:max-h-64 w-auto object-cover rounded-xl bg-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      {/* Video indicator on image */}
                      {hero.video && (
                        <motion.div
                          onClick={() => setIsVideoOpen(true)}
                          className="absolute inset-0 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center cursor-pointer transition-all group"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Icon icon="mdi:play" className="w-6 h-6 text-gray-800 ml-0.5" />
                          </motion.div>
                        </motion.div>
                      )}
                      {/* Decorative frame corner */}
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
                        style={{ backgroundColor: hero.color }}
                      >
                        <Icon icon="mdi:star" className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Video Section Info */}
                {hero.video && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-center mb-4"
                  >
                    <motion.button
                      onClick={() => setIsVideoOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={{ 
                        backgroundColor: `${hero.color}15`,
                        color: hero.color,
                        border: `1px solid ${hero.color}30`
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: `${hero.color}25`
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon="mdi:video-outline" className="w-4 h-4" />
                      Watch History of {hero.name}
                    </motion.button>
                  </motion.div>
                )}

                {/* Hero Basic Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <h2 
                    id="modal-title"
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{ color: hero.color }}
                  >
                    {hero.name}
                  </h2>
                  <p className="text-lg text-gray-600 font-medium mb-2">
                    {hero.title}
                  </p>
                  <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:calendar" className="w-4 h-4" />
                      <span>Born {hero.birthYear}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:flag" className="w-4 h-4" />
                      <span>Philippine Hero</span>
                    </div>
                  </div>
                </motion.div>

                {/* Key Contribution Highlight */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <div 
                    className="rounded-2xl p-4 border-l-4"
                    style={{ 
                      borderColor: hero.color,
                      backgroundColor: `${hero.color}10`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: hero.color }}
                      >
                        <Icon icon="mdi:medal" className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Key Contribution
                        </h3>
                        <p className="text-gray-700 text-sm">
                          {hero.keyContribution}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Biography */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="mdi:book-open-page-variant" className="w-5 h-5 text-gray-600" />
                    Biography
                  </h3>
                  <p id="modal-description" className="text-gray-700 leading-relaxed">
                    {hero.bio}
                  </p>
                </motion.div>

                {/* Legacy Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="mdi:trophy" className="w-5 h-5 text-gray-600" />
                    Legacy
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {hero.legacy}
                    </p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 justify-end"
                >
                  <motion.button
                    onClick={handleModalClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                    Close
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      alert(`More resources about ${hero.name} coming soon!`)
                    }
                    className="px-6 py-3 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
                    style={{ 
                      backgroundColor: hero.color,
                      boxShadow: `0 4px 20px ${hero.color}40`
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 6px 25px ${hero.color}50`
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon icon="mdi:school" className="w-4 h-4" />
                    Learn More
                  </motion.button>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div 
                className="absolute top-3 left-3 w-6 h-6 rounded-full opacity-20 pointer-events-none"
                style={{ backgroundColor: hero.color }}
              />
              <div 
                className="absolute bottom-3 right-8 w-4 h-4 rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: hero.color }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        video={hero?.video}
        heroColor={hero?.color}
        onVideoPlayingChange={onVideoPlayingChange}
      />
    </>
  );
};

export default ArtifactModal;