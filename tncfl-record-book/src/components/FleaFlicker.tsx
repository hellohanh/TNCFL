import { useEffect, useRef } from 'react'
import { useScrollProgress } from '../lib/useScrollProgress'
import { useHeaderHeight } from '../lib/HeaderHeightContext'
import styles from './FleaFlicker.module.css'

// ────────────────────────────────────────────────────────────────────────
// Frame data
//
// Ten hand-placed frames of a flea-flicker trick play, drafted and reviewed
// frame-by-frame in chat. Offense (o-line, QB/RB/WR/TE, ball, block-T's) was
// laid out once per frame and is final. Defense (11 X's) is keyed by a fixed
// colorId (0-10) rather than raw array position — each colorId is the SAME
// defender across every frame, confirmed by hand rather than nearest-position
// guessing, which is why buildDefenderTracks() below needs no matching logic
// at all: it just reads DEF_BY_FRAME[frame][colorId] directly.
// ────────────────────────────────────────────────────────────────────────

type OffenseType = 'o' | 't' | 'qb' | 'rb' | 'wr' | 'te' | 'ball'
interface OffenseEl {
  type: OffenseType
  x: number
  y: number
}
interface Pt {
  x: number
  y: number
}

const F1_OFF: OffenseEl[] = [
  { type: 'o', x: 348, y: 366 }, { type: 'o', x: 385, y: 403 }, { type: 'o', x: 380, y: 384 },
  { type: 'o', x: 366, y: 366 }, { type: 'o', x: 328, y: 374 }, { type: 'o', x: 318, y: 386 },
  { type: 'qb', x: 348, y: 440 }, { type: 'rb', x: 365, y: 438 }, { type: 'wr', x: 313, y: 408 },
  { type: 'te', x: 323, y: 432 }, { type: 'wr', x: 384, y: 426 },
]
const F2_OFF: OffenseEl[] = [
  { type: 'o', x: 355, y: 311 }, { type: 'o', x: 444, y: 310 }, { type: 'o', x: 397, y: 310 },
  { type: 'o', x: 376, y: 310 }, { type: 'o', x: 334, y: 310 }, { type: 'o', x: 310, y: 311 },
  { type: 'qb', x: 355, y: 327 }, { type: 'rb', x: 357, y: 389 }, { type: 'wr', x: 132, y: 307 },
  { type: 'te', x: 175, y: 304 }, { type: 'wr', x: 508, y: 307 }, { type: 'ball', x: 356, y: 298 },
]
const F3_OFF: OffenseEl[] = [
  { type: 'o', x: 357, y: 302 }, { type: 'o', x: 445, y: 283 }, { type: 'o', x: 398, y: 304 },
  { type: 'o', x: 379, y: 305 }, { type: 'o', x: 335, y: 302 }, { type: 'o', x: 313, y: 307 },
  { type: 'qb', x: 354, y: 354 }, { type: 'rb', x: 367, y: 370 }, { type: 'wr', x: 132, y: 268 },
  { type: 'te', x: 176, y: 276 }, { type: 'wr', x: 506, y: 268 }, { type: 'ball', x: 354, y: 340 },
  { type: 't', x: 398, y: 289 }, { type: 't', x: 333, y: 286 }, { type: 't', x: 380, y: 288 },
  { type: 't', x: 355, y: 285 }, { type: 't', x: 309, y: 289 },
]
const F4_OFF: OffenseEl[] = [
  { type: 'o', x: 357, y: 302 }, { type: 'o', x: 445, y: 283 }, { type: 'o', x: 398, y: 304 },
  { type: 'o', x: 379, y: 305 }, { type: 'o', x: 335, y: 302 }, { type: 'o', x: 313, y: 307 },
  { type: 'qb', x: 357, y: 344 }, { type: 'rb', x: 367, y: 370 }, { type: 'wr', x: 132, y: 268 },
  { type: 'te', x: 176, y: 276 }, { type: 'wr', x: 506, y: 268 }, { type: 'ball', x: 370, y: 356 },
  { type: 't', x: 398, y: 289 }, { type: 't', x: 333, y: 286 }, { type: 't', x: 380, y: 288 },
  { type: 't', x: 355, y: 285 }, { type: 't', x: 309, y: 289 },
]
const F5_OFF: OffenseEl[] = [
  { type: 'o', x: 358, y: 303 }, { type: 'o', x: 435, y: 261 }, { type: 'o', x: 408, y: 305 },
  { type: 'o', x: 382, y: 300 }, { type: 'o', x: 335, y: 308 }, { type: 'o', x: 308, y: 305 },
  { type: 'rb', x: 372, y: 322 }, { type: 'wr', x: 130, y: 215 }, { type: 'te', x: 184, y: 222 },
  { type: 'wr', x: 515, y: 180 }, { type: 'ball', x: 370, y: 312 }, { type: 'qb', x: 356, y: 383 },
]
const F6_OFF: OffenseEl[] = [
  { type: 'o', x: 356, y: 314 }, { type: 'o', x: 421, y: 264 }, { type: 'o', x: 410, y: 317 },
  { type: 'o', x: 388, y: 315 }, { type: 'o', x: 331, y: 317 }, { type: 'o', x: 307, y: 312 },
  { type: 'rb', x: 371, y: 320 }, { type: 'wr', x: 143, y: 210 }, { type: 'te', x: 202, y: 220 },
  { type: 'wr', x: 535, y: 154 }, { type: 'ball', x: 377, y: 371 }, { type: 'qb', x: 373, y: 384 },
]
const F7_OFF: OffenseEl[] = [
  { type: 'rb', x: 367, y: 299 }, { type: 'wr', x: 182, y: 159 }, { type: 'te', x: 254, y: 187 },
  { type: 'wr', x: 568, y: 109 }, { type: 'ball', x: 506, y: 204 }, { type: 'qb', x: 396, y: 378 },
]
const F8_OFF: OffenseEl[] = [
  { type: 'rb', x: 370, y: 248 }, { type: 'wr', x: 258, y: 114 }, { type: 'te', x: 327, y: 145 },
  { type: 'wr', x: 589, y: 84 }, { type: 'ball', x: 585, y: 71 }, { type: 'qb', x: 437, y: 326 },
]
const F9_OFF: OffenseEl[] = [
  { type: 'rb', x: 400, y: 143 }, { type: 'wr', x: 363, y: 68 }, { type: 'te', x: 425, y: 75 },
  { type: 'wr', x: 604, y: 50 }, { type: 'ball', x: 602, y: 38 }, { type: 'qb', x: 468, y: 276 },
]
const F10_OFF: OffenseEl[] = [
  { type: 'rb', x: 423, y: 97 }, { type: 'wr', x: 456, y: 50 }, { type: 'te', x: 492, y: 57 },
  { type: 'wr', x: 603, y: 24 }, { type: 'ball', x: 601, y: 12 }, { type: 'qb', x: 532, y: 221 },
]
const OFF_FRAMES: OffenseEl[][] = [
  F1_OFF, F2_OFF, F3_OFF, F4_OFF, F5_OFF, F6_OFF, F7_OFF, F8_OFF, F9_OFF, F10_OFF,
]

