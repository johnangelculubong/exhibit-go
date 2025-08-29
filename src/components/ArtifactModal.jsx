import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hero details 
const heroDetails = {
  "Hero 1": {
    name: "Andres Bonifacio",
    image: "/assets/heroes/andres.jpg",
    bio: "Known as the 'Father of the Philippine Revolution', he founded the Katipunan to fight Spanish rule.",
    legacy: "Symbol of courage and resistance; remembered every Bonifacio Day (Nov 30).",
  },
  "Hero 2": {
    name: "Emilio Aguinaldo",
    image: "/assets/heroes/Emilio.jpg",
    bio: "First President of the Philippines; declared independence from Spain on June 12, 1898.",
    legacy: "His leadership marked the birth of the First Philippine Republic.",
  },
  "Hero 3": {
    name: "Apolinario Mabini",
    image: "/assets/heroes/Apolinario.jpg",
    bio: "The 'Brains of the Revolution'; despite being paralyzed, he was Aguinaldo’s chief adviser.",
    legacy: "Advocate of good governance and people’s rights; his writings shaped Philippine democracy.",
  },
  "Hero 4": {
    name: "Antonio Luna",
    image: "/assets/heroes/Luna.jpg",
    bio: "General known for his military strategies and discipline during the Philippine–American War.",
    legacy: "Inspired future generations with his bravery and unyielding patriotism.",
  },
  "Hero 5": {
    name: "Melchora Aquino",
    image: "/assets/heroes/Melchora.jpg",
    bio: "Also called 'Tandang Sora'; she helped Katipuneros by giving them food, shelter, and medical care.",
    legacy: "Recognized as the 'Mother of the Revolution'.",
  },
  "Hero 6": {
    name: "Jose P. Rizal",
    image: "/assets/heroes/rizal.jpg",
    bio: "National Hero of the Philippines; his novels Noli Me Tangere and El Filibusterismo exposed Spanish abuses.",
    legacy: "Inspired Filipinos to unite for independence; executed on Dec 30, 1896.",
  },
};

const ArtifactModal = ({ isOpen, onClose, artifact }) => {
  if (!isOpen || !artifact) return null;

  const hero = heroDetails[artifact.label] || null;

  return (
    <AnimatePresence>
      {isOpen && hero && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Hero Image */}
            {hero.image && (
            <motion.div className="flex justify-center mb-4">
            <motion.img
              src={hero.image}
              alt={hero.name}
              className="max-h-64 sm:max-h-80 w-auto object-contain rounded-xl shadow"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
           />
         </motion.div>
         )}

            {/* Hero Info */}
            <h2 className="text-2xl font-bold mb-2">{hero.name}</h2>
            <p className="text-gray-700 mb-4">{hero.bio}</p>

            {/* Legacy Section */}
            <div className="bg-gray-100 p-3 rounded-xl">
              <h3 className="text-lg font-semibold mb-1">Legacy</h3>
              <p className="text-gray-600">{hero.legacy}</p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() =>
                  alert(`More resources about ${hero.name} coming soon!`)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtifactModal;
