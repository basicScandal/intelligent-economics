# Discord Server Setup Guide

Step-by-step guide to create and configure the Intelligent Economics Discord server.

## Overview

Discord is the community hub for the Intelligent Economics movement. It gives volunteers a place to meet by role, share work, and coordinate contributions. This guide walks through creating the server, configuring channels and roles, and generating the invite link used across the site and email sequence.

**Time required:** 30-45 minutes for initial setup.

## Step 1: Create the Server

1. Go to [discord.com](https://discord.com) or open the Discord desktop app
2. Click the **+** button in the server sidebar
3. Choose **Create My Own**
4. Select **For a club or community**
5. Server name: **Intelligent Economics**
6. Upload server icon (use the site's network/MIND logo or a custom icon matching the bioluminescent palette)
7. Click **Create**

## Step 2: Enable Community Features

Before creating channels, enable Community features for access to welcome screens and announcement channels.

1. Go to **Server Settings > Community > Enable Community**
2. Accept the requirements (verified email, explicit media content filter)
3. Set **#welcome** as the rules/guidelines channel (you'll create it next)
4. Set **#announcements** as the community updates channel
5. Enable **Membership Screening** -- create a simple welcome gate:
   - "What brings you to Intelligent Economics?"
   - "I agree to be respectful and constructive"
   - "I understand this is a volunteer-driven movement"

## Step 3: Create Channels

Delete the default channels Discord created, then create the following structure.

### Information (category)

| Channel | Type | Permissions | Purpose |
|---------|------|------------|---------|
| #welcome | Text | Read-only (everyone) | Server rules, getting started guide, links to key resources |
| #announcements | Text | Read-only (everyone) | Updates from the team -- new features, milestones, events |

### Community (category)

| Channel | Type | Permissions | Purpose |
|---------|------|------------|---------|
| #introductions | Text | Open | New members introduce themselves -- name, location, what drew them to MIND |
| #general | Text | Open | Open discussion, off-topic, movement-related conversation |
| #zone-zero-ideas | Text | Open | Simulator experiments, proposed configurations, what-if scenarios |

### Roles (category)

| Channel | Type | Permissions | Purpose |
|---------|------|------------|---------|
| #economists | Text | Open | Economic theory, GDP alternatives, MIND framework discussion |
| #engineers | Text | Open | Technical contributions, GitHub issues, code and data |
| #designers | Text | Open | Visual design, data visualization, communication materials |
| #organizers | Text | Open | Local outreach, partnerships, event coordination |
| #researchers | Text | Open | Academic papers, data sources, methodology |
| #policymakers | Text | Open | Policy briefs, elevator pitches, government engagement |

**Total: 11 channels** (2 information + 3 community + 6 role-based)

## Step 4: Set Up Roles

Create roles matching the volunteer form role cards on the website. Members self-assign via reaction roles.

| Role | Color | Hex Code | Matches |
|------|-------|----------|---------|
| Economist / Theorist | Green | #00ff88 | Site role card "Economists & Theorists" |
| Engineer / Builder | Purple | #7b4bff | Site role card "Engineers & Builders" |
| Designer / Communicator | Cyan | #00c8ff | Site role card "Designers & Communicators" |
| Community Organizer | Amber | #ffb400 | Site role card "Community Organizers" |
| Researcher / Academic | Pink | #ff6482 | Site role card "Researchers & Academics" |
| Policymaker / Advocate | Teal | #00c8ff | Site role card "Policymakers & Advocates" |

### Role assignment method

Use **Carl-bot** (free tier) for reaction-based role assignment:

1. Invite Carl-bot: https://carl.gg
2. Go to Carl-bot dashboard > **Reaction Roles**
3. Create a reaction role message in **#welcome**
4. Map emoji to roles:
   - Chart emoji -> Economist / Theorist
   - Wrench emoji -> Engineer / Builder
   - Paintbrush emoji -> Designer / Communicator
   - Handshake emoji -> Community Organizer
   - Microscope emoji -> Researcher / Academic
   - Scroll emoji -> Policymaker / Advocate
5. Post the message and verify reactions work

## Step 5: Pin "Start Here" Messages

In each role-based channel, pin a welcome message with the following structure.

### Template for pinned messages

```
Welcome to #[channel-name]!

**What this role contributes to the movement:**
[1-2 sentences about how this expertise advances the MIND framework]

**Your first action:**
[The micro-task from Email 3 for this role]

**Relevant resources:**
- [Link to relevant section on intelligenteconomics.ai]
- [Link to any relevant GitHub repo, paper, or tool]

Ask questions, share work, and tag @[role] to get attention from others in your lane.
```

### Example pinned messages per channel

**#economists** -- "Economists and theorists challenge the assumptions behind GDP and refine the MIND framework's mathematical model. Your first action: Post your take on GDP's single biggest measurement failure."

**#engineers** -- "Engineers and builders create the tools that make MIND measurable. Your first action: Review GitHub issues tagged 'good-first-issue' and comment on one you'd tackle."

**#designers** -- "Designers and communicators make the MIND framework legible to everyone. Your first action: Sketch one alternative visualization for the MIND Dashboard and share it here."

**#organizers** -- "Community organizers connect the movement to local institutions and real communities. Your first action: Identify one local organization that might care about alternative economic indicators and share it here."

**#researchers** -- "Researchers and academics ground the MIND framework in evidence. Your first action: Find one recent paper on alternative economic indicators and share the link with a 2-sentence summary."

**#policymakers** -- "Policymakers and advocates translate the MIND framework into language that moves governments. Your first action: Draft a 3-sentence elevator pitch for MIND aimed at a city council member and share it here."

## Step 6: Generate Invite Link

1. Go to **Server Settings > Invites**
2. Click **Create Invite**
3. Set **Max Age** to **Never** (no expiration)
4. Set **Max Uses** to **No limit**
5. Copy the invite link

### Replace the placeholder in these files

After generating the invite link, search the codebase for `[DISCORD_INVITE_LINK]` and replace with the actual URL:

| File | Location | Context |
|------|----------|---------|
| `src/components/VolunteerForm.astro` | Form success screen | Shown after volunteer signup |
| `docs/emails/01-welcome.md` | Body text | "Join our Discord" link |
| `docs/emails/03-first-micro-task.md` | Body text + CTA button | Primary CTA drives to Discord |

```bash
# Quick find-and-replace command (run from project root):
grep -rn "DISCORD_INVITE_LINK" docs/ src/
```

## Step 7: Configure Moderation

### AutoMod

1. Go to **Server Settings > AutoMod**
2. Enable **Block Mention Spam** (threshold: 5 mentions)
3. Enable **Block Spam Content** (Discord's ML filter)
4. Optionally add custom keyword filters for obvious spam patterns

### Slow Mode

Set slow mode on high-traffic channels to prevent spam:

| Channel | Slow Mode |
|---------|-----------|
| #general | 30 seconds |
| #introductions | 60 seconds |
| All role channels | None (low traffic initially) |

### Moderation Bot (optional, at scale)

If the community grows past 50 active members, consider adding:

- **MEE6** -- Auto-moderation, welcome messages, leveling
- **Dyno** -- Advanced moderation logs, auto-role, custom commands

Not needed at launch. Add when moderation becomes a time burden.

## Post-Setup Checklist

- [ ] Server created with name "Intelligent Economics"
- [ ] Community features enabled with membership screening
- [ ] 11 channels created in 3 categories (Information, Community, Roles)
- [ ] 6 roles created with correct colors
- [ ] Carl-bot installed with reaction roles in #welcome
- [ ] Pinned "Start Here" messages in all 6 role channels
- [ ] Invite link generated (never-expire, unlimited uses)
- [ ] Invite link replaced in VolunteerForm.astro, email 01, and email 03
- [ ] AutoMod enabled
- [ ] Slow mode set on #general (30s) and #introductions (60s)
- [ ] Post a welcome message in #announcements introducing the server

---

*This is a documentation artifact. All setup is performed manually through Discord's web or desktop interface.*
