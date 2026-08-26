import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClimateHotspot } from "../types";
import { Globe, Eye, Sparkles, ZoomIn, ZoomOut, RotateCcw, MapPin, Compass, Shield } from "lucide-react";

export const CLIMATE_HOTSPOTS: ClimateHotspot[] = [
  {
    id: "amazon",
    name: "Amazon Bio-Basin Canopy",
    region: "South America",
    lat: -3.4653,
    lng: -62.2159,
    type: "reforestation",
    title: "Global Oxygen & Carbon Sequestration Hub",
    metric: "123 Billion Metric Tons Carbon Stored",
    description: "The world's largest tropical rainforest absorbing ~2 billion metric tons of CO2 annually. Key priority for UN SDG 13 & 15 biodiversity preservation.",
    sdgTarget: "SDG 13.1 & 15.2 (Ecosystem Protection)",
  },
  {
    id: "sahara",
    name: "Noor Ouarzazate Solar Complex",
    region: "North Africa",
    lat: 30.9983,
    lng: -6.8617,
    type: "renewable",
    title: "World's Premier Concentrated Solar Facility",
    metric: "580 MW Clean Peak Capacity",
    description: "Cuts global carbon emissions by over 760,000 tonnes annually, powering over 2 million North African homes through concentrated parabolic solar arrays.",
    sdgTarget: "SDG 13.2 & 7.2 (Renewable Energy)",
  },
  {
    id: "northsea",
    name: "Dogger Bank Offshore Wind Mega-Grid",
    region: "North Sea / Europe",
    lat: 54.75,
    lng: 1.95,
    type: "renewable",
    title: "Largest Offshore Wind Array on Earth",
    metric: "3.6 GW Powering 6M Homes",
    description: "Harnessing fierce oceanic winds to displace 4.8M tonnes of coal & gas power emissions annually across the European grid.",
    sdgTarget: "SDG 13.a (Clean Energy Financing)",
  },
  {
    id: "arctic",
    name: "Svalbard Cryosphere Observatory",
    region: "Arctic Circle",
    lat: 78.2232,
    lng: 15.6267,
    type: "research",
    title: "Global Climate Albedo & Ice Telemetry",
    metric: "426.8 ppm CO2 Live Baseline",
    description: "Monitoring polar vortex shifts, permafrost carbon release, and Arctic albedo feedback mechanisms for the Intergovernmental Panel on Climate Change (IPCC).",
    sdgTarget: "SDG 13.3 (Climate Science & Early Warning)",
  },
  {
    id: "greatbarrier",
    name: "Coral Sea Carbon Sink & Reef Sanctuary",
    region: "Oceania",
    lat: -18.2871,
    lng: 147.6992,
    type: "conservation",
    title: "Marine Blue Carbon & Heat Dissipation",
    metric: "2,300 km Protected Marine Biosphere",
    description: "Pioneering heat-resilient coral breeding and coastal mangrove restoration that traps carbon 4x faster than terrestrial tropical forests.",
    sdgTarget: "SDG 13.1 & 14.2 (Marine Climate Resilience)",
  },
  {
    id: "tokyo",
    name: "Tokyo Hydrogen & Smart Zero-Grid Hub",
    region: "East Asia",
    lat: 35.6762,
    lng: 139.6503,
    type: "renewable",
    title: "Urban Decarbonization & Hydrogen Infrastructure",
    metric: "80% Net-Zero Municipal Target by 2030",
    description: "Mass-scale deployment of green hydrogen transport networks, building-integrated photovoltaics, and circular waste-to-energy closed systems.",
    sdgTarget: "SDG 13.2 (National Climate Action Strategies)",
  },
];

