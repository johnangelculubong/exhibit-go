// src/components/VirtualTour.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import ArtifactModal from "./ArtifactModal";

const VirtualTour = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const audioRef = useRef(null); // background music
  const guideAudioRef = useRef(null); // artifact narration audio

  // ---- Scene setup (runs once) ----
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ---- Scene & Camera ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

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

    // ---- Panorama background ----
    let panoSphere = null;
    const loader = new THREE.TextureLoader();
    loader.load("/assets/Hall5.jpg", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      panoSphere = new THREE.Mesh(geometry, material);
      scene.add(panoSphere);
    });

    // ---- Hotspot definitions ----
    const hotspotDefs = [
      { yaw: 242.5, pitch: -3, label: "Hero 1", audio: "/assets/audio/hero1.mp3" },
      { yaw: 293.5, pitch: -2.5, label: "Hero 2", audio: "/assets/audio/hero2.mp3" },
      { yaw: -8, pitch: 0, label: "Hero 3", audio: "/assets/audio/hero3.mp3" },
      { yaw: 18, pitch: -3, label: "Hero 4", audio: "/assets/audio/hero4.mp3" },
      { yaw: 80, pitch: -2, label: "Hero 5", audio: "/assets/audio/hero5.mp3" },
      { yaw: 127, pitch: -3.5, label: "Hero 6", audio: "/assets/audio/hero6.mp3" },
    ];

    // ---- Hotspot creation ----
    const hotspotMeshes = [];
    const makeHotspot = ({ yaw, pitch, label, audio }) => {
      const pos = anglesToVec3(yaw, pitch);
      const texture = new THREE.TextureLoader().load("/assets/icons/info.png");
      const material = new THREE.SpriteMaterial({
        map: texture,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(pos);
      sprite.scale.set(4, 4, 1);
      sprite.userData = { label, audio };
      scene.add(sprite);
      hotspotMeshes.push(sprite);
    };
    hotspotDefs.forEach(makeHotspot);

    // ---- Raycasting ----
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

        // ✅ Stop any existing narration before starting a new one
        if (guideAudioRef.current) {
          guideAudioRef.current.pause();
          guideAudioRef.current.currentTime = 0;
        }

        // Start new narration
        guideAudioRef.current = new Audio(audio);

        // Pause background music while narration plays
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

    // ---- Camera rotation ----
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
  }, []); // ✅ run once

  // ---- Background music effect ----
  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  // ---- Toggle background music ----
  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  // ---- Handle modal close ----
  const handleCloseModal = () => {
    setSelectedArtifact(null);

    // ✅ Stop narration immediately when modal closes
    if (guideAudioRef.current) {
      guideAudioRef.current.pause();
      guideAudioRef.current.currentTime = 0;
      guideAudioRef.current = null;
    }

    // ✅ Resume background music if enabled
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.play();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* BACK button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-white text-black font-semibold rounded shadow hover:bg-gray-200 z-20"
      >
        ← Back
      </button>

      {/* MUSIC TOGGLE */}
      <button
        onClick={toggleMusic}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-black font-semibold rounded shadow hover:bg-gray-200 z-20"
      >
        {isMusicPlaying ? "🔇 Mute" : "🔊 Play"}
      </button>

      {/* 360 Viewer */}
      <div
        ref={containerRef}
        id="virtual-tour"
        className="w-full h-full"
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
    </div>
  );
};

export default VirtualTour;