// Defender (X) positions per frame, keyed by permanent colorId 0-10.
const DEF_BY_FRAME: Record<number, Pt>[] = [
  { 0: { x: 348, y: 171 }, 1: { x: 347, y: 244 }, 2: { x: 312, y: 210 }, 3: { x: 390, y: 204 }, 4: { x: 384, y: 226 }, 5: { x: 364, y: 239 }, 6: { x: 363, y: 178 }, 7: { x: 380, y: 190 }, 8: { x: 323, y: 187 }, 9: { x: 318, y: 230 }, 10: { x: 326, y: 242 } },
  { 5: { x: 175, y: 255 }, 9: { x: 376, y: 276 }, 2: { x: 310, y: 273 }, 1: { x: 507, y: 267 }, 8: { x: 442, y: 271 }, 10: { x: 398, y: 275 }, 3: { x: 347, y: 170 }, 4: { x: 384, y: 231 }, 0: { x: 132, y: 263 }, 6: { x: 333, y: 273 }, 7: { x: 352, y: 275 } },
  { 5: { x: 174, y: 243 }, 9: { x: 387, y: 275 }, 2: { x: 302, y: 270 }, 1: { x: 513, y: 237 }, 8: { x: 447, y: 250 }, 10: { x: 407, y: 276 }, 3: { x: 346, y: 180 }, 4: { x: 378, y: 236 }, 0: { x: 132, y: 249 }, 6: { x: 329, y: 270 }, 7: { x: 350, y: 272 } },
  { 5: { x: 174, y: 243 }, 9: { x: 387, y: 275 }, 2: { x: 302, y: 270 }, 1: { x: 513, y: 237 }, 8: { x: 447, y: 250 }, 10: { x: 407, y: 276 }, 3: { x: 346, y: 180 }, 4: { x: 384, y: 233 }, 0: { x: 132, y: 249 }, 6: { x: 329, y: 270 }, 7: { x: 350, y: 272 } },
  { 5: { x: 187, y: 204 }, 9: { x: 386, y: 288 }, 2: { x: 308, y: 289 }, 1: { x: 497, y: 202 }, 8: { x: 437, y: 246 }, 10: { x: 407, y: 294 }, 3: { x: 351, y: 236 }, 4: { x: 380, y: 265 }, 0: { x: 141, y: 196 }, 6: { x: 334, y: 293 }, 7: { x: 356, y: 292 } },
  { 5: { x: 205, y: 205 }, 9: { x: 383, y: 300 }, 2: { x: 309, y: 295 }, 1: { x: 510, y: 168 }, 8: { x: 420, y: 252 }, 10: { x: 409, y: 304 }, 3: { x: 354, y: 244 }, 4: { x: 378, y: 273 }, 0: { x: 146, y: 196 }, 6: { x: 334, y: 300 }, 7: { x: 358, y: 300 } },
  { 5: { x: 236, y: 186 }, 9: { x: 372, y: 276 }, 2: { x: 303, y: 266 }, 1: { x: 539, y: 123 }, 8: { x: 433, y: 213 }, 10: { x: 410, y: 284 }, 3: { x: 374, y: 190 }, 4: { x: 403, y: 228 }, 0: { x: 192, y: 140 }, 6: { x: 330, y: 275 }, 7: { x: 352, y: 258 } },
  { 5: { x: 309, y: 141 }, 9: { x: 392, y: 240 }, 2: { x: 323, y: 211 }, 1: { x: 573, y: 81 }, 8: { x: 501, y: 152 }, 10: { x: 422, y: 254 }, 3: { x: 460, y: 115 }, 4: { x: 469, y: 161 }, 6: { x: 343, y: 224 }, 7: { x: 360, y: 224 }, 0: { x: 242, y: 100 } },
  { 5: { x: 394, y: 81 }, 9: { x: 428, y: 184 }, 2: { x: 359, y: 150 }, 1: { x: 591, y: 48 }, 8: { x: 554, y: 80 }, 10: { x: 450, y: 200 }, 3: { x: 503, y: 79 }, 4: { x: 513, y: 98 }, 6: { x: 380, y: 161 }, 7: { x: 400, y: 175 }, 0: { x: 363, y: 55 } },
  { 5: { x: 486, y: 32 }, 9: { x: 488, y: 126 }, 2: { x: 435, y: 96 }, 1: { x: 589, y: 32 }, 8: { x: 567, y: 46 }, 10: { x: 501, y: 130 }, 3: { x: 539, y: 34 }, 4: { x: 553, y: 30 }, 6: { x: 452, y: 107 }, 7: { x: 465, y: 112 }, 0: { x: 469, y: 35 } },
]

