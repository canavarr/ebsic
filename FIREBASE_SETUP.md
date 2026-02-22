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
