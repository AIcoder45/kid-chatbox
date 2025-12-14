/**
 * Three.js 3D Background Component
 * Creates an interactive neural core with floating particles
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeJSBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.002);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. The "Neural Core" (Icosahedron with wireframe)
    const geometry = new THREE.IcosahedronGeometry(10, 4); // High detail sphere

    // Wireframe material for outer sphere
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    // Main material for inner sphere
    const material = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    // Create two meshes: one inner solid/wireframe, one outer "halo"
    const sphere = new THREE.Mesh(geometry, material);
    const outerSphere = new THREE.Mesh(geometry, wireframeMaterial);
    outerSphere.scale.set(1.2, 1.2, 1.2);

    const group = new THREE.Group();
    group.add(sphere);
    group.add(outerSphere);
    scene.add(group);
    groupRef.current = group;

    // 3. Particles floating around (Simulating Data)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      // Random spread
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xbd00ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesRef.current = particlesMesh;

    // 4. Mouse interaction
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mouseXRef.current = event.clientX - windowHalfX;
      mouseYRef.current = event.clientY - windowHalfY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // 5. Animation loop
    const animate = () => {
      if (!groupRef.current || !particlesRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      const time = clockRef.current.getElapsedTime();

      targetXRef.current = mouseXRef.current * 0.001;
      targetYRef.current = mouseYRef.current * 0.001;

      // Gentle rotation of the core
      groupRef.current.rotation.y += 0.5 * (targetXRef.current - groupRef.current.rotation.y);
      groupRef.current.rotation.x += 0.5 * (targetYRef.current - groupRef.current.rotation.x);
      groupRef.current.rotation.z += 0.002;

      // Pulse effect (Breathing)
      const scale = 1 + Math.sin(time * 1.5) * 0.03;
      if (groupRef.current.children[0]) {
        (groupRef.current.children[0] as THREE.Mesh).scale.set(scale, scale, scale);
      }

      // Rotate particles slowly in opposite direction
      particlesRef.current.rotation.y = -time * 0.1;
      particlesRef.current.rotation.x = time * 0.05;

      rendererRef.current.render(scene, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 6. Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      wireframeMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        background: 'radial-gradient(circle at center, #1a1a3a 0%, #050510 100%)',
      }}
    />
  );
};

