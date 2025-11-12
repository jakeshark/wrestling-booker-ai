## Codex Session Summary — 2025-11-09

**Files Modified or Created:**
- src/components/MessagesModal.jsx — extracted backstage messaging modal UI.
- src/hooks/useMessages.js — centralized messaging state and Firestore logic.
- src/components/AssistantModal.jsx — isolated AI booker assistant modal.
- src/App.jsx — integrated new messaging and assistant components/hooks.

**Features / Fixes Implemented:**
- Modularized the backstage messaging system into dedicated hook and component layers without altering Firestore paths.
- Split the AI booker assistant into a standalone modal component wired to the existing `/api/ai` workflow.
- Updated App.jsx to consume the new abstractions while preserving roster-aware assistant prompts and unread message behavior.

**Known Issues / To-Do:**
- TODO to centralize shared AI POST request handling between assistant and messaging features.
- Git remote configuration remains absent, so repository pushes are currently blocked.

**Next Steps / Recommendations:**
- Configure the Git remote and push the modular refactor commits for backup.
- Continue breaking down App.jsx by extracting remaining modals and game screens into dedicated components/hooks.
- Establish shared utilities for AI requests and Firestore path helpers to reduce duplication.

## Codex Session Summary — 2025-11-09 (Session 2)

**Files Modified or Created:**
- src/App.jsx — documented booking screen extraction approach and added centralized AI request TODO markers.
- src/hooks/useMessages.js — flagged AI fetch logic for upcoming centralization utility.

**Features / Fixes Implemented:**
- Added a concrete extraction plan for migrating the booking screen UI into its own component while keeping game-state mutations in App.jsx.
- Marked both assistant and messaging AI POST calls with a shared `// TODO: centralizeAIRequests` placeholder to guide future refactors.

**Known Issues / To-Do:**
- Shared AI request helper still needs to be implemented; current TODO markers highlight duplication.
- Git remote remains unconfigured (`git remote -v` reports no entries), so pushes are still blocked.

**Next Steps / Recommendations:**
- Implement a shared AI request utility that both the assistant and messaging flows can consume.
- Continue modularizing App.jsx, starting with extracting the Booking screen into `src/components/BookingScreen.jsx` per the new plan.
- Configure the Git remote so future commits can be pushed for backup.

## Codex Session Summary — 2025-11-10

**Files Modified or Created:**
- src/components/BookingScreen.jsx — extracted the booking UI into a dedicated component fed by App state.
- src/App.jsx — wired in the new BookingScreen component and removed the inline renderer.
- docs/session-log.md — recorded the booking screen extraction.

**Features / Fixes Implemented:**
- Migrated the booking screen JSX into `BookingScreen.jsx` while keeping Firestore and AI recap flows anchored in App state.
- Passed the existing booking handlers, segment data, and timestamps into the new component to preserve booking behavior.
- Replaced the inline render switch branch with the new component to keep the game flow intact.

**Known Issues / To-Do:**
- Shared AI POST helper remains unimplemented despite TODO markers in assistant and messaging flows.
- Additional App.jsx screens (roster, storylines, etc.) still need extraction to continue the modular refactor.

**Next Steps / Recommendations:**
- Continue decomposing App.jsx by extracting the roster and storyline screens into their own components/hooks.
- Build a shared AI request utility so assistant and messaging POST logic can converge on one helper.
- Confirm Git remote configuration so modular refactor commits can be pushed for safekeeping.

## Codex Session Summary — 2025-11-11

**Files Modified or Created:**
- src/components/RosterScreen.jsx — extracted the roster UI into a reusable component fed by App state.
- src/App.jsx — replaced the inline roster renderer with the new component and passed through selection handlers.
- docs/session-log.md — documented the roster screen extraction.

**Features / Fixes Implemented:**
- Moved the roster listing and selection controls into `RosterScreen.jsx` while preserving existing Tailwind styling.
- Wired the component into the game state switch so roster navigation and history/relationship actions still call the original handlers.

**Known Issues / To-Do:**
- Firestore helpers remain duplicated across features; consider adding a shared path utility in a future refactor.
- Additional screens (storyline, relationships, etc.) are still defined inline within `App.jsx`.

