# Wrestling Booker AI — Future Plans & Development Roadmap

_Last updated: March 2026_

This document tracks upcoming and planned features for **Wrestling Booker AI**, prioritized by development stage.
It supplements the main design document (`docs/Wrestling-Booker-AI-GDD-v13.1.pdf`) and the project README.

> **Philosophy:** Each phase should leave the game more fun to actually play, not just more complete on paper.
> Structural work is woven into feature work — we refactor as we build, not in isolation.

---

## ✅ Phase 0: Foundation (Complete)

The core game loop is fully functional.

- New Game / Load Game with dataset seeding
- Day-by-day simulation with AI-generated wrestler messages
- Booking screen with segment editor and show ratings
- Post-show AI recaps (dirt sheet style)
- iPhone-style wrestler DM system with AI reactions
- Morale delta system on replies (with Snackbar feedback)
- Journal / Quest MVP (promise detection, deadline evaluation)
- Roster screen with relationship viewer and career history
- Storyline planner
- Component modularization (all major screens extracted from App.jsx)

---

## 🏆 Phase 1: Title Belts System (Current)

**Goal:** Make shows feel meaningful. Wrestlers should be able to win and lose championships.

### Tasks
- [x] `save_titles` Firestore collection wired into load/delete/seed
- [x] Default PGW title belts (World, Intercontinental, Tag Team) seeded into new games
- [x] `titlesCol` path helper in `firestorePaths.js`
- [x] Titles screen — create, view, history, vacate, manual champion change
- [x] "Title on the line" selector in segment booking modal (Match type only)
- [x] Title badge displayed on booking screen for title match segments
- [x] Automatic title change when show is run — winner becomes new champion
- [x] Title change history stored per belt (who won it, who they beat, when)
- [x] Champion displayed in roster screen wrestler cards
- [x] Toast notification on title change ("New champion: ...")
- [x] Titles exposed in GameProvider context
- [x] `mustHoldTitle` quest condition now fully wired to live title data

---

## 📜 Phase 2: Contract Negotiation System

**Goal:** Backstage politics get real teeth. Wrestlers push back, demand things, and leave if ignored.

### Overview

EWR-level contract complexity plus new wrinkles: competing offers, working agreements, and wrestler-specific priorities.

### Planned Features

**Contract Schema (wrestler):**
- Type: Written (guaranteed) / Per Appearance / Legends / Developmental
- Exclusive vs. non-exclusive
- Duration in months, start/expire dates
- Monthly salary + downside guarantee + signing bonus + merch cut
- Creative control clause (wrestler can refuse bookings)
- Required appearances per month (for per-appearance deals)

**Wrestler Contract Priorities (drives negotiation behavior):**
- `primaryGoal`: money / push / schedule / longevity / legacy
- `wantsExclusivity`: boolean (some want freedom, some want security)
- `schedulePreference`: light / normal / heavy
- `minYearsWanted` / `maxYearsWanted`
- `creativeControlImportance`: 0–100

**Negotiation Flow:**
1. Contract nearing expiry → wrestler initiates DM, or player opens negotiation
2. Player makes offer
3. AI generates wrestler counter-offer based on their priorities + market value
4. Player accepts / counters / walks away
5. Rejected → free agency (and eventually, rival promotions bid)

**Groundwork for Multi-Promotion:**
- Free agent pool (wrestlers not under contract to anyone)
- Exclusivity flag enforced — non-exclusive wrestlers can work elsewhere
- Working agreements between promotions flagged on company record

---

## 🔧 Phase 3: App.jsx Hook Extraction (Structural)

**Goal:** Keep the codebase manageable as complexity grows.

By this point, App.jsx will be shouldering contracts, titles, and morale on top of existing systems.
Extracting the core game handlers into dedicated hooks keeps future phases from becoming painful.

### Tasks
- [ ] Extract Firebase initialization into `useFirebase` hook
- [ ] Extract save/load logic into `useGameSave` hook
- [ ] Extract day advancement + simulation into `useAdvanceDay` hook
- [ ] Extract show running + title change logic into `useRunShow` hook
- [ ] Move shared SVG icons into `src/components/icons.jsx`
- [ ] Audit `gameContextValue` — add missing fields, remove stale ones

---