// Helper: Convert lat/lng to 3D Cartesian coordinates on sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Helper: Procedural high-resolution canvas texture for Earth
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Ocean Deep Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#081b33");
  oceanGrad.addColorStop(0.3, "#0d2b52");
  oceanGrad.addColorStop(0.5, "#0b2545");
  oceanGrad.addColorStop(0.7, "#0e3464");
  oceanGrad.addColorStop(1, "#061324");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continental Landforms generator with realistic topography shades
  const drawLand = (coords: [number, number][], fill: string, stroke = "rgba(46, 164, 79, 0.4)") => {
    ctx.beginPath();
    ctx.moveTo(coords[0][0] * 2, coords[0][1] * 2);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i][0] * 2, coords[i][1] * 2);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // Americas (North, Central, South)
  drawLand([
    [100, 100], [150, 70], [210, 80], [240, 110], [270, 130], [280, 170], [250, 200],
    [230, 215], [250, 240], [280, 270], [300, 310], [320, 370], [310, 420], [280, 470],
    [260, 440], [270, 390], [250, 340], [230, 290], [200, 260], [170, 220], [140, 190],
    [90, 160], [80, 130]
  ], "#1b4332", "#2d6a4f");

  // Greenland & Arctic Isles
  drawLand([
    [290, 40], [340, 35], [370, 50], [330, 75], [280, 65]
  ], "#e5e9f0", "#d8dee9");

  // Eurasia (Europe, Asia)
  drawLand([
    [480, 110], [520, 80], [580, 70], [660, 65], [740, 75], [820, 95], [890, 120],
    [920, 160], [880, 180], [830, 190], [790, 210], [740, 240], [700, 245], [640, 220],
    [590, 240], [560, 210], [510, 190], [470, 170], [450, 140]
  ], "#2d5a27", "#40916c");

  // Africa
  drawLand([
    [480, 210], [540, 200], [580, 230], [610, 270], [620, 320], [590, 370], [560, 420],
    [520, 450], [500, 420], [490, 360], [460, 310], [440, 260], [460, 220]
  ], "#386641", "#52b788");

  // Australia & New Zealand
  drawLand([
    [780, 340], [840, 330], [880, 360], [860, 410], [810, 430], [770, 390]
  ], "#6b705c", "#a5a58d");

  // Antarctica
  drawLand([
    [50, 480], [200, 490], [400, 485], [600, 490], [800, 485], [980, 490],
    [1020, 512], [0, 512]
  ], "#f8f9fa", "#e9ecef");

  // Add Latitude / Longitude Subtle Coordinate Grid
  ctx.strokeStyle = "rgba(46, 164, 79, 0.12)";
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Glowing city node clusters (green & gold accents)
  const drawNode = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const cities: [number, number][] = [
    [140, 130], [160, 140], [240, 270], [260, 350], [480, 130], [510, 120],
    [530, 150], [590, 180], [740, 160], [820, 170], [860, 160], [810, 380]
  ];
  cities.forEach(([cx, cy]) => {
    drawNode(cx, cy, 3, "rgba(255, 215, 0, 0.8)");
    drawNode(cx, cy, 6, "rgba(46, 164, 79, 0.4)");
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Helper: Procedural Clouds texture
function createProceduralCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft atmospheric cloud patches
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    const r = 25 + Math.random() * 45;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.55)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

interface ThreeEarthSpaceProps {
  onSelectHotspot?: (hotspot: ClimateHotspot) => void;
  className?: string;
}

export default function ThreeEarthSpace({
  onSelectHotspot,
  className = "w-full h-full min-h-[480px]",
}: ThreeEarthSpaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<ClimateHotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.0018);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Keep ref for Three objects to allow manual adjustments
  const controlsRef = useRef<{
    earthGroup: THREE.Group | null;
    camera: THREE.PerspectiveCamera | null;
    cloudsMesh: THREE.Mesh | null;
  }>({
    earthGroup: null,
    camera: null,
    cloudsMesh: null,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050c, 0.0012);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.8);
    controlsRef.current.camera = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Simulating Sun in Deep Space)
    const ambientLight = new THREE.AmbientLight(0x223344, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    blueRimLight.position.set(-5, -2, -3);
    scene.add(blueRimLight);

    const greenFillLight = new THREE.PointLight(0x2ea44f, 1.2, 20);
    greenFillLight.position.set(2, 4, 3);
    scene.add(greenFillLight);

    // 4. Starfield Particles (Thousands of deep space stars)
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 30 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Star tint variation (cyan, white, emerald, gold)
      const rVal = Math.random();
      if (rVal > 0.7) {
        starColors[i * 3] = 0.5;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      } else if (rVal > 0.4) {
        starColors[i * 3] = 0.3;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.6;
      } else {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 1.0;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Earth Parent Group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = 23.4 * (Math.PI / 180); // Earth axial tilt!
    scene.add(earthGroup);
    controlsRef.current.earthGroup = earthGroup;

    // 6. Earth Base Mesh
    const earthRadius = 1.5;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthTexture = createProceduralEarthTexture();

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // 7. Clouds Layer Mesh (Slightly larger sphere)
    const cloudsGeometry = new THREE.SphereGeometry(earthRadius + 0.02, 48, 48);
    const cloudsTexture = createProceduralCloudsTexture();
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(cloudsMesh);
    controlsRef.current.cloudsMesh = cloudsMesh;

    // 8. Atmospheric Halo / Glow Mesh (Backside Fresnel effect)
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 0.08, 36, 36);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.2, 0.65, 0.95, 1.0) * intensity * 1.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);

    // 9. Interactive Climate Hotspots (3D glowing pins)
    const pinGroup = new THREE.Group();
    const pinMeshes: { mesh: THREE.Mesh; hotspot: ClimateHotspot }[] = [];

    CLIMATE_HOTSPOTS.forEach((hotspot) => {
      const pos = latLngToVector3(hotspot.lat, hotspot.lng, earthRadius + 0.025);
      
      // Pin marker geometry
      const markerGeom = new THREE.SphereGeometry(0.045, 16, 16);
      const markerColor = hotspot.type === "renewable" ? 0x38bdf8 : hotspot.type === "reforestation" ? 0x2ea44f : 0xf59e0b;
      const markerMat = new THREE.MeshStandardMaterial({
        color: markerColor,
        emissive: markerColor,
        emissiveIntensity: 1.5,
      });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = { hotspot };

      // Halo ring around marker
      const ringGeom = new THREE.RingGeometry(0.05, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markerMesh.add(ringMesh);

      pinGroup.add(markerMesh);
      pinMeshes.push({ mesh: markerMesh, hotspot });
    });
    earthGroup.add(pinGroup);

    // 10. Mouse Interaction & Raycasting for Hotspots and Drag-to-Rotate
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && earthGroup) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        earthGroup.rotation.y += deltaX * 0.005;
        earthGroup.rotation.x += deltaY * 0.005;

        // Clamp x rotation so earth doesn't flip
        earthGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, earthGroup.rotation.x));
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinGroup.children, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj && !currentObj.userData?.hotspot && currentObj.parent) {
          currentObj = currentObj.parent;
        }
        if (currentObj?.userData?.hotspot) {
          const hp: ClimateHotspot = currentObj.userData.hotspot;
          setSelectedHotspot(hp);
          if (onSelectHotspot) {
            onSelectHotspot(hp);
          }
        }
      }
    };

    // Zoom on Wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.8, Math.min(8.0, camera.position.z + e.deltaY * 0.002));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("click", onClick);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    // Touch support for mobile
    let touchStartPos = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1 && earthGroup) {
        const deltaX = e.touches[0].clientX - touchStartPos.x;
        const deltaY = e.touches[0].clientY - touchStartPos.y;
        earthGroup.rotation.y += deltaX * 0.006;
        earthGroup.rotation.x += deltaY * 0.006;
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    domElement.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // 11. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 12. Main Render Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation when not manually dragging
      if (autoRotate && !isDragging) {
        earthGroup.rotation.y += rotationSpeed;
        if (cloudsMesh) {
          cloudsMesh.rotation.y += rotationSpeed * 1.35; // Clouds travel faster
        }
      }

      // Starfield subtle rotation in deep space
      starField.rotation.y += 0.00015;

      // Pulse pin halos
      pinMeshes.forEach(({ mesh }, idx) => {
        const ring = mesh.children[0] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(time * 3 + idx) * 0.25;
          ring.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 13. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("click", onClick);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      // Dispose Three resources
      starGeometry.dispose();
      starMaterial.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      cloudsTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, [autoRotate, rotationSpeed]);

  const handleZoom = (delta: number) => {
    if (controlsRef.current.camera) {
      controlsRef.current.camera.position.z = Math.max(
        2.8,
        Math.min(7.5, controlsRef.current.camera.position.z + delta)
      );
    }
  };

  const handleResetPosition = () => {
    if (controlsRef.current.earthGroup) {
      controlsRef.current.earthGroup.rotation.set(0, 0, 23.4 * (Math.PI / 180));
    }
    if (controlsRef.current.camera) {
      controlsRef.current.camera.position.set(0, 0, 4.8);
    }
  };

  return (
    <div className={`relative overflow-hidden select-none bg-[#02050c] rounded-2xl border border-[#30363d]/60 shadow-2xl ${className}`}>
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Overlays */}
      {/* Top Left: Live Earth Status & SDG 13 Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#161b22]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#30363d] shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2ea44f] animate-ping" />
          <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#2ea44f]" /> 3D Earth Telemetry Active
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#0d1117]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#30363d]/60 text-[10px] text-gray-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Click glowing pins to inspect SDG 13 global hubs</span>
        </div>
      </div>

      {/* Top Right: Interactive 3D Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#161b22]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#30363d] shadow-lg">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            autoRotate
              ? "bg-[#2ea44f]/20 text-[#2ea44f] border border-[#2ea44f]/40"
              : "bg-[#21262d] text-gray-300 hover:bg-[#30363d]"
          }`}
          title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{autoRotate ? "Revolving" : "Paused"}</span>
        </button>

        <div className="h-4 w-[1px] bg-[#30363d]" />

        <button
          onClick={() => handleZoom(-0.6)}
          className="p-1.5 text-gray-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(0.6)}
          className="p-1.5 text-gray-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetPosition}
          className="p-1.5 text-gray-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-colors"
          title="Reset Orbit Position"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Hotspot Info Drawer (When a pin is clicked) */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-lg mx-auto bg-[#161b22]/95 backdrop-blur-xl border border-[#2ea44f]/40 p-4 rounded-xl shadow-2xl text-[#f0f6fc] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                selectedHotspot.type === "renewable" ? "bg-cyan-500/20 text-cyan-400" :
                selectedHotspot.type === "reforestation" ? "bg-emerald-500/20 text-emerald-400" :
                "bg-amber-500/20 text-amber-400"
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {selectedHotspot.name}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-[#21262d] text-gray-300 border border-[#30363d]">
                    {selectedHotspot.region}
                  </span>
                </h4>
                <p className="text-xs text-[#2ea44f] font-semibold">{selectedHotspot.title}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-[#21262d] hover:bg-[#30363d] rounded-md transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d]/70 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">Telemetry Milestone:</span>
            <span className="text-xs font-bold text-amber-300">{selectedHotspot.metric}</span>
          </div>

          <p className="mt-2.5 text-xs text-gray-300 leading-relaxed">
            {selectedHotspot.description}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#30363d] flex items-center justify-between text-[11px]">
            <span className="text-gray-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#2ea44f]" /> {selectedHotspot.sdgTarget}
            </span>
            <span className="text-emerald-400 font-semibold">Active UN SDG 13 Monitor</span>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center gap-2 text-[10px] text-gray-400/80 bg-[#0d1117]/60 px-3 py-1 rounded-full border border-white/5">
        <span>Drag to rotate Earth</span> • <span>Scroll to zoom</span> • <span>Click glowing hotspots</span>
      </div>
    </div>
  );
}
