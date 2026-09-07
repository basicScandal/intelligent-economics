/**
 * Form submission handler.
 *
 * The site is static (GitHub Pages), so submissions are POSTed to an external
 * endpoint configured at build time via PUBLIC_FORM_ENDPOINT and written onto
 * the <form> as data-endpoint. Both the volunteer signup and the email capture
 * share this code path.
 *
 * Behaviour:
 *   - endpoint configured   -> fetch POST, inline success / error states
 *   - endpoint missing      -> the form never renders (the .astro components
 *                              show the mailto fallback instead), so this
 *                              module simply finds nothing to wire up
 *   - submission fails      -> error panel with a retry button AND a mailto:
 *                              fallback, so a visitor is never left stranded
 */

import { trackEvent } from './analytics';

/**
 * Honeypot check. The `bot-field` input is hidden from humans, so anything that
 * fills it is a bot. Return true to drop the submission silently — bots get the
 * same success UI they would have got, and nothing is sent.
 */
function isBot(form: HTMLFormElement): boolean {
  const field = form.querySelector('input[name="bot-field"]') as HTMLInputElement | null;
  return Boolean(field && field.value.trim());
}

/** Read the build-time endpoint that the component stamped onto the form. */
function endpointFor(form: HTMLFormElement): string {
  return (form.dataset.endpoint || '').trim();
}

/**
 * POST a form to its endpoint.
 *
 * Same-origin endpoints (Netlify Forms) want URL-encoded bodies; third-party
 * endpoints (Formspree, Basin, Getform) all accept JSON and give clearer
 * errors with it. Pick by whether the endpoint is absolute.
 */
async function postForm(form: HTMLFormElement, endpoint: string): Promise<Response> {
  const formData = new FormData(form);
  const isAbsolute = /^https?:\/\//i.test(endpoint);

  if (isAbsolute) {
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = typeof value === 'string' ? value : value.name;
    });
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  return fetch(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams(formData as unknown as Record<string, string>),
  });
}

/**
 * Initialize the volunteer signup form.
 * On success: hides form, shows success message (CONV-02).
 * On failure: shows error with retry button and email fallback (CONV-03).
 */
export function initVolunteerForm(): void {
  const form = document.querySelector('#volunteer-form') as HTMLFormElement | null;
  if (!form) return;

  const endpoint = endpointFor(form);
  if (!endpoint) return;

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

    // Silently drop bot submissions without hitting the endpoint
    if (isBot(form)) {
      form.style.display = 'none';
      successEl.classList.add('visible');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const response = await postForm(form, endpoint);

      if (response.ok) {
        trackEvent('Form Submitted', { form: 'volunteer' });
        // CONV-02: Show success only after the endpoint confirms receipt
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
 * Initialize the email capture form.
 * On success: hides form, shows inline success (CONV-05).
 * On failure: shows a brief error plus email fallback, re-enables button (CONV-03).
 */
export function initEmailCapture(): void {
  const form = document.querySelector('#early-email-form') as HTMLFormElement | null;
  if (!form) return;

  const endpoint = endpointFor(form);
  if (!endpoint) return;

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

    // Silently drop bot submissions without hitting the endpoint
    if (isBot(form)) {
      form.style.display = 'none';
      successEl.classList.add('visible');
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await postForm(form, endpoint);

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