const NFRAMES = 10
const INK = '#8a8a80'
const FRAME_SPAN = 0.82
const STEP = FRAME_SPAN / (NFRAMES - 1)
const SVG_NS = 'http://www.w3.org/2000/svg'

// Stadium-camera fake-perspective: squeezes x toward the field's centerline
// more aggressively near the top of the frame (far downfield) than near the
// bottom (close to the camera), and compresses y toward a horizon line.
function persp(x: number, y: number): Pt {
  const s = 0.6 + 0.4 * (y / 460)
  return { x: 340 + (x - 340) * s, y: 40 + y * 0.82 }
}

// Nearest-position greedy matching — used ONLY for offense (o-line/T/skill
// positions/ball), where the small per-type counts make mismatches
// unlikely. Defense intentionally bypasses this (see DEF_BY_FRAME above).
function greedyMatch(prev: Pt[], cur: Pt[]) {
  const pairs: { i: number; j: number; d: number }[] = []
  for (let i = 0; i < prev.length; i++) {
    for (let j = 0; j < cur.length; j++) {
      const dx = prev[i].x - cur[j].x
      const dy = prev[i].y - cur[j].y
      pairs.push({ i, j, d: dx * dx + dy * dy })
    }
  }
  pairs.sort((a, b) => a.d - b.d)
  const usedI = new Set<number>()
  const usedJ = new Set<number>()
  const matches: { i: number; j: number }[] = []
  for (const pr of pairs) {
    if (!usedI.has(pr.i) && !usedJ.has(pr.j)) {
      usedI.add(pr.i)
      usedJ.add(pr.j)
      matches.push(pr)
    }
  }
  return matches
}

