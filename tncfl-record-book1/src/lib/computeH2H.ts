import type { CareerEntry } from '../types/data'

export interface DuelYearRow {
  year: string
  ptsA: number
  ptsB: number
  winner: 'a' | 'b' | null
  diff: number
  rankA: number | undefined
  rankB: number | undefined
}

export interface DuelResult {
  winsA: number
  winsB: number
  total: number
  pctA: number
  pctB: number
  years: DuelYearRow[]
}

// Ported from the old hub's real h2hGet()/matrixCell() logic — active
// managers only, sorted by career net descending (same sort as the old
// hub's matrixMgrs). `h2h` key format ("A|B" -> A's wins over B) verified
// against career[m].rival for several pairs before trusting it.
export function computeH2HMatrixManagers(career: Record<string, CareerEntry>): string[] {
  return Object.keys(career)
    .filter((m) => career[m].status === 'A')
    .sort((a, b) => {
      const netA = Object.values(career[a].net).reduce((s, v) => s + v, 0)
      const netB = Object.values(career[b].net).reduce((s, v) => s + v, 0)
      return netB - netA
    })
}

export function h2hGet(h2h: Record<string, number>, a: string, b: string): number {
  return h2h[`${a}|${b}`] ?? 0
}

// Same computation as the old hub's real renderDuel() — win/loss record,
// win percentage, and every shared season's point totals with the winner
// highlighted.
export function computeDuel(h2h: Record<string, number>, career: Record<string, CareerEntry>, a: string, b: string): DuelResult {
  const winsA = h2hGet(h2h, a, b)
  const winsB = h2hGet(h2h, b, a)
  const total = winsA + winsB
  const pctA = total ? (winsA / total) * 100 : 0
  const pctB = total ? (winsB / total) * 100 : 0

  const ca = career[a]
  const cb = career[b]
  const sharedYears = Object.keys(ca?.pts ?? {})
    .filter((y) => cb?.pts?.[y] !== undefined)
    .sort()

  const years: DuelYearRow[] = sharedYears.map((year) => {
    const ptsA = ca.pts[year]
    const ptsB = cb.pts[year]
    const winner = ptsA > ptsB ? 'a' : ptsB > ptsA ? 'b' : null
    return {
      year,
      ptsA,
      ptsB,
      winner,
      diff: Math.abs(ptsA - ptsB),
      rankA: ca.rank[year],
      rankB: cb.rank[year],
    }
  })

  return { winsA, winsB, total, pctA, pctB, years }
}
