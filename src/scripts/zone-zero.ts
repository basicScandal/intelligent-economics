/**
 * Zone Zero interactive simulator.
 * Extracted from monolith index.html (lines 4784-5254).
 *
 * 4-slider MIND dimension controls with live particle visualization,
 * geometric mean scoring, collapse detection, and social sharing.
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { getDeviceCapability } from './device-detect';
import { trackEvent } from './analytics';

/* -- Types -- */
interface ZoneZeroState {
  scores: Record<'m' | 'i' | 'n' | 'd', number>;
  isCollapsed: boolean;
}

interface HealthState {
  min: number;
  badge: string;
  name: string;
  insight: string;
}

/* -- Score calculation -- */
function calcScore(vals: Record<'m' | 'i' | 'n' | 'd', number>): number {
  const { m, i, n, d } = vals;
  if (m <= 0 || i <= 0 || n <= 0 || d <= 0) return 0;
  return Math.round(Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100);
}

export function initZoneZero(container: HTMLElement): void {
  const device = getDeviceCapability();

  const ZZ_COUNTS = { full: 1800, reduced: 800, minimal: 0 } as const;
  const zzParticleCount = ZZ_COUNTS[device.tier];
  if (zzParticleCount === 0) return; // minimal tier — CSS fallback

  const canvas = document.getElementById('zz-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  // -- Slider refs --
  const sliders: Record<'m' | 'i' | 'n' | 'd', HTMLInputElement> = {
    m: document.getElementById('zz-m') as HTMLInputElement,
    i: document.getElementById('zz-i') as HTMLInputElement,
    n: document.getElementById('zz-n') as HTMLInputElement,
    d: document.getElementById('zz-d') as HTMLInputElement,
  };
  const valEls: Record<'m' | 'i' | 'n' | 'd', HTMLElement> = {
    m: document.getElementById('zz-m-val')!,
    i: document.getElementById('zz-i-val')!,
    n: document.getElementById('zz-n-val')!,
    d: document.getElementById('zz-d-val')!,
  };
  const warnEls: Record<'m' | 'i' | 'n' | 'd', HTMLElement> = {
    m: document.getElementById('zz-m-warn')!,
    i: document.getElementById('zz-i-warn')!,
    n: document.getElementById('zz-n-warn')!,
    d: document.getElementById('zz-d-warn')!,
  };
  const scoreEl = document.getElementById('zz-score-num')!;
  const badgeEl = document.getElementById('zz-health-badge')!;
  const nameEl = document.getElementById('zz-health-name')!;
  const insightEl = document.getElementById('zz-health-insight')!;
  const constraintT = document.getElementById('zz-constraint-title')!;
  const constraintTx = document.getElementById('zz-constraint-text')!;
  const overlay = document.getElementById('zz-collapse-overlay')!;
  const overlayDim = document.getElementById('zz-collapse-dim')!;
  const overlayRsn = document.getElementById('zz-collapse-reason')!;
  const resetBtn = document.getElementById('zz-reset')!;

  const FLOOR = 15; // below this triggers collapse state
  const DEFAULTS: Record<'m' | 'i' | 'n' | 'd', number> = { m: 70, i: 60, n: 50, d: 40 };
  const COLORS: Record<'m' | 'i' | 'n' | 'd', string> = {
    m: '#00ff88',
    i: '#00c8ff',
    n: '#7b4bff',
    d: '#ffb400',
  };
  const NAMES: Record<'m' | 'i' | 'n' | 'd', string> = {
    m: 'Material',
    i: 'Intelligence',
    n: 'Network',
    d: 'Diversity',
  };

  // Keep COLORS accessible for potential future use
  void COLORS;

  // -- Three.js setup --
  const wrap = canvas.parentElement!;
  const W = (): number => wrap.clientWidth;
  const H = (): number => wrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: device.tier === 'full', alpha: true });
  renderer.setPixelRatio(device.pixelRatioLimit);
  renderer.setSize(W(), H());
  renderer.setClearColor(0x020204, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 500);
  camera.position.z = 110;

  // -- Particle system --
  const N = zzParticleCount;
  const positions = new Float32Array(N * 3);
  const colors_arr = new Float32Array(N * 3);
  const targets = new Float32Array(N * 3); // orbit targets
  const velocities = new Float32Array(N * 3); // scatter velocities
  const phases = new Float32Array(N); // per-particle phase offset

  // Seeded RNG for deterministic layout
  const rng = (s: number): number => {
    const x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Build cluster targets: 4 clusters (one per dimension) + scattered noise
  const clusterCentres: number[][] = [
    [-28, 18, 0], // M -- top-left
    [28, 18, 0], // I -- top-right
    [-28, -18, 0], // N -- bottom-left
    [28, -18, 0], // D -- bottom-right
  ];
  const clusterColors: number[][] = [
    [0, 1, 0.53], // #00ff88
    [0, 0.78, 1], // #00c8ff
    [0.48, 0.29, 1], // #7b4bff
    [1, 0.71, 0], // #ffb400
  ];

  for (let i = 0; i < N; i++) {
    const ci = i % 4; // which cluster
    const cx = clusterCentres[ci];
    const frac = rng(i * 3);
    const r = frac < 0.7 ? rng(i * 7 + 1) * 22 : rng(i * 13 + 2) * 55;
    const th = rng(i * 5 + 3) * Math.PI * 2;
    const phi = rng(i * 11 + 4) * Math.PI;
    const x = cx[0] + r * Math.sin(phi) * Math.cos(th);
    const y = cx[1] + r * Math.sin(phi) * Math.sin(th);
    const z = cx[2] + r * Math.cos(phi) * 0.3;
    targets[i * 3] = x;
    targets[i * 3 + 1] = y;
    targets[i * 3 + 2] = z;
    positions[i * 3] = (rng(i * 17 + 5) - 0.5) * 160;
    positions[i * 3 + 1] = (rng(i * 19 + 6) - 0.5) * 160;
    positions[i * 3 + 2] = (rng(i * 23 + 7) - 0.5) * 60;
    colors_arr[i * 3] = clusterColors[ci][0];
    colors_arr[i * 3 + 1] = clusterColors[ci][1];
    colors_arr[i * 3 + 2] = clusterColors[ci][2];
    velocities[i * 3] = (rng(i * 29 + 8) - 0.5) * 0.8;
    velocities[i * 3 + 1] = (rng(i * 31 + 9) - 0.5) * 0.8;
    velocities[i * 3 + 2] = (rng(i * 37 + 10) - 0.5) * 0.4;
    phases[i] = rng(i * 41 + 11) * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors_arr, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // -- State --
  const scoreProxy = { val: 0 }; // animated score number
  let mindScore = 52;
  const dimScores: Record<'m' | 'i' | 'n' | 'd', number> = { m: 70, i: 60, n: 50, d: 40 };
  let isCollapsed = false;

  // Keep state interface accessible for type checking
  void ({} as ZoneZeroState);

  // -- UI state updates --
  const HEALTH: HealthState[] = [
    {
      min: 70,
      badge: 'thriving',
      name: 'Symbiotic Zone',
      insight:
        'All four capitals are mutually reinforcing. This city is a candidate for nucleation — a proof-of-concept others will imitate.',
    },
    {
      min: 50,
      badge: 'thriving',
      name: 'Healthy System',
      insight:
        'The city is above the stability threshold. Further investment in the binding constraint will compound across all other capitals.',
    },
    {
      min: 35,
      badge: 'stressed',
      name: 'Under Stress',
      insight:
        'One or more capitals are lagging. The multiplicative penalty is already visible — a 10-point gap here costs more than 10 points in the total score.',
    },
    {
      min: 20,
      badge: 'critical',
      name: 'Critical Threshold',
      insight:
        'The system is near the collapse floor. At this level, capitals begin to degrade each other. Intervention is urgent.',
    },
    {
      min: 1,
      badge: 'critical',
      name: 'Pre-Collapse',
      insight:
        'Any further decline in the binding constraint will trigger systemic cascade. The multiplicative model shows no mercy at this range.',
    },
    {
      min: 0,
      badge: 'collapsed',
      name: 'Systemic Collapse',
      insight:
        'A single dimension at zero pulls the entire product to zero. This is why GDP — which adds rather than multiplies — masks these failures entirely.',
    },
  ];

  const DIM_INSIGHTS: Record<'m' | 'i' | 'n' | 'd', (v: number) => string> = {
    m: (v) =>
      `Material (${v}) is the binding constraint. Physical infrastructure is the substrate everything else runs on — raise it first.`,
    i: (v) =>
      `Intelligence (${v}) is the binding constraint. Without open knowledge infrastructure, the other capitals cannot compound.`,
    n: (v) =>
      `Network (${v}) is the binding constraint. Isolated nodes cannot multiply. Cooperative density is the transmission mechanism.`,
    d: (v) =>
      `Diversity (${v}) is the binding constraint. Monocultures are fragile. Variety is the system's immune response to shocks.`,
  };

  function updateUI(vals: Record<'m' | 'i' | 'n' | 'd', number>): void {
    const score = calcScore(vals);
    mindScore = score;
    const keys: ('m' | 'i' | 'n' | 'd')[] = ['m', 'i', 'n', 'd'];

    // Collapsed?
    const collapsedDim = keys.find((k) => vals[k] <= 0);
    const floorDims = keys.filter((k) => vals[k] > 0 && vals[k] <= FLOOR);
    isCollapsed = !!collapsedDim;

    // Suppress unused variable warning
    void floorDims;

    overlay.classList.toggle('visible', isCollapsed);
    if (isCollapsed && collapsedDim) {
      overlayDim.textContent = `${NAMES[collapsedDim]} at Zero`;
      overlayRsn.textContent = `${NAMES[collapsedDim]} Capital collapsed. In a multiplicative system, one zero destroys the product of all other capitals. M \u00D7 I \u00D7 N \u00D7 0 = 0, always.`;
    }

    // Score number -- tween
    gsap.to(scoreProxy, {
      val: score,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate() {
        scoreEl.textContent = String(Math.round(scoreProxy.val));
      },
      onComplete() {
        scoreEl.textContent = String(score);
      },
    });

    // Score colour class
    scoreEl.classList.remove('stressed', 'collapsing');
    if (score < 35) scoreEl.classList.add('collapsing');
    else if (score < 55) scoreEl.classList.add('stressed');

    // Health state
    const state = HEALTH.find((h) => score >= h.min) || HEALTH[HEALTH.length - 1];
    badgeEl.className = `zz-health-badge ${state.badge}`;
    badgeEl.textContent = state.badge.charAt(0).toUpperCase() + state.badge.slice(1);
    nameEl.textContent = state.name;
    insightEl.textContent = state.insight;

    // Binding constraint
    if (!isCollapsed) {
      const minKey = keys.reduce((a, b) => (vals[a] < vals[b] ? a : b));
      constraintT.textContent = 'Binding Constraint';
      constraintTx.textContent = DIM_INSIGHTS[minKey](vals[minKey]);
    } else {
      constraintT.textContent = 'System Status';
      constraintTx.textContent =
        'Restore any zero-floor dimension above 0 to restart the ecosystem.';
    }

    // Per-slider warnings and fill gradient
    keys.forEach((k) => {
      const v = vals[k];
      const pct = v + '%';
      sliders[k].style.setProperty('--pct', pct);
      valEls[k].textContent = String(v);
      valEls[k].classList.toggle('floor', v <= FLOOR);
      warnEls[k].classList.toggle('visible', v <= FLOOR && v > 0);
    });
  }

  // -- Particle animation --
  let t = 0;
  const dimKeys: ('m' | 'i' | 'n' | 'd')[] = ['m', 'i', 'n', 'd'];
  const scatterAccum = new Float32Array(N * 3); // accumulated scatter offset
  let zzVisible = true;
  let zzAnimRunning = false;

  // Pause render loop when zone-zero section is off-screen (PERF-05)
  const zzSection = container.closest('section') || container;
  const zzRenderObserver = new IntersectionObserver(
    (entries) => {
      zzVisible = entries[0].isIntersecting;
      if (zzVisible && !zzAnimRunning) startZZLoop();
    },
    { threshold: 0 },
  );
  zzRenderObserver.observe(zzSection);

  function animate(): void {
    if (!zzVisible) {
      zzAnimRunning = false;
      return;
    }
    requestAnimationFrame(animate);
    zzAnimRunning = true;
    t += 0.012;

    const pos = geo.attributes.position.array as Float32Array;
    const vals = dimScores;

    // Per-cluster cohesion
    const coh = dimKeys.map((k) => Math.max(0, vals[k] / 100));
    const globalCoh = calcScore(vals) / 100;

    for (let i = 0; i < N; i++) {
      const ci = i % 4;
      const c = coh[ci];
      const ph = phases[i];
      const cx = clusterCentres[ci];

      // Orbit: gentle elliptical drift around cluster centre
      const orbitR = 8 * (1 - c * 0.6); // tighter at high cohesion
      const orbitTh = t * (0.2 + 0.1 * rng(i)) + ph;
      const orbitX = cx[0] + targets[i * 3] * c + orbitR * Math.cos(orbitTh) * (1 - c);
      const orbitY = cx[1] + targets[i * 3 + 1] * c + orbitR * Math.sin(orbitTh) * (1 - c);
      const orbitZ = cx[2] + targets[i * 3 + 2] * c * 0.4;

      // Scatter: grows as cohesion drops
      const scatter = 1 - c;
      scatterAccum[i * 3] += velocities[i * 3] * scatter * 0.05;
      scatterAccum[i * 3 + 1] += velocities[i * 3 + 1] * scatter * 0.05;
      scatterAccum[i * 3 + 2] += velocities[i * 3 + 2] * scatter * 0.02;

      // When cohesion recovers, damp the scatter back
      if (c > 0.5) {
        scatterAccum[i * 3] *= 0.94;
        scatterAccum[i * 3 + 1] *= 0.94;
        scatterAccum[i * 3 + 2] *= 0.94;
      }

      // Clamp scatter so particles don't fly off to infinity
      const sx = Math.max(-80, Math.min(80, scatterAccum[i * 3]));
      const sy = Math.max(-60, Math.min(60, scatterAccum[i * 3 + 1]));
      const sz = Math.max(-30, Math.min(30, scatterAccum[i * 3 + 2]));
      scatterAccum[i * 3] = sx;
      scatterAccum[i * 3 + 1] = sy;
      scatterAccum[i * 3 + 2] = sz;

      pos[i * 3] = orbitX + sx;
      pos[i * 3 + 1] = orbitY + sy;
      pos[i * 3 + 2] = orbitZ + sz;
    }

    geo.attributes.position.needsUpdate = true;

    // Global particle size + opacity follows overall health
    mat.size = 0.6 + globalCoh * 1.8;
    mat.opacity = 0.3 + globalCoh * 0.65;

    // Slow camera drift for life
    camera.position.x = Math.sin(t * 0.08) * 4;
    camera.position.y = Math.cos(t * 0.06) * 2;

    renderer.render(scene, camera);
  }

  function startZZLoop(): void {
    if (!zzAnimRunning) {
      zzAnimRunning = true;
      animate();
    }
  }

  startZZLoop();

  // CONV-09: Track when simulator scrolls into viewport (separate from render-pause observer)
  const analyticsSection = document.getElementById('zone-zero');
  if (analyticsSection) {
    const analyticsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackEvent('Simulator Opened');
          analyticsObserver.disconnect(); // Fire only once
        }
      });
    }, { threshold: 0.2 });
    analyticsObserver.observe(analyticsSection);
  }

  // Suppress unused variable warning for mindScore / isCollapsed
  void mindScore;
  void isCollapsed;

  // -- Resize --
  const ro = new ResizeObserver(() => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
  });
  ro.observe(wrap);

  // -- Slider events --
  let sliderInteracted = false;
  (['m', 'i', 'n', 'd'] as const).forEach((k) => {
    sliders[k].addEventListener('input', () => {
      dimScores[k] = parseInt(sliders[k].value, 10);
      updateUI(dimScores);
      // CONV-09: Track first slider interaction
      if (!sliderInteracted) {
        sliderInteracted = true;
        trackEvent('Simulator Interacted');
      }
    });
  });

  // -- Reset --
  resetBtn.addEventListener('click', () => {
    Object.assign(dimScores, DEFAULTS);
    (['m', 'i', 'n', 'd'] as const).forEach((k) => {
      sliders[k].value = String(DEFAULTS[k]);
    });
    updateUI(dimScores);
    // Clear params from URL without reload
    history.replaceState(null, '', window.location.pathname + window.location.hash);
    document.getElementById('zz-shared-banner')?.classList.remove('visible');
  });

  // -- URL param hydration (load shared config) --
  (function hydrateFromURL(): void {
    const params = new URLSearchParams(window.location.search);
    const keys: ('m' | 'i' | 'n' | 'd')[] = ['m', 'i', 'n', 'd'];
    let hasAny = false;
    keys.forEach((k) => {
      if (params.has(k)) {
        const v = Math.max(0, Math.min(100, parseInt(params.get(k)!, 10) || 0));
        dimScores[k] = v;
        sliders[k].value = String(v);
        hasAny = true;
      }
    });
    if (hasAny) {
      // Show the shared-config banner and scroll section into view after a tick
      document.getElementById('zz-shared-banner')?.classList.add('visible');
      setTimeout(() => {
        updateOGMeta(dimScores.m, dimScores.i, dimScores.n, dimScores.d);
        document.getElementById('zone-zero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  })();

  // -- Share helpers --
  function buildShareURL(): string {
    const base = window.location.origin + window.location.pathname;
    const p = new URLSearchParams({
      m: String(dimScores.m),
      i: String(dimScores.i),
      n: String(dimScores.n),
      d: String(dimScores.d),
    });
    return base + '?' + p.toString() + '#zone-zero';
  }

  function buildShareText(): string {
    const score = calcScore(dimScores);
    const stateName = nameEl.textContent?.trim() || '';
    const constraint = (['m', 'i', 'n', 'd'] as const)
      .slice()
      .sort((a, b) => dimScores[a] - dimScores[b])[0];
    const cName = NAMES[constraint];
    const lines = [
      `My pilot city MIND score: ${score}/100 \u2014 ${stateName}`,
      `M=${dimScores.m} \u00B7 I=${dimScores.i} \u00B7 N=${dimScores.n} \u00B7 D=${dimScores.d}`,
      `Binding constraint: ${cName} Capital`,
      `Try the Zone Zero simulator \u2192`,
    ];
    return lines.join('\n');
  }

  // -- OG meta updater --
  function buildOGImageURL(m: number, i: number, n: number, d: number): string {
    // Microlink screenshot API
    const ogRenderURL =
      'https://intelligenteconomics.ai/og-render.html' +
      '?m=' + m + '&i=' + i + '&n=' + n + '&d=' + d;
    return (
      'https://api.microlink.io/?' +
      'url=' + encodeURIComponent(ogRenderURL) +
      '&screenshot=true' +
      '&meta=false' +
      '&embed=screenshot.url' +
      '&waitForSelector=' + encodeURIComponent('[data-ready="true"]') +
      '&viewport.width=1200' +
      '&viewport.height=630'
    );
  }

  function updateOGMeta(m: number, i: number, n: number, d: number): void {
    const score = calcScore({ m, i, n, d });
    const stateInfo = (() => {
      if (score >= 70) return { name: 'Symbiotic Zone', badge: 'THRIVING' };
      if (score >= 50) return { name: 'Healthy System', badge: 'THRIVING' };
      if (score >= 35) return { name: 'Under Stress', badge: 'STRESSED' };
      if (score >= 20) return { name: 'Critical Threshold', badge: 'CRITICAL' };
      if (score >= 1) return { name: 'Pre-Collapse', badge: 'CRITICAL' };
      return { name: 'Systemic Collapse', badge: 'COLLAPSED' };
    })();
    const title = `Zone Zero ${score}/100 \u2014 ${stateInfo.name} | Intelligent Economics`;
    const desc = `M=${m} \u00B7 I=${i} \u00B7 N=${n} \u00B7 D=${d} \u2014 ${stateInfo.badge}. Can you configure a Symbiotic Zone? Try the simulator.`;
    const imgURL = buildOGImageURL(m, i, n, d);

    // Update <meta> tags that social crawlers read
    const setMeta = (sel: string, attr: string, val: string): void => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };
    setMeta('[property="og:title"]', 'content', title);
    setMeta('[property="og:description"]', 'content', desc);
    setMeta('[property="og:url"]', 'content', window.location.href);
    setMeta('[property="og:image"]', 'content', imgURL);
    setMeta('[name="twitter:title"]', 'content', title);
    setMeta('[name="twitter:description"]', 'content', desc);
    setMeta('[name="twitter:image"]', 'content', imgURL);
    document.title = title;
  }

  // Copy link button
  const copyBtn = document.getElementById('zz-copy-btn');
  const copyLabel = document.getElementById('zz-copy-label');
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', async () => {
      trackEvent('Simulator Shared', { method: 'copy' });
      const url = buildShareURL();
      // Update browser URL + OG meta silently
      history.replaceState(
        null,
        '',
        '?' +
          new URLSearchParams({
            m: String(dimScores.m),
            i: String(dimScores.i),
            n: String(dimScores.n),
            d: String(dimScores.d),
          }).toString() +
          '#zone-zero',
      );
      updateOGMeta(dimScores.m, dimScores.i, dimScores.n, dimScores.d);
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Fallback: select a temporary textarea
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      copyBtn.classList.add('copy-ok');
      copyLabel.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copy-ok');
        copyLabel.textContent = 'Copy link';
      }, 2200);
    });
  }

  // Twitter / X share
  const twitterBtn = document.getElementById('zz-twitter-btn') as HTMLAnchorElement | null;
  function updateTwitterLink(): void {
    if (!twitterBtn) return;
    const text = buildShareText();
    const url = buildShareURL();
    twitterBtn.href =
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + '\n' + url);
  }
  twitterBtn?.addEventListener('click', () => {
    trackEvent('Simulator Shared', { method: 'twitter' });
  });

  // LinkedIn share
  const linkedinBtn = document.getElementById('zz-linkedin-btn') as HTMLAnchorElement | null;
  function updateLinkedInLink(): void {
    if (!linkedinBtn) return;
    const url = buildShareURL();
    linkedinBtn.href =
      'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
  }
  linkedinBtn?.addEventListener('click', () => {
    trackEvent('Simulator Shared', { method: 'linkedin' });
  });

  // Keep share links current on slider input
  function updateShareLinks(): void {
    updateTwitterLink();
    updateLinkedInLink();
  }
  (['m', 'i', 'n', 'd'] as const).forEach((k) => {
    sliders[k].addEventListener('input', updateShareLinks);
  });
  resetBtn.addEventListener('click', updateShareLinks);
  updateShareLinks(); // initialise

  // -- Initial render --
  updateUI(dimScores);
}