type Track = (OffenseEl | null)[]

function buildTracksOffense(type: OffenseType): Track[] {
  const tracks: Track[] = []
  let prevAssign: Record<number, number> | null = null
  for (let f = 0; f < NFRAMES; f++) {
    const elems = OFF_FRAMES[f].filter((e) => e.type === type)
    const curAssign: Record<number, number> = {}
    if (f === 0 || !prevAssign) {
      elems.forEach((e, idx) => {
        const t: Track = new Array(NFRAMES).fill(null)
        t[f] = e
        tracks.push(t)
        curAssign[idx] = tracks.length - 1
      })
    } else {
      const prevElems = OFF_FRAMES[f - 1].filter((e) => e.type === type)
      const matches = greedyMatch(prevElems, elems)
      const matchedCur = new Set<number>()
      matches.forEach((m) => {
        const trackIdx = prevAssign![m.i]
        if (trackIdx === undefined) return
        tracks[trackIdx][f] = elems[m.j]
        curAssign[m.j] = trackIdx
        matchedCur.add(m.j)
      })
      elems.forEach((e, idx) => {
        if (!matchedCur.has(idx)) {
          const t: Track = new Array(NFRAMES).fill(null)
          t[f] = e
          tracks.push(t)
          curAssign[idx] = tracks.length - 1
        }
      })
    }
    prevAssign = curAssign
  }
  return tracks
}

function buildDefenderTracks(): (Pt | null)[][] {
  const tracks: (Pt | null)[][] = []
  for (let c = 0; c < 11; c++) {
    const t: (Pt | null)[] = new Array(NFRAMES).fill(null)
    for (let f = 0; f < NFRAMES; f++) {
      if (DEF_BY_FRAME[f][c]) t[f] = DEF_BY_FRAME[f][c]
    }
    tracks.push(t)
  }
  return tracks
}

function el<T extends keyof SVGElementTagNameMap>(tag: T) {
  return document.createElementNS(SVG_NS, tag)
}

function makeOToken3D(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx', '2')
  shadow.setAttribute('cy', '4')
  shadow.setAttribute('rx', '8')
  shadow.setAttribute('ry', '7')
  shadow.setAttribute('fill', '#000')
  shadow.setAttribute('opacity', '0.4')
  g.appendChild(shadow)
  const body = el('circle')
  body.setAttribute('r', '7.5')
  body.setAttribute('fill', '#3a3a38')
  body.setAttribute('stroke', INK)
  body.setAttribute('stroke-width', '1.3')
  g.appendChild(body)
  const hl = el('circle')
  hl.setAttribute('cx', '-2.4')
  hl.setAttribute('cy', '-2.6')
  hl.setAttribute('r', '2.2')
  hl.setAttribute('fill', '#6a6a68')
  hl.setAttribute('opacity', '0.65')
  g.appendChild(hl)
  return g
}

function makeXToken3D(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx', '2')
  shadow.setAttribute('cy', '4')
  shadow.setAttribute('rx', '8')
  shadow.setAttribute('ry', '7')
  shadow.setAttribute('fill', '#000')
  shadow.setAttribute('opacity', '0.4')
  g.appendChild(shadow)
  const back = el('path')
  back.setAttribute('d', 'M-6.5,-6.5 L6.5,6.5 M-6.5,6.5 L6.5,-6.5')
  back.setAttribute('stroke', '#4a4a48')
  back.setAttribute('stroke-width', '4.4')
  back.setAttribute('stroke-linecap', 'round')
  g.appendChild(back)
  const front = el('path')
  front.setAttribute('d', 'M-6,-7 L6,5 M-6,5 L6,-7')
  front.setAttribute('stroke', '#8a8a86')
  front.setAttribute('stroke-width', '2')
  front.setAttribute('stroke-linecap', 'round')
  g.appendChild(front)
  return g
}

