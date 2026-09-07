/**
 * Form submission configuration.
 *
 * The site is deployed as static files to GitHub Pages, which answers POST with
 * 405 — so a form has to post to an external endpoint (Formspree, Basin,
 * Getform, a Cloudflare Worker, …). That endpoint is supplied at build time:
 *
 *   PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx npm run build
 *
 * On Netlify the same code works by setting PUBLIC_FORM_ENDPOINT to "/" (or any
 * same-origin path), which is what Netlify Forms expects.
 *
 * When the variable is unset the forms do not silently POST into a 405: they
 * render in fallback mode and send people to CONTACT_EMAIL instead, so a
 * would-be volunteer is never dropped on the floor.
 */

/** Where form submissions are POSTed. Empty string means "not configured". */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

/** True when a submission endpoint is configured for this build. */
export const FORMS_ENABLED: boolean = FORM_ENDPOINT.trim().length > 0;

/** Human fallback used when a submission fails or no endpoint is configured. */
export const CONTACT_EMAIL = 'Rob@theoradical.ai';

/** Build a mailto: link that pre-fills a volunteer signup. */
export function volunteerMailto(): string {
  const subject = 'Volunteer signup — Intelligent Economics';
  const body = [
    'Name:',
    'Email:',
    'City / Region:',
    'Expertise:',
    'Role(s) I want to help with:',
    '',
    '(Sent from intelligenteconomics.ai)',
  ].join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Build a mailto: link for the short email-capture form. */
export function briefingMailto(): string {
  const subject = 'Send me the MIND briefing';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
