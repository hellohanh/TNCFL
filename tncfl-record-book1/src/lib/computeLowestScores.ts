import type { Season } from '../types/data'

export interface LowScoreEntry {
  sc: number
  m: string
  yr: string
  wk: number
}

// No premade "lowest scores" field exists (checked `all_time_scores` first —
// that's the top end only, sorted descending). This is a genuine client-side
// derivation from the raw weekly scores (`seasons[year].scores`), same
// category as computeSeasonTotals.ts's own inline min/max derivation, not a
// re-implementation of something the engine already computed. Filters out
// zero/missing scores (bye weeks) before sorting ascending. Threshold-based
// (all real scores <= maxThreshold), matching computeHighScores.ts's shape
// — not a fixed top-N cap.
export function computeLowestScores(seasons: Record<string, Season>, maxThreshold: number): LowScoreEntry[] {
  const all: LowScoreEntry[] = []
  for (const [yr, season] of Object.entries(seasons)) {
    for (const [m, arr] of Object.entries(season.scores)) {
      arr.forEach((sc, i) => {
        if (sc != null && sc > 0 && sc <= maxThreshold) all.push({ sc, m, yr, wk: i + 1 })
      })
    }
  }
  all.sort((a, b) => a.sc - b.sc)
  return all
}