**Next Steps / Recommendations:**
- Continue extracting remaining screens from `App.jsx` to reduce file size and improve maintainability.
- Implement shared utilities for Firestore path building and AI request handling per earlier TODO markers.

## Codex Session Summary — 2025-11-12

**Files Modified or Created:**
- src/components/StorylineScreen.jsx — extracted the storyline planner UI into its own component powered by App state.
- src/App.jsx — replaced the inline storyline renderer with the new component and passed through the existing handlers and modal state.
- docs/session-log.md — logged the storyline screen extraction details.

**Features / Fixes Implemented:**
- Moved the storyline manager list and creation modal into `StorylineScreen.jsx` while preserving Tailwind styling and modal behavior.
- Continued to source storylines from `gameData.save_storylines` and wired the existing create, search, and participant handlers via props.
- Kept navigation back to the dashboard controlled from App by passing the existing state setter into the new component.

**Known Issues / To-Do:**
- Firestore path strings for storyline creation still live in `App.jsx`; consider centralizing them alongside other TODO markers.
- Additional inline screens (relationships, history, etc.) remain to be extracted from `App.jsx`.

**Next Steps / Recommendations:**
- Continue modularizing the remaining screens and dialogs out of `App.jsx` to improve readability.
- Create shared utilities for Firestore paths and AI requests once the current refactor stabilizes.

## Codex Session Summary — 2025-11-13

**Files Modified or Created:**
- src/components/ShowResults.jsx — extracted the show results UI with AI recap handling.
- src/App.jsx — wired the new ShowResults component and delegated recap persistence to a dedicated callback.
- docs/session-log.md — noted the show results screen extraction.

**Features / Fixes Implemented:**
- Moved the results screen into `ShowResults.jsx`, including the segment list, summary panel, and recap display.
- Shifted the show recap generation to the new component while keeping the Firestore write shape unchanged via an App-level callback.
- Hooked the existing “Next Day” flow into the modular screen so players can save and continue from the results view.

**Known Issues / To-Do:**
- Shared AI request helper remains a future improvement; the recap component still calls `callAI` directly.
- Consider surfacing storyline names in the summary once that data is readily available to the component.

**Next Steps / Recommendations:**
- Continue extracting remaining inline screens (career history, relationships) into dedicated components.
- Factor out the repeated icon components so they can be shared across screens without duplication.

## Codex Session Summary — 2025-11-14

**Files Modified or Created:**
- src/components/SegmentModal.jsx — new reusable modal for editing booking segments.
- src/components/BookingScreen.jsx — now renders `SegmentModal` and delegates segment form changes via props.
- src/App.jsx — passes modal state/handlers into `BookingScreen` and exposes storylines through `GameProvider`.
- docs/session-log.md — recorded the segment modal extraction work.

**Features / Fixes Implemented:**
- Extracted the inline segment editor from `App.jsx` into a dedicated component that sources roster/storyline data from context.
- Updated the booking screen to orchestrate modal visibility, preserving the original Tailwind styling and UX flow.
- Centralized segment state management in `App.jsx`, ensuring winner validation and storyline assignments stay intact.

**Known Issues / To-Do:**
- Icon components remain duplicated between `App.jsx` and the new modal; future refactors could consolidate them.
- Shared AI/firestore helpers mentioned earlier are still outstanding.

**Next Steps / Recommendations:**
- Continue migrating remaining modals from `App.jsx` into standalone components to reduce file size.
- Extract common SVG icon components into a shared module for reuse across screens.

## Codex Session Summary — 2025-11-15

**Files Modified or Created:**
- src/utils/journal.js — new helper for enqueueing save journal notes in Firestore.
- src/hooks/useMessages.js — added a TODO hook for future journal integration when players make promises.
- docs/session-log.md — documented the journal scaffold addition.

**Features / Fixes Implemented:**
- Added a minimal `enqueueJournalNote` helper that writes save journal entries under each player save.
- Marked the messaging reply handler with a TODO so future promise logic can log to the journal.
- Recorded the new scaffolding in the ongoing session log for discoverability.

**Known Issues / To-Do:**
- Journal helper currently infers the Firestore instance from the default app; callers will need to ensure Firebase is initialized.
- No automatic triggers call the helper yet; the TODO marker should be wired up once promise tracking is implemented.

