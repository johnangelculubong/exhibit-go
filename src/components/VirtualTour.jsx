import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import ArtifactModal from "./ArtifactModal";
import { Icon } from '@iconify/react';
import { renderToStaticMarkup } from "react-dom/server";

const VirtualTour = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hotspotCount, setHotspotCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(75);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("The Reform Room");

  const audioRef = useRef(null);
  const guideAudioRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls 
  useEffect(() => {
    const resetControlsTimeout = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showShareMenu) setShowControls(false);
      }, 3000);
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
  }, [showShareMenu]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
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
      "/assets/Hall5.jpg",
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

    //  Hotspot definitions 
    const hotspotDefs = [
      { yaw: 242.5, pitch: -3, label: "Hero 1", audio: "/assets/audio/hero1.mp3" },
      { yaw: 293.5, pitch: -2.5, label: "Hero 2", audio: "/assets/audio/hero2.mp3" },
      { yaw: -8, pitch: 0, label: "Hero 3", audio: "/assets/audio/hero3.mp3" },
      { yaw: 18, pitch: -3, label: "Hero 4", audio: "/assets/audio/hero4.mp3" },
      { yaw: 80, pitch: -2, label: "Hero 5", audio: "/assets/audio/hero5.mp3" },
      { yaw: 127, pitch: -3.5, label: "Hero 6", audio: "/assets/audio/hero6.mp3" },
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

        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }

        guideAudioRef.current.play();

        guideAudioRef.current.onended = () => {
          if (audioRef.current && isMusicPlaying) {
            audioRef.current.play();
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

  // Background music effect
  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.max(30, prev - 10));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.min(120, prev + 10));
  };

  // Fullscreen functions
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Share functions
  const shareOptions = [
    {
      name: 'Copy Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share via Email',
      icon: '📧',
      action: () => {
        window.open(`mailto:?subject=Virtual Tour&body=Check out this virtual tour: ${window.location.href}`);
        setShowShareMenu(false);
      }
    },
    {
      name: 'Share on Social',
      icon: '📱',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Virtual Tour',
            url: window.location.href
          });
        }
        setShowShareMenu(false);
      }
    }
  ];

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const handleCloseModal = () => {
    setSelectedArtifact(null);

    if (guideAudioRef.current) {
      guideAudioRef.current.pause();
      guideAudioRef.current.currentTime = 0;
      guideAudioRef.current = null;
    }

    if (audioRef.current && isMusicPlaying) {
      audioRef.current.play();
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
        <div className="bg-[#5A536E] bg-opacity-80 backdrop-blur-md rounded-full px-6 py-2 flex items-center space-x-4">
          {/* Previous */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <Icon icon="mdi:chevron-left" className="w-8 h-8" />
          </button>
          
         
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-sm ${i === 1 ? 'bg-white' : 'bg-white bg-opacity-50'}`}></div>
            ))}
          </div>
          
          {/* Next */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <Icon icon="mdi:chevron-right" className="w-8 h-8" />
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
            <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg py-2 min-w-48 z-50">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                >
                  <Icon icon={option.icon} className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{option.name}</span>
                </button>
              ))}
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
      <audio ref={audioRef} src="/assets/echoes-of-the-forest-228395.mp3" autoPlay loop />

      {/* Artifact Modal */}
      <ArtifactModal
        isOpen={!!selectedArtifact}
        artifact={selectedArtifact}
        onClose={handleCloseModal}
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

export default VirtualTour;