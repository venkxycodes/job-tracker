# Job Tracker

A two-page job application board. Firebase Authentication provides Google sign-in, Cloud Firestore keeps each applicant's applications and interview rounds, and Firebase Hosting serves the app.

## Firebase setup

1. Create a Firebase project and register a web app in the [Firebase console](https://console.firebase.google.com/).
2. Enable **Authentication → Sign-in method → Google**. Add your local and deployed domains to **Authentication → Settings → Authorized domains**.
3. Create a Cloud Firestore database. Deploy `firestore.rules` before sharing the app; these rules scope all application reads and writes to the signed-in user's UID.
4. Copy `.env.example` to `.env.local` and paste the web app's public `apiKey`, `authDomain`, `projectId`, and `appId`. These values are client identifiers, not secrets. Do not put service account credentials in the frontend.
5. Run `npm install` and `npm run dev` to work locally. Run `npm run build` and `npm run lint` before deployment.

## Local emulators

Install the Firebase CLI (for example, `npm install -g firebase-tools`), then run `firebase emulators:start --project demo-job-tracker` from this directory. Set `VITE_USE_FIREBASE_EMULATORS=true` in `.env.local` and restart the Vite server. Auth runs on port 9099 and Firestore on 8080. Use a Firebase web app configuration in `.env.local` even with the emulators; for the `demo-job-tracker` project, set `VITE_FIREBASE_PROJECT_ID=demo-job-tracker`.

## Deploy

Run `firebase login`, then `firebase use --add` to associate the repository with your Firebase project. Run `npm run build` and `firebase deploy --only firestore:rules,hosting`. `firebase.json` serves `dist` and rewrites other paths to `index.html`. No server or Cloud Function is required.

## Behavior

Applications appear in Applied, Interview, Offer, Rejected, or Ghosted. Drag a card by its handle to a new column to change its status; keyboard users can focus the handle, press Space, move with arrow keys, and press Space to drop. Status also remains editable in the application details. Changing to Interview creates Round 1 once; interview history remains with the application after an outcome. Applied applications appear in Ghosted after 45 full local calendar days without a response. Moving one back to Applied starts a new 45-day clock. The derived Ghosted state is not written to Firestore.