function makeSkillToken3D(label: string): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx', '2')
  shadow.setAttribute('cy', '4')
  shadow.setAttribute('rx', '9')
  shadow.setAttribute('ry', '8')
  shadow.setAttribute('fill', '#000')
  shadow.setAttribute('opacity', '0.4')
  g.appendChild(shadow)
  const body = el('circle')
  body.setAttribute('r', '8')
  body.setAttribute('fill', '#e8e6dc')
  body.setAttribute('stroke', '#4a4a44')
  body.setAttribute('stroke-width', '1.3')
  g.appendChild(body)
  const hl = el('circle')
  hl.setAttribute('cx', '-2.6')
  hl.setAttribute('cy', '-2.8')
  hl.setAttribute('r', '2.3')
  hl.setAttribute('fill', '#ffffff')
  hl.setAttribute('opacity', '0.65')
  g.appendChild(hl)
  const t = el('text')
  t.setAttribute('x', '0')
  t.setAttribute('y', '1')
  t.setAttribute('text-anchor', 'middle')
  t.setAttribute('dominant-baseline', 'central')
  t.setAttribute('font-family', 'sans-serif')
  t.setAttribute('font-size', '7')
  t.setAttribute('font-weight', '700')
  t.setAttribute('fill', '#3a2415')
  t.textContent = label
  g.appendChild(t)
  return g
}

function makeTToken3D(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx', '2')
  shadow.setAttribute('cy', '4')
  shadow.setAttribute('rx', '8')
  shadow.setAttribute('ry', '5')
  shadow.setAttribute('fill', '#000')
  shadow.setAttribute('opacity', '0.35')
  g.appendChild(shadow)
  const bar = el('line')
  bar.setAttribute('x1', '-7')
  bar.setAttribute('y1', '-5')
  bar.setAttribute('x2', '7')
  bar.setAttribute('y2', '-5')
  bar.setAttribute('stroke', '#4a4a48')
  bar.setAttribute('stroke-width', '3.6')
  bar.setAttribute('stroke-linecap', 'round')
  g.appendChild(bar)
  const stem = el('line')
  stem.setAttribute('x1', '0')
  stem.setAttribute('y1', '-5')
  stem.setAttribute('x2', '0')
  stem.setAttribute('y2', '6')
  stem.setAttribute('stroke', '#8a8a86')
  stem.setAttribute('stroke-width', '2')
  stem.setAttribute('stroke-linecap', 'round')
  g.appendChild(stem)
  return g
}

function makeBallToken(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx', '1.5')
  shadow.setAttribute('cy', '3')
  shadow.setAttribute('rx', '8')
  shadow.setAttribute('ry', '4')
  shadow.setAttribute('fill', '#000')
  shadow.setAttribute('opacity', '0.35')
  g.appendChild(shadow)
  const fb = el('path')
  fb.setAttribute(
    'd',
    'M-7.8,0 Q-4.2,-4.5 0,-4.5 Q4.2,-4.5 7.8,0 Q4.2,4.5 0,4.5 Q-4.2,4.5 -7.8,0 Z',
  )
  fb.setAttribute('fill', '#7a5535')
  fb.setAttribute('stroke', '#3a2415')
  fb.setAttribute('stroke-width', '1')
  g.appendChild(fb)
  ;[-1, 1].forEach((sign) => {
    const lace = el('line')
    lace.setAttribute('x1', '-3')
    lace.setAttribute('y1', String(sign))
    lace.setAttribute('x2', '3')
    lace.setAttribute('y2', String(sign))
    lace.setAttribute('stroke', '#e8dcc8')
    lace.setAttribute('stroke-width', '0.7')
    g.appendChild(lace)
  })
  return g
}

