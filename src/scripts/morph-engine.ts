/**
 * Scroll-driven particle morph engine.
 * Extracted from monolith index.html (lines 4506-4782).
 *
 * Transitions between 6 particle shapes as user scrolls through the stories section.
 * Uses Three.js for rendering and GSAP ScrollTrigger for scroll-position tracking.
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getDeviceCapability } from './device-detect';

gsap.registerPlugin(ScrollTrigger);

export function initMorphEngine(sceneEl: HTMLElement): void {
  const device = getDeviceCapability();
  if (device.prefersReducedMotion) return;

  const morphCanvas = document.getElementById('morph-canvas') as HTMLCanvasElement | null;
  const morphSceneEl = sceneEl;
  const panels = Array.from(document.querySelectorAll('.story-panel'));
  const progressEl = document.getElementById('morph-progress');
  const shapeLabelEl = document.getElementById('morph-shape-label');
  if (!morphCanvas || !morphSceneEl || !panels.length) return;

  /* -- Three.js renderer -- */
  const pane = morphCanvas.parentElement!;
  const W = pane.clientWidth || window.innerWidth / 2;
  const H = pane.clientHeight || window.innerHeight;

  const mR = new THREE.WebGLRenderer({ canvas: morphCanvas, antialias: true, alpha: true });
  mR.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  mR.setSize(W, H);
  mR.setClearColor(0x000000, 0);

  const mScene = new THREE.Scene();
  const mCam = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
  mCam.position.z = 120;

  /* -- Seeded RNG (deterministic shapes) -- */
  const rng = (s: number): number => {
    const x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const N = device.isMobile ? 1200 : 3200;

  /* -- Per-particle arrays -- */
  const livePos = new Float32Array(N * 3);
  const jitter = new Float32Array(N * 3);
  const jAmp = new Float32Array(N);
  const jPhase = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    jitter[i * 3] = (rng(i * 3) - 0.5) * 2;
    jitter[i * 3 + 1] = (rng(i * 3 + 1) - 0.5) * 2;
    jitter[i * 3 + 2] = (rng(i * 3 + 2) - 0.5) * 2;
    jAmp[i] = 0.3 + rng(i + 500) * 0.8;
    jPhase[i] = rng(i + 1000) * Math.PI * 2;
  }

  /* -- Shape generators -- */
  function makeSphere(n: number, radius: number): Float32Array {
    const o = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rng(i * 7 + 1),
        v = rng(i * 7 + 2);
      const th = u * Math.PI * 2,
        ph = Math.acos(2 * v - 1);
      const r = radius * (0.88 + rng(i * 7 + 3) * 0.12);
      o[i * 3] = r * Math.sin(ph) * Math.cos(th);
      o[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      o[i * 3 + 2] = r * Math.cos(ph);
    }
    return o;
  }

  function makeNetwork(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    const hubs: number[][] = [
      [0, 0, 0],
      [40, 20, 0],
      [-38, 18, 5],
      [10, -42, 0],
      [-20, -30, 0],
      [30, -10, 15],
      [-5, 38, -10],
    ];
    for (let i = 0; i < n; i++) {
      const s = rng(i * 5);
      if (s < 0.55) {
        const ha = Math.floor(rng(i * 5 + 1) * hubs.length),
          hb = Math.floor(rng(i * 5 + 2) * hubs.length);
        const t = rng(i * 5 + 3),
          sc = (rng(i * 5 + 4) - 0.5) * 5;
        o[i * 3] = hubs[ha][0] + (hubs[hb][0] - hubs[ha][0]) * t + sc;
        o[i * 3 + 1] = hubs[ha][1] + (hubs[hb][1] - hubs[ha][1]) * t + sc;
        o[i * 3 + 2] = hubs[ha][2] + (hubs[hb][2] - hubs[ha][2]) * t + sc;
      } else {
        const h = hubs[Math.floor(rng(i * 5 + 1) * hubs.length)];
        const r = rng(i * 5 + 2) * 10,
          a = rng(i * 5 + 3) * Math.PI * 2,
          b = rng(i * 5 + 4) * Math.PI;
        o[i * 3] = h[0] + r * Math.sin(b) * Math.cos(a);
        o[i * 3 + 1] = h[1] + r * Math.sin(b) * Math.sin(a);
        o[i * 3 + 2] = h[2] + r * Math.cos(b);
      }
    }
    return o;
  }

  function makeRadial(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    const ARMS = 9;
    for (let i = 0; i < n; i++) {
      if (rng(i * 6) < 0.25) {
        const r = rng(i * 6 + 1) * 20,
          th = rng(i * 6 + 2) * Math.PI * 2,
          ph = Math.acos(2 * rng(i * 6 + 3) - 1);
        o[i * 3] = r * Math.sin(ph) * Math.cos(th);
        o[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        o[i * 3 + 2] = r * Math.cos(ph);
      } else {
        const arm = Math.floor(rng(i * 6 + 1) * ARMS),
          angle = (arm / ARMS) * Math.PI * 2;
        const dist = 20 + rng(i * 6 + 2) * 55,
          sp = rng(i * 6 + 3) * 8,
          pa = angle + Math.PI / 2;
        o[i * 3] = Math.cos(angle) * dist + Math.cos(pa) * sp;
        o[i * 3 + 1] = Math.sin(angle) * dist + Math.sin(pa) * sp;
        o[i * 3 + 2] = (rng(i * 6 + 4) - 0.5) * 18;
      }
    }
    return o;
  }

  function makeRings(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    const RINGS = 6;
    for (let i = 0; i < n; i++) {
      const ring = Math.floor(rng(i * 4) * RINGS),
        rad = 10 + ring * 12;
      const angle = rng(i * 4 + 1) * Math.PI * 2,
        sp = (rng(i * 4 + 2) - 0.5) * 5,
        z = (rng(i * 4 + 3) - 0.5) * 12;
      o[i * 3] = (rad + sp) * Math.cos(angle);
      o[i * 3 + 1] = (rad + sp) * Math.sin(angle);
      o[i * 3 + 2] = z;
    }
    return o;
  }

  function makeExplosion(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = Math.pow(rng(i * 5), 0.4) * 90;
      const th = rng(i * 5 + 1) * Math.PI * 2,
        ph = Math.acos(2 * rng(i * 5 + 2) - 1);
      o[i * 3] = r * Math.sin(ph) * Math.cos(th);
      o[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      o[i * 3 + 2] = r * Math.cos(ph) * 0.15;
    }
    return o;
  }

  function makeGrid(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    const C = 14,
      R = 14,
      NODES = C * R;
    for (let i = 0; i < n; i++) {
      if (rng(i * 5) < 0.4) {
        const ni = Math.floor(rng(i * 5 + 1) * NODES),
          col = ni % C,
          row = Math.floor(ni / C);
        o[i * 3] = (col - C / 2) * 10 + (rng(i * 5 + 2) - 0.5) * 2;
        o[i * 3 + 1] = (row - R / 2) * 10 + (rng(i * 5 + 3) - 0.5) * 2;
        o[i * 3 + 2] = (rng(i * 5 + 4) - 0.5) * 6;
      } else {
        const ni = Math.floor(rng(i * 5 + 1) * NODES),
          col = ni % C,
          row = Math.floor(ni / C);
        const t = rng(i * 5 + 2),
          horiz = rng(i * 5 + 3) > 0.5;
        const ox = (col - C / 2) * 10,
          oy = (row - R / 2) * 10;
        o[i * 3] = horiz ? ox + t * 10 : ox + (rng(i * 5 + 4) - 0.5) * 2;
        o[i * 3 + 1] = horiz ? oy + (rng(i * 5 + 4) - 0.5) * 2 : oy + t * 10;
        o[i * 3 + 2] = (rng(i * 6 + i) - 0.5) * 4;
      }
    }
    return o;
  }

  function makeSpinout(n: number): Float32Array {
    const o = new Float32Array(n * 3);
    let idx = 0;
    function branch(
      x: number,
      y: number,
      z: number,
      angle: number,
      length: number,
      depth: number,
    ): void {
      if (depth === 0 || idx >= n) return;
      const count = Math.min(Math.floor(length * 4), n - idx);
      for (let c = 0; c < count; c++, idx++) {
        const t = rng(idx * 3) * length,
          sp = rng(idx * 3 + 1) * 6 * (1 / depth);
        o[idx * 3] = x + Math.cos(angle) * t + (rng(idx * 3 + 2) - 0.5) * sp;
        o[idx * 3 + 1] = y + Math.sin(angle) * t + (rng(idx * 3 + 2) - 0.5) * sp;
        o[idx * 3 + 2] = z + (rng(idx * 3 + 3) - 0.5) * 8;
      }
      const br = 2 + Math.floor(rng(depth * 13) * 2);
      const nx = x + Math.cos(angle) * length,
        ny = y + Math.sin(angle) * length;
      for (let b = 0; b < br; b++)
        branch(
          nx,
          ny,
          z,
          angle + (b / ((br - 1) || 1) - 0.5) * Math.PI * 0.6,
          length * 0.62,
          depth - 1,
        );
    }
    branch(0, -60, 0, Math.PI / 2, 30, 5); // grow upward from bottom center
    for (let i = 0; i < n; i++)
      if (o[i * 3] === 0 && o[i * 3 + 1] === 0 && o[i * 3 + 2] === 0) {
        const ref = Math.floor(rng(i * 7) * n);
        o[i * 3] = o[ref * 3] + (rng(i * 7 + 1) - 0.5) * 8;
        o[i * 3 + 1] = o[ref * 3 + 1] + (rng(i * 7 + 2) - 0.5) * 8;
        o[i * 3 + 2] = o[ref * 3 + 2] + (rng(i * 7 + 3) - 0.5) * 5;
      }
    return o;
  }

  /* -- Story data -- */
  const STORIES = [
    { label: 'Network', color: [1.0, 0.71, 0.0], positions: makeNetwork(N) },
    { label: 'Radial', color: [0.0, 0.78, 1.0], positions: makeRadial(N) },
    { label: 'Rings', color: [0.0, 1.0, 0.53], positions: makeRings(N) },
    { label: 'Explosion', color: [0.48, 0.29, 1.0], positions: makeExplosion(N) },
    { label: 'Grid', color: [0.0, 0.78, 1.0], positions: makeGrid(N) },
    { label: 'Spinout', color: [1.0, 0.39, 0.51], positions: makeSpinout(N) },
  ];

  /* -- Init geometry from story 0 -- */
  const s0 = STORIES[0];
  for (let i = 0; i < N * 3; i++) livePos[i] = s0.positions[i];

  const mColors = new Float32Array(N * 3);
  const [r0, g0, b0] = s0.color;
  for (let i = 0; i < N; i++) {
    const br = 0.5 + rng(i + 2000) * 0.5;
    mColors[i * 3] = r0 * br;
    mColors[i * 3 + 1] = g0 * br;
    mColors[i * 3 + 2] = b0 * br;
  }

  const mGeo = new THREE.BufferGeometry();
  mGeo.setAttribute('position', new THREE.BufferAttribute(livePos.slice(), 3));
  mGeo.setAttribute('color', new THREE.BufferAttribute(mColors, 3));

  const mMat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
  });
  const mPts = new THREE.Points(mGeo, mMat);
  mScene.add(mPts);

  /* -- Progress dots -- */
  if (progressEl)
    STORIES.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'morph-dot' + (i === 0 ? ' active' : '');
      progressEl.appendChild(d);
    });
  const dots = progressEl ? Array.from(progressEl.querySelectorAll('.morph-dot')) : [];

  /* -- Morph state -- */
  let curIdx = 0;
  const morphObj = { p: 0 };
  let fromPos = livePos.slice();
  let fromCol = mColors.slice();
  let busy = false;

  function ease(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function goTo(idx: number, dur?: number): void {
    if (idx === curIdx && !busy) return;
    busy = true;
    const story = STORIES[idx];
    fromPos = new Float32Array(mGeo.attributes.position.array as ArrayLike<number>);
    fromCol = new Float32Array(mGeo.attributes.color.array as ArrayLike<number>);

    const [r, g, b] = story.color;
    const toCol = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const br = 0.5 + rng(i + 2000) * 0.5;
      toCol[i * 3] = r * br;
      toCol[i * 3 + 1] = g * br;
      toCol[i * 3 + 2] = b * br;
    }

    morphObj.p = 0;
    gsap.to(morphObj, {
      p: 1,
      duration: dur || 1.4,
      ease: 'power2.inOut',
      onUpdate() {
        const ep = ease(morphObj.p);
        const pos = mGeo.attributes.position.array as Float32Array;
        const col = mGeo.attributes.color.array as Float32Array;
        for (let i = 0; i < N * 3; i++) {
          pos[i] = fromPos[i] + (story.positions[i] - fromPos[i]) * ep;
          col[i] = fromCol[i] + (toCol[i] - fromCol[i]) * ep;
          livePos[i] = pos[i];
        }
        mGeo.attributes.position.needsUpdate = true;
        mGeo.attributes.color.needsUpdate = true;
      },
      onComplete() {
        busy = false;
        curIdx = idx;
      },
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (shapeLabelEl) {
      shapeLabelEl.style.opacity = '0';
      setTimeout(() => {
        shapeLabelEl.textContent = story.label;
        shapeLabelEl.style.opacity = '0.7';
      }, 300);
    }

    const prevIdx = curIdx;
    panels.forEach((p, i) => {
      p.classList.remove('active', 'exiting');
      if (i === idx) setTimeout(() => p.classList.add('active'), 80);
      else if (i === prevIdx) {
        p.classList.add('exiting');
        setTimeout(() => p.classList.remove('exiting'), 700);
      }
    });
  }

  /* -- Set scene height + ScrollTrigger -- */
  morphSceneEl.style.height = STORIES.length * 100 + 'vh';
  if (panels[0]) setTimeout(() => panels[0].classList.add('active'), 300);

  ScrollTrigger.create({
    trigger: morphSceneEl,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      const idx = Math.round(self.progress * (STORIES.length - 1));
      if (idx !== curIdx) goTo(idx, 1.3);
    },
  });

  /* -- Render loop -- */
  let mFrame = 0;
  let mMX = 0;
  let mMY = 0;
  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      mMX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mMY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    },
    { passive: true },
  );

  function mLoop(): void {
    requestAnimationFrame(mLoop);
    mFrame++;
    if (!busy) {
      const pos = mGeo.attributes.position.array as Float32Array;
      const t = mFrame * 0.012;
      for (let i = 0; i < N; i++) {
        const a = jAmp[i] * 0.4;
        const ph = jPhase[i];
        pos[i * 3] = livePos[i * 3] + jitter[i * 3] * a * Math.sin(t + ph);
        pos[i * 3 + 1] = livePos[i * 3 + 1] + jitter[i * 3 + 1] * a * Math.cos(t * 0.7 + ph);
        pos[i * 3 + 2] = livePos[i * 3 + 2] + jitter[i * 3 + 2] * a * Math.sin(t * 1.3 + ph);
      }
      mGeo.attributes.position.needsUpdate = true;
    }
    mPts.rotation.y += 0.0008 + (mMX * 0.004 - mPts.rotation.y * 0.003);
    mPts.rotation.x += -mMY * 0.003 - mPts.rotation.x * 0.003;
    mR.render(mScene, mCam);
  }
  mLoop();

  /* -- Resize -- */
  window.addEventListener(
    'resize',
    () => {
      const nW = pane.clientWidth || window.innerWidth / 2;
      const nH = pane.clientHeight || window.innerHeight;
      mCam.aspect = nW / nH;
      mCam.updateProjectionMatrix();
      mR.setSize(nW, nH);
      ScrollTrigger.refresh();
    },
    { passive: true },
  );

  // Keep makeSphere available for potential future use
  void makeSphere;
}
