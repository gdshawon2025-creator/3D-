import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { ZONES, PROJECTS } from '../data/portfolioData';
import { CameraMode, VehiclePhysicsState } from '../types/portfolio';
import { sound } from '../utils/soundEngine';

interface ThreeCanvasProps {
  vehicleColor: string;
  isNightMode: boolean;
  cameraMode: CameraMode;
  onZoneChange: (zoneId: string | null) => void;
  onOpenProject: (projectId: string) => void;
  onOpenZoneModal: (zoneId: string) => void;
  onSpeedChange: (speedKmh: number, nitroFuel: number, gear: string) => void;
  onVehicleStateUpdate?: (x: number, z: number, rotation: number) => void;
  teleportTarget: { x: number; z: number } | null;
  onTeleportComplete: () => void;
  resetBlocksSignal: number;
  resetPinsSignal: number;
  inputState: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    nitro: boolean;
    brake: boolean;
    horn: boolean;
  };
}

interface DynamicBlock {
  mesh: THREE.Mesh;
  vx: number;
  vz: number;
  vy: number;
  rx: number;
  ry: number;
  rz: number;
  initialX: number;
  initialY: number;
  initialZ: number;
  radius: number;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  vehicleColor,
  isNightMode,
  cameraMode,
  onZoneChange,
  onOpenProject,
  onOpenZoneModal,
  onSpeedChange,
  onVehicleStateUpdate,
  teleportTarget,
  onTeleportComplete,
  resetBlocksSignal,
  resetPinsSignal,
  inputState
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep updated across render loops
  const vehicleColorRef = useRef(vehicleColor);
  const isNightModeRef = useRef(isNightMode);
  const cameraModeRef = useRef(cameraMode);
  const inputRef = useRef(inputState);
  const teleportRef = useRef(teleportTarget);

  useEffect(() => {
    vehicleColorRef.current = vehicleColor;
  }, [vehicleColor]);