**Next Steps / Recommendations:**
- Integrate the journal helper into the reply flow once promise metadata is defined.
- Consider expanding the helper with validation and status updates after initial integration tests.

## Codex Session Summary — 2025-11-16

**Files Modified or Created:**
- src/components/Snackbar.jsx — lightweight toast stack for morale feedback.
- src/utils/replyOutcomes.js — maps wrestler topics and reply tones to morale deltas.
- src/hooks/useMessages.js — applies reply outcomes, persists morale, and queues toasts.
- src/components/MessagesModal.jsx — disables double sends and surfaces sending state.
- src/App.jsx — lifts toast state, wires Snackbar, and hands addToast into messaging.
- src/utils/firestorePaths.js — added save_wrestlers helper for morale updates.

**Features / Fixes Implemented:**
- Award or deduct morale immediately after player replies, clamping to 0–100 and persisting to Firestore.
- Surfaced instant feedback via stackable Snackbar toasts that auto-dismiss and note morale caps.
- Sequenced morale persistence ahead of AI follow-ups without altering conversation threading.

**Known Issues / To-Do:**
- npm install/build still blocked in this environment (missing registry access); CI should verify once dependencies resolve.
- Future polish: expose the toast helper through context so other systems can surface feedback.

**Next Steps / Recommendations:**
- Extend reply outcomes with promise/journal logging once narrative flags are defined.
- Consider animating Snackbar entries and adding manual dismiss affordances for accessibility.

## Codex Session Summary — 2025-11-16

**Files Modified or Created:**
- src/components/ConfirmDialog.jsx — introduced reusable confirmation modal with destructive action styling.
- src/utils/firestorePaths.js — added named helpers for player save documents and subcollections.
- src/utils/deleteSave.js — implemented recursive batched deletion for player saves and subcollections.
- src/App.jsx — wired delete confirmation flow into the main menu and reset active save state post-deletion.

**Features / Fixes Implemented:**
- Added a confirmation dialog and trash control so players can remove saves directly from the main menu.
- Created a Firestore utility that deletes known subcollections in 500-doc batches before removing the save document.
- Hooked UI state to disable interactions during deletion, clear active game data, and surface success/error toasts.

**Known Issues / To-Do:**
- Recursive delete currently targets only the known subcollections; future nested additions will require updating the helper.
- Additional refactoring may further isolate App.jsx concerns as more screens and flows are extracted.

**Next Steps / Recommendations:**
- Extend the delete utility or Firestore rules to auto-discover new subcollections when they are introduced.
- Continue modularizing App.jsx to keep onboarding new features manageable.

## Codex Session Summary — 2025-11-17

**Files Modified or Created:**
- src/utils/journal.js — rebuilt with quest CRUD helpers plus evaluation logic and logging.
- src/utils/firestorePaths.js — exposed save_journal_entries path helper.
- src/components/JournalPanel.jsx — new dashboard drawer showing quest filters and notes.
- src/components/QuestBadge.jsx — badge button that surfaces the active quest count.
- src/App.jsx — wired journal badge, drawer, and next-day evaluation toasts.
- src/hooks/useMessages.js — documented the future quest-creation hook in the reply handler.
- docs/session-log.md — recorded the journal/quest scaffolding work.

**Features / Fixes Implemented:**
- Added Firestore-backed quest helpers (create/update/evaluate) with defensive timestamp handling and MVP condition checks.
- Surfaced a non-intrusive Journal drawer with filter tabs, expandable entries, and an active-count badge in the dashboard sidebar.
- Hooked quest evaluation into the Next Day flow so successes/failures log notes, update Firestore, and trigger toasts without blocking gameplay.

**Known Issues / To-Do:**
- TODO hooks remain in the messaging reply flow to translate promises into concrete quests once NLP parsing lands.
- Quest evaluation currently handles basic roster/deadline checks; richer storyline/title logic can be layered in later.

**Next Steps / Recommendations:**
- Extend evaluateQuests with additional condition types (e.g., storyline milestones) as the narrative system expands.
- Implement the promise parsing pipeline to populate createQuest payloads directly from message replies.
