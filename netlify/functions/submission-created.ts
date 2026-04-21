/**
 * Netlify submission-created event handler.
 * Fires automatically when any Netlify Form receives a submission
 * (the function name "submission-created" is a Netlify convention).
 *
 * Syncs subscriber email to MailerLite for welcome email automation.
 * Handles both "volunteer-signup" and "email-capture" form submissions.
 *
 * CONV-06: MailerLite subscriber sync via Netlify Functions.
 * Graceful degradation: if MailerLite is not configured or API fails,
 * the form submission still succeeds (returns 200).
 */

interface SubmissionPayload {
  payload: {
    form_name: string;
    data: Record<string, string>;
  };
}

interface MailerLiteBody {
  email: string;
  fields: Record<string, string>;
  groups?: string[];
}

export default async (req: Request): Promise<Response> => {
  let payload: SubmissionPayload['payload'];

  try {
    const body: SubmissionPayload = await req.json();
    payload = body.payload;
  } catch {
    console.error('[submission-created] Failed to parse request body');
    return new Response(JSON.stringify({ statusCode: 200, body: 'Invalid payload, skipping' }), {
      status: 200,
    });
  }

  // Extract email -- if missing, nothing to sync
  const email = payload?.data?.email;
  if (!email || !email.trim()) {
    console.log('[submission-created] No email in submission, skipping MailerLite sync');
    return new Response(JSON.stringify({ statusCode: 200, body: 'No email, skipping' }), {
      status: 200,
    });
  }

  // Check for MailerLite API key -- graceful degradation if not configured
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.warn('[submission-created] MAILERLITE_API_KEY not set -- skipping subscriber sync. Forms still work without email integration.');
    return new Response(JSON.stringify({ statusCode: 200, body: 'MailerLite not configured, skipping' }), {
      status: 200,
    });
  }

  // Build MailerLite subscriber payload
  const formName = payload.form_name || 'unknown';
  const subscriberBody: MailerLiteBody = {
    email: email.trim(),
    fields: {},
  };

  // Include name fields for volunteer-signup form
  if (formName === 'volunteer-signup') {
    const firstName = payload.data.first_name?.trim();
    const lastName = payload.data.last_name?.trim();
    if (firstName) subscriberBody.fields.name = firstName;
    if (lastName) subscriberBody.fields.last_name = lastName;
  }

  // Add to subscriber group if configured
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (groupId) {
    subscriberBody.groups = [groupId];
  }

  // POST to MailerLite API
  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberBody),
    });

    if (response.ok) {
      console.log(`[submission-created] Subscriber synced to MailerLite: ${email} (form: ${formName})`);
    } else {
      const errorText = await response.text().catch(() => 'Unable to read response');
      console.error(`[submission-created] MailerLite API error (${response.status}): ${errorText}`);
    }
  } catch (err) {
    // Network error or fetch failure -- log but do NOT break form flow
    console.error('[submission-created] MailerLite API call failed:', err);
  }

  // Always return 200 -- the form submission is already saved in Netlify Forms.
  // We never want a MailerLite issue to break the form submission flow.
  return new Response(JSON.stringify({ statusCode: 200, body: 'Subscriber synced' }), {
    status: 200,
  });
};
