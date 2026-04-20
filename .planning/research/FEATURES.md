# Feature Research

**Domain:** Movement/advocacy platform for economic reform (Beyond GDP / MIND framework)
**Researched:** 2026-04-21
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = platform feels broken or untrustworthy. Derived from analysis of 350.org, Sunrise Movement, Doughnut Economics Action Lab (DEAL), WEAll, Creative Commons, and Code for America.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Working email capture / signup form | Every movement site captures supporters. A broken form (current state) is catastrophic -- every lost signup is a lost volunteer. 350.org uses 3-field forms (name, email, country). | LOW | Netlify Forms or Resend. Must persist data, confirm to user, and trigger welcome flow. |
| Clear primary CTA above the fold | Sunrise, 350.org, DEAL all have one unmistakable "Join" action visible without scrolling. Visitors need to know what to do in under 5 seconds. | LOW | Single prominent button near hero. "Join the Movement" or "Stay Informed" -- not multiple competing CTAs. |
| Mobile-responsive design | 60%+ of traffic is mobile. Climate/reform movements skew younger (mobile-first). A desktop-only experience loses the majority. | MEDIUM | Current Three.js particles need conditional reduction. Touch targets >= 44px. |
| Team/About page with real humans | Trust signals are critical for credibility. Visitors need to see who founded this, why they're credible, and that real people stand behind it. Anonymous movements struggle to convert. | LOW | Named founder(s) with photo, brief bio, LinkedIn link. Not a full org chart -- just enough to trust. |
| Privacy-respecting analytics | You must measure to improve. But advocacy audiences are privacy-sensitive. Heavy tracking erodes trust. Plausible/Fathom are table stakes for this audience. | LOW | Plausible (GDPR-compliant, no cookies, lightweight script). Track page views, referrers, UTM campaigns. |
| Social proof / credibility signals | WEAll shows government partnerships, DEAL shows 400+ community members. Visitors need evidence the movement has traction. | LOW | Supporter count, media mentions, institutional interest. Honest -- never fabricate. |
| Compelling storytelling / mission clarity | Nonprofits that only share statistics fail. The "why" must be visceral, human, and clear within 30 seconds. DEAL uses Kate Raworth's personal narrative as anchor. | MEDIUM | Already strong in current site content. Preserve and enhance with clearer hierarchy. |
| Welcome email within 24 hours | Research shows first-30-day communication determines retention. Supporters who receive no response assume they were ignored. | LOW | Automated via Resend/Loops. Immediate confirmation + first substantive email within 24h. |
| Accessible design (WCAG 2.1 AA) | Legal requirement in many jurisdictions. Moral imperative for an equity-focused movement. Screen reader users, keyboard navigators, and reduced-motion users must be served. | MEDIUM | Already partially implemented (aria labels, reduced motion). Complete audit needed. |
| Working navigation and content structure | Current monolithic page is impressive but hard to navigate. Users expect to find specific content (about, join, resources) without hunting. | MEDIUM | Astro component architecture enables proper routing. Keep scroll experience but add nav anchors. |

### Differentiators (Competitive Advantage)

