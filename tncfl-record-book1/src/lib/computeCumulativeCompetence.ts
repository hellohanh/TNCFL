import type { CareerEntry } from '../types/data'

export interface CumulativeCompetenceRow {
  rank: number
  m: string
  pts: number
  medals: { gold: number; silver: number; bronze: number; nickel: number }
  status: string
}

// Same points-per-finish scale as the existing per-season CompetenceChart.tsx
// (10/5/2/1/0.9/0.8/0.7/0.6/0.5/0.4), applied here to each manager's
// SEASON-ENDING rank (career.rank[year]) summed across every season they've
// played, rather than within-season weekly ranks — a genuinely different,
// new all-time metric, not a re-derivation of the existing per-season
// summary.competence field (checked: summing THAT field per manager across
// years does NOT match this feature's real reference numbers; this
// season-rank-based derivation does, exactly, verified manager-by-manager
// before trusting it).
const LEGEND: Record<number, number> = { 1: 10, 2: 5, 3: 2, 4: 1, 5: 0.9, 6: 0.8, 7: 0.7, 8: 0.6, 9: 0.5, 10: 0.4 }
const MEDAL_BY_RANK: Record<number, 'gold' | 'silver' | 'bronze' | 'nickel'> = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
  4: 'nickel',
}

export function computeCumulativeCompetence(career: Record<string, CareerEntry>): CumulativeCompetenceRow[] {
  const rows = Object.entries(career).map(([m, c]) => {
    let pts = 0
    const medals = { gold: 0, silver: 0, bronze: 0, nickel: 0 }
    for (const rk of Object.values(c.rank)) {
      pts += LEGEND[rk] ?? 0
      const medal = MEDAL_BY_RANK[rk]
      if (medal) medals[medal] += 1
    }
    return { m, pts: Math.round(pts * 10) / 10, medals, status: c.status }
  })
  rows.sort((a, b) => b.pts - a.pts)
  return rows.map((r, i) => ({ ...r, rank: i + 1 }))
}
