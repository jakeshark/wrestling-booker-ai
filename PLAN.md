# Wrestling Booker AI — Formal Plan Artifact

_Last updated: 2026-03-14_

## 1) System Map (Current State)

### Core Runtime & Shell
- **`src/App.jsx`** is the current orchestration layer (auth bootstrap, save lifecycle, day advancement, show execution, navigation, and global UI overlays).
- **`src/context/GameProvider.jsx`** provides app-wide game context for screens/components.
- **Screen components** exist for major gameplay slices:
  - `BookingScreen`, `RosterScreen`, `StorylineScreen`, `TitlesScreen`, `ShowResults`
  - `MessagesModal`, `AssistantModal`, `JournalPanel`, `ConfirmDialog`, `Snackbar`

### Data & Persistence (Firestore)
- Path helpers are centralized in **`src/utils/firestorePaths.js`**.
- Public dataset seeding comes from:
  - `src/utils/defaultDataset.js` (company + wrestler + relationships)
  - `src/utils/defaultTitles.js` (default belts)
- Save-scoped collections currently in use include:
  - `save_wrestlers`, `save_messages`, `save_shows`, `save_storylines`,
    `save_career_events`, `save_journal_entries`, `save_titles`

### Gameplay Simulation
- **Day advancement:** in `handleNextDay`, with daily event chance and quest evaluation.
- **Show engine:** segment rating + weighted show rating + post-show simulation updates.
- **Post-show updates:**
  - storyline heat changes
  - wrestler morale changes
  - title change processing for title matches
  - career event logging

### Messaging & Backstage Layer
- `src/hooks/useMessages.js` centralizes:
  - thread/contact organization
  - reply selection/draft flow
  - wrestler morale deltas on reply
  - wrestler follow-up reaction generation
  - promise detection + journal entry creation

### Journal / Quest Layer
- `src/utils/journal.js` includes:
  - journal entry creation
  - AI promise detection helper
  - fallback heuristic promise extraction
  - quest create/update/evaluate helpers
- Journal panel UI and active quest badge are wired into dashboard flow.

### AI Layer
- Frontend AI client in **`src/utils/aiClient.js`** with one entrypoint: `callAI(type, payload)`.
- Vercel route **`api/ai.js`** handles AI request types:
  - `wrestler-message`
  - `wrestler-reaction`
  - `booker-assistant`
  - `show-recap`
  - `journal-promise-detector`

---

## 2) Missing / Incomplete Game Systems

## High Priority (Per mission + AGENTS + roadmap)
1. **Contracts v1 (not implemented as a playable system)**
   - Contract negotiation UI + lifecycle management
   - Contract expiration triggers and free agency behaviors
   - Contract terms affecting morale and availability

2. **Morale Simulation v2+**
   - Passive morale decay
   - event-driven morale modifiers beyond current reply/show effects
   - threshold incidents (complaints, release requests, shooter events)

3. **Promise → Quest full pipeline**
   - richer automatic quest generation from detected promises
   - quest condition types beyond current MVP
   - multi-step quests and better quest UX linking (wrestler/title/show)

4. **Error boundaries / crash containment**
   - route/screen-level boundaries to prevent white-screen failures

5. **Relationship dataset cleanup**
   - de-duplication and shoot-consistent relationship notes in default/public data

## Medium Priority
6. **Assistant payload hardening**
   - guaranteed well-formed roster summary
   - robust payload validation for missing fields

7. **Title Belts v1 polish continuation**
   - metadata UI refinements and champion display consistency checks

8. **EWR import pipeline**
   - `.tel` parser and normalization flow

## Long-term Priority
9. Rival promotions and world simulation
10. Advanced AI memory/continuity systems
11. Portrait image pipeline + broader polish/beta work

---

## 3) Dependency Graph (Implementation-Oriented)

