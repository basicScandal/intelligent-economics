import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize IntersectionObserver-based reveal animations.
 * Elements with .reveal class get .visible when entering viewport.
 */
export function initScrollReveals(): void {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * GSAP clip-path diagonal wipes for pillar cards and MIND panels.
 * Even cards wipe from bottom-left, odd from top-right.
 */
export function initClipWipes(): void {
  // Pillar cards
  const pillarCards = gsap.utils.toArray('.pillar-card') as HTMLElement[];
  pillarCards.forEach((card, i) => {
    const fromClip =
      i % 2 === 0
        ? 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)'
        : 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)';
    const toClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

    gsap.set(card, { clipPath: fromClip, opacity: 1 });

    gsap.to(card, {
      clipPath: toClip,
      duration: 0.9,
      ease: 'power3.out',
      delay: (i % 3) * 0.1,
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // MIND panel: right-edge wipe
  const mindPanel = document.querySelector('.mind__panel') as HTMLElement | null;
  if (mindPanel) {
    gsap.set(mindPanel, {
      clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    });
    gsap.to(mindPanel, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: mindPanel,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }

  // MIND left column: left-edge wipe
  const mindLeft = document.querySelector(
    '#mind .mind__grid > div:first-child',
  ) as HTMLElement | null;
  if (mindLeft) {
    gsap.set(mindLeft, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      opacity: 1,
    });
    mindLeft.classList.add('visible');
    gsap.to(mindLeft, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: mindLeft,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });
  }
}

/**
 * MIND dashboard bar counter animation.
 * Bars fill and numbers count up when panel enters viewport.
 */
export function initMindCounters(): void {
  const panel = document.querySelector('.mind__panel') as HTMLElement | null;
  if (!panel) return;

  const rows = Array.from(panel.querySelectorAll('.mind-bar-row')).map(
    (row) => ({
      fill: row.querySelector('.mind-bar-fill') as HTMLElement | null,
      val: row.querySelector('.mind-bar-val') as HTMLElement | null,
      target: parseInt(
        (row.querySelector('[data-target]') as HTMLElement)?.dataset.target ||
          '0',
        10,
      ),
    }),
  );

  const STAGGER = 0.18;
  const DURATION = 1.4;
  const EASE = 'power2.out';
  let fired = false;

  function runCounters(): void {
    if (fired) return;
    fired = true;

    rows.forEach((row, i) => {
      const proxy = { val: 0, pct: 0 };
      if (row.fill) row.fill.style.width = '0%';
      if (row.val) row.val.textContent = '0';

      gsap.to(proxy, {
        val: row.target,
        pct: row.target,
        duration: DURATION,
        ease: EASE,
        delay: i * STAGGER,
        onUpdate() {
          if (row.val) row.val.textContent = String(Math.round(proxy.val));
          if (row.fill) row.fill.style.width = proxy.pct.toFixed(1) + '%';
        },
        onComplete() {
          if (row.val) row.val.textContent = String(row.target);
          if (row.fill) row.fill.style.width = row.target + '%';
        },
      });
    });
  }

  // Reset to zero immediately so the page never shows stale values
  rows.forEach((row) => {
    if (row.fill) row.fill.style.width = '0%';
    if (row.val) row.val.textContent = '0';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          io.disconnect();
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
  );

  io.observe(panel);
}
