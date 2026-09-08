// Locked color rule for the F1 car (confirmed with the user after comparing
// a complementary-color scheme, which didn't look good, against a single
// darkened-accent scheme, which did): body = the manager's real color,
// every accent piece (side pod, front wingtip, stripe, rear wing) = that
// same color at 65% darker (35% of original brightness) — not a separate
// complementary hue.
export function darkenHex(hex: string, pct: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const f = 1 - pct / 100
  const to2 = (v: number) => Math.round(v * f).toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}

export function getF1CarColors(managerColor: string): { primary: string; dark: string } {
  return { primary: managerColor, dark: darkenHex(managerColor, 65) }
}
