/**
 * Form submission handler for Netlify Forms.
 * Handles both volunteer signup and email capture forms via fetch POST (AJAX).
 * Provides inline success/error states instead of Netlify's default redirect.
 *
 * CONV-04: Duplicate email handling is automatic on Netlify's side.
 * Netlify Forms accepts all submissions including duplicates and flags
 * them in the dashboard. No client-side dedup logic is needed.
 */

import { trackEvent } from './analytics';

/**
 * Initialize the volunteer signup form with fetch-based submission.
 * On success: hides form, shows success message (CONV-02).
 * On failure: shows error with retry button (CONV-03).
 */
export function initVolunteerForm(): void {
  const form = document.querySelector('#volunteer-form') as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit') as HTMLButtonElement | null;
  const successEl = document.getElementById('signup-success');
  const errorEl = document.getElementById('form-error');
  const retryBtn = document.getElementById('form-retry');

  if (!submitBtn || !successEl) return;

  // CONV-08: Track first interaction with form
  let formStarted = false;
  form.addEventListener('focusin', () => {
    if (!formStarted) {
      formStarted = true;
      trackEvent('Form Started', { form: 'volunteer' });
    }
  });

  const originalBtnText = submitBtn.textContent || 'Join the Nucleation';

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    // Basic client-side validation
    const emailInput = form.querySelector('#email') as HTMLInputElement | null;
    const firstNameInput = form.querySelector('#first-name') as HTMLInputElement | null;
    const lastNameInput = form.querySelector('#last-name') as HTMLInputElement | null;

    if (emailInput && !emailInput.value.includes('@')) {
      emailInput.focus();
      return;
    }
    if (firstNameInput && !firstNameInput.value.trim()) {
      firstNameInput.focus();
      return;
    }
    if (lastNameInput && !lastNameInput.value.trim()) {
      lastNameInput.focus();
      return;
    }

    // Hide any previous error
    errorEl?.classList.remove('visible');

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const formData = new FormData(form);

      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(formData as unknown as Record<string, string>),
      });

      if (response.ok) {
        trackEvent('Form Submitted', { form: 'volunteer' });
        // CONV-02: Show success only after Netlify confirms receipt
        form.style.display = 'none';
        successEl.classList.add('visible');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showVolunteerError(submitBtn, originalBtnText, errorEl);
      }
    } catch {
      // Network error or fetch failure (CONV-03)
      showVolunteerError(submitBtn, originalBtnText, errorEl);
    }
  });

  // Retry button re-enables the form for another attempt
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      errorEl?.classList.remove('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
  }
}

/** Show error state for volunteer form and re-enable submission. */
function showVolunteerError(
  btn: HTMLButtonElement,
  originalText: string,
  errorEl: HTMLElement | null,
): void {
  btn.disabled = false;
  btn.textContent = originalText;
  errorEl?.classList.add('visible');
}

/**
 * Initialize the email capture form with fetch-based submission.
 * On success: hides form, shows inline success (CONV-05).
 * On failure: shows brief error, re-enables button (CONV-03).
 */
export function initEmailCapture(): void {
  const form = document.querySelector('#early-email-form') as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector('.email-capture__btn') as HTMLButtonElement | null;
  const successEl = document.getElementById('early-email-success');
  const errorEl = document.getElementById('early-email-error');

  if (!submitBtn || !successEl) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    // Validate email
    const emailInput = form.querySelector('#early-email') as HTMLInputElement | null;
    if (emailInput && !emailInput.value.includes('@')) {
      emailInput.focus();
      return;
    }

    // Hide any previous error
    errorEl?.classList.remove('visible');

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(form);

      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(formData as unknown as Record<string, string>),
      });

      if (response.ok) {
        trackEvent('Form Submitted', { form: 'email-capture' });
        form.style.display = 'none';
        successEl.classList.add('visible');
      } else {
        showEmailError(submitBtn, errorEl);
      }
    } catch {
      // Network error (CONV-03)
      showEmailError(submitBtn, errorEl);
    }
  });
}

/** Show error state for email capture form and re-enable submission. */
function showEmailError(
  btn: HTMLButtonElement,
  errorEl: HTMLElement | null,
): void {
  btn.disabled = false;
  btn.textContent = 'Get the Briefing';
  errorEl?.classList.add('visible');
}
