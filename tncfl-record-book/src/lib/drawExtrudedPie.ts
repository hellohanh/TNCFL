// 3D isometric extruded donut chart, ported directly from the old hub's real
// sccDrawPie()/sccInitPie() (TNCFL_hub.html) — same geometry constants, same
// wall-shading, same exploded-max-slice, same leader-line label de-collision.
// Canvas-based, matching the old hub's own technique exactly, rather than
// reinventing this as SVG — the wall/depth-shading effect is what actually
// produces the 3D look, and porting the proven algorithm faithfully was the
// safer path to visual fidelity than approximating it from scratch.

export interface PieDatum {
  name: string
  val: number // always positive here — sign is conveyed separately via isLosers
}

const TILT = 22
const VSQUASH = 0.75
const W_INNER = 0.15
const W_OUTER = 0.167
const W_EDGE_A = 0.211
const W_EDGE_B = 0.244
const MIN_PCT = 0.1 // slices below this get a "small" flag (unused visually here, kept for parity)
const LBL_GAP = 30

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function shade(hex: string, f: number): string {
  const [r, g, b] = hexRgb(hex)
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`
}
function rgba(hex: string, a: number): string {
  const [r, g, b] = hexRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

// Computes the canvas height this chart needs at a given width — the caller
// sizes the <canvas> and its wrapper with this before drawing, matching the
// old hub's own sccInitPie() sizing step.
export function computePieHeight(widthPx: number, radiusFraction: number): number {
  const R = widthPx * radiusFraction
  const DEPTH = R * 0.35
  const LS = 75
  const yScale = Math.sin((TILT * Math.PI) / 180) * VSQUASH
  const ry = R * yScale
  const EXPAD = Math.ceil(R * 0.25 * yScale)
  return Math.round(ry * 2 + DEPTH + LS + 30 + EXPAD * 2)
}

export function drawExtrudedPie(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  data: PieDatum[],
  rotationDeg: number,
  isLosers: boolean,
  colors: Record<string, string>,
  radiusFraction: number
): void {
  const BW = widthPx
  const R = BW * radiusFraction
  const HOLE = R * 0.45
  const DEPTH = R * 0.35
  const EXPL = R * 0.25
  const LS = 75
  const yScale = Math.sin((TILT * Math.PI) / 180) * VSQUASH
  const ry = R * yScale
  const hry = HOLE * yScale
  const EXPAD = Math.ceil(EXPL * yScale)
  const H = heightPx
  const cx = BW / 2
  const cy = Math.round(ry + LS * 0.5 + 10 + EXPAD)

  ctx.clearRect(0, 0, BW, H)
  if (!data.length) return

  const total = data.reduce((s, d) => s + Math.abs(d.val), 0)
  const maxIdx = data.reduce((mi, d, i) => (Math.abs(d.val) > Math.abs(data[mi].val) ? i : mi), 0)
  let sa = (rotationDeg * Math.PI) / 180 - Math.PI / 2

  interface Slice extends PieDatum {
    startAngle: number
    endAngle: number
    mid: number
    pct: number
    ex: number
    ey: number
    i: number
    isExploded: boolean
  }

  const slices: Slice[] = data.map((d, i) => {
    const pct = Math.abs(d.val) / total
    const angle = pct * 2 * Math.PI
    const mid = sa + angle / 2
    const isE = i === maxIdx
    const ex = isE ? Math.cos(mid) * EXPL : 0
    const ey = isE ? Math.sin(mid) * EXPL * yScale : 0
    const s: Slice = { ...d, startAngle: sa, endAngle: sa + angle, mid, pct, ex, ey, i, isExploded: isE }
    sa += angle
    return s
  })

  function eArc(x: number, y: number, rx: number, ryy: number, a1: number, a2: number, ccw = false) {
    ctx.ellipse(x, y, rx, ryy, 0, a1, a2, ccw)
  }

  // walls (back-to-front by sin(mid))
  ;[...slices]
    .sort((a, b) => Math.sin(a.mid) - Math.sin(b.mid))
    .forEach((s) => {
      if (Math.sin(s.mid) < -0.05) return
      const scx = cx + s.ex
      const scy = cy + s.ey
      const mc = colors[s.name] ?? '#888'
      ctx.beginPath()
      ctx.moveTo(scx + R * Math.cos(s.startAngle), scy + ry * Math.sin(s.startAngle))
      eArc(scx, scy, R, ry, s.startAngle, s.endAngle)
      ctx.lineTo(scx + R * Math.cos(s.endAngle), scy + ry * Math.sin(s.endAngle) + DEPTH)
      eArc(scx, scy + DEPTH, R, ry, s.endAngle, s.startAngle, true)
      ctx.closePath()
      ctx.fillStyle = shade(mc, W_OUTER)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(scx + HOLE * Math.cos(s.startAngle), scy + hry * Math.sin(s.startAngle))
      eArc(scx, scy, HOLE, hry, s.startAngle, s.endAngle)
      ctx.lineTo(scx + HOLE * Math.cos(s.endAngle), scy + hry * Math.sin(s.endAngle) + DEPTH)
      eArc(scx, scy + DEPTH, HOLE, hry, s.endAngle, s.startAngle, true)
      ctx.closePath()
      ctx.fillStyle = shade(mc, W_INNER)
      ctx.fill()
      ;[
        [s.startAngle, W_EDGE_A],
        [s.endAngle, W_EDGE_B],
      ].forEach(([ang, f]) => {
        ctx.beginPath()
        ctx.moveTo(scx + HOLE * Math.cos(ang), scy + hry * Math.sin(ang))
        ctx.lineTo(scx + R * Math.cos(ang), scy + ry * Math.sin(ang))
        ctx.lineTo(scx + R * Math.cos(ang), scy + ry * Math.sin(ang) + DEPTH)
        ctx.lineTo(scx + HOLE * Math.cos(ang), scy + hry * Math.sin(ang) + DEPTH)
        ctx.closePath()
        ctx.fillStyle = shade(mc, f)
        ctx.fill()
      })
    })

  // tops (non-exploded first, then exploded on top)
  slices
    .filter((s) => !s.isExploded)
    .concat(slices.filter((s) => s.isExploded))
    .forEach((s) => {
      const scx = cx + s.ex
      const scy = cy + s.ey
      const mc = colors[s.name] ?? '#888'
      ctx.beginPath()
      eArc(scx, scy, R, ry, s.startAngle, s.endAngle)
      eArc(scx, scy, HOLE, hry, s.endAngle, s.startAngle, true)
      ctx.closePath()
      ctx.fillStyle = mc
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'
      ctx.lineWidth = 1
      ctx.stroke()
    })

  const LBL_GAP_LOCAL = LBL_GAP
  interface LabelObj {
    s: Slice
    mc: string
    ax: number
    ay: number
    ex2: number
    ey2: number
    ty: number
    isR: boolean
    valStr: string
    pctStr: string
  }
  const labelObjs: LabelObj[] = slices.map((s) => {
    const scx = cx + s.ex
    const scy = cy + s.ey
    const mc = colors[s.name] ?? '#888'
    const ax = scx + R * Math.cos(s.mid)
    const ay = scy + ry * Math.sin(s.mid)
    const dist = R * 0.5
    const ex2 = scx + Math.cos(s.mid) * (R + dist)
    const ey2 = scy + ry * Math.sin(s.mid) + Math.sin(s.mid) * dist * 0.3
    return {
      s,
      mc,
      ax,
      ay,
      ex2,
      ey2,
      ty: ey2,
      isR: ex2 >= cx,
      valStr: isLosers ? `-$${Math.abs(s.val).toFixed(2)}` : `+$${Math.abs(s.val).toFixed(2)}`,
      pctStr: `${(s.pct * 100).toFixed(1)}%`,
    }
  })
  ;[true, false].forEach((side) => {
    const grp = labelObjs.filter((L) => L.isR === side).sort((a, b) => a.ey2 - b.ey2)
    for (let i = 1; i < grp.length; i++) {
      if (grp[i].ty - grp[i - 1].ty < LBL_GAP_LOCAL) grp[i].ty = grp[i - 1].ty + LBL_GAP_LOCAL
    }
    const over = grp.length ? grp[grp.length - 1].ty + 14 - (H - 4) : 0
    if (over > 0) grp.forEach((L) => (L.ty -= over))
  })

  labelObjs.forEach((L) => {
    ctx.strokeStyle = rgba(L.mc, 0.55)
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(L.ax, L.ay)
    ctx.lineTo(L.ex2, L.ey2)
    ctx.lineTo(L.ex2, L.ty)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(L.ax, L.ay, 2, 0, Math.PI * 2)
    ctx.fillStyle = L.mc
    ctx.fill()
    const tx = L.isR ? L.ex2 + 4 : L.ex2 - 4
    ctx.textAlign = L.isR ? 'left' : 'right'
    ctx.fillStyle = L.mc
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText(L.s.name, tx, L.ty - 1)
    ctx.fillStyle = 'rgba(200,200,200,0.85)'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(L.valStr, tx, L.ty + 13)
    ctx.fillStyle = '#888'
    ctx.font = '11px sans-serif'
    ctx.fillText(L.pctStr, tx, L.ty + 25)
  })
  void MIN_PCT
}
