// Types describing the shape of site_data.json — the data feed produced by the
// verified engine (see the tncfl-hmotw-engine skill). This file is the single
// source of truth for "what does the data actually look like" going forward:
// every component reads these types, never `any`, so a mismatch between what a
// component expects and what the data feed actually contains is a compile
// error, not a runtime surprise.
//
// SCOPE NOTE (Milestone 1): only the pieces needed to render a single season
// are typed here — `seasons`, `summary`, `recaps`, `nuggets`, `dance`, and the
// manager-color palette from `meta`. The remaining top-level sections in the
// real file (`career`, `h2h`, `all_time_scores`, `streaks_at_1`, `payouts`,
// `cumulative`) are cross-season / all-time data the League/Hall of Fame
// section needs — deliberately left untyped until Milestone 9, rather than
// typing everything up front against data we're not rendering yet.

/** One season's per-manager week-by-week data. Verified against site_data.json's
 * seasons.2011 shape directly — do not extend this from memory/assumption if a
 * later season's shape differs, check the real file first. */
export interface Season {
  year: number
  weeks: number
  manager_count: number
  active_managers: string[]
  /** manager name -> that manager's score each week, index 0 = week 1 */
  scores: Record<string, number[]>
  /** the single highest score across all managers, per week */
  weekly_high: number[]
  /** manager name -> running cumulative total after each week */
  cum_points: Record<string, number[]>
  /** manager name -> that manager's league rank (1 = best) after each week */
  weekly_rank: Record<string, number[]>
  /** the managers who finished in the money this season */
  money_circle: string[]
  /** manager name -> points behind the leader, per week */
  gap_behind: Record<string, number[]>
  /** manager name -> total HMOTW (High Man of the Week) tally for the season */
  hmotw_tally: Record<string, number>
}

/** summary[year] — the season-summary nugget data (competence chart + high/low weeks). */
/** competence[i] — one row of summary[year].competence, the cumulative
 * points-per-finish leaderboard (already computed by the engine). */
export interface CompetenceRow {
  rank: number
  m: string
  pts: number
  status: 'A' | 'F' | 'I' | 'D'
  medals: { gold: number; silver: number; bronze: number; nickel: number }
}

/** one row of meta.hmotw.atdr_snapshots[year] — a top-10 all-time drought
 * streak, as of the selected season's end. */
export interface AtdrRow {
  rank: number
  m: string
  length: number
  start: string // "YYYY-WNN"
  end: string | null // null when ongoing
  ongoing: boolean
}
export interface WeekExtremeRow {
  rank: number
  score: number
  m: string
  year: number
  week: number
  status: 'A' | 'F' | 'I' | 'D'
}

export interface SeasonSummaryEntry {
  competence: CompetenceRow[]
  topweeks: WeekExtremeRow[]
  lowweeks: WeekExtremeRow[]
}

/** recaps[year] — the hand-written prose recap. Prose only; never derive numbers from this. */
export interface Recap {
  title: string
  subtitle: string
  body: string[]
}

/** nuggets[year][i] — one hand-written nugget card. Positioned by exact
 * authored pixel coordinates (not a CSS-grid row/column string) — matches
 * the nugget-panel-sandbox tool's model exactly: a fixed 1200px-wide,
 * 4-column canvas, each card independently placed and sized by hand in
 * that tool, then exported. Replaces the old `cells`/`stack`/`stackWidth`
 * row-letter system entirely: every nugget is now its own independent
 * absolutely-positioned card, none of them "consume" or contain others. */
export interface Nugget {
  accent: string
  title: string
  body: string // may contain inline <b> tags from the original authoring — render as HTML, not escaped text
  colStart: number // 1-indexed column start (1-4)
  colSpan: number // number of columns this card spans (1-4, colStart + colSpan - 1 <= 4)
  top: number // authored top offset in px, relative to the season's own nugget canvas
  ownHeight: number // authored height in px — rendered at exactly this height, not measured or stretched
}

/** dance[year] — the "Dancing Shoes" (longest drought) roast card for the season. */
export interface DanceCard {
  victim: string
  weeks: number
  body: string
}

/** payouts[year].rows[i] — one manager's salary-cap ledger row for that season.
 * Verified against the real 2011 data before typing. */
export interface PayoutRow {
  m: string // manager name
  rk: number // season rank
  tal: number // HMOTW tally
  seas: number // season-split earnings
  ring: number
  hm: number // HMOTW winnings
  sbi: number // sidebet in
  sbo: number // sidebet out
  poi: number // playoff in
  poo: number // playoff out
  earn: number
  owe: number
  net: number // earn - owe; positive = season winner, negative = season loser
  trans: number
  trades: number
  buyin: number
  trans_fee: number
  trade_fee: number
  hmcost: number
  season_purse: number
}

/** payouts[year] — the full season payout ledger. */
export interface PayoutsEntry {
  rows: PayoutRow[]
  pot: number
  raw: number
  league_tally: number
  hmotw_fee: number
  ring: number
  n: number
  buyin: number
  trans_fee: number
  pr_rate: number
  season_split: Record<string, number>
  balanced: boolean
  total_earn: number
  total_owe: number
  sidebet_pool: number
  playoff_pool: number
  trans_total: number
  trades_total: number
}

/** cumulative[year].rows[i] — one manager's CAREER salary-cap ledger row,
 * summed from 2011 through the selected year. Same fields as PayoutRow
 * minus `ring`/`seas` (verified against real data), plus `active` (whether
 * this manager is active in the selected year — departed managers still
 * appear, dimmed). */
