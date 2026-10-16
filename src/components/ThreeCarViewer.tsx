import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCw, Eye, Sun, Sparkles, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface ThreeCarViewerProps {
  initialColor?: string;
  className?: string;
  interactive?: boolean;
}

export const ThreeCarViewer: React.FC<ThreeCarViewerProps> = ({
  initialColor = '#0a0a0c',
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [paintColor, setPaintColor] = useState<string>(initialColor);
  const [lightingPreset, setLightingPreset] = useState<'obsidian' | 'apex' | 'cyber'>('obsidian');
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References for mutable animation loop state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const paintMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const headlightMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Rotation target and velocity for silky smooth damped mouse drag
  const targetRotationY = useRef<number>(0.4);
  const targetRotationX = useRef<number>(0.1);
  const currentRotationY = useRef<number>(0.4);
  const currentRotationX = useRef<number>(0.1);
  const pointerStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startRot = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera target for smooth view switching
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(5.2, 2.2, 5.8));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x08090d);
    scene.fog = new THREE.FogExp2(0x08090d, 0.045);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.copy(targetCameraPos.current);
    cameraRef.current = camera;

    // 3. Renderer with PBR settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Room Environment for high-fidelity car reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.05).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Setup
    // Key Light
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.4);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    scene.add(keyLight);

    // Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0x2a3547, 0x0a0c10, 1.2);
    scene.add(hemiLight);

    // Aggressive Racing Red Rim / Backlight
    const rimLight = new THREE.DirectionalLight(0xef4444, 2.8);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Soft overhead softbox fill
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(0, 7, 0);
    scene.add(topLight);

    // 6. Ground Showroom Floor with subtle mirror reflections & contact shadow
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      roughness: 0.28,
      metalness: 0.65,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Soft Contact Shadow Plane directly under car
    const shadowGeo = new THREE.PlaneGeometry(5.4, 2.6);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 64, 10, 128, 64, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 128);

    const shadowTexture = new THREE.CanvasTexture(canvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    scene.add(contactShadow);

    // Floor showroom grid lines (subtle metallic rings)
    const gridGeo = new THREE.RingGeometry(3.6, 3.63, 64);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const gridRing = new THREE.Mesh(gridGeo, gridMat);
    gridRing.rotation.x = -Math.PI / 2;
    gridRing.position.y = 0.008;
    scene.add(gridRing);

    // 7. BUILD PROCEDURAL 3D HYPERCAR MODEL (Multi-part Composite Group)
    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);
    carGroupRef.current = carGroup;

    // Materials
    // A. Luxury High-Gloss Clearcoat Car Paint
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
    });
    paintMaterialRef.current = paintMaterial;

    // B. Carbon Fiber Aero Material
    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.3,
      roughness: 0.35,
    });

    // C. Optical Tinted Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050810,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 0.8,
      transparent: true,
      opacity: 0.88,
    });

    // D. Chrome / Brushed Metal Details
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.95,
      roughness: 0.15,
    });

    // E. Tire Rubber
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x121418,
      metalness: 0.05,
      roughness: 0.85,
    });

    // F. Brembo Calipers Racing Red
    const caliperMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.6,
      roughness: 0.25,
    });

    // G. LED Headlight Glowing Material
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x67e8f9,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });
    headlightMaterialsRef.current.push(headlightMaterial);

    // H. Rear OLED Lightbar Glowing Material
    const taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      emissive: 0xef4444,
      emissiveIntensity: 4.2,
      roughness: 0.1,
    });

    // 1. Lower Main Chassis & Sculpted Side Sills
    const chassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.95);
    // Bevel front and rear slightly
    const chassis = new THREE.Mesh(chassisGeo, paintMaterial);
    chassis.position.set(0, 0.42, 0);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);

    // Front Nose Wedge (aerodynamic drop)
    const noseGeo = new THREE.CylinderGeometry(0.85, 1.0, 0.8, 4);
    const nose = new THREE.Mesh(noseGeo, paintMaterial);
    nose.rotation.y = Math.PI / 4;
    nose.rotation.z = Math.PI / 2;
    nose.scale.set(0.4, 1.1, 1.8);
    nose.position.set(1.95, 0.38, 0);
    nose.castShadow = true;
    carGroup.add(nose);

    // 2. Cabin Cockpit Greenhouse (Curved aerodynamic canopy)
    const cabinGeo = new THREE.BoxGeometry(2.1, 0.52, 1.4);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(-0.15, 0.82, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Panel (Carbon finish)
    const roofGeo = new THREE.BoxGeometry(1.85, 0.08, 1.25);
    const roof = new THREE.Mesh(roofGeo, carbonMaterial);
    roof.position.set(-0.15, 1.1, 0);
    roof.castShadow = true;
    carGroup.add(roof);

    // Windshield frame / A-pillars
    const pillarGeo = new THREE.BoxGeometry(0.06, 0.55, 1.38);
    const aPillar = new THREE.Mesh(pillarGeo, carbonMaterial);
    aPillar.position.set(0.88, 0.82, 0);
    aPillar.rotation.z = -0.55;
    carGroup.add(aPillar);

    const cPillar = new THREE.Mesh(pillarGeo, carbonMaterial);
    cPillar.position.set(-1.18, 0.82, 0);
    cPillar.rotation.z = 0.5;
    carGroup.add(cPillar);

    // 3. Aggressive Front Splitter & Air Intakes (Carbon Fiber)
    const splitterGeo = new THREE.BoxGeometry(0.8, 0.06, 2.05);
    const splitter = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitter.position.set(2.05, 0.16, 0);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // Front Intake Grille Inserts
    const intakeGeo = new THREE.BoxGeometry(0.2, 0.22, 0.7);
    const intakeL = new THREE.Mesh(intakeGeo, carbonMaterial);
    intakeL.position.set(2.02, 0.32, 0.55);
    carGroup.add(intakeL);
    const intakeR = new THREE.Mesh(intakeGeo, carbonMaterial);
    intakeR.position.set(2.02, 0.32, -0.55);
    carGroup.add(intakeR);

    // 4. Rear Aerodynamic Diffuser & Exhausts
    const diffuserGeo = new THREE.BoxGeometry(0.9, 0.12, 1.9);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
    diffuser.position.set(-2.0, 0.22, 0);
    diffuser.rotation.z = 0.12;
    diffuser.castShadow = true;
    carGroup.add(diffuser);

    // Dual Twin Inconel Exhaust Tips
    const exhaustGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.25, 16);
    const exhaustMat = chromeMaterial;
    const exhaust1 = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust1.rotation.z = Math.PI / 2;
    exhaust1.position.set(-2.15, 0.44, 0.16);
    carGroup.add(exhaust1);
    const exhaust2 = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust2.rotation.z = Math.PI / 2;
    exhaust2.position.set(-2.15, 0.44, -0.16);
    carGroup.add(exhaust2);

    // 5. High-Downforce Rear Wing / Spoiler
    const wingGeo = new THREE.BoxGeometry(0.65, 0.05, 2.15);
    const wing = new THREE.Mesh(wingGeo, carbonMaterial);
    wing.position.set(-1.85, 1.08, 0);
    wing.rotation.z = -0.06;
    wing.castShadow = true;
    carGroup.add(wing);

    // Wing Stanchions (Uprights)
    const stanchionGeo = new THREE.BoxGeometry(0.35, 0.45, 0.04);
    const stanchionL = new THREE.Mesh(stanchionGeo, carbonMaterial);
    stanchionL.position.set(-1.8, 0.85, 0.55);
    carGroup.add(stanchionL);
    const stanchionR = new THREE.Mesh(stanchionGeo, carbonMaterial);
    stanchionR.position.set(-1.8, 0.85, -0.55);
    carGroup.add(stanchionR);

    // 6. Sculpted Side Aero Air Ducts
    const ductGeo = new THREE.BoxGeometry(1.2, 0.32, 0.14);
    const ductL = new THREE.Mesh(ductGeo, carbonMaterial);
    ductL.position.set(-0.4, 0.46, 0.98);
    carGroup.add(ductL);
    const ductR = new THREE.Mesh(ductGeo, carbonMaterial);
    ductR.position.set(-0.4, 0.46, -0.98);
    carGroup.add(ductR);

    // 7. Side Mirrors
    const mirrorStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
    const mirrorHousingGeo = new THREE.BoxGeometry(0.25, 0.12, 0.14);

    const mirrorL = new THREE.Group();
    const stemL = new THREE.Mesh(mirrorStemGeo, carbonMaterial);
    stemL.rotation.z = -0.4;
    const houseL = new THREE.Mesh(mirrorHousingGeo, paintMaterial);
    houseL.position.set(0, 0.12, 0.08);
    mirrorL.add(stemL);
    mirrorL.add(houseL);
    mirrorL.position.set(0.65, 0.76, 0.85);
    carGroup.add(mirrorL);

    const mirrorR = new THREE.Group();
    const stemR = new THREE.Mesh(mirrorStemGeo, carbonMaterial);
    stemR.rotation.z = -0.4;
    const houseR = new THREE.Mesh(mirrorHousingGeo, paintMaterial);
    houseR.position.set(0, 0.12, -0.08);
    mirrorR.add(stemR);
    mirrorR.add(houseR);
    mirrorR.position.set(0.65, 0.76, -0.85);
    carGroup.add(mirrorR);

    // 8. Razor LED Headlights (Left & Right)
    const hlGeo = new THREE.BoxGeometry(0.3, 0.05, 0.42);
    const hlL = new THREE.Mesh(hlGeo, headlightMaterial);
    hlL.position.set(1.98, 0.48, 0.72);
    hlL.rotation.y = -0.25;
    carGroup.add(hlL);

    const hlR = new THREE.Mesh(hlGeo, headlightMaterial);
    hlR.position.set(1.98, 0.48, -0.72);
    hlR.rotation.y = 0.25;
    carGroup.add(hlR);

    // Headlight Spotlights projecting onto the floor ahead
    const spotL = new THREE.SpotLight(0xa5f3fc, 8, 15, Math.PI / 6, 0.4, 1.2);
    spotL.position.set(2.0, 0.5, 0.7);
    spotL.target.position.set(8.0, 0, 1.0);
    scene.add(spotL);
    scene.add(spotL.target);
    spotLightsRef.current.push(spotL);

    const spotR = new THREE.SpotLight(0xa5f3fc, 8, 15, Math.PI / 6, 0.4, 1.2);
    spotR.position.set(2.0, 0.5, -0.7);
    spotR.target.position.set(8.0, 0, -1.0);
    scene.add(spotR);
    scene.add(spotR.target);
    spotLightsRef.current.push(spotR);

    // 9. Rear Continuous OLED Taillight Ribbon
    const tlGeo = new THREE.BoxGeometry(0.1, 0.05, 1.75);
    const tl = new THREE.Mesh(tlGeo, taillightMaterial);
    tl.position.set(-2.1, 0.62, 0);
    carGroup.add(tl);

    // 10. WHEELS & CALIPERS (4 Corners)
    const wheelPositions = [
      { x: 1.35, y: 0.34, z: 0.98, isFront: true },
      { x: 1.35, y: 0.34, z: -0.98, isFront: true },
      { x: -1.35, y: 0.36, z: 1.0, isFront: false },
      { x: -1.35, y: 0.36, z: -1.0, isFront: false },
    ];

    wheelsRef.current = [];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const radius = pos.isFront ? 0.35 : 0.37;
      const width = 0.28;

      // Tire Outer Ring
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
      const tire = new THREE.Mesh(tireGeo, tireMaterial);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Alloy Rim Center
      const rimGeo = new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, width * 1.02, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMaterial);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Brake Rotor Disc
      const rotorGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.04, 24);
      const rotor = new THREE.Mesh(rotorGeo, chromeMaterial);
      rotor.rotation.x = Math.PI / 2;
      rotor.position.z = pos.z > 0 ? -0.04 : 0.04;
      wheelGroup.add(rotor);

      // Brembo Caliper
      const caliperGeo = new THREE.BoxGeometry(0.12, 0.22, 0.08);
      const caliper = new THREE.Mesh(caliperGeo, caliperMaterial);
      caliper.position.set(0.14, 0.1, pos.z > 0 ? -0.05 : 0.05);
      wheelGroup.add(caliper);

      // Forged Spoke Details (5 Twin-Spokes)
      for (let s = 0; s < 5; s++) {
        const spokeGeo = new THREE.BoxGeometry(0.04, radius * 1.3, 0.03);
        const spoke = new THREE.Mesh(spokeGeo, carbonMaterial);
        spoke.rotation.z = (s * Math.PI) / 5;
        spoke.position.z = pos.z > 0 ? 0.08 : -0.08;
        wheelGroup.add(spoke);
      }

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    scene.add(carGroup);

    // Pre-warm WebGL compilation
    renderer.compile(scene, camera);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderTick = () => {
      animationFrameId = requestAnimationFrame(renderTick);
      const delta = clock.getDelta();

      // Auto rotation if enabled and not currently dragging
      if (autoRotate && !isDragging) {
        targetRotationY.current += 0.35 * delta;
      }

      // Smooth damped rotation interpolation
      currentRotationY.current = THREE.MathUtils.damp(
        currentRotationY.current,
        targetRotationY.current,
        6,
        delta
      );
      currentRotationX.current = THREE.MathUtils.damp(
        currentRotationX.current,
        targetRotationX.current,
        6,
        delta
      );

      if (carGroupRef.current) {
        carGroupRef.current.rotation.y = currentRotationY.current;
        carGroupRef.current.rotation.x = currentRotationX.current;
      }

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPos.current, 0.05);
        cameraRef.current.lookAt(targetLookAt.current);
      }

      renderer.render(scene, camera);
    };

    renderTick();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pmremGenerator.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update car paint color
  useEffect(() => {
    if (paintMaterialRef.current) {
      paintMaterialRef.current.color.set(paintColor);
    }
  }, [paintColor]);

  // Update headlights
  useEffect(() => {
    headlightMaterialsRef.current.forEach((mat) => {
      mat.emissiveIntensity = headlightsOn ? 3.5 : 0.0;
    });
    spotLightsRef.current.forEach((spot) => {
      spot.intensity = headlightsOn ? 8 : 0;
    });
  }, [headlightsOn]);

  // Update lighting preset
  useEffect(() => {
    if (!rimLightRef.current || !sceneRef.current) return;
    if (lightingPreset === 'obsidian') {
      rimLightRef.current.color.set(0xef4444);
      rimLightRef.current.intensity = 2.8;
      sceneRef.current.fog = new THREE.FogExp2(0x08090d, 0.045);
    } else if (lightingPreset === 'apex') {
      rimLightRef.current.color.set(0xdc2626);
      rimLightRef.current.intensity = 4.5;
      sceneRef.current.fog = new THREE.FogExp2(0x120707, 0.04);
    } else if (lightingPreset === 'cyber') {
      rimLightRef.current.color.set(0x06b6d4);
      rimLightRef.current.intensity = 3.6;
      sceneRef.current.fog = new THREE.FogExp2(0x050f14, 0.045);
    }
  }, [lightingPreset]);

  // Mouse / Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    pointerStart.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: targetRotationX.current, y: targetRotationY.current };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !interactive) return;
    const deltaX = (e.clientX - pointerStart.current.x) * 0.007;
    const deltaY = (e.clientY - pointerStart.current.y) * 0.005;

    targetRotationY.current = startRot.current.y + deltaX;
    // Constrain pitch so car doesn't flip
    targetRotationX.current = Math.max(-0.2, Math.min(0.35, startRot.current.x + deltaY));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Camera Presets
  const setCameraView = (view: 'three-quarter' | 'profile' | 'rear' | 'top') => {
    if (view === 'three-quarter') {
      targetCameraPos.current.set(5.2, 2.2, 5.8);
      targetRotationX.current = 0.08;
    } else if (view === 'profile') {
      targetCameraPos.current.set(0, 1.4, 7.2);
      targetRotationX.current = 0.02;
    } else if (view === 'rear') {
      targetCameraPos.current.set(-5.5, 1.8, -4.5);
      targetRotationX.current = 0.12;
    } else if (view === 'top') {
      targetCameraPos.current.set(0.1, 7.5, 0.8);
      targetRotationX.current = 0.0;
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle Studio Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(9,10,15,0.7)_90%]" />

      {/* Floating Instructions Cue */}
      <div className="pointer-events-none absolute top-6 left-6 flex items-center gap-3 text-xs tracking-wider uppercase text-slate-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span>3D Studio Engine · Drag to Orbit · 360° Inspection</span>
      </div>

      {/* COLLAPSIBLE BOTTOM CONTROL DOCK (Strict Three.js Skill Compliance) */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out z-20 max-w-[94vw] w-auto ${
          dockCollapsed ? 'translate-y-[calc(100%-2.5rem)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setDockCollapsed(!dockCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-wider uppercase bg-[#12151e]/90 text-slate-300 hover:text-white border border-white/10 rounded-full transition-colors cursor-pointer"
          >
            {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{dockCollapsed ? 'Open Studio Controls' : 'Hide Controls'}</span>
          </button>
        </div>

        {/* Dock Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-2.5 sm:p-3 bg-[#0d1017]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
          {/* Finish Palette */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
              Finish:
            </span>
            {[
              { name: 'Obsidian Black', hex: '#0a0a0c' },
              { name: 'Apex Crimson', hex: '#b91c1c' },
              { name: 'Titanium Silver', hex: '#94a3b8' },
              { name: 'Cyber Cyan', hex: '#0284c7' },
              { name: 'Track Yellow', hex: '#ca8a04' },
            ].map((color) => (
              <button
                key={color.hex}
                onClick={() => setPaintColor(color.hex)}
                title={color.name}
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                  paintColor === color.hex ? 'border-white scale-125 shadow-lg shadow-red-500/30' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* Camera Angles */}
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
              Camera:
            </span>
            <button
              onClick={() => setCameraView('three-quarter')}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Perspective
            </button>
            <button
              onClick={() => setCameraView('profile')}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={() => setCameraView('rear')}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Rear
            </button>
            <button
              onClick={() => setCameraView('top')}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden md:inline"
            >
              Aero Top
            </button>
          </div>

          {/* Lighting Mode */}
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setLightingPreset('obsidian')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                lightingPreset === 'obsidian' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setLightingPreset('apex')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                lightingPreset === 'apex' ? 'bg-red-600/30 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Apex Red
            </button>
            <button
              onClick={() => setLightingPreset('cyber')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                lightingPreset === 'cyber' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cyber
            </button>
          </div>

          {/* Toggles: Auto Rotate & Headlights */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeadlightsOn(!headlightsOn)}
              title="Toggle Headlights"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                headlightsOn ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-black/40 text-slate-500 border-white/5'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                autoRotate ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-black/40 text-slate-500 border-white/5'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
