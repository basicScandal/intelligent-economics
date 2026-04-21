/**
 * Countdown timer module.
 * Displays remaining days/hours/mins until the 1000-day window closes (2029-01-09).
 * Also wires up the countdown explanation toggle.
 */
export function initCountdown(): void {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  if (!daysEl || !hoursEl || !minsEl) return;

  const TARGET = new Date('2029-01-09T00:00:00Z');

  function update(): void {
    const now = new Date();
    const diff = TARGET.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl!.textContent = '000';
      hoursEl!.textContent = '00';
      minsEl!.textContent = '00';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    daysEl!.textContent = String(days).padStart(3, '0');
    hoursEl!.textContent = String(hours).padStart(2, '0');
    minsEl!.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 30000);

  // Countdown explanation toggle
  const btn = document.getElementById('countdown-label-btn');
  const explain = document.getElementById('countdown-explain');
  if (btn && explain) {
    btn.addEventListener('click', () => {
      const isHidden = explain.hidden;
      explain.hidden = !isHidden;
      btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  }
}
