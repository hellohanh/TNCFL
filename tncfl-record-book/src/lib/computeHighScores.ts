import type { Season } from '../types/data'

export interface HighScoreEntry {
  sc: number
  m: string
  yr: string
  wk: number
}

// The premade `all_time_scores` field only carries the top 25 (min value
// 210.32 as of 2025) — checked first, and it's short of every real score
// >=200: there are 73 of those in the raw weekly data. Same category of
// derivation as computeLowestScores.ts, not a re-implementation of
// something the engine already computed.
export function computeHighScores(seasons: Record<string, Season>, minThreshold: number): HighScoreEntry[] {
  const all: HighScoreEntry[] = []
  for (const [yr, season] of Object.entries(seasons)) {
    for (const [m, arr] of Object.entries(season.scores)) {
      arr.forEach((sc, i) => {
        if (sc != null && sc >= minThreshold) all.push({ sc, m, yr, wk: i + 1 })
      })
    }
  }
  all.sort((a, b) => b.sc - a.sc)
  return all
}
