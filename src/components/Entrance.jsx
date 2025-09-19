import React from "react";
import { useNavigate } from "react-router-dom";
import entranceBg from "../assets/images/entrance.png";
import arrowLeft from "../assets/images/right-navigation.png"; // your blue arrow
import arrowRight from "../assets/images/left-navigation.png"; // mirrored version

const Entrance = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${entranceBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Left Arrow (Image) */}
      <button
        onClick={() => navigate("/virtual-tour")}
        className="group absolute left-32 bottom-20 transform -rotate-12 hover:scale-110 transition"
      >
        <img
          src={arrowRight}
          alt="Go to National Heroes"
          className="w-32 drop-shadow-[0_0_15px_rgba(255,255,0,0.7)] animate-pulse"
        />
        
        <p className="absolute left-1/2 top-full mt-3 -translate-x-1/2 text-yellow-300 text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          National Heroes
        </p>
      </button>

      {/* Right Arrow (Image) */}
      <button
        onClick={() => navigate("/art-facts")}
        className="group absolute right-32 bottom-20 transform rotate-12 hover:scale-110 transition"
      >
        <img
          src={arrowLeft}
          alt="Go to Artifacts"
          className="w-32 drop-shadow-[0_0_15px_rgba(255,255,0,0.7)] animate-pulse"
        />
        
        <p className="absolute left-1/2 top-full mt-3 -translate-x-1/2 text-yellow-300 text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Artifacts
        </p>
      </button>
    </div>
  );
};

export default Entrance;
