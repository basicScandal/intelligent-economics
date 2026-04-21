/**
 * Nav scroll state management.
 * Adds 'scrolled' class to nav when page scrolls past 60px threshold.
 */
export function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener(
    'scroll',
    () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    },
    { passive: true },
  );
}
