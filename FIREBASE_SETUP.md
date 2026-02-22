# Firebase Setup

## 1. Add your config

1. Copy `.env.example` to `.env`
2. In [Firebase Console](https://console.firebase.google.com/) → your project → Project settings → Your apps
3. If you don't have a web app yet, add one
4. Copy the `firebaseConfig` values into your `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 2. Enable Firestore

1. Firebase Console → Build → Firestore Database
2. Create database (start in **test mode** or use the rules below)

## 3. Deploy Firestore rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project, use firestore.rules when asked)
firebase deploy --only firestore
```

Or in Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`.

## 4. Optional: Firestore index

If the leaderboard query fails, Firebase will show an error with a link to create the index. For `orderBy('finalValue', 'desc')`, a single-field index is usually created automatically.

## 5. Secure your API key (important for public deploys)

Firebase API keys appear in the built JavaScript—that's expected for web apps. To limit abuse:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Credentials → your API key
2. Under **Application restrictions**, choose **HTTP referrers**
3. Add allowed sites, e.g.:
   - `https://*.github.io/ebsic/*`
   - `https://canavarr.github.io/ebsic/*` (your actual GitHub Pages URL)
   - `http://localhost:*` and `http://127.0.0.1:*` (for local dev)
4. Save

Firestore rules (step 3) protect your data; API restrictions reduce unauthorized usage.