Features that set Intelligent Economics apart. These are where the MIND framework competes against Doughnut Economics, WEAll, OECD Beyond GDP, etc.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive Zone Zero simulator | No other Beyond GDP framework has an interactive tool showing how dimensional collapse kills prosperity. This is the "aha moment" for the MIND framework -- it makes the abstract visceral. DEAL has static diagrams; MIND has a live simulator. | MEDIUM | Already built (4 sliders, real-time visualization). Needs mobile optimization and clearer pedagogical framing. |
| Countdown timer with real urgency | The 1000-day window (ending 2029-01-09) tied to concrete UN/policy milestones creates authentic scarcity. Unlike fake marketing timers, this connects to real institutional deadlines. | LOW | Already built. Ensure it links to the "why" -- what happens at the deadline. |
| Ladder of engagement (explicit progression) | Most movement sites have implicit pathways. Explicitly showing "Here's how you go from curious to contributor" is rare and powerful. Sunrise does this well with Welcome Call -> Hub -> Member -> Leader Portal. | MEDIUM | Design clear pathways: Email subscriber -> Discord member -> Working group participant -> Chapter leader. Surface progression visibly. |
| MIND Score dashboard (future) | Interactive data visualization showing MIND dimensions by country/city. No other framework offers a self-service policy evaluation tool. OECD has static PDFs; this would be live and explorable. | HIGH | Deferred to P2. Requires World Bank API integration, D3/Observable visualization, data normalization. |
| Academic novelty: Intelligence dimension | No existing Beyond GDP framework treats AI/intelligence as a core economic dimension. This is genuinely novel in the field. The site must communicate this clearly. | LOW | Content/messaging work, not a technical feature. Ensure the "what's different" is crystal clear within 60 seconds. |
| "MIND Score for My City" tool (future) | Localized policy evaluation lets practitioners see their jurisdiction's MIND profile. DEAL has "City Portraits" but they're consultant-created, not self-service. | HIGH | Deferred to P3. Requires validated methodology, data sources per city, user input flows. |
| Welcome email sequence (4 emails / 14 days) | Most movement sites send one welcome email then silence. A thoughtful 4-email sequence educates, builds relationship, and makes the first "ask" (join Discord, share with 1 person). Research shows 5-7 emails over 60 days optimal -- but 4/14 days is appropriate for a fast-moving movement. | MEDIUM | Sequence: (1) Welcome + mission, (2) MIND explainer, (3) Community invitation, (4) First contribution ask. |
| Open-source ethos and transparency | Mozilla and Creative Commons succeed by being radically transparent about their work. Publishing methodology, inviting critique, sharing data openly -- this builds academic credibility and trust simultaneously. | LOW | Publish MIND methodology openly. Link to working papers. Invite peer review. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for a pre-traction movement site.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / login system | "Let people track their involvement" | Massive implementation overhead (auth, password reset, profile management, security). Zero value before you have 100+ active contributors. Creates friction at signup -- people abandon registration forms. | Email-only signup. Discord handles identity and community features. Add accounts only when you need to gate specific tools (P3+). |
| Real-time chat on site | "Visitors should be able to ask questions immediately" | Requires 24/7 moderation or you get spam/unanswered questions that erode trust. Implementation complexity (WebSocket, state management). Creates expectation of instant response. | Link to Discord for community discussion. Async by nature, moderation built-in, no custom infrastructure. |
| Donation functionality | "Movements need money" | Premature for pre-traction phase. Adds legal/compliance complexity (financial disclosures, payment processing, tax receipts). Splits the CTA -- "join" competes with "donate." | Defer until movement has clear use-of-funds story and 501(c)(3) status or fiscal sponsor. Single CTA: join first. |
| Blog / news feed | "We need fresh content to drive traffic" | Content treadmill. Stale blogs (last post 3 months ago) actively harm credibility. Requires consistent editorial effort the team may not sustain. | Evergreen content architecture. Updates via email newsletter to subscribers. Site content should be timeless framework explanation, not news. |
| Gamification / points / badges | "Motivate volunteers with rewards" | Feels manipulative for an intellectual movement. Attracts engagement-seekers not genuine contributors. Complex to implement well. Trivializes serious policy work. | Recognition through meaningful roles (Discord roles, contributor credits, named working groups). |
| Multi-language support | "Reach global audience" | Translation maintenance is a permanent resource drain. Partial translation is worse than none. The MIND framework needs to be validated in English first before expanding. | Defer to P3. Publish in English. Let community-driven translation emerge organically if demand exists. |
| Petition / letter-writing tool | "Advocacy sites need action tools" | Premature. You need a policy target, a specific ask, and a supporter base first. Building action infrastructure before having an audience is building a megaphone before having a message. | Build supporter base first (P0-P1). Add action tools when you have a specific campaign and 500+ supporters (P3+). |
| AI chatbot for MIND framework Q&A | "Let AI explain the framework" | Hallucination risk with novel academic content. Maintenance burden. Distraction from the core conversion goal. Visitors need human connection, not AI interaction. | Clear FAQ section. Well-structured content hierarchy. Discord for questions with human answers. |
| Volunteer matching / project boards | "Help people find what to do" | Requires critical mass of both tasks and volunteers. Empty project boards scream "nobody is here." Complex to implement (task management, assignment, progress tracking). | Start with Discord channels by interest area. Manual coordination until you have 20+ active volunteers. Then formalize. |
| Complex CRM / supporter database | "Track every interaction across channels" | Over-engineering for current scale. Netlify Forms + Resend gives you a contact list. You don't need Salesforce for 50 supporters. | Spreadsheet or simple Airtable for first 200 supporters. Upgrade when manual tracking becomes painful. |

## Feature Dependencies

