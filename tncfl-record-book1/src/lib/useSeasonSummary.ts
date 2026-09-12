import { useMemo } from 'react'
import type { Season } from '../types/data'

// This is the first hook in the project that computes something rather than
// fetches something. `useMemo` re-runs its function only when `season`
// changes — without it, this computation would re-run on every single
// re-render of whatever component calls this hook, even re-renders caused
// by something unrelated (e.g. a route change elsewhere). For a small loop
// over 6-10 managers x ~17 weeks that's not a real performance problem yet,
// but the HABIT of memoizing a derived computation is worth building now,
// before a chart with real per-frame animation makes it actually matter.
//
// Both values here are DERIVED from the engine's real per-week data
// (cum_points, scores) — never hand-typed, and cross-checked against a
// second independent field in the same data file (career[manager].pts) as a
// sanity check before this was written.
export interface SeasonSummaryComputed {
  championName: string
  championPoints: number
  highestWeek: {
    manager: string
    score: number
    week: number // 1-indexed, matches how weeks are talked about elsewhere
  }
  hmotwLeader: {
    manager: string
    tally: number
  }
}

export function useSeasonSummary(season: Season): SeasonSummaryComputed {
  return useMemo(() => {
    // Champion = whoever has the highest cumulative total after the final
    // week. `cum_points[m]` is a running total, so its LAST entry is the
    // season-end total.
    let championName = season.active_managers[0]
    let championPoints = -Infinity
    for (const manager of season.active_managers) {
      const finalTotal = season.cum_points[manager][season.weeks - 1]
      if (finalTotal > championPoints) {
        championPoints = finalTotal
        championName = manager
      }
    }

    // Highest single-week score across the whole season, and who scored it.
    // season.weekly_high[w] already gives the max score for week w — this
    // loop additionally finds WHO scored it, which weekly_high alone doesn't
    // tell you.
    let highestWeek = { manager: season.active_managers[0], score: -Infinity, week: 1 }
    for (const manager of season.active_managers) {
      season.scores[manager].forEach((score, weekIndex) => {
        if (score > highestWeek.score) {
          highestWeek = { manager, score, week: weekIndex + 1 }
        }
      })
    }

    // HMOTW leader — whoever has the highest season-long tally. Directly
    // from season.hmotw_tally, which the engine already computed; this just
    // finds the max, same pattern as champion above.
    let hmotwLeader = { manager: season.active_managers[0], tally: -Infinity }
    for (const manager of season.active_managers) {
      const tally = season.hmotw_tally[manager]
      if (tally > hmotwLeader.tally) {
        hmotwLeader = { manager, tally }
      }
    }

    return { championName, championPoints, highestWeek, hmotwLeader }
  }, [season])
}
