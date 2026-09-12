import type { PayoutsEntry } from '../types/data'

export interface TrophyCabinetEntry {
  year: number
  m: string // champion's name
  titleNum: number // this champion's Nth career title, counting chronologically (1, 2, 3, ...)
  titleYears: number[] // every year this champion has won, up to and including `year`, chronological
  purse: number // that season's season_purse for the champion (rk === 1)
}

// Champion-per-year is the payouts row with rk === 1 — verified against the
// user's own three examples (2011/2017/2020 -> Hanh's 1st/2nd/3rd title)
// before trusting this as "the" champion. NOT summary.competence rank 1,
// which is a different (HMOTW-tally) leaderboard that gave the wrong answer
// on the same three years when checked.
//
// titleNum only goes up to 5 today (Hanh and Randy both cap out at 3); the
// trophy art itself (public/trophies/) already has headroom through 5LT for
// whenever a manager wins a 4th or 5th. A 6th+ title has no art yet — see
// the fallback below.
export function computeTrophyCabinet(
  payouts: Record<string, PayoutsEntry>,
  yearsDesc: number[],
): TrophyCabinetEntry[] {
  const yearsAsc = [...yearsDesc].sort((a, b) => a - b)
  const titleCounts: Record<string, number> = {}
  const titleYearsByManager: Record<string, number[]> = {}
  const entries: TrophyCabinetEntry[] = []

  for (const year of yearsAsc) {
    const entry = payouts[String(year)]
    const champRow = entry?.rows.find((r) => r.rk === 1)
    if (!champRow) continue
    titleCounts[champRow.m] = (titleCounts[champRow.m] || 0) + 1
    const yearsSoFar = titleYearsByManager[champRow.m] ?? []
    yearsSoFar.push(year)
    titleYearsByManager[champRow.m] = yearsSoFar
    entries.push({
      year,
      m: champRow.m,
      titleNum: titleCounts[champRow.m],
      titleYears: [...yearsSoFar], // copy — this manager's array keeps growing in later iterations
      purse: champRow.season_purse,
    })
  }

  return entries.reverse() // most-recent-first, per the user's locked ordering decision
}

// Caps at the highest asset we actually have (5LT) rather than assuming
// every future title count will have art — a 6th title reuses 5LT until a
// new asset is supplied.
export function trophyImageSrc(titleNum: number): string {
  const capped = Math.min(titleNum, 5)
  return import.meta.env.BASE_URL + 'trophies/' + capped + 'LT.png'
}
