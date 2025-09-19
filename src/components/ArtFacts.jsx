import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import ArtfactsModal from "./ArtifactModal";
import { Icon } from '@iconify/react';
import { renderToStaticMarkup } from "react-dom/server";

const ArtFacts = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hotspotCount, setHotspotCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(75);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("Pre-Colonial Treasures Room");

  const audioRef = useRef(null);
  const guideAudioRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const isMusicPlayingRef = useRef(isMusicPlaying);
  const isVideoPlayingRef = useRef(isVideoPlaying);

  
  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  
  useEffect(() => {
    const unlockAudio = () => {
      const testAudio = new Audio();
      testAudio.muted = true;
      testAudio.play().finally(() => {
        if (isMusicPlayingRef.current && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
        console.log("✅ Audio unlocked");
      });
    };
    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
  }, []);

  // Auto-hide controls - MODIFIED to not hide in fullscreen
  useEffect(() => {
    const resetControlsTimeout = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      
      // Don't auto-hide controls when in fullscreen mode
      if (!isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          if (!showShareMenu) setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => resetControlsTimeout();
    const handleTouchStart = () => resetControlsTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);

    resetControlsTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [showShareMenu, isFullscreen]); // Added isFullscreen dependency

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenState = !!document.fullscreenElement;
      setIsFullscreen(fullscreenState);
      
      // Show controls when entering fullscreen, keep them visible
      if (fullscreenState) {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  //  Scene setup (runs once) 
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    //  Scene & Camera 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      zoomLevel,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const SPHERE_RADIUS = 50;
    const HOTSPOT_RADIUS = SPHERE_RADIUS - 1;
    const yawOffsetDeg = 0;

    const anglesToVec3 = (yawDeg, pitchDeg, radius = HOTSPOT_RADIUS) => {
      const phi = THREE.MathUtils.degToRad(90 - pitchDeg);
      const theta = THREE.MathUtils.degToRad(yawDeg + yawOffsetDeg);
      const sinPhi = Math.sin(phi);
      const x = radius * sinPhi * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * sinPhi * Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    };

    const vec3ToAngles = (v) => {
      const r = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      const phi = Math.acos(v.y / r);
      const theta = Math.atan2(v.z, v.x);
      const pitch = 90 - THREE.MathUtils.radToDeg(phi);
      const yaw = THREE.MathUtils.radToDeg(theta) - yawOffsetDeg;
      return { yaw, pitch };
    };

    // Panorama background 
    let panoSphere = null;
    const loader = new THREE.TextureLoader();
    loader.load(
      "/assets/artfacts2.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        panoSphere = new THREE.Mesh(geometry, material);
        scene.add(panoSphere);
        setIsLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading panorama:', error);
        setIsLoading(false);
      }
    );

    //  Hotspot definitions for Artifacts (FIXED)
    const hotspotDefs = [
      // Golden Tara of Agusan
      { yaw: 95, pitch: 18, label: "Artifact 1", audio: "/assets/audio/artifact1.mp3" },
      // Butuan Balangay
      { yaw: 298.5, pitch: 13, label: "Artifact 2", audio: "/assets/audio/artifact2.mp3" },
      //Manunggul Jar
      { yaw: -13, pitch: 0, label: "Artifact 3", audio: "/assets/audio/artifact3.mp3" },
      // Calatagan Pot
      { yaw: 178, pitch: 5, label: "Artifact 4", audio: "/assets/audio/artifact4.mp3" },
      // Lingling-o Ornaments
      { yaw: 216, pitch: 0, label: "Artifact 5", audio: "/assets/audio/artifact5.mp3" },
      // Laguna Copperplate Inscription
      { yaw: 35, pitch: 17.5, label: "Artifact 6", audio: "/assets/audio/artifact6.mp3" },
    ];

    setHotspotCount(hotspotDefs.length);

    const hotspotMeshes = [];
    const makeHotspot = ({ yaw, pitch, label, audio }) => {
      const pos = anglesToVec3(yaw, pitch);
      
      // glowing ring effect
      const geometry = new THREE.RingGeometry(0.5, 1.5, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.position.copy(pos);
      ring.lookAt(camera.position);
      
      ring.userData = { 
        label, 
        audio, 
        baseScale: 1,
        pulsePhase: Math.random() * Math.PI * 2 
      };
      
      scene.add(ring);
      hotspotMeshes.push(ring);

      // info icon
      const iconTexture = new THREE.TextureLoader().load("/assets/icons/info.png");
      const iconMaterial = new THREE.SpriteMaterial({
        map: iconTexture,
        transparent: true,
        opacity: 0.9,
      });
      const iconSprite = new THREE.Sprite(iconMaterial);
      iconSprite.position.copy(pos);
      iconSprite.scale.set(2, 2, 1);
      iconSprite.userData = { label, audio, isIcon: true };
      scene.add(iconSprite);
      hotspotMeshes.push(iconSprite);
    };
    hotspotDefs.forEach(makeHotspot);

    //  Raycasting 
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const pick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
    };

    const onClick = (event) => {
      pick(event);

      if (event.shiftKey && panoSphere) {
        const hit = raycaster.intersectObject(panoSphere, false)[0];
        if (hit) {
          const { yaw, pitch } = vec3ToAngles(hit.point);
          console.log(`Hotspot angles -> yaw: ${yaw.toFixed(2)}°, pitch: ${pitch.toFixed(2)}°`);
        }
        return;
      }

      const intersects = raycaster.intersectObjects(hotspotMeshes, false);
      if (intersects.length > 0) {
        const { label, audio } = intersects[0].object.userData;
        setSelectedArtifact({ label });

        if (guideAudioRef.current) {
          guideAudioRef.current.pause();
          guideAudioRef.current.currentTime = 0;
        }

        guideAudioRef.current = new Audio(audio);

        // Pause background music when guide audio plays
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }

        guideAudioRef.current.play().catch((err) => {
          console.warn("Guide audio blocked:", err);
        });

        // FIXED: Use ref to get current states (not captured in closure)
        guideAudioRef.current.onended = () => {
          // Only resume background music if user wants it AND no video is playing
          if (audioRef.current && isMusicPlayingRef.current && !isVideoPlayingRef.current) {
            audioRef.current.play().catch((err) => {
              console.warn("Background music resume blocked:", err);
            });
          }
        };
      }
    };
    renderer.domElement.addEventListener("click", onClick);

    //  Camera rotation 
    let isRotating = false;
    let previousPointer = { x: 0, y: 0 };
    let phi = 0;
    let theta = 0;

    const getPointer = (e) =>
      e.touches?.length
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const onPointerStart = (e) => {
      isRotating = true;
      previousPointer = getPointer(e);
      setShowInstructions(false);
    };

    const onPointerMove = (e) => {
      if (!isRotating) return;
      const p = getPointer(e);
      const dx = p.x - previousPointer.x;
      const dy = p.y - previousPointer.y;
      theta -= dx * 0.002;
      phi -= dy * 0.002;
      phi = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, phi));
      previousPointer = p;
    };

    const onPointerEnd = () => (isRotating = false);

    renderer.domElement.addEventListener("mousedown", onPointerStart);
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerEnd);
    renderer.domElement.addEventListener("touchstart", onPointerStart);
    renderer.domElement.addEventListener("touchmove", onPointerMove);
    renderer.domElement.addEventListener("touchend", onPointerEnd);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.002;
      hotspotMeshes.forEach((hotspot, index) => {
        if (!hotspot.userData.isIcon) {
          const phase = hotspot.userData.pulsePhase + time;
          const scale = 1 + Math.sin(phase) * 0.2;
          hotspot.scale.setScalar(scale);
          
          const hue = (time + index * 0.5) % 1;
          hotspot.material.color.setHSL(0.55 + hue * 0.1, 0.8, 0.6);
        }
      });
      
      camera.rotation.order = "YXZ";
      camera.rotation.y = theta;
      camera.rotation.x = phi;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousedown", onPointerStart);
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerEnd);
      renderer.domElement.removeEventListener("touchstart", onPointerStart);
      renderer.domElement.removeEventListener("touchmove", onPointerMove);
      renderer.domElement.removeEventListener("touchend", onPointerEnd);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = zoomLevel;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoomLevel]);

  // Background music effect - mute when video is playing
  useEffect(() => {
    if (!audioRef.current) return;
  
    // Mute if video is playing OR user has muted manually
    if (isMusicPlaying && !isVideoPlaying) {
      // Try to play only if music should be playing and no video is playing
      audioRef.current.play().catch(() => {
        console.log("Background music blocked until user interaction.");
      });
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying, isVideoPlaying]);

  // Function definitions
  const zoomIn = () => {
    setZoomLevel(prev => Math.max(30, prev - 10));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.min(120, prev + 10));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: 'mdi:link-variant',
      color: 'text-blue-600',
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          // You could add a toast notification here
          console.log('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share via Email',
      icon: 'mdi:email-outline',
      color: 'text-red-600',
      action: () => {
        const subject = encodeURIComponent('Amazing Virtual Museum Tour');
        const body = encodeURIComponent(`Check out this incredible virtual tour of Pre-Colonial Philippine artifacts!\n\n${window.location.href}\n\nExplore ancient treasures and learn about our rich cultural heritage.`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share on Facebook',
      icon: 'mdi:facebook',
      color: 'text-blue-700',
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share on Twitter',
      icon: 'mdi:twitter',
      color: 'text-blue-500',
      action: () => {
        const text = encodeURIComponent('Exploring Pre-Colonial Philippine artifacts in this amazing virtual museum tour!');
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share on WhatsApp',
      icon: 'mdi:whatsapp',
      color: 'text-green-600',
      action: () => {
        const text = encodeURIComponent(`Check out this virtual museum tour: ${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        setShowShareMenu(false);
      }
    },
    {
      name: 'Native Share',
      icon: 'mdi:share-variant',
      color: 'text-purple-600',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Virtual Museum Tour - Pre-Colonial Treasures',
            text: 'Explore amazing Pre-Colonial Philippine artifacts in this virtual tour!',
            url: window.location.href
          }).catch((err) => console.error('Share failed:', err));
        } else {
          console.log('Native sharing not supported');
        }
        setShowShareMenu(false);
      }
    }
  ];

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const handleVideoPlayingChange = (isPlaying) => {
    setIsVideoPlaying(isPlaying);
    console.log(isPlaying ? "Video started - background audio muted" : "Video stopped - background audio available");
  };

  const handleCloseModal = () => {
    setSelectedArtifact(null);

    if (guideAudioRef.current) {
      guideAudioRef.current.pause();
      guideAudioRef.current.currentTime = 0;
      guideAudioRef.current = null;
    }

    // FIXED: Only resume background music if it should be playing AND no video is playing
    if (audioRef.current && isMusicPlaying && !isVideoPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Background music resume blocked:", err);
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading Virtual Tour...</p>
          </div>
        </div>
      )}

      {/* Controls: Zoom, Home, Minus */}
      <div className={`px-[30px] absolute top-4 right-4 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-[#5A536E] bg-opacity-80 backdrop-blur-md rounded-full px-8 py-4 flex items-center space-x-[24px]">
          {/* Zoom In */}
          <button
            onClick={zoomIn}
            className="text-white hover:text-gray-300 transition-all"
            title="Zoom In"
          >
            <Icon icon="humbleicons:plus" className="w-7 h-7  p-1 rounded-full border border-white" />
          </button>
          
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300 transition-all"
            title="Home"
          >
            <Icon icon="uiw:home" className="w-6 h-6" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            className="text-white hover:text-gray-300 transition-all"
            title="Zoom Out"
          >
            <Icon icon="akar-icons:minus" className="w-7 h-7  p-1 rounded-full border border-white" />
          </button>
        </div>
      </div>

      {/* Room Info */}
      <div className={`absolute bottom-4 left-4 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-3">
          {/* Audio Toggle */}
          <button
            onClick={toggleMusic}
            className="w-12 h-12 bg-[#5A536E] bg-opacity-80 backdrop-blur-md text-white rounded-full hover:bg-opacity-70 transition-all flex items-center justify-center"
            title={isMusicPlaying ? "Mute Audio" : "Play Audio"}
          >
            <Icon 
              icon={isMusicPlaying ? "iconoir:sound-low-solid" : "mdi:volume-mute"} 
              className="w-6 h-6" 
            />
          </button>

          {/* Room Name */}
          <div className="bg-[#5A536E] bg-opacity-80 backdrop-blur-md text-white px-6 py-4 rounded-r-full border-l-4 border-[#00B4FF] flex items-center">
            <span className="text-m font-medium">{currentRoom}</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-[#5A536E] bg-opacity-80 backdrop-blur-md rounded-full px-0 py-1 flex items-center justify-between min-w-[250px]">
          {/* Previous */}
          <button className="text-white hover:text-gray-300 transition-colors"
          onClick={() => navigate("/entrance")}
          >
            <Icon icon="mdi:chevron-left" className="w-12 h-12" />
          </button>
          
          <div className="grid grid-cols-2 gap-1 mx-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-sm ${i === 1 ? 'bg-white' : 'bg-white bg-opacity-50'}`}></div>
            ))}
          </div>
          
          {/* Next */}
          <button className="text-white hover:text-gray-300 transition-colors"
          onClick={() => navigate("/art-facts")}
          >
            <Icon icon="mdi:chevron-right" className="w-12 h-12" />
          </button>
        </div>
      </div>

      {/* Fullscreen and Share */}
      <div className={`absolute bottom-4 right-4 flex items-center space-x-2 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-12 h-12 bg-[#5A536E] bg-opacity-80 backdrop-blur-md text-white rounded-full hover:bg-opacity-70 transition-all flex items-center justify-center"
          title="Toggle Fullscreen"
        >
          <Icon 
            icon={isFullscreen ? "mdi:fullscreen-exit" : "gridicons:fullscreen"} 
            className="w-7 h-7" 
          />
        </button>

        {/* Share Menu */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-12 h-12 bg-[#5A536E] bg-opacity-80 backdrop-blur-md text-white rounded-full hover:bg-opacity-70 transition-all flex items-center justify-center"
            title="Share"
          >
            <Icon icon="fluent:share-48-filled" className="w-6 h-6" />
          </button>

          {showShareMenu && (
            <div className="absolute right-0 bottom-full mb-2 z-50">
              {/* Arrow pointer */}
              <div className="absolute bottom-0 right-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
              </div>
              
              {/* Menu container */}
              <div className="bg-white rounded-xl shadow-2xl py-3 min-w-[280px] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                {/* Header */}
                <div className="px-4 pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Icon icon="mdi:share-variant" className="w-5 h-5 mr-2 text-gray-600" />
                    Share this tour
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Spread the wonder of Philippine heritage</p>
                </div>
                
                {/* Share options */}
                <div className="py-2">
                  {shareOptions
                    .filter(option => {
                      // Only show Native Share if supported
                      if (option.name === 'Native Share') {
                        return navigator.share;
                      }
                      return true;
                    })
                    .map((option, index) => (
                    <button
                      key={index}
                      onClick={option.action}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 flex items-center space-x-3 transition-all duration-150 group"
                    >
                      <div className="flex-shrink-0">
                        <Icon 
                          icon={option.icon} 
                          className={`w-5 h-5 ${option.color} group-hover:scale-110 transition-transform duration-150`} 
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                          {option.name}
                        </span>
                      </div>
                      <Icon 
                        icon="mdi:chevron-right" 
                        className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-150" 
                      />
                    </button>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="px-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Help preserve Philippine cultural heritage
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 360 Viewer */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      />

      {/* Background Music */}
      <audio ref={audioRef} src="/assets/echoes-of-the-forest-228395.mp3" loop />

      {/* Artifact Modal */}
      <ArtfactsModal
        isOpen={!!selectedArtifact}
        artifact={selectedArtifact}
        onClose={handleCloseModal}
        onVideoPlayingChange={handleVideoPlayingChange}
      />

      {/* close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default ArtFacts;