function addYardNumber(fieldG: SVGGElement, x: number, y: number, label: string) {
  const g = el('g')
  g.setAttribute('transform', `translate(${x},${y + 5}) rotate(-90) skewX(-8)`)
  const outline = el('text')
  outline.setAttribute('x', '0')
  outline.setAttribute('y', '0')
  outline.setAttribute('text-anchor', 'middle')
  outline.setAttribute('dominant-baseline', 'central')
  outline.setAttribute('font-family', 'Arial, sans-serif')
  outline.setAttribute('font-weight', '900')
  outline.setAttribute('font-style', 'italic')
  outline.setAttribute('font-size', '20')
  outline.setAttribute('fill', '#2a2a28')
  outline.setAttribute('stroke', '#2a2a28')
  outline.setAttribute('stroke-width', '3')
  outline.setAttribute('stroke-linejoin', 'round')
  outline.setAttribute('opacity', '0.6')
  outline.textContent = label
  g.appendChild(outline)
  const fillText = el('text')
  fillText.setAttribute('x', '0')
  fillText.setAttribute('y', '0')
  fillText.setAttribute('text-anchor', 'middle')
  fillText.setAttribute('dominant-baseline', 'central')
  fillText.setAttribute('font-family', 'Arial, sans-serif')
  fillText.setAttribute('font-weight', '900')
  fillText.setAttribute('font-style', 'italic')
  fillText.setAttribute('font-size', '20')
  fillText.setAttribute('fill', '#8a8a80')
  fillText.setAttribute('opacity', '0.6')
  fillText.textContent = label
  g.appendChild(fillText)
  fieldG.appendChild(g)
}

const FW_PALETTE = [
  '#FF0000', '#FF7A00', '#FFD400', '#9DFF00', '#00E03C',
  '#00E5FF', '#1E5BFF', '#8A2BE2', '#FF00D4', '#FF2D8A',
]
const FW_SPOTS = [
  { x: 22, y: 18 },
  { x: 78, y: 14 },
  { x: 50, y: 10 },
]
const FW_SPARKS_PER_BURST = 35

