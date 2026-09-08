// Race-finish-time math, confirmed with the user against a real spreadsheet
// before being written as code (verified to match 2011's real numbers to
// the decimal: Hanh 8.877493s, Kito 9.037037s, Mikey 9.646724s, Bao
// 9.743590s, La 9.817664s, Lonny 10.000000s, at a 10s duration).
//
// The idea: the SLOWEST-scoring manager in the race always finishes at
// exactly the full race duration; every other manager finishes
// proportionally FASTER, scaled by how much more they scored relative to
// that slowest manager — not by their absolute rank, so a narrow final
// scoreboard produces a tight photo finish and a blowout season produces a
// spread-out field, mirroring the real season's actual competitiveness.
//
// ratio = this manager's total / the lowest total in the race
// finishTime = duration - (duration * (ratio - 1)) = duration * (2 - ratio)
//
// Known boundary (confirmed against all 15 real seasons before writing this
// — the worst real spread is 2014 at a 1.39 ratio, comfortably under the
// limit): this formula only stays valid while every manager's ratio stays
// under 2.0. A ratio of exactly 2 gives a finish time of 0 (instant); above
// 2, it goes negative. This has never happened in 15 real seasons, but a
// future season with a much wider point spread could hit it — worth
// revisiting if that ever actually occurs, not a defensive check added
// preemptively for a case that isn't real yet.
export function computeRaceFinishTimes(
  totals: Record<string, number>,
  duration: number
): Record<string, number> {
  const values = Object.values(totals)
  const minTotal = Math.min(...values)

  const finishTimes: Record<string, number> = {}
  for (const [manager, total] of Object.entries(totals)) {
    const ratio = total / minTotal
    finishTimes[manager] = duration * (2 - ratio)
  }
  return finishTimes
}

// Race duration: a random 5-8 seconds (changed from the old hub's original
// 8-15s range at the user's request) — returned in MILLISECONDS, matching
// every other timing value in this codebase (performance.now(), setTimeout,
// RaceCountdown's MS_PER_NUMBER). A units mismatch here (returning seconds
// while the race's requestAnimationFrame loop computes elapsed time in ms
// via performance.now()) was a real bug caught during testing: t/duration
// evaluated to ~34 within the first frame, instantly clamping every car's
// progress to 1 and jumping them straight to the finish line.
export function pickRaceDuration(): number {
  return 5000 + Math.random() * 3000
}