## Foundation Dependencies
- **Path correctness** (`firestorePaths`) influences all systems touching Firestore.
- **Wrestler normalization/schema** underpins messaging AI payloads, ratings, morale, and UI rendering safety.
- **AI API contract** (`callAI` + `api/ai.js`) is a dependency for messages, assistant, recaps, and promise detection.

## Gameplay Dependencies
- **Contracts v1** depends on:
  - wrestler schema expansion
  - save collection strategy
  - message trigger/events framework
  - UI surfaces in roster/profile and maybe dedicated contracts screen

- **Morale simulation v2** depends on:
  - existing morale writes from messages + show simulation
  - contract satisfaction signals (once contracts exist)
  - daily sim event scheduler (Next Day flow)

- **Quest pipeline completion** depends on:
  - promise detection outputs (AI + fallback)
  - standardized quest schema
  - integration points in message reply flow + day advancement + show outcomes + title outcomes

- **Rival promotions** depends on:
  - robust company and contract models
  - free agency model
  - daily simulation extensibility

## Structural Dependencies
- Hook extraction (`useFirebase`, `useGameSave`, `useAdvanceDay`, `useRunShow`) is prerequisite for scaling complexity without regressions.
- Shared utility standardization (AI requests, path helpers, icons) reduces duplicate logic and bug surface area.

---

## 4) Recommended Refactors (Before or Alongside New Features)

## Refactor Track A — App Orchestration Split
1. Extract `useFirebaseAuthInit`
2. Extract `useGameSaves` (new game/load/delete/list)
3. Extract `useDayAdvance` (daily sim + quest eval)
4. Extract `useRunShow` (ratings, simulation, title changes, recap persistence)
5. Keep `App.jsx` as composition/root route shell only

## Refactor Track B — Data/Model Consistency
1. Normalize Firestore path strategy and document canonical path rules
2. Centralize collection-name constants (public/save mappings)
3. Introduce explicit runtime validators for:
   - AI payload shape
   - loaded save data integrity
   - critical nested objects (wrestler stats/metadata/contract)

## Refactor Track C — AI Reliability
1. Add shared AI request helper with request/response guardrails
2. Add timeout + structured fallback behavior per AI type
3. Add telemetry/log wrappers for AI failures by type

## Refactor Track D — UI Resilience
1. Add React error boundaries around:
   - main screen router switch
   - modals with async dependencies
2. Add safe-empty states for all list-driven screens
3. Remove obsolete duplicate render paths in `App.jsx`

---

## 5) Proposed Build Order (Execution Plan)

### Phase 1: Architecture Stabilization (short sprint)
- Finalize path/canonical data decisions
- Add error boundaries and payload validators
- Complete `App.jsx` hook extraction for save/day/show logic

### Phase 2: Contracts v1 (feature sprint)
- Schema + Firestore writes + base UI
- Negotiation loop in Messages/AI
- Contract expiry and free-agent transition

### Phase 3: Morale v2 + Promise/Quest Completion
- Passive/event morale model
- Promise-to-quest richer generation
- Multi-condition quest evaluation hooks

### Phase 4: Data/World Expansion
- EWR import pipeline
- Rival promotion scaffolding

### Phase 5: AI Depth + Beta polish
- continuity/memory-aware assistant and recaps
- content pipeline (portraits/audio polish as desired)

---

## 6) Risks & Guardrails

## Primary Risks
- **Monolithic orchestration risk:** feature work in `App.jsx` increases regression probability.
- **Data-model drift risk:** docs vs implementation path/schema mismatches can corrupt saves.
- **AI brittleness risk:** malformed payloads can stall assistant/messages.

## Guardrails
- Introduce stable schema contracts and validators for all critical entities.
- Add regression checks for save create/load/delete and show run pipeline.
- Maintain strict single AI endpoint contract (`/api/ai` + `callAI`).

---

## 7) Decision Needed Before Coding Feature Work

To prevent Firestore drift, we should lock one canonical public dataset path strategy and propagate it consistently through docs + code + migration notes before Contracts v1 starts.
