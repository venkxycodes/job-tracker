# Job Tracker — V0 product specification

Status: confirmed product direction, 2026-09-28. This is the implementation contract for V0.

## 1. Purpose and user

A job applicant needs a quick, trustworthy view of every application and the next interview step. Today this information tends to be scattered across email, notes, and spreadsheets. V0 should answer two questions immediately: “Where does each application stand?” and “What is the next round for each active interview?”

The smallest repeatable loop is: add an application → update its status when something changes → see the current state and next interview step → return when another response arrives.

## 2. Navigation and visual direction

The signed-in app has exactly two primary pages: **Applications** and **Interviews**. Authentication is a gate, not a third product page. Use a responsive, polished Kanban-style UI with legible type, restrained color, clear status cues, generous spacing, and subtle motion. Do not rely on color alone to convey status. On narrow screens, columns may scroll horizontally; controls and cards must remain usable without drag-and-drop.

A persistent top navigation switches between the two pages. Each page has a clear heading and one obvious primary action. The application detail/edit view can be a modal or drawer; it does not need its own route.

## 3. Applications page

Show all applications in five columns, in this order: **Applied, Interview, Offer, Rejected, Ghosted**. Show the count in each column. A card displays company, role, application date, and a compact, context-specific detail (for example, current interview round). Sort newest updates first within each column. Provide a clear “Add application” action and a status menu on each card; drag-and-drop is an optional enhancement, not the only way to move a card.

Creating an application requires company, role, and application date. Default the date to today, but allow past dates. Company and role must be nonblank after trimming. Opening a card allows editing these fields, changing status, and deleting it after a confirmation. A newly created application starts in Applied.

When an application first enters Interview, create one default round named **Round 1**. The applicant can rename it and add further rounds later. Do not force them to predict the whole interview process up front. Moving an application to Offer, Rejected, or Ghosted retains its round history. Returning it to Interview resumes that history. A user may change any status manually; no rigid state machine is imposed.

### Ghosted rule

An application still in Applied becomes **effectively Ghosted** after 45 full days in Applied. `appliedStageStartedAt` starts at the application date for a new application. Editing that date while the card remains in its initial Applied stage updates this clock too. If a user later moves a card back into Applied, reset this clock to that action's date. The effective status is Ghosted when the current date is strictly later than `appliedStageStartedAt + 45 days`; otherwise it is the stored status. Use calendar dates in the user's local time zone so the transition occurs at local midnight. This rule never changes Interview, Offer, or Rejected applications. The user can manually move an auto-ghosted card to another status; moving it to Applied restarts its clock. The UI should label an automatically ghosted card accordingly. Compute this status when data is displayed, including after a page has remained open across midnight; no scheduled job is required.

## 4. Interviews page

Show only applications whose **effective** status is Interview. Because each company can have different rounds, use one company card/row per application with its own ordered round timeline; do not force all companies into shared round columns.

Each interview entry shows company, role, the current round, and all rounds in order. A round has a name, status (**Upcoming, Completed, Skipped**), optional scheduled date/time, and optional notes. The first non-completed, non-skipped round is the current round. Applicants can add a round, rename it, edit its details, reorder it, complete it, or skip it. A new round is Upcoming. If no upcoming round remains, show “No upcoming round” and an “Add round” action. Interview outcome is set on the Applications board by moving the application to Offer or Rejected; completion of a round must not silently change the application status.

## 5. Core user flows

1. **First visit:** Sign in with Google → see an empty Applications board with a clear Add application action. Signed-out users cannot read or change application data.
2. **Add:** Enter company, role, and application date → save → see the card in Applied. On error, preserve entered values and show a retryable message.
3. **Interview starts:** Move a card to Interview → one editable Round 1 is created → see the same company on Interviews. This transition should require no multi-step setup.
4. **Interview progresses:** Name the round, optionally schedule it, mark it completed, and add the next round when known → current round updates immediately.
5. **Outcome:** Move the card to Offer or Rejected → it leaves Interviews and appears in the selected Applications column; round history remains accessible from its card.
6. **No response:** An Applied card crosses the 45-day threshold → it appears in Ghosted automatically. If a response arrives, the user moves it to the appropriate state.
7. **Return visit:** Sign in on another device → see the same data. Loading, empty, save-success, and recoverable error states are explicit.

## 6. Data and implementation contract

Use the current React/TypeScript/Vite starter as the frontend. **The entire deployed V0 must live on Firebase:** Firebase Hosting serves the built single-page app, Firebase Authentication handles Google sign-in, and Cloud Firestore stores user data. The browser uses the Firebase JavaScript SDK directly. There is no separately hosted Flask service or required Cloud Function. The earlier Flask idea is superseded by the Firebase-only hosting requirement.

Recommended Firestore structure: `users/{uid}/applications/{applicationId}`. Each application contains `company`, `role`, `applicationDate` (YYYY-MM-DD), `status` (one of the five values), `appliedStageStartedAt` (YYYY-MM-DD), ordered `rounds`, `createdAt`, and `updatedAt`. Each round has a stable ID, `name`, `status`, optional `scheduledAt`, optional `notes`, and an order value. Store round history with the application so status changes do not erase it. Avoid storing the derived auto-ghosted state as a second source of truth. Notes are plain text; rich text is outside V0.

Security rules must allow each authenticated user to read and write only their own documents under their UID; deny all other access. Validate expected fields and types in the app, and enforce ownership in Firestore rules. Include Firebase config and deploy instructions, an SPA rewrite, and local emulator guidance. Client configuration values are public identifiers, not secret credentials.

## 7. Acceptance criteria

- The two pages and their complete empty, loading, success, and error states work at desktop and mobile widths.
- An applicant can create, edit, delete, and manually change application status; data survives refresh and a second-device sign-in.
- Entering Interview creates exactly one editable round if none exists; later rounds can be added without a predefined count.
- Round ordering and status changes persist; the current round is derived consistently.
- The 45-day rule works on boundary dates, on reload, and while the page remains open across local midnight; returning to Applied resets its clock.
- Users cannot access another user's applications, including by direct Firestore request.
- Keyboard and touch users can change status and manage rounds without drag-and-drop.
- The production build can be deployed using Firebase services alone.

## 8. Outside V0

Email or calendar integrations, reminders, analytics dashboards, AI extraction from job posts, resume tracking, collaboration, and custom application statuses. These can be considered after real applicants use the core loop.

## References for implementation

- [Firebase Hosting configuration and SPA rewrites](https://firebase.google.com/docs/hosting/full-config)
- [Google sign-in with the Firebase JavaScript SDK](https://firebase.google.com/docs/auth/web/google-signin)
- [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
