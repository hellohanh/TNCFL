import type { Season } from '../types/data'
import type { SeasonTotalEntry } from '../components/SeasonTotalsCard'

/** Every manager-season's final point total, across every season through
 * `year`, ranked descending, capped at `limit`. Checked all_time_scores and
 * cumulative in the real data first — neither of those fields is this, so
 * this is a genuine client-side derivation (same category as Spread's
 * inline weekly min/max, not a re-implementation of something the engine
 * already computed). */
export function computeSeasonTotals(
  seasons: Record<string, Season>,
  yearsDesc: number[],
  year: number,
  limit: number,
): SeasonTotalEntry[] {
  const throughYears = yearsDesc.filter((y) => y <= year)
  const entries: Array<{ m: string; total: number; year: number }> = []
  for (const y of throughYears) {
    const season = seasons[String(y)]
    if (!season) continue
    for (const m of season.active_managers) {
      const total = season.cum_points[m][season.weeks - 1]
      entries.push({ m, total, year: y })
    }
  }
  entries.sort((a, b) => b.total - a.total)
  return entries.slice(0, limit).map((e, i) => ({ rank: i + 1, m: e.m, total: e.total, year: e.year }))
}
