# Decision Record: Canonical Firestore Public Dataset Path

- **Status:** Accepted
- **Date:** 2026-03-14
- **Owner:** Wrestling Booker AI team

## Context
There is a mismatch between:
- documented canonical public dataset path in `AGENTS.md` (`/artifacts/{appId}/users/public/data/...`), and
- current implementation in `src/utils/firestorePaths.js` (`/artifacts/{appId}/public/data/...`).

This can cause data drift and confusion when seeding datasets, loading saves, and writing future migration scripts.

## Decision
Use **`/artifacts/{appId}/users/public/data/...`** as the canonical public dataset path moving forward.

## Why (short)
- Matches project guidance in `AGENTS.md`.
- Keeps public dataset convention aligned with the broader `/users/{userId}` namespace model.
- Reduces ambiguity for future systems (imports, migrations, multiplayer-ready structures).

## Consequences
- `src/utils/firestorePaths.js` and any seed/load callsites should be updated to the canonical path.
- Existing environments that already use `/artifacts/{appId}/public/data/...` need a one-time migration or compatibility fallback during transition.
- Follow-up docs should be updated to reflect this as the single source of truth.
