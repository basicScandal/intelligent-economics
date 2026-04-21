/**
 * Experiment tab switching logic with ARIA state management.
 * Tabs switch content panels and re-trigger reveal animations.
 */
export function initExperimentTabs(): void {
  const tabs = document.querySelectorAll('.exp-tab');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      document.querySelectorAll('.exp-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      // Hide all panels
      document.querySelectorAll('.exp-panel').forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('inert', '');
      });

      // Activate clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show corresponding panel
      const panelId = (tab as HTMLElement).dataset.panel;
      const panel = document.getElementById('panel-' + panelId);
      if (panel) {
        panel.classList.add('active');
        panel.removeAttribute('inert');

        // Re-observe reveal elements in new panel
        panel.querySelectorAll('.reveal').forEach((el) => {
          el.classList.remove('visible');
        });
      }
    });
  });
}
