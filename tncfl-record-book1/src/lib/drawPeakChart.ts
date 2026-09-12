// Faithful port of the old hub's real drawPeakChart() (TNCFL_hub.html).
// Draws a 3D-isometric pyramid per manager per column (a TOTAL/career column
// plus one column per season through the selected year, windowed to the
// most recent PEAK_WINDOW seasons unless expanded). Height uses TWO
// independent scales: the TOTAL column scales freely by career total; season
// columns use a separate scale anchored so 10 season-wins = 80% of the
// tallest TOTAL pyramid's height — this means a manager's single-season
// column and their TOTAL column can show visually different heights for the
// exact same number, by design, not a bug (verified for 2011 specifically,
// where TOTAL == the one season's tally, before trusting the port).

export const PEAK_WINDOW = 15
export const STD_CELL = 44

export interface PeakHit {
  x: number
  y: number
  r: number
  m: string
  col: string // 'Career' for the TOTAL column, else the season year as a string
  val: number
}

export function peakShade(hex: string, f: number): string {
  const h = hex.replace('#', '')
  let r = parseInt(h.slice(0, 2), 16)
  let g = parseInt(h.slice(2, 4), 16)
  let b = parseInt(h.slice(4, 6), 16)
  if (f <= 1) {
    r = Math.round(r * f)
    g = Math.round(g * f)
    b = Math.round(b * f)
  } else {
    const t = Math.min(1, f - 1)
    r = Math.round(r + (255 - r) * t)
    g = Math.round(g + (255 - g) * t)
    b = Math.round(b + (255 - b) * t)
  }
  return `rgb(${r},${g},${b})`
}

interface DrawPeakChartArgs {
  canvas: HTMLCanvasElement
  containerW: number
  DPR: number
  year: number
  candidateManagers: string[] // active_managers or departed managers
  seasonTally: Record<string, Record<string, number>> // meta.hmotw.season_tally
  yearsDesc: number[] // meta.years_desc
  expanded: boolean
  isActive: boolean
  spotlit: Set<string> // manager-filter concept (Money Circle toggle) — separate from hover/pin
  hoverDisplayed: string | null // currently hovered-or-pinned manager, for a SEPARATE dim layer
  managerColors: Record<string, string>
}

