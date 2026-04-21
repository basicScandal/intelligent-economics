/**
 * Role card selection module.
 * Manages toggle state for volunteer role cards and syncs
 * selected roles into the hidden form input before submission.
 */
export function initRoleCards(): void {
  const cards = document.querySelectorAll<HTMLButtonElement>('.role-card');
  if (cards.length === 0) return;

  const hiddenInput = document.getElementById('selected-roles') as HTMLInputElement | null;
  if (!hiddenInput) return;

  const selectedRoles = new Set<string>();

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const role = card.getAttribute('data-role');
      if (!role) return;

      if (selectedRoles.has(role)) {
        selectedRoles.delete(role);
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
      } else {
        selectedRoles.add(role);
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
      }

      // Sync selected roles to hidden input for form submission
      hiddenInput.value = Array.from(selectedRoles).join(', ');
    });
  });
}
