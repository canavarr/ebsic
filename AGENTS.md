# AGENTS.md

## Cursor Cloud specific instructions

This is a **React + Vite** single-page application (investment portfolio simulation game). There is no backend server — Firebase is used as an optional managed service, and the app gracefully falls back to `localStorage` when Firebase credentials are absent.

### Running the app

- `npm run dev` starts the Vite dev server on port 5173
- The app is served at `http://localhost:5173/ebsic/` (base path is `/ebsic/` by default; override with `VITE_BASE=/` env var)
- No additional services (databases, Docker, etc.) are required

### Build

- `npm run build` produces a production bundle in `dist/`

### Lint / Tests

- No ESLint, Prettier, or test framework is configured in this project
- The build step (`npm run build`) is the primary automated verification

### Firebase (optional)

- Copy `.env.example` to `.env` and fill in Firebase credentials to enable cloud leaderboard
- Without Firebase config, the app uses `localStorage` for leaderboard data — fully functional for development
- See `FIREBASE_SETUP.md` for detailed Firebase configuration instructions