## 💊 Phase 4: Morale Simulation

**Goal:** Decisions have lasting consequences. A wrestler with tanking morale becomes a problem.

### Planned Features
- Passive morale decay over time (slow bleed if a wrestler is unhappy)
- Event-triggered morale swings:
  - Losing a title match: –5 to –15 depending on booking method
  - Being buried under a less-popular opponent: –10
  - Winning a title: +15
  - Being featured in main event: +5
  - Contract satisfaction modifier (underpaid = slow drain)
- Morale threshold events:
  - < 40: wrestler DMs player expressing frustration
  - < 20: wrestler requests release via DM
  - > 90: wrestler sends positive message, may take a pay cut to stay
- "Shooter" incidents: very low morale + bad relationship = potential locker room problem

---

## 🎯 Phase 5: Promise → Quest Pipeline (Complete Wiring)

**Goal:** The journal system becomes a real moral pressure system.

### Tasks
- [ ] Wire `journal-promise-detector` AI call into `useMessages.js` reply handler (currently a TODO stub)
- [ ] Auto-create journal quest from detected promise (pre-fill deadline, wrestlerId, type)
- [ ] Richer quest conditions:
  - Title shot promised: `mustHoldTitle` condition with `wrestlerId`
  - Push promised: must appear in main event segment within N shows
  - Salary promised: contract offer must be issued within N days
- [ ] Multi-step quests (e.g., "Build the feud → book the title match → deliver the win")
- [ ] Quest UI improvements: link quest to title / wrestler / show visually

---

## 🌎 Phase 6: EWR Roster Import (Strategic Priority)

**Goal:** Capture the EWR community. Monthly updated real-world rosters should import seamlessly.

The EWR community still releases updated data packs monthly, decades after the original game stopped being supported.
A clean import experience is the single most important community-acquisition feature.

### Tasks
- [ ] Research EWR `.tel` file format — fields, delimiters, encoding
- [ ] Build parser: `.tel` → normalized wrestler schema
- [ ] Map EWR stat scales to our 0–100 system
- [ ] Handle EWR title data → `save_titles`
- [ ] Handle EWR company/roster structure → `save_companies` + `save_wrestlers`
- [ ] Import UI: file picker → preview parsed roster → confirm
- [ ] Validation and error reporting for malformed files
- [ ] Also support custom JSON roster format (documented public spec)
- [ ] This defines the public import API — all future importers use same interface

---

## 🏢 Phase 7: Rival Promotions & Free Agency

**Goal:** The world feels alive. Your decisions exist in a competitive landscape.

### Planned Features
- AI-run competitor companies with their own rosters, shows, and title belts
- When a player's wrestler's contract expires, rival promotions make competing offers
- Working agreements: promotions can share talent under defined terms
- Global news feed: AI-generated daily headlines (signings, releases, title changes across companies)
- "Company reputation" score affects who wants to sign with you

---

## 🧠 Phase 8: Advanced AI Behavior

**Goal:** Wrestlers feel like people with memories, not NPCs with random events.

### Planned Features
- Wrestler memory: AI knows about broken promises, past feuds, career milestones
- Contextual recaps that reference ongoing storylines and historical data
- AI booking assistant is aware of current feuds, title picture, and player's booking style
- Feud generator: AI suggests and tracks multi-month program arcs
- Personality drift: wrestlers change over time based on how they've been treated

---

## 🎬 Phase 9: Polish & Beta Prep

**Goal:** A game worth showing to the EWR community.

### Checklist
- [ ] Auto-save + manual save slots
- [ ] Tutorial prompts for key systems
- [ ] Performance optimization: 50+ wrestlers, 1000+ messages
- [ ] Analytics integration for playtesting
- [ ] Sound effects (AI-generated or licensed)
- [ ] Visual assets: wrestler portraits, belt graphics, company logos (AI image pipeline)
- [ ] Motion graphics / intro sequences
- [ ] Background music (AI-generated ambient / entrance themes)
- [ ] Final UI pass

---

## 📚 References
- **Design Doc v13.1:** `docs/Wrestling-Booker-AI-GDD-v13.1.pdf`
- **README:** Project overview and current implementation
- **AGENTS.md:** Tech stack rules and mission
- **api/ai.js:** Current OpenAI integration