function fwShuffle<T>(a: T[]): T[] {
  const arr = a.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
function fwRollColorway(): string[] {
  const r = Math.random()
  const count = r < 0.45 ? 1 : r < 0.8 ? 2 : 3
  return fwShuffle(FW_PALETTE).slice(0, count)
}

export default function FleaFlicker() {
  const { wrapperRef, frameRef, progress } = useScrollProgress<HTMLDivElement, HTMLDivElement>()
  const fieldGRef = useRef<SVGGElement | null>(null)
  const routesGRef = useRef<SVGGElement | null>(null)
  const tracksGRef = useRef<SVGGElement | null>(null)
  const tdTextGRef = useRef<SVGGElement | null>(null)
  const fwLayerRef = useRef<HTMLDivElement | null>(null)

  const renderRef = useRef<((p: number) => void) | null>(null)
  const fwFiredRef = useRef(false)
  const fwIntervalRef = useRef<number | null>(null)

  // Build the field, tokens, and routes once on mount — the choreography
  // itself never changes, only the scroll progress driving it.
  useEffect(() => {
    const fieldG = fieldGRef.current
    const routesG = routesGRef.current
    const tracksG = tracksGRef.current
    const tdTextG = tdTextGRef.current
    const fwLayer = fwLayerRef.current
    if (!fieldG || !routesG || !tracksG || !tdTextG || !fwLayer) return

    // Static field grid + two columns of stadium-style yard numbers.
    const lines: [number, number, number, number, string][] = [
      [135, 120, 545, 120, '10'],
      [135, 180, 545, 180, '20'],
      [135, 250, 545, 250, '30'],
      [135, 330, 545, 330, '40'],
    ]
    const leftColX = lines[0][0] + 45
    const rightColX = lines[0][2] - 45
    lines.forEach(([x1, y1, x2, y2, label]) => {
      const line = el('line')
      line.setAttribute('x1', String(x1))
      line.setAttribute('y1', String(y1))
      line.setAttribute('x2', String(x2))
      line.setAttribute('y2', String(y2))
      line.setAttribute('stroke', '#5a5a58')
      line.setAttribute('stroke-width', '1')
      line.setAttribute('opacity', '0.85')
      fieldG.appendChild(line)
      addYardNumber(fieldG, leftColX, y1, label)
      addYardNumber(fieldG, rightColX, y1, label)
      void x2
    })

    // Offense + defense tracks and their on-field tokens.
    type TrackEntry = { track: Track; node: SVGGElement }
    const allTracks: TrackEntry[] = []

    buildTracksOffense('o').forEach((track) => {
      const node = makeOToken3D()
      tracksG.appendChild(node)
      allTracks.push({ track, node })
    })
    buildTracksOffense('t').forEach((track) => {
      const node = makeTToken3D()
      tracksG.appendChild(node)
      allTracks.push({ track, node })
    })
    ;([
      ['qb', 'QB'],
      ['rb', 'RB'],
      ['wr', 'WR'],
      ['te', 'TE'],
    ] as [OffenseType, string][]).forEach(([type, label]) => {
      buildTracksOffense(type).forEach((track) => {
        const node = makeSkillToken3D(label)
        tracksG.appendChild(node)
        allTracks.push({ track, node })
      })
    })
    buildTracksOffense('ball').forEach((track) => {
      const node = makeBallToken()
      tracksG.appendChild(node)
      allTracks.push({ track, node })
    })

    type DefTrackEntry = { track: (Pt | null)[]; node: SVGGElement }
    const defTracks: DefTrackEntry[] = buildDefenderTracks().map((track) => {
      const node = makeXToken3D()
      tracksG.appendChild(node)
      return { track, node }
    })

    // Grey dashed route trails for the four skill positions, one segment per
    // frame-to-frame leg, faded in/out based on scroll proximity to that leg.
    const routeSegments: { node: SVGPathElement; frameIdx: number }[] = []
    ;(['qb', 'rb', 'wr', 'te'] as OffenseType[]).forEach((type) => {
      buildTracksOffense(type).forEach((track) => {
        for (let f = 0; f < NFRAMES - 1; f++) {
          const a = track[f]
          const b = track[f + 1]
          if (a && b) {
            const pa = persp(a.x, a.y)
            const pb = persp(b.x, b.y)
            const path = el('path')
            path.setAttribute('d', `M${pa.x.toFixed(1)},${pa.y.toFixed(1)} L${pb.x.toFixed(1)},${pb.y.toFixed(1)}`)
            path.setAttribute('stroke', INK)
            path.setAttribute('stroke-width', '1.4')
            path.setAttribute('stroke-dasharray', '4 6')
            path.setAttribute('fill', 'none')
            routesG.appendChild(path)
            routeSegments.push({ node: path, frameIdx: f })
          }
        }
      })
    })

    // "TOUCHDOWN!" in the same bold italic stadium font as the yard numbers.
    ;(() => {
      const g = el('g')
      g.setAttribute('transform', 'translate(340,230) skewX(-6)')
      const outline = el('text')
      outline.setAttribute('x', '0')
      outline.setAttribute('y', '0')
      outline.setAttribute('text-anchor', 'middle')
      outline.setAttribute('dominant-baseline', 'central')
      outline.setAttribute('font-family', 'Arial, sans-serif')
      outline.setAttribute('font-weight', '900')
      outline.setAttribute('font-style', 'italic')
      outline.setAttribute('font-size', '48')
      outline.setAttribute('fill', '#1a1a18')
      outline.setAttribute('stroke', '#1a1a18')
      outline.setAttribute('stroke-width', '5')
      outline.setAttribute('stroke-linejoin', 'round')
      outline.textContent = 'TOUCHDOWN!'
      g.appendChild(outline)
      const fillText = el('text')
      fillText.setAttribute('x', '0')
      fillText.setAttribute('y', '0')
      fillText.setAttribute('text-anchor', 'middle')
      fillText.setAttribute('dominant-baseline', 'central')
      fillText.setAttribute('font-family', 'Arial, sans-serif')
      fillText.setAttribute('font-weight', '900')
      fillText.setAttribute('font-style', 'italic')
      fillText.setAttribute('font-size', '48')
      fillText.setAttribute('fill', '#e0ded4')
      fillText.textContent = 'TOUCHDOWN!'
      g.appendChild(fillText)
      tdTextG.appendChild(g)
    })()

    // Hub-style firework bursts (see the Hall of Fame trophy cabinet for the
    // original mechanic this was ported from): each spark gets a random
    // --dx/--dy radial displacement and a tinted trailing box-shadow tail.
    function fwFire(spot: { x: number; y: number }, colorway: string[]) {
      if (!fwLayer) return
      const anchor = document.createElement('div')
      anchor.className = styles.fwAnchor
      anchor.style.left = `${spot.x}%`
      anchor.style.top = `${spot.y}%`
      for (let i = 0; i < FW_SPARKS_PER_BURST; i++) {
        const sp = document.createElement('span')
        sp.className = styles.fwSpark
        const ang = (Math.PI * 2) * (i / FW_SPARKS_PER_BURST) + (Math.random() * 0.35 - 0.175)
        const dist = 70 + Math.random() * 70
        sp.style.setProperty('--dx', `${(Math.cos(ang) * dist).toFixed(1)}px`)
        sp.style.setProperty('--dy', `${(Math.sin(ang) * dist).toFixed(1)}px`)
        const c = colorway[i % colorway.length]
        sp.style.background = c
        sp.style.boxShadow = `0 -3px 4px ${c}cc, 0 -8px 5px ${c}77, 0 -14px 7px ${c}33`
        sp.style.animationDelay = `0s,${(Math.random() * 0.3).toFixed(2)}s`
        anchor.appendChild(sp)
      }
      fwLayer.appendChild(anchor)
      // Force layout so the animation class re-triggers cleanly on relaunch.
      void anchor.offsetWidth
      anchor.classList.add(styles.celebrate)
    }
    function fwLaunchAll() {
      if (!fwLayer) return
      fwLayer.innerHTML = ''
      FW_SPOTS.forEach((spot, idx) => {
        window.setTimeout(() => fwFire(spot, fwRollColorway()), idx * 350)
      })
    }
    function fwStart() {
      if (fwFiredRef.current) return
      fwFiredRef.current = true
      fwLaunchAll()
      fwIntervalRef.current = window.setInterval(fwLaunchAll, 3400)
    }
    function fwStop() {
      fwFiredRef.current = false
      if (fwIntervalRef.current !== null) {
        clearInterval(fwIntervalRef.current)
        fwIntervalRef.current = null
      }
      if (fwLayer) fwLayer.innerHTML = ''
    }

    function trackState(track: Track | (Pt | null)[], i: number, frac: number) {
      const a = track[i]
      const b = track[i + 1]
      if (a && b) return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac, opacity: 1 }
      if (a && !b) return { x: a.x, y: a.y, opacity: 1 - frac }
      if (!a && b) return { x: b.x, y: b.y, opacity: frac }
      return { x: 0, y: 0, opacity: 0 }
    }

    function fadeOpacity(frameIdx: number, p: number) {
      const center = frameIdx * STEP + STEP * 0.5
      const half = STEP * 0.9
      const dist = Math.abs(p - center)
      if (dist <= half * 0.4) return 0.7
      if (dist >= half) return 0
      return (0.7 * (half - dist)) / (half * 0.6)
    }

    function render(p: number) {
      const td = p > FRAME_SPAN ? (p - FRAME_SPAN) / (1 - FRAME_SPAN) : 0
      const fadeMul = 1 - td

      const frameFloat = Math.min(NFRAMES - 1, p / STEP)
      const i = Math.min(NFRAMES - 2, Math.floor(frameFloat))
      const frac = Math.max(0, Math.min(1, frameFloat - i))

      allTracks.forEach(({ track, node }) => {
        const s = trackState(track, i, frac)
        const pt = persp(s.x, s.y)
        node.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`)
        node.setAttribute('opacity', (s.opacity * fadeMul).toFixed(2))
      })
      defTracks.forEach(({ track, node }) => {
        const s = trackState(track, i, frac)
        const pt = persp(s.x, s.y)
        node.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`)
        node.setAttribute('opacity', (s.opacity * fadeMul).toFixed(2))
      })

      routeSegments.forEach((seg) => {
        seg.node.setAttribute('opacity', (fadeOpacity(seg.frameIdx, p) * fadeMul).toFixed(2))
      })

      // Non-null: guarded by the early-return at the top of this effect —
      // TS just can't see that narrowing across the nested render() closure.
      tdTextG!.setAttribute('opacity', td.toFixed(2))

      if (td > 0.05) fwStart()
      else if (td < 0.02) fwStop()
    }

    renderRef.current = render
    render(0)

    return () => {
      renderRef.current = null
      fwStop()
      fieldG.innerHTML = ''
      routesG.innerHTML = ''
      tracksG.innerHTML = ''
      tdTextG.innerHTML = ''
      if (fwLayer) fwLayer.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- build is intentionally
    // mount-only; the frame data is module-level and never changes.
  }, [])

  useEffect(() => {
    renderRef.current?.(progress)
  }, [progress])

  const headerHeight = useHeaderHeight()

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <div className={styles.stickyFrame} ref={frameRef} style={{ top: headerHeight }}>
        <div className={styles.stage}>
          <svg className={styles.board} viewBox="0 0 680 460">
            <g ref={fieldGRef} />
            <g ref={routesGRef} />
            <g ref={tracksGRef} />
            <g ref={tdTextGRef} opacity={0} />
          </svg>
          <div className={styles.fwLayer} ref={fwLayerRef} />
        </div>
      </div>
    </div>
  )
}
