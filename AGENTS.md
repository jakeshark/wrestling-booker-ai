🐺 Wrestling Booker AI — Mission & Agent Guide

Project Codename: Wrestling Booker AI
Tagline: A modern, AI-enhanced spiritual successor to Extreme Warfare Revenge.

⸻

🎯 NORTH STAR GOAL (One Sentence)

Build a deep, replayable pro-wrestling booking simulator where AI-driven backstage politics, promises, morale, and dynamic narratives shape the player’s federation from day to day.

⸻

🧱 TECH STACK RULES (Non-negotiable)

Antigravity agents must follow these rules:

Frontend
	•	React (functional components only)
	•	Vite
	•	TailwindCSS
	•	Component-driven architecture
	•	Prefer @/ imports (alias → src)

Backend / Cloud
	•	Firebase Auth (Anonymous)
	•	Firebase Firestore (canonical paths below)
	•	Firebase Functions NOT used yet — only Firestore + client logic
	•	Vercel (for deployment & serverless API routes)
	•	OpenAI (ChatGPT) for all AI generation
	•	Show recaps
	•	Wrestler DM responses
	•	Promise detection
	•	GM assistant
	•	No custom servers. No backend outside Vercel API routes.

API Structure

All AI requests must be routed through:

/api/ai.js

via:

callAI(type, payload)

No direct fetches, no multiple endpoints.

⸻

📁 CANONICAL FIRESTORE STRUCTURE

Public dataset (seeding new saves)

/artifacts/{appId}/users/public/data/dataset_companies
/artifacts/{appId}/users/public/data/dataset_wrestlers
/artifacts/{appId}/users/public/data/dataset_events   (optional)

Per-player save structure

/artifacts/{appId}/users/{userId}/player_saves/{saveId}
    /save_wrestlers
    /save_messages
    /save_shows
    /save_storylines
    /save_career_events
    /save_journal_entries


⸻

🧩 CURRENT STATUS (What works & what doesn’t)

✅ Fully Working
	•	New Game / Load Game
	•	Dataset seeding (20-wrestler PGW roster)
	•	Booking screen w/ participant search
	•	Show recaps via OpenAI
	•	Wrestler DM system (hover predictive replies, wrestler tone reactions)
	•	Journal system (AI promise detection)
	•	Quest evaluator (v1)
	•	Roster UI redesign (EWR-inspired)
	•	No more ghost/empty saves
	•	Dashboard now correctly shows “Proving Ground Wrestling (PGW)”

⚠️ Partially Working / Needs Review
	•	Public dataset wrestler docs have duplicated relationship entries
	•	Some relationships still kayfabe instead of shoot
	•	AI assistant occasionally stalls if roster summary malformed
	•	No images for wrestlers yet (future pipeline)

❌ Missing or Not Implemented Yet
	•	Contracts system
	•	Morale decay over time
	•	Shooter/backstage fights
	•	Titles & champions metadata UI
	•	Day-level news feed
	•	Full match rating algorithm (EWR depth)
	•	Full quest system (multi-step promises)
	•	AI image generation pipeline (future)

⸻

✨ STYLE PREFERENCES (“Vibe”)

Future code changes should follow these principles:

React
	•	Functional components only
	•	Keep components small and pure
	•	Prefer passing data via props, not giant contexts
	•	Extract logic into utils/ or custom hooks when it gets large

UI
	•	Clean, readable, wrestling-management aesthetic
	•	Tailwind utility classes, no inline CSS
	•	Dark theme w/ neon accents (existing style)
	•	EWR-style roster profile cards

UX
	•	Everything must feel fast, snappy, and managerial
	•	No blocking modals
	•	No AI responses that break kayfabe unless explicitly shoot
	•	AI should always know:
	•	Roster summary
	•	Player company
	•	Prior messages in thread

⸻

📌 NEXT PRIORITIES FOR AGENTS (Immediate)

These are the next tasks Antigravity should tackle:
	1.	Clean up duplicate & kayfabe relationships in public dataset.
	2.	Audit AI assistant request payloads to ensure:
	•	roster summary is well-formed
	•	no missing fields break reasoning
	3.	Add stronger error boundaries to prevent white screens.
	4.	Implement “Contracts v1” (length, pay-to-appearance, morale modifiers).
	5.	Implement “Title Belts v1” and assign them to wrestlers.
	6.	Start designing AI-ready image pipeline for wrestler portraits.

⸻

🔍 REFERENCE FILES TO STUDY FIRST (Important)

A new agent should read these immediately:
	1.	src/utils/firestorePaths.js
	2.	src/App.jsx
	3.	src/context/GameProvider.jsx
	4.	src/utils/journal.js
	5.	src/api/ai.js
	6.	docs/Wrestling-Booker-AI-GDD-v13.1.pdf
	7.	docs/session-log.md

⸻

🔧 WHAT THE AGENT SHOULD DO FIRST

After reading this file, the agent should:
	1.	Index the entire codebase
	2.	Generate a PLAN.md containing:
	•	a map of all game systems
	•	all missing game systems
	•	dependency graph
	•	recommended refactors
	3.	Ask for permission before executing code changes

Never run code before generating a Plan Artifact.

Just tell me.

Ready when you are.
