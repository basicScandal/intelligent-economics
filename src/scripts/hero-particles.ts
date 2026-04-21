/**
 * Hero background particle system.
 * Extracted from monolith index.html (lines 4429-4503).
 *
 * 5 coloured nuclei, sphere-spread particles with velocity drift,
 * boundary containment, and mouse-parallax rotation.
 */

import * as THREE from 'three';
import { getDeviceCapability } from './device-detect';

export function initHeroParticles(canvas: HTMLCanvasElement): void {
  const device = getDeviceCapability();

  const PARTICLE_COUNTS = { full: 4000, reduced: 1500, minimal: 0 } as const;
  const PARTICLE_COUNT = PARTICLE_COUNTS[device.tier];
  if (PARTICLE_COUNT === 0) return; // minimal tier — CSS fallback

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: device.tier === 'full', alpha: true });
  renderer.setPixelRatio(device.pixelRatioLimit);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const velocities: { x: number; y: number; z: number }[] = [];

  const nuclei = [
    { x: 0, y: 0, z: 0, r: 1.0, g: 1.0, b: 0.53 },
    { x: 20, y: 10, z: -10, r: 0.0, g: 0.78, b: 1.0 },
    { x: -18, y: -8, z: -5, r: 0.48, g: 0.29, b: 1.0 },
    { x: -5, y: 20, z: -15, r: 1.0, g: 0.71, b: 0.0 },
    { x: 12, y: -15, z: -8, r: 1.0, g: 0.39, b: 0.51 },
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const nucleus = nuclei[Math.floor(Math.random() * nuclei.length)];
    const spread = Math.random() < 0.3 ? 40 : 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 0.5) * spread;
    positions[i * 3] = nucleus.x + r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = nucleus.y + r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = nucleus.z + r * Math.cos(phi);
    const blend = 0.2 + Math.random() * 0.8;
    colors[i * 3] = nucleus.r * blend + (1 - blend);
    colors[i * 3 + 1] = nucleus.g * blend + (1 - blend);
    colors[i * 3 + 2] = nucleus.b * blend + (1 - blend);
    sizes[i] = 0.3 + Math.random() * 1.8;
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.003,
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true },
  );

  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    { passive: true },
  );

  let frame = 0;
  let animId: number;

  function animate(): void {
    animId = requestAnimationFrame(animate);
    frame++;
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i].x * Math.sin(frame * 0.002 + i);
      pos[i * 3 + 1] += velocities[i].y * Math.cos(frame * 0.003 + i * 0.5);
      pos[i * 3 + 2] += velocities[i].z;
      const dx = pos[i * 3];
      const dy = pos[i * 3 + 1];
      const dz = pos[i * 3 + 2];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) > 50) {
        pos[i * 3] *= 0.99;
        pos[i * 3 + 1] *= 0.99;
        pos[i * 3 + 2] *= 0.99;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += (mouseX * 0.3 - particles.rotation.y) * 0.02;
    particles.rotation.x += (-mouseY * 0.2 - particles.rotation.x) * 0.02;
    particles.rotation.z += 0.0005;
    renderer.render(scene, camera);
  }

  animate();

  // Store animId for potential future cleanup
  void animId!;
}
