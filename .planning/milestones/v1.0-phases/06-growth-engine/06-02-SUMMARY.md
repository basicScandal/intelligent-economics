---
phase: 06-growth-engine
plan: 02
subsystem: growth
tags: [email, mailerlite, discord, community, onboarding, welcome-sequence]

# Dependency graph
requires:
  - phase: 03-conversion-pipeline
    provides: Netlify Forms + MailerLite integration for subscriber capture
  - phase: 06-01
    provides: Team/About section and organizational identity
provides:
  - 4-email welcome sequence templates for MailerLite (14-day drip)
  - Discord server setup guide with channel structure and role configuration
  - Cross-referenced invite link placeholders connecting emails to Discord
affects: [user-setup, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: [markdown-email-templates, documentation-driven-setup]

key-files:
  created:
    - docs/emails/01-welcome.md
    - docs/emails/02-simulator-deep-dive.md
    - docs/emails/03-first-micro-task.md
    - docs/emails/04-progress-feedback.md
    - docs/discord-setup.md
  modified: []

key-decisions:
  - "Email templates as Markdown docs user pastes into MailerLite visual editor -- no code integration needed"
  - "Discord setup as step-by-step manual guide -- no bot automation at launch"
  - "Carl-bot for free reaction-based role assignment in Discord"

patterns-established:
  - "Email template structure: metadata header, body, CTA, MailerLite notes"
  - "Documentation-only artifacts for external service configuration"

requirements-completed: [GROW-01, GROW-02, GROW-03]

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 6 Plan 2: Email Welcome Sequence and Discord Setup Summary

**4-email welcome sequence (Day 0/3/7/14) with role-based micro-tasks driving Discord community engagement, plus full Discord server setup guide with 11 channels and 6 color-coded roles**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-21T08:48:24Z
- **Completed:** 2026-04-21T08:51:35Z
- **Tasks:** 2
- **Files created:** 5

## Accomplishments

- Created 4 email templates covering full 14-day welcome sequence with increasing engagement depth
- Each email has exactly one primary CTA and unsubscribe notice (GROW-02 compliance)
- Discord setup guide documents 11 channels in 3 categories, 6 roles with site-matching colors, and Carl-bot reaction role setup
- Cross-references wired: emails 1 and 3 include [DISCORD_INVITE_LINK] placeholders, Discord guide references all 3 files needing the link

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 4-email welcome sequence templates** - `51f09f1` (feat)
2. **Task 2: Create Discord server setup guide** - `0b8c200` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `docs/emails/01-welcome.md` - Day 0 welcome email with MIND explainer and Discord invite
- `docs/emails/02-simulator-deep-dive.md` - Day 3 Zone Zero simulator deep-dive with share challenge
- `docs/emails/03-first-micro-task.md` - Day 7 role-based micro-tasks with Discord CTA
- `docs/emails/04-progress-feedback.md` - Day 14 progress update and feedback ask via reply
- `docs/discord-setup.md` - Full Discord server setup guide with channels, roles, moderation, and checklist

## Decisions Made

- **Email templates as Markdown documentation:** Templates are designed to be pasted into MailerLite's visual editor rather than programmatically integrated. This keeps the pipeline manual but zero-dependency.
- **Carl-bot for role self-assignment:** Free tier sufficient for reaction-based role assignment. No custom bot development needed at launch scale.
- **11 channels instead of 9:** Added #welcome and #announcements (read-only information channels) beyond the 9 GROW-03 channels for proper community structure. GROW-03 channels are a subset.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**External services require manual configuration:**
- **MailerLite:** Copy email template content into MailerLite automation builder, configure delays (Day 0/3/7/14), set conditional content for Email 3 role-based tasks
- **Discord:** Follow docs/discord-setup.md step-by-step to create server, channels, roles, and generate invite link
- **Invite link:** After Discord setup, replace [DISCORD_INVITE_LINK] in VolunteerForm.astro, email 01, and email 03

## Next Phase Readiness

- Phase 06 (growth-engine) plans complete -- all v1 requirements addressed
- User manual actions remain: MailerLite automation setup, Discord server creation, invite link replacement
- GROW-04 (Discord invite on form success + emails) depends on user completing Discord setup and replacing placeholder links

## Self-Check: PASSED

- All 5 created files verified present on disk
- Both task commits (51f09f1, 0b8c200) verified in git log

---
*Phase: 06-growth-engine*
*Completed: 2026-04-21*