export function drawPeakChart(args: DrawPeakChartArgs): PeakHit[] {
  const { canvas, containerW, DPR, year, candidateManagers, seasonTally, yearsDesc, expanded, isActive, spotlit, hoverDisplayed, managerColors } = args

  const allYears = [...yearsDesc].sort((a, b) => a - b)
  const throughYears = allYears.filter((y) => y <= year)
  let seasons = throughYears.slice()
  if (!expanded && seasons.length > PEAK_WINDOW) {
    seasons = seasons.slice(seasons.length - PEAK_WINDOW)
  }
  const tally = (m: string, y: number) => (seasonTally[String(y)] || {})[m] || 0
  const career = (m: string) => throughYears.reduce((s, y) => s + tally(m, y), 0)
  const players = candidateManagers.filter((m) => career(m) > 0).sort((a, b) => career(b) - career(a))

  if (!players.length) {
    canvas.style.display = 'none'
    return []
  }
  canvas.style.display = 'block'

  const cols = ['TOTAL', ...seasons.map(String)]
  const nCols = cols.length
  const nMgr = players.length

  const longestName = Math.max(...players.map((m) => m.length), 4)
  const namePx = longestName * 7 + 16

  const maxCareer = Math.max(1, ...players.map((m) => career(m)))
  const hsTotal = Math.min(15, 150 / maxCareer)
  const H_total = maxCareer * hsTotal
  const hsSeason = (0.8 * H_total) / 10
  const drawH = (col: string, raw: number) => (col === 'TOTAL' ? raw * hsTotal : raw * hsSeason)

  const HW = 0.36
  const FLAT = 4

  function geom(cell: number) {
    const csx = cell
    const csy = cell * 0.13
    const ang = (33 * Math.PI) / 180
    const zsx = cell * Math.cos(ang)
    const zsy = -cell * Math.sin(ang)
    const sc = cell / STD_CELL
    const proj = (ci: number, hpx: number, z: number, ox: number, oy: number): [number, number] => [
      ox + ci * csx + z * zsx,
      oy + ci * csy + z * zsy - hpx * sc,
    ]
    let minX = 1e9
    let maxX = -1e9
    let minY = 1e9
    let maxY = -1e9
    for (let zi = 0; zi < nMgr; zi++) {
      for (let ci = 0; ci < nCols; ci++) {
        const m = players[zi]
        const col = cols[ci]
        const rv = col === 'TOTAL' ? career(m) : tally(m, +col)
        const hpx = rv > 0 ? drawH(col, rv) : FLAT
        const cx = ci + 0.5
        const cz = zi + 0.5
        const corners: Array<[number, number, number]> = [
          [cx - HW, hpx, cz - HW],
          [cx + HW, hpx, cz - HW],
          [cx + HW, 0, cz + HW],
          [cx - HW, 0, cz + HW],
          [cx, hpx, cz],
        ]
        for (const [x, y, z] of corners) {
          const [sx, sy] = proj(x, y, z, 0, 0)
          if (sx < minX) minX = sx
          if (sx > maxX) maxX = sx
          if (sy < minY) minY = sy
          if (sy > maxY) maxY = sy
        }
      }
    }
    return { csx, csy, zsx, zsy, sc, proj, minX, maxX, minY, maxY }
  }

  const PAD_L = 42
  const PAD_T = 16
  const PAD_B = 42
  const PAD_R = namePx + 18
  let CELL = STD_CELL
  let scale = 1
  let g = geom(CELL)
  const needW = g.maxX - g.minX + PAD_L + PAD_R
  if (needW > containerW) {
    scale = containerW / needW
    CELL = STD_CELL * scale
    g = geom(CELL)
  }
  const ox = PAD_L - g.minX
  const oy = PAD_T - g.minY
  const CW = Math.ceil(g.maxX - g.minX + PAD_L + PAD_R)
  const CH = Math.ceil(g.maxY - g.minY + PAD_T + PAD_B)
  canvas.width = CW * DPR
  canvas.height = CH * DPR
  canvas.style.width = CW + 'px'
  canvas.style.height = CH + 'px'
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  ctx.clearRect(0, 0, CW, CH)
  const proj = (ci: number, hpx: number, z: number) => g.proj(ci, hpx, z, ox, oy)
  const fz = Math.max(9, Math.round(11 * Math.max(0.7, scale)))

  const briTop = 1.02
  const briLeft = 0.7
  const briRight = 0.52
  const briBack = 0.36

  // floor gridlines
  for (let zi = 0; zi <= nMgr; zi++) {
    const [x0, y0] = proj(0, 0, zi)
    const [x1, y1] = proj(nCols, 0, zi)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  for (let ci = 0; ci <= nCols; ci++) {
    const [x0, y0] = proj(ci, 0, 0)
    const [x1, y1] = proj(ci, 0, nMgr)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  // Y-axis gridlines follow the TOTAL (career) scale
  ;[0, Math.round(maxCareer * 0.5), Math.round(maxCareer)].forEach((gv) => {
    const hpx = gv * hsTotal
    const [x0, y0] = proj(0, hpx, 0)
    const [x1, y1] = proj(nCols, hpx, 0)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.fillStyle = '#777'
    ctx.font = `600 ${fz}px Segoe UI,sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText(gv === 0 ? '\u2014' : String(gv), x0 - 5, y0 + 3)
  })
  // column labels
  cols.forEach((col, ci) => {
    const [lx, ly] = proj(ci, 0, 0)
    ctx.fillStyle = col === 'TOTAL' ? 'rgba(225,225,225,0.95)' : 'rgba(150,150,150,0.7)'
    ctx.font = `700 ${fz}px Segoe UI,sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(col, lx - 3, ly + 16)
  })

  const hits: PeakHit[] = []
  for (let zi = nMgr - 1; zi >= 0; zi--) {
    const m = players[zi]
    const mc = managerColors[m] || '#888'
    const on = spotlit.has(m)
    const opF = isActive ? (on ? 1 : 0.3) : on ? 0.7 : 0.28
    const hoverF = hoverDisplayed !== null && hoverDisplayed !== m ? 0.4 : 1
    const finalOpF = opF * hoverF
    for (let ci = 0; ci < nCols; ci++) {
      const col = cols[ci]
      const raw = col === 'TOTAL' ? career(m) : tally(m, +col)
      const isZero = raw === 0
      const cx = ci + 0.5
      const cz = zi + 0.5
      const val = isZero ? FLAT : drawH(col, raw)
      const [flx, fly] = proj(cx - HW, 0, cz - HW)
      const [frx, fry] = proj(cx + HW, 0, cz - HW)
      const [brx, bry] = proj(cx + HW, 0, cz + HW)
      const [blx, bly] = proj(cx - HW, 0, cz + HW)
      const [tx, ty] = proj(cx, val, cz)
      ctx.globalAlpha = (isZero ? 0.18 : 1) * finalOpF
      ctx.fillStyle = peakShade(mc, briBack)
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(blx, bly)
      ctx.lineTo(brx, bry)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = peakShade(mc, briLeft)
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(blx, bly)
      ctx.lineTo(flx, fly)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = peakShade(mc, briRight)
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(brx, bry)
      ctx.lineTo(frx, fry)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = peakShade(mc, briTop)
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(flx, fly)
      ctx.lineTo(frx, fry)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
      if (!isZero) {
        hits.push({ x: tx, y: ty, r: 11 * Math.max(0.6, scale), m, col: col === 'TOTAL' ? 'Career' : col, val: raw })
      }
    }
    const [nx, ny] = proj(nCols, 0, zi + 0.5)
    ctx.fillStyle = on ? mc : peakShade(mc, 0.55)
    ctx.globalAlpha = (on ? 1 : 0.4) * hoverF
    ctx.font = `${on ? '700' : '600'} ${fz}px Segoe UI,sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(m, nx + 10, ny + 4)
    ctx.globalAlpha = 1
  }

  return hits
}
