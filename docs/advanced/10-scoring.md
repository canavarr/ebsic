# Scoring

> Source: `src/advanced/simulation/scoring.ts`

- **Return (0–40):** `totalReturn × 0.4`, clamped
- **Diversification (0–30):** `(sectorsUsed - 1) × 10`
- **Consistency (0–30):** `positiveYears / totalYears × 30`
- **Ranks:** 0→Algaja, 20→Arenev, 40→Kogenud, 60→Turuhai, 80→Fondihaldurite kuningas