```
[Email Capture Form]
    |-- requires --> [Form Backend (Netlify Forms)]
    |-- triggers --> [Welcome Email Sequence]
                        |-- requires --> [Email Service (Resend/Loops)]
                        |-- references --> [Discord Community]
                                              |-- requires --> [Discord Server Setup]
                                              |-- requires --> [Role-based Channels]

[Analytics (Plausible)]
    |-- informs --> [CTA Optimization]
    |-- informs --> [Content Hierarchy Decisions]

[Team/About Page]
    |-- enhances --> [Social Proof / Credibility]
    |-- enhances --> [Email Capture Conversion Rate]

[Zone Zero Simulator]
    |-- requires --> [Mobile Performance Optimization]
    |-- enhances --> [Mission Clarity / Storytelling]
    |-- enhances --> [Email Capture Conversion Rate]

[Welcome Email Sequence]
    |-- drives --> [Discord Community Growth]
    |-- drives --> [Ladder of Engagement Progression]

[MIND Score Dashboard (P2)]
    |-- requires --> [Working Site Architecture (Astro)]
    |-- requires --> [Data Integration (World Bank API)]
    |-- enhances --> [Academic Credibility]

[Ladder of Engagement]
    |-- requires --> [Email Capture]
    |-- requires --> [Discord Community]
    |-- requires --> [Welcome Email Sequence]
```

### Dependency Notes

- **Welcome Email Sequence requires Email Service:** Cannot send automated sequences without a transactional email provider (Resend or Loops). Must be set up before email capture goes live.
- **Discord Community requires Server Setup:** Role-based channels, welcome bot, moderation rules must be configured before directing new signups there.
- **Zone Zero Simulator requires Mobile Optimization:** Current 4000-particle Three.js scene is heavy on mobile. Must conditionally reduce before it's a reliable conversion tool on all devices.
- **Ladder of Engagement requires all three upstream features:** The progression path (email -> Discord -> working group) only works when each step exists.
- **MIND Score Dashboard (P2) requires stable architecture:** Must have Astro components, routing, and build pipeline solid before adding complex data visualization pages.

## MVP Definition

### Launch With (P0+P1 -- Current Milestone)

Minimum viable movement platform -- what's needed to stop losing volunteers and start building a community.

- [x] **Working email capture form** -- stops the bleeding (every signup currently lost)
- [x] **Privacy-respecting analytics** -- enables data-driven decisions
- [x] **Honest partner section** -- removes credibility risk from implied endorsements
- [x] **Lightweight email signup near hero** -- low-friction entry point (email only, no long form)
- [x] **Discord community with role-based channels** -- gives signups somewhere to go
- [x] **Team/About page** -- establishes trust and credibility
- [x] **Welcome email sequence (4 emails / 14 days)** -- nurtures new signups into community members
- [x] **Mobile performance optimization** -- ensures 60%+ of traffic can actually use the site

### Add After Validation (P2)

Features to add once the conversion funnel is working and you have 100+ email subscribers.

- [ ] **MIND Score whitepaper / academic paper** -- establishes intellectual credibility for the framework
- [ ] **Real MIND dashboard with World Bank data** -- interactive policy tool that differentiates from competition
- [ ] **Content hierarchy improvements** -- guided by analytics data from P1 showing where users drop off
- [ ] **Newsletter / update emails** -- regular communication beyond welcome sequence (triggered by having content worth sharing)
- [ ] **Testimonials / supporter stories** -- social proof from real community members (requires having community members first)

### Future Consideration (P3+)

Features to defer until movement has traction (500+ subscribers, 20+ active Discord members).

- [ ] **"MIND Score for My City" tool** -- complex, requires validated methodology and data sources
- [ ] **Volunteer matching / project boards** -- requires critical mass of volunteers and tasks
- [ ] **Multi-language support** -- requires translation resources and demonstrated global demand
- [ ] **Action tools (petitions, letter-writing)** -- requires policy targets and supporter base
- [ ] **MIND Score API** -- requires stabilized methodology and developer community interest

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Working email capture form | HIGH | LOW | P0 |
| Analytics (Plausible) | HIGH | LOW | P0 |
| Honest partner section fix | HIGH | LOW | P0 |
| Lightweight email signup (hero) | HIGH | LOW | P1 |
| Discord community setup | HIGH | LOW | P1 |
| Team/About page | MEDIUM | LOW | P1 |
| Welcome email sequence | HIGH | MEDIUM | P1 |
| Mobile perf optimization | HIGH | MEDIUM | P1 |
| Zone Zero simulator mobile fix | MEDIUM | MEDIUM | P1 |
| Ladder of engagement (explicit) | MEDIUM | MEDIUM | P1-P2 |
| MIND Score dashboard | HIGH | HIGH | P2 |
| Academic paper / whitepaper | HIGH | HIGH | P2 |
| Newsletter system | MEDIUM | LOW | P2 |
| Multi-language | LOW | HIGH | P3 |
| Volunteer matching | LOW | HIGH | P3 |
| "MIND for My City" tool | HIGH | HIGH | P3 |

**Priority key:**
- P0: Fix what's broken (form, analytics, partner section)
- P1: Build the growth engine (capture, nurture, community)
- P2: Establish credibility (data tools, academic work)
- P3: Scale the movement (localization, action tools, self-service)

