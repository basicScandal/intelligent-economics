# Email DNS Setup — intelligenteconomics.ai

## Why Now

Email deliverability requires domain authentication. SPF, DKIM, and DMARC records
need 4-6 weeks of "warming" before sending marketing emails in Phase 6. Configure
these records as soon as possible.

## Records to Add

Add these DNS records at your domain registrar (wherever intelligenteconomics.ai DNS is managed).

### 1. SPF Record

| Type | Host | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:mlsend.com ~all` |

Allows MailerLite (mlsend.com) to send email on behalf of the domain.

### 2. DKIM Record

| Type | Host | Value |
|------|------|-------|
| CNAME | ml._domainkey | `ml.domainkey.mlsend.com` |

NOTE: The exact CNAME value may differ. After adding intelligenteconomics.ai
to MailerLite (Settings > Domains > Add domain), MailerLite will show the
exact DKIM CNAME record to create. Use those values instead if they differ.

### 3. DMARC Record

| Type | Host | Value |
|------|------|-------|
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:dmarc@intelligenteconomics.ai; pct=100` |

Starts in monitoring mode (p=none). Can be tightened to p=quarantine after
verifying deliverability in Phase 6.

## Verification

After adding records, verify propagation:

1. SPF: https://mxtoolbox.com/spf.aspx — enter intelligenteconomics.ai
2. DKIM: https://mxtoolbox.com/dkim.aspx — selector: ml, domain: intelligenteconomics.ai
3. DMARC: https://mxtoolbox.com/dmarc.aspx — enter intelligenteconomics.ai

DNS propagation can take up to 48 hours.

## MailerLite Account Setup

1. Create account at https://www.mailerlite.com/ (free tier: 1000 subscribers)
2. Go to Settings > Domains > Add domain
3. Enter intelligenteconomics.ai
4. MailerLite will provide exact DNS records — cross-reference with above
5. Click "Verify" after DNS records propagate