export interface CumulativeRow {
  m: string
  rk: number
  tal: number
  hm: number
  sbi: number
  sbo: number
  poi: number
  poo: number
  earn: number
  owe: number
  net: number
  trans: number
  trades: number
  buyin: number
  trans_fee: number
  trade_fee: number
  hmcost: number
  season_purse: number
  active: boolean
}

/** cumulative[year] — the full career ledger through that season. */
export interface CumulativeEntry {
  rows: CumulativeRow[]
  years: number[]
  balanced: boolean
}

/** meta.hmotw — cross-season HMOTW/drought reference data. Only
 * `drought_snapshot` (this season's current drought per manager) is typed —
 * it's the only piece Milestone 5's drought-bars chart needs. The rest
 * (season_tally, status_by_year, drought_start_snapshot, top5_streaks,
 * all_players, atdr_snapshots) are cross-season/ATDR data, real but still
 * deliberately deferred to Milestone 9's Hall of Fame work. */
export interface HmotwMeta {
  drought_snapshot: Record<string, Record<string, number>> // year -> manager -> current drought (weeks)
  /** year -> manager -> that manager's HMOTW tally that season. Verified against
   * season.hmotw_tally before trusting it (same numbers, cross-season-keyed). */
  season_tally: Record<string, Record<string, number>>
  /** year -> manager -> status that year: 'A' active, 'F' hasn't joined yet,
   * 'I'/'D' departed/inactive. Verified against real data — all 4 codes occur. */
  status_by_year: Record<string, Record<string, 'A' | 'F' | 'I' | 'D'>>
  drought_start_snapshot: unknown
  /** manager -> that manager's own top droughts ever (by week length), each
   * with real start/end week markers (`ongoing: true` in place of `end` for
   * a still-running drought). Verified against the old hub's real
   * "Longest Drought" record card (Bao 96wks, 2013-W10 to 2019-W03) before
   * trusting this shape — Milestone 17 Records page. */
  top5_streaks: Record<string, DroughtStreak[]>
  /** every manager who has ever played, across all seasons (18 names as of 2025). */
  all_players: string[]
  /** year -> top-10 all-time drought streaks, as of that season's end. */
  atdr_snapshots: Record<string, AtdrRow[]>
}

/** meta — cross-cutting reference data (league identity, color palette, HMOTW cross-season data). */
export interface Meta {
  league: string
  first_year: number
  last_year: number
  season_count: number
  years_desc: number[]
  /** manager name -> hex color, used consistently everywhere a manager is drawn/labeled */
  manager_colors: Record<string, string>
  reserve_colors: string[]
  hmotw: HmotwMeta
}

/** meta.hmotw.top5_streaks[manager][i] — one completed or ongoing drought. */
export interface DroughtStreak {
  len: number
  start: string // 'YYYY-Www'
  end: string | null // null when ongoing
  ongoing: boolean
}

/** all_time_scores[i] — one entry in the top single-week scores leaderboard
 * (25 entries as of 2025, sorted desc by `sc`). */
export interface AllTimeScoreEntry {
  sc: number
  m: string
  yr: string
  wk: number
  status: 'A' | 'I' | 'D' | 'F'
}

/** career[manager] — that manager's full career record, keyed by year within
 * each sub-object. Typed for Milestone 17's Manager Profiles page — verified
 * against the old hub's real leagueShowProfile() usage (TNCFL_hub.html)
 * before trusting this shape, and cross-checked all 18 managers have every
 * field present (no manager-specific gaps). */
export interface CareerEntry {
  pts: Record<string, number>
  tally: Record<string, number>
  rank: Record<string, number>
  net: Record<string, number>
  status: 'A' | 'I' | 'D' | 'F'
  best_week: { sc: number; yr: string; wk: number }
  worst_week: { sc: number; yr: string; wk: number }
  trans: number
  trades: number
  rival: { name: string; their_wins: number; my_wins: number }
}

/** streaks_at_1[i] — one manager's streak holding the #1 cumulative-points
 * spot, `sw`-`ew` within `sy`-`ey` (may cross a season boundary, see
 * `cross`). Global list — filter by `m` for a single manager's streaks. */
export interface StreakEntry {
  m: string
  len: number
  sy: number
  sw: number
  ey: number
  ew: number
  cross: boolean
}

/** The full shape of site_data.json. Sections marked `unknown` are real data we
 * haven't typed yet (out of scope for this milestone) — NOT missing data. */
export interface RecordBookData {
  meta: Meta
  seasons: Record<string, Season>
  summary: Record<string, SeasonSummaryEntry>
  recaps: Record<string, Recap>
  dance: Record<string, DanceCard>
  nuggets: Record<string, Nugget[]>
  career: Record<string, CareerEntry>
  /** h2h["ManagerA|ManagerB"] -> ManagerA's career win count over ManagerB
   * (a separate key holds B's wins over A). Verified against the old hub's
   * real h2hGet()/renderDuel() usage, and cross-checked several pairs
   * against career[m].rival (which is derived from this same data) before
   * trusting the key format — all matched exactly. */
  h2h: Record<string, number>
  all_time_scores: AllTimeScoreEntry[]
  streaks_at_1: StreakEntry[]
  payouts: Record<string, PayoutsEntry>
  cumulative: Record<string, CumulativeEntry>
}
