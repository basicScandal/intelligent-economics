/**
 * Theme toggle module.
 *
 * Two parts work together:
 * 1. An `is:inline` snippet in <head> (BaseLayout.astro) reads localStorage
 *    and sets `data-theme` before first paint to prevent FOUC.
 * 2. This function wires up the toggle button click handler.
 */
export function initThemeToggle(): void {
  const toggle = document.querySelector('[data-theme-toggle]') as HTMLButtonElement | null;
  if (!toggle) return;

  const root = document.documentElement;

  // SVG icons
  const moonSVG =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sunSVG =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  function getTheme(): string {
    return root.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme: string): void {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle!.setAttribute(
      'aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
    );
    toggle!.innerHTML = theme === 'dark' ? moonSVG : sunSVG;
  }

  toggle.addEventListener('click', () => {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Set initial icon based on current theme
  const currentTheme = getTheme();
  toggle.innerHTML = currentTheme === 'dark' ? moonSVG : sunSVG;
  toggle.setAttribute(
    'aria-label',
    `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`,
  );
}
