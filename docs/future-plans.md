# Wrestling Booker AI — Future Plans & Development Roadmap

_Last updated: November 2025_

This document tracks upcoming and planned features for **Wrestling Booker AI**, prioritized by development stage.  
It supplements the main design document (`docs/Wrestling-Booker-AI-GDD-v13.1.pdf`) and the project README.

---

## 🧱 Phase 1: Structural Refactor (Current)
**Goal:** Prepare the codebase for long-term growth and modularity.

### Tasks
- [ ] Split the current `App.jsx` (~3,000 lines) into modular React components:
  - `MessagesModal.jsx`
  - `AssistantModal.jsx`
  - `BookingScreen.jsx`
  - `RosterScreen.jsx`
  - `StorylineScreen.jsx`
  - `ShowResults.jsx`
- [ ] Centralize AI message and Firestore logic into hooks:
  - `useMessages.js`
  - `useAIClient.js`
- [ ] Create a shared state/context for `gameData` (so all screens stay in sync).
- [ ] Ensure all timestamps use **in-game date**, not real-world date.
- [ ] Finalize morale/mood calculation helper for wrestlers.

---

## 🎭 Phase 2: Player Feedback & Morale System
**Goal:** Make choices feel impactful in daily play.

### Planned Features
- [ ] When player sends a reply to a wrestler message, show:
  - Inline stat changes (e.g. “Wrestler A: Morale –5”)
  - Small “decision feedback” toast or popup
- [ ] Store morale changes in Firestore per wrestler.
- [ ] Add emotion scaling for AI wrestler follow-ups:
  - “Yes” → positive/thankful tone
  - “No” → upset/resentful tone
  - “Maybe” → cautious or hopeful tone

---

## 📜 Phase 3: Journal / Quest System
**Goal:** Transform backstage promises and communications into player objectives.

### Overview
When the player commits to a promise (e.g. pushes a wrestler, gives a title shot, hires someone’s partner), a **Journal Entry** is created.

### Planned Mechanics
- Journal entries tracked under `save_journal_entries`
- Each has:
  - `description` (e.g. “Promised Wrestler A a World Title shot before 2026”)
  - `conditions` (success/failure criteria)
  - `deadline` (in-game date)
  - `rewards` and `penalties` (e.g. morale boost or loss)
- Conditions dynamically generated from the conversation context.

### Example
> Wrestler A: “If I keep winning, I think I deserve a shot at the World Title.”  
> Player (Yes): “Absolutely. You’ll get your shot before May 2026.”  
> → Journal Entry Created: “Promise: Give Wrestler A a World Title shot before May 2026.”  
> → Success: Wrestler A gets title match → morale +10  
> → Fail: Date passes without title shot → morale –10 and wrestler messages expressing frustration

---

## 🌎 Phase 4: Expanded World Simulation
**Goal:** Bring depth and unpredictability to the wrestling ecosystem.

### Long-term Tasks
- [ ] Add multiple promotions (rival AI-run companies)
- [ ] Simulate free-agent signings, contract expirations, and inter-promotion movement
- [ ] Add global news feed (generated via AI + game events)
- [ ] Track “company reputation” and “booking style” metrics

---

## 🧠 Phase 5: Advanced AI Behavior
**Goal:** Deepen the realism of interactions and outcomes.

### Concepts
- [ ] Wrestlers develop memory of past events (e.g., broken promises, title shots)
- [ ] AI booking assistant aware of player’s past feuds and results
- [ ] Contextual AI recaps that reference ongoing storylines and historical data
- [ ] Feud generator that adapts to player style (sports-based, dramatic, chaotic)

---

## 🧪 Phase 6: Public Beta Preparation
**Goal:** Polish and release.

### Checklist
- [ ] Implement auto-save and manual save slots
- [ ] Add tutorial prompts for key systems
- [ ] Optimize performance for 50+ wrestlers / 1000+ messages
- [ ] Integrate analytics for playtesting
- [ ] Final UI pass and sound effects

---

## 📚 References
- **Design Doc v13.1:** `docs/Wrestling-Booker-AI-GDD-v13.1.pdf`
- **README:** Project overview and current implementation
- **api/ai.js:** Current OpenAI integration
