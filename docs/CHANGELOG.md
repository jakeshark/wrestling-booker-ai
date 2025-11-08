# Wrestling Booker AI — Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.9.0] — 2025-11-08
### Added
- **iPhone-style Messages UI**
  - Wrestlers now appear as individual contacts in a left-hand panel.
  - Clicking a contact opens a threaded conversation view.
  - Player reply bubbles now appear only in the correct thread.
  - AI-generated Yes / No / Maybe buttons with hover-to-preview behavior.
  - Replies are tone-aware and context-sensitive.
- **AI Integration Refinements**
  - `/api/ai.js` now uses `response_format: json_object` for reliable structured responses.
  - `show-recap` endpoint restricted to booked segments only (no hallucinated wrestlers or surprise returns).
  - `wrestler-message` endpoint generates context-aware reply options based on topic (push, contract, time off, etc.).
- **Game Date System**
  - All timestamps now use in-game dates rather than real-world system dates.
- **README.md** and **Design Doc v13.1**
  - Added comprehensive documentation and linked to design philosophy.

### Fixed
- Replies no longer appear across all message threads.
- AI connection stability restored for `/api/ai.js` routes.
- Removed “System: Wrestler acknowledged your reply” placeholder messages.
- Reduced chance of duplicated Firebase message entries.

---

## [0.8.0] — 2025-10-30
### Added
- AI Assistant integrated into dashboard (`type: booker-assistant`).
- AI-generated show recaps (`type: show-recap`) with segment-based ratings.
- Player save and load functionality via Firestore.
- Basic morale and relationship fields for wrestlers.
- Default dataset seeding for new games.

### Changed
- Refined `App.jsx` simulation logic for day advancement and message triggers.
- Improved show rating algorithm to reflect EWR-style segment weighting.

---

## [0.7.0] — 2025-09-01
### Added
- Core project scaffolding (React, Firebase, Vercel deployment).
- Dataset templates: wrestlers, companies, titles, events.
- Firestore save architecture under `/artifacts/{appId}/users/{userId}/player_saves`.
- Basic booking screen and dashboard.
- First version of AI routes (`/api/ai.js`).

---

## [0.6.0] — 2025-08-01
### Prototype
- Early prototype of Wrestling Booker AI with static data and mock UI.
- Established connection between React app and Firebase backend.

---

## [Unreleased]
### Planned
- Refactor `App.jsx` into modular components (`MessagesModal.jsx`, `BookingScreen.jsx`, etc.).
- Centralize AI and Firestore logic into hooks.
- Add Journal / Quest system based on player promises.
- Add morale-impact feedback system on wrestler replies.
- Expand world simulation to include rival promotions.

---
