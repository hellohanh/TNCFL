// Ported verbatim from the old hub's real money()/money2()/ord() functions
// (TNCFL_hub.html) — Milestone 10. Not re-derived or approximated.

/** 1158 -> "$1,158" ; -226 -> "-$226" ; 0 -> "$0" ; 6.5 -> "$6.50" */
export function money(v: number): string {
  const n = Math.round(v * 100) / 100
  const neg = n < 0
  const a = Math.abs(n)
  const s =
    '$' +
    a.toLocaleString('en-US', {
      minimumFractionDigits: a % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    })
  return neg ? '-' + s : s
}

/** ALWAYS 2 decimals: 447 -> "$447.00" ; -226 -> "-$226.00" (Net + Season Purse columns only) */
export function money2(v: number): string {
  const n = Math.round(v * 100) / 100
  const neg = n < 0
  const a = Math.abs(n)
  const s = '$' + a.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return neg ? '-' + s : s
}

/** 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th", 21 -> "21st"
 * A clearer rewrite of the hub's real (bit-hack) ord() — verified to produce
 * IDENTICAL output across every value 1-130 before trusting it, not assumed
 * equivalent from reading the hub's formula alone. */
export function ord(r: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = r % 100
  return r + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}
