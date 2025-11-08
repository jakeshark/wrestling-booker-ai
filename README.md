# Wrestling Booker AI

**Wrestling Booker AI** is a modern reimagining of *Extreme Warfare Revenge (EWR)* — a detailed pro wrestling booking simulator where players balance the creative storytelling of wrestling shows with the real-life personalities, egos, and politics of the wrestlers and staff behind the curtain.

This project aims to faithfully capture the depth and unpredictability of the original EWR while leveraging modern AI to create dynamic, context-aware narratives.

---

## 🎮 Current Features

- **Daily Simulation**  
  Advance time day-by-day, with AI-generated news, messages, and backstage updates.

- **Show Booking System**  
  Book matches and angles using an intuitive UI. Each segment receives its own rating.  
  The overall show rating is derived from those segments — just like in EWR.

- **AI-Generated Show Recaps**  
  Uses OpenAI to produce “dirt sheet”–style reviews of shows.  
  (Recaps are grounded in booked segments only — no invented surprises.)

- **AI Assistant**  
  A built-in creative assistant that understands your roster and ongoing storylines.  
  Ask for booking advice, feud ideas, or match suggestions.

- **Messages System (iPhone-style UI)**  
  Wrestlers send **shoot-style** messages to the booker about creative, pay, or time off.  
  - Dynamic, context-aware Yes / No / Maybe responses  
  - AI follow-ups that reflect tone and outcome  
  - All timestamps use in-game date, not real-world date  
  - Replies appear only in the correct wrestler’s thread

---

## 🤖 AI Integration

All AI features route through `/api/ai.js` using `type` flags:
1. `wrestler-message` → generates a real-world backstage message and 3 tone-varied reply options  
2. `booker-assistant` → returns context-aware booking ideas based on roster  
3. `show-recap` → generates realistic show recaps without hallucinating segments or talent

AI outputs are stored in Firestore alongside player save data.

---

## 🔥 Design Philosophy

This project balances two storytelling layers:

- **On-screen product:** crafting storylines, matches, and PPVs that captivate fans  
- **Behind-the-curtain reality:** managing morale, relationships, egos, injuries, contracts, and creative politics  

Players should feel equally invested in:
- writing a perfect main-event storyline, *and*
- managing the volatile personalities that make that storyline possible.

Future updates will introduce a **Journal/Quest System**, transforming promises and backstage negotiations into tracked objectives with outcomes and rewards.

For full design goals, mechanics, and AI behavior guidelines, see  
📄 [`docs/Wrestling-Booker-AI-GDD-v13.1.pdf`](docs/Wrestling-Booker-AI-GDD-v13.1.pdf)

---

## 🧩 Technical Overview

- **Frontend:** React (Vite)  
- **Backend:** Firebase / Firestore  
- **Deployment:** Vercel  
- **AI:** OpenAI GPT-5 (via `OPENAI_API_KEY`)

### Firestore Structure
/artifacts/{appId}/public/data/…              # Default datasets (read-only)
datasets
dataset_wrestlers
dataset_companies
dataset_titles
/artifacts/{appId}/users/{userId}/player_saves  # Per-user save data
{saveId}/save_wrestlers
{saveId}/save_messages
{saveId}/save_shows
{saveId}/save_storylines
{saveId}/save_career_events
---

## 🧱 Next Development Goals

1. **Refactor `App.jsx`** into modular components:
   - `MessagesModal.jsx`
   - `AssistantModal.jsx`
   - `BookingScreen.jsx`
   - `RosterScreen.jsx`
   - `StorylineScreen.jsx`
   - `ShowResults.jsx`

2. **Centralize AI message logic** in a dedicated hook (`useMessages.js`).

3. **Add backend hooks** for morale and journal entries:
   - Morale impact based on player replies  
   - Journal/Quest entries for promises and goals  

4. **Prepare multiplayer / shared world foundation** (optional long-term goal).

---

## ⚙️ Environment Variables

Make sure these exist in Vercel or `.env`:
OPENAI_API_KEY=
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
---

## 🧑‍💻 Development Notes

- The game currently loads the default dataset into Firestore on first run.
- All AI communications go through `/api/ai.js` (no direct OpenAI calls from frontend).
- The current `App.jsx` is large (~3k lines) and will be split into modular components as part of the refactor.
- The in-game date is tracked within the `gameData` state object (`currentDate`).
- All new messages and segments should reference `currentDate` for timestamping.

---

## 🗂️ Documentation

- [Design Doc — Wrestling Booker AI v13.1 (PDF)](docs/Wrestling-Booker-AI-GDD-v13.1.pdf)
- [Future Systems Notes](docs/future-plans.md) ← *(create this file if needed)*

---

## 🦾 Contributors

**Lead Developer / Designer:** Jake Schwing  
**AI Assistant / System Architect:** ChatGPT-5 (Alfred)  
