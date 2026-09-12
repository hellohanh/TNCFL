import type { CareerEntry, PayoutsEntry } from '../types/data'

export interface LeagueRecords {
  seasonsPlayed: number
  totalManagers: number
  activeCount: number
  inactiveCount: number
  departedCount: number
  championCount: number
  championNames: string[]
  mostRecentChampion: string // old hub colors the Champions card's number by this — the LATEST year's champion, not a fixed manager
  moneyThroughLeague: number
  netLeader: { m: string; net: number; rings: number }
  hmotwLeader: { m: string; tally: number; seasons: number }
  seasonPointsRecord: { m: string; pts: number; year: string }
  singleWeekRecord: { m: string; sc: number; year: string; wk: number }
  longestDrought: { m: string; weeks: number; startYear: string; endYear: string }
}

// Every number here is derived, not hardcoded — verified against the old
// hub's real 9-card "League Records" grid (TNCFL_hub.html) before trusting
// the derivation matched: all 9 came back exactly matching current (2025)
// data, so nothing needed correcting here (unlike the hero essay's stale
// "eleven of fifteen").
export function computeLeagueRecords(
  career: Record<string, CareerEntry>,
  payouts: Record<string, PayoutsEntry>,
  topDroughts: Record<string, { len: number; start: string; end: string | null }[]>,
  yearsDesc: number[],
): LeagueRecords {
  const managers = Object.keys(career)
  const activeCount = managers.filter((m) => career[m].status === 'A').length
  const inactiveCount = managers.filter((m) => career[m].status === 'I').length
  const departedCount = managers.filter((m) => career[m].status === 'D').length

  const championCounts: Record<string, number> = {}
  let mostRecentChampion = ''
  for (const y of yearsDesc) {
    const champ = payouts[String(y)]?.rows.find((r) => r.rk === 1)
    if (champ) championCounts[champ.m] = (championCounts[champ.m] || 0) + 1
  }
  const championNames = Object.keys(championCounts).sort()
  mostRecentChampion = payouts[String(yearsDesc[0])]?.rows.find((r) => r.rk === 1)?.m ?? ''

  let moneyThroughLeague = 0
  for (const y of yearsDesc) {
    moneyThroughLeague += (payouts[String(y)]?.rows ?? []).reduce((s, r) => s + r.earn, 0)
  }

  const nets = managers.map((m) => ({ m, net: Object.values(career[m].net).reduce((s, v) => s + v, 0) }))
  const topNet = nets.reduce((a, b) => (b.net > a.net ? b : a))
  const netLeader = { m: topNet.m, net: topNet.net, rings: championCounts[topNet.m] ?? 0 }

  const tallies = managers.map((m) => ({
    m,
    tally: Object.values(career[m].tally).reduce((s, v) => s + v, 0),
    seasons: Object.keys(career[m].pts).length,
  }))
  const topTally = tallies.reduce((a, b) => (b.tally > a.tally ? b : a))

  let seasonPointsRecord = { m: '', pts: 0, year: '' }
  for (const m of managers) {
    for (const [y, pts] of Object.entries(career[m].pts)) {
      if (pts > seasonPointsRecord.pts) seasonPointsRecord = { m, pts, year: y }
    }
  }

  let singleWeekRecord = { m: '', sc: 0, year: '', wk: 0 }
  for (const m of managers) {
    const bw = career[m].best_week
    if (bw && bw.sc > singleWeekRecord.sc) singleWeekRecord = { m, sc: bw.sc, year: bw.yr, wk: bw.wk }
  }

  let longestDrought = { m: '', weeks: 0, startYear: '', endYear: '' }
  for (const [m, streaks] of Object.entries(topDroughts)) {
    for (const s of streaks) {
      if (s.len > longestDrought.weeks && s.end) {
        longestDrought = { m, weeks: s.len, startYear: s.start.slice(0, 4), endYear: s.end.slice(0, 4) }
      }
    }
  }

  return {
    seasonsPlayed: yearsDesc.length,
    totalManagers: managers.length,
    activeCount,
    inactiveCount,
    departedCount,
    championCount: championNames.length,
    championNames,
    mostRecentChampion,
    moneyThroughLeague,
    netLeader,
    hmotwLeader: { m: topTally.m, tally: topTally.tally, seasons: topTally.seasons },
    seasonPointsRecord,
    singleWeekRecord,
    longestDrought,
  }
}