  useEffect(() => {
    isNightModeRef.current = isNightMode;
  }, [isNightMode]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    inputRef.current = inputState;
  }, [inputState]);

  useEffect(() => {
    teleportRef.current = teleportTarget;
  }, [teleportTarget]);

  // Handle Horn sound
  useEffect(() => {
    if (inputState.horn) {
      sound.playHorn();
    }
  }, [inputState.horn]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightModeRef.current ? 0x090d16 : 0x111827);
    scene.fog = new THREE.FogExp2(isNightModeRef.current ? 0x090d16 : 0x111827, 0.012);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 300);
    camera.position.set(24, 28, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isNightModeRef.current ? 0.35 : 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, isNightModeRef.current ? 0.8 : 1.8);
    dirLight.position.set(45, 60, 35);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    const d = 55;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.4);
    scene.add(hemiLight);

    // --- Texture Generator for Floor Grid ---
    const createGridTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 512);

      // Grid coordinate lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 512; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Plus crosses '+' at intersections
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let x = 64; x < 512; x += 128) {
        for (let y = 64; y < 512; y += 128) {
          ctx.fillText('+', x, y);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(24, 24);
      return texture;
    };

    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createGridTexture(),
      roughness: 0.85,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- Road Connectors / Pathways ---
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const createRoad = (x: number, z: number, w: number, l: number, rotY: number = 0) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotY;
      road.position.set(x, 0.02, z);
      road.receiveShadow = true;
      scene.add(road);
    };
    createRoad(16, -14, 5, 36, -Math.PI / 4);
    createRoad(-16, -14, 5, 36, Math.PI / 4);
    createRoad(16, 14, 5, 36, Math.PI / 4);
    createRoad(-16, 14, 5, 36, -Math.PI / 4);
    createRoad(0, -24, 5, 34, 0);

    // --- Stylized Low-Poly Autumn Trees ---
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const foliageColors = [0xf43f5e, 0xf97316, 0xfb923c, 0xf472b6, 0x10b981];

    const createTree = (x: number, z: number, scale: number = 1, colorHex = 0xf43f5e) => {
      const singleTree = new THREE.Group();
      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.2 * scale, 6), trunkMat);
      trunk.position.y = 1.1 * scale;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      singleTree.add(trunk);

      // Low-poly Foliage layers
      const folMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7, flatShading: true });
      const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6 * scale, 0), folMat);
      foliage1.position.y = 2.6 * scale;
      foliage1.castShadow = true;
      singleTree.add(foliage1);

      const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 * scale, 0), folMat);
      foliage2.position.set(0.3 * scale, 3.4 * scale, -0.2 * scale);
      foliage2.castShadow = true;
      singleTree.add(foliage2);

      singleTree.position.set(x, 0, z);
      return singleTree;
    };

    // Populate Trees around Spawn and boundaries (matching the reel visual)
    const treePositions = [
      { x: -7, z: -5, s: 1.2, c: 0xf43f5e },
      { x: -9, z: -2, s: 0.9, c: 0xf97316 },
      { x: -8, z: 4, s: 1.1, c: 0xfb923c },
      { x: 8, z: -6, s: 1.0, c: 0xf43f5e },
      { x: 9, z: 3, s: 1.3, c: 0xf472b6 },
      { x: -44, z: -38, s: 1.4, c: 0xf97316 },
      { x: -20, z: -44, s: 1.2, c: 0xf43f5e },
      { x: 44, z: -38, s: 1.3, c: 0xfb923c },
      { x: 22, z: -44, s: 1.1, c: 0xf43f5e },
      { x: -45, z: 38, s: 1.3, c: 0x10b981 },
      { x: 45, z: 38, s: 1.3, c: 0xf97316 }
    ];

    treePositions.forEach((tp) => {
      treeGroup.add(createTree(tp.x, tp.z, tp.s, tp.c));
    });
    scene.add(treeGroup);

    // --- Wooden Fence Behind Spawn ---
    const fenceGroup = new THREE.Group();
    const fenceWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    for (let i = -5; i <= 5; i += 2) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), fenceWoodMat);
      post.position.set(i, 0.6, -7);
      post.castShadow = true;
      fenceGroup.add(post);
    }
    const railTop = new THREE.Mesh(new THREE.BoxGeometry(11, 0.15, 0.1), fenceWoodMat);
    railTop.position.set(0, 0.9, -7);
    railTop.castShadow = true;
    fenceGroup.add(railTop);
    const railBottom = new THREE.Mesh(new THREE.BoxGeometry(11, 0.15, 0.1), fenceWoodMat);
    railBottom.position.set(0, 0.4, -7);
    railBottom.castShadow = true;
    fenceGroup.add(railBottom);
    scene.add(fenceGroup);

    // --- Street Lantern (Lantern from video) ---
    const lampGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.3 });
    const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 4.2, 8), metalMat);
    lampPost.position.y = 2.1;
    lampPost.castShadow = true;
    lampGroup.add(lampPost);

    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.5, 6), metalMat);
    lampHead.position.set(0, 4.3, 0);
    lampHead.rotation.x = Math.PI;
    lampGroup.add(lampHead);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lampBulb.position.set(0, 4.0, 0);
    lampGroup.add(lampBulb);

    const lanternLight = new THREE.PointLight(0xfef08a, 2.5, 12, 1.5);
    lanternLight.position.set(0, 3.8, 0);
    lanternLight.castShadow = true;
    lampGroup.add(lanternLight);

    lampGroup.position.set(-4.5, 0, -2.5);
    scene.add(lampGroup);

    // --- Start Zone Glowing Ring ---
    const startRingGeo = new THREE.RingGeometry(4.2, 4.5, 48);
    const startRingMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const startRing = new THREE.Mesh(startRingGeo, startRingMat);
    startRing.rotation.x = -Math.PI / 2;
    startRing.position.set(0, 0.03, 0);
    scene.add(startRing);

    // Inner subtle glow disc
    const innerDiscGeo = new THREE.CircleGeometry(4.1, 36);
    const innerDiscMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.12
    });
    const innerDisc = new THREE.Mesh(innerDiscGeo, innerDiscMat);
    innerDisc.rotation.x = -Math.PI / 2;
    innerDisc.position.set(0, 0.02, 0);
    scene.add(innerDisc);

    // --- "CLICK TO START" Hand-drawn Canvas Decal on Floor ---
    const createStartDecalTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, 512, 256);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SHAWON DESIGN STUDIO', 256, 60);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
      ctx.fillText('গ্রাফিক্স ডিজাইন গ্যালারিতে স্বাগতম ⤹', 256, 102);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '15px "Chakra Petch", monospace';
      ctx.fillText('DRIVE RC BUGGY TO EXPLORE', 256, 138);

      // Sketched curved arrow
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 185, 26, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(c);
      return tex;
    };

    const startDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshBasicMaterial({ map: createStartDecalTexture(), transparent: true, opacity: 0.9 })
    );
    startDecal.rotation.x = -Math.PI / 2;
    startDecal.rotation.z = Math.PI / 6;
    startDecal.position.set(5.5, 0.03, 2.5);
    scene.add(startDecal);

    // --- RC Monster Truck Model ---
    const vehicleGroup = new THREE.Group();

    // Chassis body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(vehicleColorRef.current),
      roughness: 0.35,
      metalness: 0.65
    });

    // Lower cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 3.4), bodyMat);
    cabin.position.y = 1.35;
    cabin.castShadow = true;
    vehicleGroup.add(cabin);

    // Upper cockpit / roof
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.8
    });
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 1.8), cockpitMat);
    cockpit.position.set(0, 1.95, -0.2);
    cockpit.castShadow = true;
    vehicleGroup.add(cockpit);

    // Windshield
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.65), glassMat);
    windshield.position.set(0, 1.95, 0.72);
    windshield.rotation.x = -0.3;
    vehicleGroup.add(windshield);

    // Roll cage / roof spotlights
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const rollBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8), cageMat);
    rollBar.rotation.z = Math.PI / 2;
    rollBar.position.set(0, 2.38, -0.2);
    vehicleGroup.add(rollBar);

    for (let i = -0.6; i <= 0.6; i += 0.4) {
      const spotLightMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.18, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      spotLightMesh.rotation.x = Math.PI / 2;
      spotLightMesh.position.set(i, 2.45, -0.15);
      vehicleGroup.add(spotLightMesh);
    }

    // Heavy duty Front Bumper
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.4), cageMat);
    bumper.position.set(0, 1.0, 1.85);
    bumper.castShadow = true;
    vehicleGroup.add(bumper);

    // Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headlightL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headlightMat);
    headlightL.position.set(-0.7, 1.3, 1.7);
    vehicleGroup.add(headlightL);

    const headlightR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headlightMat);
    headlightR.position.set(0.7, 1.3, 1.7);
    vehicleGroup.add(headlightR);

    // Real Three.js Spotlights casting light forward from headlights
    const spotL = new THREE.SpotLight(0xfffbeb, 3.5, 28, Math.PI * 0.2, 0.4, 1.2);
    spotL.position.set(-0.7, 1.3, 1.8);
    spotL.target.position.set(-0.7, 0, 12);
    vehicleGroup.add(spotL);
    vehicleGroup.add(spotL.target);

    const spotR = new THREE.SpotLight(0xfffbeb, 3.5, 28, Math.PI * 0.2, 0.4, 1.2);
    spotR.position.set(0.7, 1.3, 1.8);
    spotR.target.position.set(0.7, 0, 12);
    vehicleGroup.add(spotR);
    vehicleGroup.add(spotR.target);

    // Oversized Monster Truck Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 });

    const createWheel = () => {
      const wheel = new THREE.Group();
      // Outer tire with treads
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.65, 14), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheel.add(tire);

      // Inner rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.67, 10), rimMat);
      rim.rotation.z = Math.PI / 2;
      wheel.add(rim);

      return wheel;
    };

    const frontLeftWheelGroup = new THREE.Group();
    const frontLeftWheel = createWheel();
    frontLeftWheelGroup.add(frontLeftWheel);
    frontLeftWheelGroup.position.set(-1.25, 0.75, 1.2);
    vehicleGroup.add(frontLeftWheelGroup);

    const frontRightWheelGroup = new THREE.Group();
    const frontRightWheel = createWheel();
    frontRightWheelGroup.add(frontRightWheel);
    frontRightWheelGroup.position.set(1.25, 0.75, 1.2);
    vehicleGroup.add(frontRightWheelGroup);

    const rearLeftWheel = createWheel();
    rearLeftWheel.position.set(-1.25, 0.75, -1.2);
    vehicleGroup.add(rearLeftWheel);

    const rearRightWheel = createWheel();
    rearRightWheel.position.set(1.25, 0.75, -1.2);
    vehicleGroup.add(rearRightWheel);

    // Vehicle Shadow Blob
    const shadowBlobGeo = new THREE.PlaneGeometry(3.2, 4.4);
    const shadowBlobMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45
    });
    const shadowBlob = new THREE.Mesh(shadowBlobGeo, shadowBlobMat);
    shadowBlob.rotation.x = -Math.PI / 2;
    shadowBlob.position.y = 0.04;
    scene.add(shadowBlob);

    vehicleGroup.position.set(0, 0, 0);
    scene.add(vehicleGroup);

    // --- ZONE 1: Projects Showcase Island ---
    const projectsGroup = new THREE.Group();
    const projectMeshes: { mesh: THREE.Mesh; projectId: string }[] = [];

    const createProjectBoard = (p: typeof PROJECTS[0], idx: number) => {
      const boardGroup = new THREE.Group();

      // Canvas Texture for the billboard
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 340;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 340);

      // Top colored header bar
      ctx.fillStyle = p.color;
      ctx.fillRect(0, 0, 512, 32);

      // Category
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Chakra Petch", sans-serif';
      ctx.fillText(p.category.toUpperCase(), 20, 22);

      // Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(p.title, 20, 78);

      // Bengali Title
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px "Hind Siliguri", sans-serif';
      ctx.fillText(p.titleBn, 20, 110);

      // Tagline
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      const words = p.tagline.split(' ');
      let line = '';
      let y = 145;
      for (const w of words) {
        if ((line + w).length > 38) {
          ctx.fillText(line, 20, y);
          line = w + ' ';
          y += 24;
        } else {
          line += w + ' ';
        }
      }
      ctx.fillText(line, 20, y);

      // Tech tags unboxed with separators
      ctx.fillStyle = p.color;
      ctx.font = 'bold 14px "Chakra Petch", monospace';
      ctx.fillText(p.tags.slice(0, 4).join('  ·  '), 20, 240);

      // CTA bottom strip
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16, 275, 480, 48);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ TAP OR PRESS ENTER TO INSPECT PROJECT', 256, 305);

      const boardTex = new THREE.CanvasTexture(canvas);
      const boardGeo = new THREE.BoxGeometry(6.4, 4.4, 0.4);
      const boardMat = new THREE.MeshStandardMaterial({
        map: boardTex,
        roughness: 0.4,
        metalness: 0.2
      });
      const boardMesh = new THREE.Mesh(boardGeo, boardMat);
      boardMesh.position.y = 3.6;
      boardMesh.castShadow = true;
      boardGroup.add(boardMesh);

      // Two wooden support posts
      const postGeo = new THREE.CylinderGeometry(0.18, 0.2, 3.6, 8);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const postL = new THREE.Mesh(postGeo, postMat);
      postL.position.set(-2.6, 1.8, 0);
      postL.castShadow = true;
      boardGroup.add(postL);

      const postR = new THREE.Mesh(postGeo, postMat);
      postR.position.set(2.6, 1.8, 0);
      postR.castShadow = true;
      boardGroup.add(postR);

      // Interactive ring on floor
      const triggerRing = new THREE.Mesh(
        new THREE.RingGeometry(3.2, 3.5, 32),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color), side: THREE.DoubleSide })
      );
      triggerRing.rotation.x = -Math.PI / 2;
      triggerRing.position.set(0, 0.04, 2.5);
      boardGroup.add(triggerRing);

      // Placement in grid within projects zone
      const offsetX = (idx % 2 === 0 ? -5.5 : 5.5);
      const offsetZ = (idx < 2 ? -5.5 : 5.5);
      boardGroup.position.set(32 + offsetX, 0, -28 + offsetZ);
      boardGroup.rotation.y = idx % 2 === 0 ? 0.2 : -0.2;

      projectMeshes.push({ mesh: boardMesh, projectId: p.id });
      return boardGroup;
    };

    PROJECTS.forEach((p, idx) => {
      projectsGroup.add(createProjectBoard(p, idx));
    });

    // Zone Title Sign for Projects
    const createZoneBanner = (title: string, titleBn: string, colorHex: number, x: number, z: number) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 160;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 160);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 148);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, 256, 65);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px "Hind Siliguri", sans-serif';
      ctx.fillText(titleBn, 256, 115);

      const tex = new THREE.CanvasTexture(c);
      const banner = new THREE.Mesh(
        new THREE.BoxGeometry(8, 2.5, 0.3),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
      );
      banner.position.set(x, 4.8, z);
      banner.castShadow = true;
      return banner;
    };

    projectsGroup.add(createZoneBanner('DESIGN PORTFOLIO', 'গ্রাফিক্স ডিজাইন গ্যালারি', 0xf97316, 32, -40));
    scene.add(projectsGroup);

    // --- ZONE 2: Physics-Enabled Skills Blocks ---
    const skillsGroup = new THREE.Group();
    const dynamicBlocks: DynamicBlock[] = [];

    const skillList = [
      { name: 'Photoshop', color: '#001e36' },
      { name: 'Illustrator', color: '#ff9a00' },
      { name: 'Blender 3D', color: '#ea580c' },
      { name: 'Figma', color: '#a259ff' },
      { name: 'After Effects', color: '#9999ff' },
      { name: 'Branding', color: '#ec4899' },
      { name: 'Cinema 4D', color: '#0284c7' },
      { name: 'Typography', color: '#10b981' },
      { name: 'Packaging', color: '#eab308' },
      { name: 'Motion', color: '#f43f5e' },
      { name: 'Social Ads', color: '#06b6d4' },
      { name: 'Three.js', color: '#f59e0b' }
    ];

    const createSkillBlockMesh = (name: string, colorHex: string, initX: number, initY: number, initZ: number) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;

      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, 256, 256);

      // Dark inner border
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 244, 244);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, 128, 128);

      const tex = new THREE.CanvasTexture(c);
      const geo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.4,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(initX, initY, initZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      skillsGroup.add(mesh);

      const block: DynamicBlock = {
        mesh,
        vx: 0,
        vz: 0,
        vy: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        initialX: initX,
        initialY: initY,
        initialZ: initZ,
        radius: 1.4
      };
      dynamicBlocks.push(block);
    };

    // Arrange skill blocks in stacked pyramid/grid
    let skillIdx = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (skillIdx >= skillList.length) break;
        const item = skillList[skillIdx];
        const bx = -32 + (col - 1.5) * 2.8;
        const bz = -28 + (row - 1) * 2.8;
        createSkillBlockMesh(item.name, item.color, bx, 1.0, bz);
        skillIdx++;
      }
    }

    skillsGroup.add(createZoneBanner('DESIGN TOOLS SUITE', 'গ্রাফিক্স ডিজাইন সফটওয়্যার ও স্কিলস', 0x8b5cf6, -32, -38));
    scene.add(skillsGroup);

    // --- ZONE 3: Mega Ramp & Bowling Pins ---
    const playgroundGroup = new THREE.Group();
    const bowlingPins: DynamicBlock[] = [];

    // The Mega Jump Ramp
    const rampWidth = 6.0;
    const rampLength = 9.0;
    const rampHeight = 3.0;

    const rampShape = new THREE.Shape();
    rampShape.moveTo(0, 0);
    rampShape.lineTo(rampLength, 0);
    rampShape.lineTo(rampLength, rampHeight);
    rampShape.closePath();

    const rampExtrude = new THREE.ExtrudeGeometry(rampShape, {
      depth: rampWidth,
      bevelEnabled: false
    });
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.5,
      metalness: 0.3
    });
    const rampMesh = new THREE.Mesh(rampExtrude, rampMat);
    rampMesh.rotation.y = Math.PI / 2;
    rampMesh.position.set(-rampWidth / 2, 0, -38);
    rampMesh.castShadow = true;
    rampMesh.receiveShadow = true;
    playgroundGroup.add(rampMesh);

    // Ramp surface stripe lines
    const stripeGeo = new THREE.PlaneGeometry(rampWidth * 0.9, 0.4);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 1; i <= 4; i++) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.atan2(rampHeight, rampLength);
      const frac = i / 5;
      stripe.position.set(0, frac * rampHeight + 0.05, -38 - frac * rampLength);
      playgroundGroup.add(stripe);
    }

    const cmykColors = [0x06b6d4, 0xec4899, 0xeab308, 0x18181b, 0xf97316, 0x8b5cf6, 0x10b981, 0x3b82f6, 0xef4444, 0x0ea5e9];

    const createBowlingPin = (x: number, z: number, colorHex: number) => {
      const pinGroup = new THREE.Group();

      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1
      });
      const pinStripeMat = new THREE.MeshBasicMaterial({ color: colorHex });

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.6, 12), pinMat);
      base.position.y = 0.8;
      base.castShadow = true;
      pinGroup.add(base);

      const colorStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.45, 12), pinStripeMat);
      colorStripe.position.y = 1.05;
      pinGroup.add(colorStripe);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), pinStripeMat);
      head.position.y = 1.8;
      head.castShadow = true;
      pinGroup.add(head);

      pinGroup.position.set(x, 0, z);
      playgroundGroup.add(pinGroup);

      const pinBlock: DynamicBlock = {
        mesh: pinGroup as unknown as THREE.Mesh,
        vx: 0,
        vz: 0,
        vy: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        initialX: x,
        initialY: 0,
        initialZ: z,
        radius: 0.9
      };
      bowlingPins.push(pinBlock);
    };

    // Triangular Bowling Rack at z = -58
    const pinStartZ = -56;
    const pinSpacing = 1.4;
    let pinCount = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c <= r; c++) {
        const px = (c - r * 0.5) * pinSpacing;
        const pz = pinStartZ - r * 1.5;
        const colorHex = cmykColors[pinCount % cmykColors.length];
        createBowlingPin(px, pz, colorHex);
        pinCount++;
      }
    }

    playgroundGroup.add(createZoneBanner('CMYK COLOR SPLASH RAMP', 'কালার স্প্ল্যাশ ও আর্ট পিনস', 0xec4899, 0, -66));
    scene.add(playgroundGroup);

    // --- ZONE 4: About Me Station (Developer Workstation Diorama) ---
    const aboutGroup = new THREE.Group();

    // Wooden desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.3, 3.2), deskMat);
    deskTop.position.set(-32, 2.0, 28);
    deskTop.castShadow = true;
    aboutGroup.add(deskTop);

    for (const [dx, dz] of [[-2.7, -1.3], [2.7, -1.3], [-2.7, 1.3], [2.7, 1.3]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.0, 0.25), deskMat);
      leg.position.set(-32 + dx, 1.0, 28 + dz);
      leg.castShadow = true;
      aboutGroup.add(leg);
    }

    // Dual Glowing Monitors
    const monitorFrameMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const monitorScreenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const createMonitor = (mx: number, rotY: number) => {
      const mGroup = new THREE.Group();
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 0.8), monitorFrameMat);
      stand.position.y = 0.4;
      mGroup.add(stand);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.15), monitorFrameMat);
      frame.position.y = 1.4;
      frame.castShadow = true;
      mGroup.add(frame);

      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3), monitorScreenMat);
      screen.position.set(0, 1.4, 0.09);
      mGroup.add(screen);

      mGroup.position.set(-32 + mx, 2.15, 27.5);
      mGroup.rotation.y = rotY;
      aboutGroup.add(mGroup);
    };
    createMonitor(-1.4, 0.25);
    createMonitor(1.4, -0.25);

    // Developer Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const chairSeat = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 16), chairMat);
    chairSeat.position.set(-32, 1.2, 30.5);
    chairSeat.castShadow = true;
    aboutGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.2), chairMat);
    chairBack.position.set(-32, 2.2, 31.4);
    chairBack.castShadow = true;
    aboutGroup.add(chairBack);

    // Coffee mug & Trophy
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.18, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    mug.position.set(-34.2, 2.35, 28.5);
    aboutGroup.add(mug);

    // Green Self-Healing Cutting Mat on desk
    const cuttingMatMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6 });
    const cuttingMat = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.04, 2.2), cuttingMatMat);
    cuttingMat.position.set(-32, 2.16, 28.2);
    cuttingMat.receiveShadow = true;
    aboutGroup.add(cuttingMat);

    // Wacom Drawing Tablet with active screen
    const tabletMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const tablet = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 1.4), tabletMat);
    tablet.position.set(-32, 2.2, 28.5);
    tablet.receiveShadow = true;
    aboutGroup.add(tablet);

    const tabletScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 1.1),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    tabletScreen.rotation.x = -Math.PI / 2;
    tabletScreen.position.set(-32, 2.24, 28.5);
    aboutGroup.add(tabletScreen);

    // Stylus Pen
    const penMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), penMat);
    pen.rotation.z = Math.PI / 3;
    pen.position.set(-30.5, 2.26, 28.6);
    aboutGroup.add(pen);

    // Pantone Swatch Fan Deck
    const swatchColors = [0xef4444, 0xf97316, 0xeab308, 0x10b981, 0x06b6d4, 0x8b5cf6];
    swatchColors.forEach((col, idx) => {
      const fanBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.02, 0.7),
        new THREE.MeshStandardMaterial({ color: col })
      );
      fanBlade.rotation.y = 0.25 * idx - 0.6;
      fanBlade.position.set(-33.8 + idx * 0.08, 2.2, 27.8);
      aboutGroup.add(fanBlade);
    });

    const trophy = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.0, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 })
    );
    trophy.position.set(-29.8, 2.65, 27.5);
    aboutGroup.add(trophy);

    // Interactive Bio Plaque billboard
    const bioCanvas = document.createElement('canvas');
    bioCanvas.width = 512;
    bioCanvas.height = 320;
    const bctx = bioCanvas.getContext('2d')!;
    bctx.fillStyle = '#0f172a';
    bctx.fillRect(0, 0, 512, 320);
    bctx.fillStyle = '#10b981';
    bctx.fillRect(0, 0, 512, 28);

    bctx.fillStyle = '#ffffff';
    bctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    bctx.fillText('গ্রাফিক্স ডিজাইনার শাওন', 20, 75);

    bctx.fillStyle = '#94a3b8';
    bctx.font = '20px "Hind Siliguri", sans-serif';
    bctx.fillText('প্রফেশনাল গ্রাফিক্স ডিজাইনার ও ৩ডি আর্টিস্ট', 20, 110);

    bctx.fillStyle = '#cbd5e1';
    bctx.font = '16px "Plus Jakarta Sans", sans-serif';
    bctx.fillText('5+ Years Exp  ·  150+ Projects  ·  100% Satisfaction', 20, 155);
    bctx.fillText('Brand Identities, 3D Product Packaging & Motion Ads', 20, 190);

    bctx.fillStyle = '#1e293b';
    bctx.fillRect(16, 240, 480, 50);
    bctx.fillStyle = '#10b981';
    bctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('⚡ TAP OR PRESS ENTER FOR FULL BIO & EXPERIENCE', 256, 272);

    const bioTex = new THREE.CanvasTexture(bioCanvas);
    const bioBoard = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 4.0, 0.3),
      new THREE.MeshStandardMaterial({ map: bioTex, roughness: 0.4 })
    );
    bioBoard.position.set(-32, 5.0, 24.5);
    bioBoard.castShadow = true;
    aboutGroup.add(bioBoard);

    aboutGroup.add(createZoneBanner('ARTIST STUDIO & WORKSTATION', 'শাওনের ক্রিয়েটিভ আর্ট স্টুডিও', 0x10b981, -32, 36));
    scene.add(aboutGroup);

    // --- ZONE 5: Contact Postbox & Hologram Beacon ---
    const contactGroup = new THREE.Group();

    // Classic Red/Cyan Postbox
    const postboxMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.2 });
    const postboxBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.2, 16), postboxMat);
    postboxBody.position.set(32, 1.6, 28);
    postboxBody.castShadow = true;
    contactGroup.add(postboxBody);

    const postboxDome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), postboxMat);
    postboxDome.position.set(32, 3.2, 28);
    postboxDome.castShadow = true;
    contactGroup.add(postboxDome);

    // Mail slot
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.4), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    slot.position.set(32, 2.5, 29.1);
    contactGroup.add(slot);

    // Hologram Beacon Beam
    const beaconLight = new THREE.PointLight(0x06b6d4, 3, 16);
    beaconLight.position.set(32, 4.5, 28);
    contactGroup.add(beaconLight);

    // Contact Board
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 512;
    contactCanvas.height = 320;
    const cctx = contactCanvas.getContext('2d')!;
    cctx.fillStyle = '#0f172a';
    cctx.fillRect(0, 0, 512, 320);
    cctx.fillStyle = '#06b6d4';
    cctx.fillRect(0, 0, 512, 28);

    cctx.fillStyle = '#ffffff';
    cctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    cctx.fillText('DESIGN ORDERS & BRIEF', 20, 75);

    cctx.fillStyle = '#94a3b8';
    cctx.font = '20px "Hind Siliguri", sans-serif';
    cctx.fillText('গ্রাফিক্স ডিজাইন অর্ডার ও যোগাযোগ', 20, 110);

    cctx.fillStyle = '#38bdf8';
    cctx.font = '18px monospace';
    cctx.fillText('shawon.graphics.design@gmail.com', 20, 160);

    cctx.fillStyle = '#cbd5e1';
    cctx.font = '15px "Plus Jakarta Sans", sans-serif';
    cctx.fillText('Behance  ·  Dribbble  ·  LinkedIn  ·  Dhaka, BD', 20, 200);

    cctx.fillStyle = '#1e293b';
    cctx.fillRect(16, 240, 480, 50);
    cctx.fillStyle = '#06b6d4';
    cctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    cctx.textAlign = 'center';
    cctx.fillText('⚡ TAP OR PRESS ENTER TO SEND DESIGN BRIEF', 256, 272);

    const contactTex = new THREE.CanvasTexture(contactCanvas);
    const contactBoard = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 4.0, 0.3),
      new THREE.MeshStandardMaterial({ map: contactTex, roughness: 0.4 })
    );
    contactBoard.position.set(32, 5.0, 24.5);
    contactBoard.castShadow = true;
    contactGroup.add(contactBoard);

    contactGroup.add(createZoneBanner('DESIGN ORDERS & BRIEF', 'ডিজাইন অর্ডার ও যোগাযোগ', 0x06b6d4, 32, 36));
    scene.add(contactGroup);

    // --- Floating Tech Badges (Chrome, Three.js, etc. as seen in the reel thumbnail) ---
    const badgeGroup = new THREE.Group();
    const createHexBadge = (colorHex: number, symbol: string, x: number, y: number, z: number) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 64, 64);

      const tex = new THREE.CanvasTexture(c);
      const hexGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 6);
      const hexMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: tex,
        metalness: 0.7,
        roughness: 0.2
      });
      const badge = new THREE.Mesh(hexGeo, hexMat);
      badge.rotation.x = Math.PI / 2;
      badge.position.set(x, y, z);
      badgeGroup.add(badge);
      return badge;
    };

    const floatingBadges = [
      createHexBadge(0x001e36, 'Ps', -12, 6, -8),
      createHexBadge(0xff9a00, 'Ai', 12, 7, -8),
      createHexBadge(0xea580c, '3D', -14, 5, 8),
      createHexBadge(0xec4899, 'Id', 14, 6, 8)
    ];
    scene.add(badgeGroup);

    // --- Vehicle Physics Simulation Variables ---
    const vehiclePhysics: VehiclePhysicsState = {
      x: 0,
      y: 0,
      z: 0,
      rotationY: 0,
      speed: 0,
      steerAngle: 0,
      isGrounded: true,
      isNitro: false,
      nitroFuel: 100,
      pitch: 0,
      roll: 0,
      verticalVelocity: 0
    };

    // Reset Dynamic Skill Blocks helper
    const resetSkillBlocks = () => {
      dynamicBlocks.forEach((b) => {
        b.mesh.position.set(b.initialX, b.initialY, b.initialZ);
        b.mesh.rotation.set(0, 0, 0);
        b.vx = 0;
        b.vy = 0;
        b.vz = 0;
        b.rx = 0;
        b.ry = 0;
        b.rz = 0;
      });
    };

    // Reset Bowling Pins helper
    const resetBowlingPins = () => {
      bowlingPins.forEach((p) => {
        p.mesh.position.set(p.initialX, p.initialY, p.initialZ);
        p.mesh.rotation.set(0, 0, 0);
        p.vx = 0;
        p.vy = 0;
        p.vz = 0;
        p.rx = 0;
        p.ry = 0;
        p.rz = 0;
      });
    };

    // Raycaster for Direct Canvas Clicking on Billboards / Objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check project billboards
      const intersects = raycaster.intersectObjects(projectMeshes.map((pm) => pm.mesh));
      if (intersects.length > 0) {
        const hit = projectMeshes.find((pm) => pm.mesh === intersects[0].object);
        if (hit) {
          onOpenProject(hit.projectId);
          sound.playSuccess();
          return;
        }
      }

      // Check Bio Board
      const bioHit = raycaster.intersectObject(bioBoard);
      if (bioHit.length > 0) {
        onOpenZoneModal('about');
        sound.playSuccess();
        return;
      }

      // Check Contact Board
      const contactHit = raycaster.intersectObject(contactBoard);
      if (contactHit.length > 0) {
        onOpenZoneModal('contact');
        sound.playSuccess();
        return;
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // --- Animation & Physics Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentActiveZoneId: string | null = null;

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Update Body Paint Color dynamically
      bodyMat.color.set(vehicleColorRef.current);

      // Handle External Teleport Request
      if (teleportRef.current) {
        vehiclePhysics.x = teleportRef.current.x;
        vehiclePhysics.z = teleportRef.current.z;
        vehiclePhysics.y = 0;
        vehiclePhysics.speed = 0;
        vehiclePhysics.verticalVelocity = 0;
        teleportRef.current = null;
        onTeleportComplete();
      }

      // Driving Input handling
      const input = inputRef.current;
      const isNitroActive = input.nitro && vehiclePhysics.nitroFuel > 5;

      // Nitro Fuel Regen / Depletion
      if (isNitroActive) {
        vehiclePhysics.nitroFuel = Math.max(0, vehiclePhysics.nitroFuel - delta * 25);
        if (Math.random() < 0.2) sound.playBoost();
      } else {
        vehiclePhysics.nitroFuel = Math.min(100, vehiclePhysics.nitroFuel + delta * 12);
      }

      // Speed & Acceleration physics
      const maxSpeed = isNitroActive ? 32 : 20;
      const accel = isNitroActive ? 28 : 16;
      const decel = input.brake ? 35 : 12;

      if (input.forward) {
        vehiclePhysics.speed = Math.min(maxSpeed, vehiclePhysics.speed + accel * delta);
      } else if (input.backward) {
        vehiclePhysics.speed = Math.max(-10, vehiclePhysics.speed - accel * delta);
      } else {
        if (vehiclePhysics.speed > 0) {
          vehiclePhysics.speed = Math.max(0, vehiclePhysics.speed - decel * delta);
        } else if (vehiclePhysics.speed < 0) {
          vehiclePhysics.speed = Math.min(0, vehiclePhysics.speed + decel * delta);
        }
      }

      // Update Audio Engine Sound
      const speedNormalized = Math.abs(vehiclePhysics.speed) / 32;
      sound.updateEngine(speedNormalized, input.forward || input.backward);

      // Steering
      const steerSpeed = 2.4;
      const targetSteer = (input.left ? 0.45 : 0) - (input.right ? 0.45 : 0);
      vehiclePhysics.steerAngle += (targetSteer - vehiclePhysics.steerAngle) * steerSpeed * 6 * delta;

      if (Math.abs(vehiclePhysics.speed) > 0.1) {
        const turnDirection = vehiclePhysics.speed > 0 ? 1 : -1;
        vehiclePhysics.rotationY += vehiclePhysics.steerAngle * turnDirection * (vehiclePhysics.speed / maxSpeed) * 3.2 * delta;
      }

      // Pivot front wheels visually
      frontLeftWheelGroup.rotation.y = vehiclePhysics.steerAngle;
      frontRightWheelGroup.rotation.y = vehiclePhysics.steerAngle;

      // Spin all 4 wheels based on speed
      const wheelSpin = (vehiclePhysics.speed / 0.75) * delta;
      frontLeftWheel.rotation.x += wheelSpin;
      frontRightWheel.rotation.x += wheelSpin;
      rearLeftWheel.rotation.x += wheelSpin;
      rearRightWheel.rotation.x += wheelSpin;

      // Mega Ramp Jump detection
      // Ramp bounding box: x between -3 and 3, z between -47 and -38
      const inRampX = vehiclePhysics.x >= -3 && vehiclePhysics.x <= 3;
      const inRampZ = vehiclePhysics.z <= -38 && vehiclePhysics.z >= -47;

      if (inRampX && inRampZ && vehiclePhysics.speed > 8) {
        const rampProgress = ((-38 - vehiclePhysics.z) / 9.0);
        const rampElevation = rampProgress * 3.0;
        if (vehiclePhysics.y < rampElevation) {
          vehiclePhysics.y = rampElevation;
          vehiclePhysics.pitch = -0.3;
          // Launch velocity off the ramp lip!
          if (rampProgress > 0.9 && vehiclePhysics.isGrounded) {
            vehiclePhysics.verticalVelocity = vehiclePhysics.speed * 0.45;
            vehiclePhysics.isGrounded = false;
            sound.playBoost();
          }
        }
      }

      // Air gravity & ground landing
      if (!vehiclePhysics.isGrounded || vehiclePhysics.y > 0) {
        vehiclePhysics.verticalVelocity -= 26 * delta;
        vehiclePhysics.y += vehiclePhysics.verticalVelocity * delta;

        if (vehiclePhysics.y <= 0) {
          vehiclePhysics.y = 0;
          vehiclePhysics.verticalVelocity = 0;
          vehiclePhysics.isGrounded = true;
          vehiclePhysics.pitch = 0;
          sound.playCollision(1.5);
        }
      }

      // World boundary clamping
      const forwardDirX = Math.sin(vehiclePhysics.rotationY);
      const forwardDirZ = Math.cos(vehiclePhysics.rotationY);

      vehiclePhysics.x += forwardDirX * vehiclePhysics.speed * delta;
      vehiclePhysics.z += forwardDirZ * vehiclePhysics.speed * delta;

      const boundary = 75;
      if (Math.abs(vehiclePhysics.x) > boundary) {
        vehiclePhysics.x = Math.sign(vehiclePhysics.x) * boundary;
        vehiclePhysics.speed = -vehiclePhysics.speed * 0.4;
        sound.playCollision(0.8);
      }
      if (Math.abs(vehiclePhysics.z) > boundary) {
        vehiclePhysics.z = Math.sign(vehiclePhysics.z) * boundary;
        vehiclePhysics.speed = -vehiclePhysics.speed * 0.4;
        sound.playCollision(0.8);
      }

      // Apply Vehicle Transform
      vehicleGroup.position.set(vehiclePhysics.x, vehiclePhysics.y, vehiclePhysics.z);
      vehicleGroup.rotation.y = vehiclePhysics.rotationY;
      vehicleGroup.rotation.x = vehiclePhysics.pitch;
      vehicleGroup.rotation.z = -vehiclePhysics.steerAngle * 0.15; // Body roll during turn

      shadowBlob.position.set(vehiclePhysics.x, 0.04, vehiclePhysics.z);

      // --- Physical Collision: Monster Truck with Dynamic Skill Blocks ---
      dynamicBlocks.forEach((block) => {
        const dx = block.mesh.position.x - vehiclePhysics.x;
        const dz = block.mesh.position.z - vehiclePhysics.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Truck hit block
        if (dist < block.radius + 1.8) {
          const hitIntensity = Math.abs(vehiclePhysics.speed);
          if (hitIntensity > 1.5) {
            const angle = Math.atan2(dz, dx);
            const impulse = Math.max(8, hitIntensity * 1.2);
            block.vx = Math.cos(angle) * impulse;
            block.vz = Math.sin(angle) * impulse;
            block.vy = Math.min(8, hitIntensity * 0.6);
            block.rx = (Math.random() - 0.5) * 8;
            block.ry = (Math.random() - 0.5) * 8;
            block.rz = (Math.random() - 0.5) * 8;

            sound.playCollision(Math.min(2, hitIntensity / 10));
            vehiclePhysics.speed *= 0.85; // Slight resistance
          }
        }

        // Block simulation
        block.mesh.position.x += block.vx * delta;
        block.mesh.position.z += block.vz * delta;
        block.mesh.position.y += block.vy * delta;

        block.mesh.rotation.x += block.rx * delta;
        block.mesh.rotation.y += block.ry * delta;
        block.mesh.rotation.z += block.rz * delta;

        // Friction and gravity
        block.vx *= 0.94;
        block.vz *= 0.94;
        block.rx *= 0.94;
        block.ry *= 0.94;
        block.rz *= 0.94;

        if (block.mesh.position.y > 1.0) {
          block.vy -= 22 * delta;
        } else {
          block.mesh.position.y = 1.0;
          block.vy = -block.vy * 0.3;
        }
      });

      // --- Physical Collision: Monster Truck with Bowling Pins ---
      let pinsHitCount = 0;
      bowlingPins.forEach((pin) => {
        const dx = pin.mesh.position.x - vehiclePhysics.x;
        const dz = pin.mesh.position.z - vehiclePhysics.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < pin.radius + 1.8) {
          const hitIntensity = Math.abs(vehiclePhysics.speed);
          if (hitIntensity > 2) {
            const angle = Math.atan2(dz, dx);
            const impulse = Math.max(12, hitIntensity * 1.5);
            pin.vx = Math.cos(angle) * impulse;
            pin.vz = Math.sin(angle) * impulse;
            pin.vy = Math.min(10, hitIntensity * 0.8);
            pin.rx = (Math.random() - 0.5) * 12;
            pin.rz = (Math.random() - 0.5) * 12;

            pinsHitCount++;
            sound.playCollision(1.8);
          }
        }

        pin.mesh.position.x += pin.vx * delta;
        pin.mesh.position.z += pin.vz * delta;
        pin.mesh.position.y += pin.vy * delta;
        pin.mesh.rotation.x += pin.rx * delta;
        pin.mesh.rotation.z += pin.rz * delta;

        pin.vx *= 0.95;
        pin.vz *= 0.95;

        if (pin.mesh.position.y > 0) {
          pin.vy -= 25 * delta;
        } else {
          pin.mesh.position.y = 0;
          pin.vy = -pin.vy * 0.2;
        }
      });

      if (pinsHitCount > 2) {
        // Trigger celebratory confetti on bowling strike!
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      // Zone Detection
      let activeZone: typeof ZONES[0] | null = null;
      for (const zone of ZONES) {
        const distToZone = Math.hypot(vehiclePhysics.x - zone.x, vehiclePhysics.z - zone.z);
        if (distToZone < zone.radius) {
          activeZone = zone;
          break;
        }
      }

      const activeZoneId = activeZone ? activeZone.id : null;
      if (activeZoneId !== currentActiveZoneId) {
        currentActiveZoneId = activeZoneId;
        onZoneChange(activeZoneId);
      }

      // Speed & Telemetry HUD update
      const speedKmh = Math.round(Math.abs(vehiclePhysics.speed) * 3.6);
      const gear = vehiclePhysics.speed > 0.5 ? 'D' : vehiclePhysics.speed < -0.5 ? 'R' : 'P';
      onSpeedChange(speedKmh, vehiclePhysics.nitroFuel, gear);

      if (onVehicleStateUpdate) {
        onVehicleStateUpdate(vehiclePhysics.x, vehiclePhysics.z, vehiclePhysics.rotationY);
      }

      // Floating Badges Bobbing
      floatingBadges.forEach((b, i) => {
        b.rotation.z += 0.01;
        b.position.y += Math.sin(now * 0.002 + i) * 0.005;
      });

      // Camera Choreography
      const mode = cameraModeRef.current;
      if (mode === 'chase') {
        // Classic Bruno Simon 3D Isometric Chase Camera
        const camDistance = 24;
        const camHeight = 22;
        const targetCamX = vehiclePhysics.x + Math.sin(vehiclePhysics.rotationY - Math.PI * 0.85) * camDistance * 0.7;
        const targetCamZ = vehiclePhysics.z + Math.cos(vehiclePhysics.rotationY - Math.PI * 0.85) * camDistance * 0.7;

        camera.position.x += (targetCamX - camera.position.x) * 4 * delta;
        camera.position.y += (camHeight - camera.position.y) * 4 * delta;
        camera.position.z += (targetCamZ - camera.position.z) * 4 * delta;

        const lookTarget = new THREE.Vector3(vehiclePhysics.x, vehiclePhysics.y + 1.2, vehiclePhysics.z);
        camera.lookAt(lookTarget);
      } else if (mode === 'topdown') {
        // Overhead Tactical Radar View
        camera.position.set(vehiclePhysics.x, 60, vehiclePhysics.z + 0.1);
        camera.lookAt(vehiclePhysics.x, 0, vehiclePhysics.z);
      } else {
        // Free Orbit around vehicle
        camera.position.set(vehiclePhysics.x + 20, 22, vehiclePhysics.z + 24);
        camera.lookAt(vehiclePhysics.x, 1, vehiclePhysics.z);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none outline-none"
    />
  );
};