## Competitor Feature Analysis

| Feature | Doughnut Economics (DEAL) | WEAll | 350.org | Sunrise Movement | Our Approach |
|---------|---------------------------|-------|---------|------------------|--------------|
| Signup flow | Newsletter + member login | Membership form | 3-field form (name, email, country) | Welcome Call + hub finder | Email-only lightweight capture near hero. Minimal friction. |
| Community platform | Custom community platform with discussions, book clubs | Online community + local hubs | Local group directory + Slack | Discord + Mobilize events | Discord with role-based channels. Lower barrier than custom platform. |
| Interactive tools | Static doughnut diagram + city portraits | Policy design course | Campaign action pages | Phone bank tools | Zone Zero simulator (interactive, real-time). Unique differentiator. |
| Content approach | Themed clusters of practice (6 areas) | Policy briefs + case studies | Campaign-focused + blog | Action-focused + storytelling | Evergreen framework explanation. No blog treadmill. |
| Onboarding | Generic welcome email | Generic welcome | Welcome email + local group suggestion | Welcome Call + hub assignment | 4-email nurture sequence over 14 days. Relationship building. |
| Credibility signals | Kate Raworth (famous author), Amsterdam partnership | Government partnerships (Scotland, Iceland, Finland) | 15 years of campaigns, massive membership | Youth energy, Green New Deal association | Named founder, UN inflection point timing, academic novelty claim. |
| Urgency mechanism | None (evergreen) | None (evergreen) | Climate deadline framing | Election cycles | 1000-day countdown tied to policy windows. Authentic urgency. |
| Policy tools | City Doughnut Portrait (consultant-made) | WEGo government network | None (action-focused) | Endorsement tracker | MIND Score dashboard (P2). Self-service, data-driven. |
| Progression path | Browse -> Join community -> Attend events | Browse -> Join -> Advocate | Browse -> Sign petition -> Join group -> Lead | Browse -> Welcome Call -> Hub -> Member -> Leader Portal | Browse -> Email signup -> Discord -> Working group -> Chapter lead |

## Ladder of Engagement: Feature Mapping

The most critical strategic insight from this research is that successful movements design explicit progression pathways. Each level needs specific platform features:

| Level | Supporter Type | Platform Feature | Engagement Action |
|-------|---------------|------------------|-------------------|
| 1 - Awareness | Curious visitor | Compelling hero + clear mission statement | Read, understand, stay on page |
| 2 - Interest | Intellectual explorer | Zone Zero simulator + MIND explainer content | Interact with simulator, read case studies |
| 3 - Subscription | Email subscriber | Lightweight signup form + welcome sequence | Give email, read welcome emails |
| 4 - Community | Discord member | Discord invitation in welcome email (email 3) | Join Discord, introduce self |
| 5 - Contribution | Active participant | Working group channels in Discord, contributor credits | Participate in discussions, review content |
| 6 - Leadership | Chapter/group leader | (P3) Named roles, project boards, public recognition | Lead initiatives, recruit others |

## Sources

- [350.org](https://350.org) -- Homepage signup flow, community tools, campaign structure
- [Sunrise Movement - Take Action](https://www.sunrisemovement.org/volunteer/) -- Volunteer pathways, hub model, member portal
- [Doughnut Economics Action Lab](https://doughnuteconomics.org/) -- Community platform, themed clusters, interactive tools
- [Wellbeing Economy Alliance (WEAll)](https://weall.org/) -- Policy networks, government partnerships, membership model
- [Creative Commons Community](https://creativecommons.org/2025/05/15/the-next-chapter-strengthening-the-creative-commons-community-together/) -- Open community engagement, governance
- [CiviClick - Ladder of Engagement](https://civiclick.com/mastering-the-ladder-of-engagement-strategy/) -- Four-level framework, progression strategies
- [Beautiful Trouble - Ladder of Engagement](https://beautifultrouble.org/toolbox/tool/ladder-of-engagement) -- Community organizing framework
- [InboxArmy - Welcome Email Series](https://www.inboxarmy.com/blog/welcome-email-series/) -- Best practices for onboarding sequences
- [Digital Organizing Best Practices - MobilizeAmerica](https://medium.com/@LetsMobilizeUS/digital-organizing-best-practices-from-mobilizeamerica-db0d6452287c) -- Engagement matrix, volunteer-hosted events
- [Nonprofit Website Best Practices 2025](https://blog.soloist.ai/nonprofit-website-best-practices/) -- CTA optimization, storytelling, trust signals

---
*Feature research for: Movement/advocacy platform (Beyond GDP / MIND framework)*
*Researched: 2026-04-21*
