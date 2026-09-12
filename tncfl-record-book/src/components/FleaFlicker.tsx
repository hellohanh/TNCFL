import { useEffect, useRef } from 'react'
import { useScrollProgress } from '../lib/useScrollProgress'
import { useHeaderHeight } from '../lib/HeaderHeightContext'
import styles from './FleaFlicker.module.css'

// ─────────────────────────────────────────────────────────────────────────────
// FF2 — 18-frame flea-flicker play diagram
//
// Marker types:
//   o   — O-line circle
//   x   — Defender X (num = permanent colorId 1–11, used for identity tracking)
//   t   — Block-T marker (has rot)
//   qb/rb/fb/te/xr/z — Skill positions (bare 3D initials)
//   ball — 🏈 emoji (has rot)
//   dash — Dashed throw line {points:[{x,y},{x,y}]}
//   cadence — QB cadence word {word, ax, ay}
//
// Defenders are tracked by their permanent num (1–11) across all 18 frames —
// never by nearest-position — so identity is stable and interpolation is smooth.
// Tokens render in greyscale; num is identity only, not colour.
// ─────────────────────────────────────────────────────────────────────────────

type MarkerType = 'o'|'x'|'t'|'qb'|'rb'|'fb'|'te'|'xr'|'z'|'ball'|'dash'|'cadence'
interface Marker {
  type: MarkerType
  x?: number; y?: number
  rot?: number; num?: number
  points?: {x:number;y:number}[]
  word?: string; ax?: number; ay?: number
}

const SKILL_LABEL: Partial<Record<MarkerType,string>> = {
  qb:'QB', rb:'RB', fb:'FB', te:'TE', xr:'X', z:'Z',
}
// SKILL_TYPES removed — defender identity uses num, not type-set

// Cadence sequence: word + grow-fade animation per frame index (4–7)
// Font grows 0→100px ease-out, then fades out. Each word is its own beat.
const CADENCE_FRAMES: Record<number,{word:string;ax:number;ay:number}> = {
  4: {word:'BLUE 42',  ax:338, ay:330},
  5: {word:'OMAHA',    ax:338, ay:330},
  6: {word:'OH-MA-HA!!',ax:338,ay:330},
  7: {word:'HUT',      ax:338, ay:330},
}

const FRAMES: Marker[][] = [
  // F1 — Huddle
  [{"type":"o","x":386,"y":404,"num":3},{"type":"o","x":380,"y":384,"num":5},{"type":"o","x":309,"y":410,"num":4},{"type":"o","x":328,"y":374,"num":2},{"type":"o","x":318,"y":386,"num":1},{"type":"qb","x":348,"y":440},{"type":"rb","x":373,"y":433},{"type":"xr","x":345,"y":368},{"type":"te","x":323,"y":432},{"type":"z","x":362,"y":372},{"type":"x","x":348,"y":171,"num":6},{"type":"x","x":347,"y":244,"num":5},{"type":"x","x":312,"y":210,"num":1},{"type":"x","x":390,"y":204,"num":11},{"type":"x","x":384,"y":226,"num":10},{"type":"x","x":364,"y":239,"num":8},{"type":"x","x":363,"y":178,"num":7},{"type":"x","x":380,"y":190,"num":9},{"type":"x","x":323,"y":187,"num":3},{"type":"x","x":318,"y":230,"num":2},{"type":"x","x":326,"y":242,"num":4},{"type":"fb","x":395,"y":424}],
  // F2 — Formation
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"xr","x":191,"y":310},{"type":"te","x":415,"y":334},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":409,"y":278,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":339,"y":230,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":327,"y":279,"num":3},{"type":"x","x":296,"y":279,"num":2},{"type":"x","x":353,"y":279,"num":4},{"type":"fb","x":298,"y":388},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F3 — Motion going
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"te","x":262,"y":335},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":264,"y":264,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":323,"y":230,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":375,"y":240,"num":9},{"type":"x","x":297,"y":279,"num":2},{"type":"x","x":327,"y":279,"num":3},{"type":"x","x":354,"y":280,"num":4},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F4 — Motion back
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":422,"y":271,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":335,"y":215,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F5 — Cadence: BLUE 42
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":422,"y":271,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":335,"y":215,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F6 — Cadence: OMAHA
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":422,"y":271,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":335,"y":215,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F7 — Cadence: OH-MA-HA!!
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":422,"y":271,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":335,"y":215,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F8 — Cadence: HUT
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275,"num":6},{"type":"x","x":422,"y":271,"num":5},{"type":"x","x":194,"y":276,"num":1},{"type":"x","x":420,"y":183,"num":11},{"type":"x","x":327,"y":175,"num":10},{"type":"x","x":335,"y":215,"num":8},{"type":"x","x":265,"y":238,"num":7},{"type":"x","x":390,"y":240,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F9 — Snap
  [{"type":"o","x":339,"y":313,"num":3},{"type":"o","x":384,"y":314,"num":5},{"type":"o","x":362,"y":313,"num":4},{"type":"o","x":316,"y":314,"num":2},{"type":"o","x":295,"y":314,"num":1},{"type":"qb","x":338,"y":365},{"type":"rb","x":359,"y":381},{"type":"fb","x":280,"y":371},{"type":"xr","x":194,"y":292},{"type":"z","x":487,"y":292},{"type":"x","x":482,"y":254,"num":6},{"type":"x","x":435,"y":264,"num":5},{"type":"x","x":194,"y":261,"num":1},{"type":"x","x":423,"y":156,"num":11},{"type":"x","x":311,"y":158,"num":10},{"type":"x","x":332,"y":224,"num":8},{"type":"x","x":270,"y":243,"num":7},{"type":"x","x":391,"y":244,"num":9},{"type":"x","x":302,"y":279,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":432,"y":303},{"type":"ball","x":338,"y":355,"rot":-44},{"type":"t","x":296,"y":297,"rot":4},{"type":"t","x":320,"y":295,"rot":16},{"type":"t","x":340,"y":296,"rot":-11},{"type":"t","x":361,"y":293,"rot":-18},{"type":"t","x":384,"y":296,"rot":-5}],
  // F10 — Handoff
  [{"type":"o","x":377,"y":295,"num":5},{"type":"o","x":311,"y":301,"num":2},{"type":"o","x":289,"y":301,"num":1},{"type":"qb","x":337,"y":378},{"type":"rb","x":359,"y":381},{"type":"fb","x":273,"y":342},{"type":"xr","x":196,"y":230},{"type":"z","x":485,"y":228},{"type":"x","x":487,"y":208,"num":6},{"type":"x","x":424,"y":240,"num":5},{"type":"x","x":206,"y":210,"num":1},{"type":"x","x":412,"y":175,"num":11},{"type":"x","x":304,"y":187,"num":10},{"type":"x","x":361,"y":247,"num":8},{"type":"x","x":305,"y":247,"num":7},{"type":"x","x":403,"y":264,"num":9},{"type":"x","x":298,"y":285,"num":2},{"type":"x","x":331,"y":279,"num":3},{"type":"x","x":360,"y":279,"num":4},{"type":"te","x":434,"y":252},{"type":"ball","x":358,"y":375,"rot":-44},{"type":"o","x":334,"y":298,"num":3},{"type":"o","x":358,"y":296,"num":4}],
  // F11 — Run Fake
  [{"type":"o","x":381,"y":287,"num":5},{"type":"o","x":314,"y":293,"num":2},{"type":"o","x":299,"y":295,"num":1},{"type":"qb","x":370,"y":393},{"type":"rb","x":356,"y":337},{"type":"fb","x":252,"y":299},{"type":"xr","x":199,"y":184},{"type":"z","x":483,"y":179},{"type":"x","x":466,"y":197,"num":6},{"type":"x","x":400,"y":242,"num":5},{"type":"x","x":223,"y":216,"num":1},{"type":"x","x":391,"y":195,"num":11},{"type":"x","x":319,"y":201,"num":10},{"type":"x","x":361,"y":247,"num":8},{"type":"x","x":276,"y":248,"num":7},{"type":"x","x":383,"y":266,"num":9},{"type":"x","x":299,"y":277,"num":2},{"type":"x","x":327,"y":272,"num":3},{"type":"x","x":356,"y":271,"num":4},{"type":"te","x":430,"y":233},{"type":"ball","x":354,"y":323,"rot":-44},{"type":"o","x":335,"y":290,"num":3},{"type":"o","x":360,"y":289,"num":4}],
  // F12 — Reverse
  [{"type":"o","x":386,"y":290,"num":5},{"type":"o","x":323,"y":294,"num":2},{"type":"o","x":299,"y":295,"num":1},{"type":"qb","x":389,"y":389},{"type":"rb","x":374,"y":308},{"type":"fb","x":260,"y":252},{"type":"xr","x":207,"y":143},{"type":"z","x":476,"y":143},{"type":"x","x":466,"y":163,"num":6},{"type":"x","x":409,"y":219,"num":5},{"type":"x","x":225,"y":176,"num":1},{"type":"x","x":396,"y":167,"num":11},{"type":"x","x":338,"y":172,"num":10},{"type":"x","x":365,"y":217,"num":8},{"type":"x","x":277,"y":235,"num":7},{"type":"x","x":372,"y":273,"num":9},{"type":"x","x":300,"y":280,"num":2},{"type":"x","x":323,"y":278,"num":3},{"type":"x","x":343,"y":275,"num":4},{"type":"te","x":426,"y":205},{"type":"ball","x":388,"y":377,"rot":-44},{"type":"o","x":345,"y":290,"num":3},{"type":"o","x":367,"y":291,"num":4}],
  // F13 — Flea Flick
  [{"type":"o","x":400,"y":277,"num":5},{"type":"o","x":326,"y":284,"num":2},{"type":"o","x":299,"y":295,"num":1},{"type":"qb","x":409,"y":377},{"type":"rb","x":374,"y":308},{"type":"fb","x":260,"y":252},{"type":"xr","x":238,"y":115},{"type":"z","x":495,"y":116},{"type":"x","x":476,"y":148,"num":6},{"type":"x","x":418,"y":182,"num":5},{"type":"x","x":266,"y":160,"num":1},{"type":"x","x":407,"y":151,"num":11},{"type":"x","x":354,"y":156,"num":10},{"type":"x","x":365,"y":217,"num":8},{"type":"x","x":303,"y":206,"num":7},{"type":"x","x":376,"y":248,"num":9},{"type":"x","x":299,"y":263,"num":2},{"type":"x","x":323,"y":262,"num":3},{"type":"x","x":346,"y":253,"num":4},{"type":"te","x":438,"y":178},{"type":"ball","x":409,"y":366,"rot":-44},{"type":"o","x":350,"y":283,"num":3},{"type":"o","x":374,"y":274,"num":4}],
  // F14 — Throw
  [{"type":"o","x":412,"y":249,"num":5},{"type":"o","x":330,"y":254,"num":2},{"type":"o","x":305,"y":278,"num":1},{"type":"qb","x":419,"y":359},{"type":"rb","x":398,"y":275},{"type":"fb","x":273,"y":194},{"type":"xr","x":284,"y":83},{"type":"z","x":527,"y":78},{"type":"x","x":501,"y":96,"num":6},{"type":"x","x":434,"y":161,"num":5},{"type":"x","x":310,"y":119,"num":1},{"type":"x","x":452,"y":105,"num":11},{"type":"x","x":377,"y":125,"num":10},{"type":"x","x":396,"y":185,"num":8},{"type":"x","x":346,"y":179,"num":7},{"type":"x","x":387,"y":231,"num":9},{"type":"x","x":302,"y":233,"num":2},{"type":"x","x":328,"y":226,"num":3},{"type":"x","x":357,"y":235,"num":4},{"type":"te","x":450,"y":152},{"type":"ball","x":474,"y":194,"rot":-26},{"type":"o","x":356,"y":275,"num":3},{"type":"o","x":374,"y":261,"num":4},{"type":"dash","points":[{"x":417,"y":351},{"x":517,"y":80}]}],
  // F15 — Catch
  [{"type":"o","x":422,"y":218,"num":5},{"type":"o","x":341,"y":241,"num":2},{"type":"o","x":307,"y":244,"num":1},{"type":"qb","x":459,"y":346},{"type":"rb","x":445,"y":244},{"type":"fb","x":306,"y":156},{"type":"xr","x":330,"y":77},{"type":"z","x":521,"y":91},{"type":"x","x":505,"y":94,"num":6},{"type":"x","x":446,"y":144,"num":5},{"type":"x","x":352,"y":105,"num":1},{"type":"x","x":474,"y":97,"num":11},{"type":"x","x":411,"y":108,"num":10},{"type":"x","x":411,"y":145,"num":8},{"type":"x","x":361,"y":144,"num":7},{"type":"x","x":394,"y":216,"num":9},{"type":"x","x":300,"y":209,"num":2},{"type":"x","x":329,"y":207,"num":3},{"type":"x","x":364,"y":220,"num":4},{"type":"te","x":466,"y":133},{"type":"ball","x":519,"y":102,"rot":-26},{"type":"o","x":360,"y":268,"num":3},{"type":"o","x":377,"y":238,"num":4}],
  // F16 — Break Tackle 1
  [{"type":"o","x":431,"y":198,"num":5},{"type":"o","x":352,"y":232,"num":2},{"type":"o","x":319,"y":232,"num":1},{"type":"qb","x":486,"y":323},{"type":"rb","x":459,"y":234},{"type":"fb","x":357,"y":135},{"type":"xr","x":385,"y":71},{"type":"z","x":518,"y":107},{"type":"x","x":540,"y":91,"num":6},{"type":"x","x":455,"y":123,"num":5},{"type":"x","x":397,"y":97,"num":1},{"type":"x","x":490,"y":93,"num":11},{"type":"x","x":449,"y":104,"num":10},{"type":"x","x":439,"y":133,"num":8},{"type":"x","x":403,"y":126,"num":7},{"type":"x","x":396,"y":211,"num":9},{"type":"x","x":300,"y":196,"num":2},{"type":"x","x":331,"y":204,"num":3},{"type":"x","x":365,"y":214,"num":4},{"type":"te","x":466,"y":133},{"type":"ball","x":523,"y":98,"rot":-26},{"type":"o","x":373,"y":257,"num":3},{"type":"o","x":389,"y":227,"num":4}],
  // F17 — Break Tackle 2
  [{"type":"o","x":431,"y":192,"num":5},{"type":"o","x":353,"y":226,"num":2},{"type":"o","x":324,"y":229,"num":1},{"type":"qb","x":509,"y":313},{"type":"rb","x":469,"y":220},{"type":"fb","x":380,"y":113},{"type":"xr","x":409,"y":64},{"type":"z","x":504,"y":80},{"type":"x","x":550,"y":76,"num":6},{"type":"x","x":459,"y":119,"num":5},{"type":"x","x":411,"y":90,"num":1},{"type":"x","x":494,"y":79,"num":11},{"type":"x","x":455,"y":90,"num":10},{"type":"x","x":445,"y":117,"num":8},{"type":"x","x":417,"y":114,"num":7},{"type":"x","x":397,"y":205,"num":9},{"type":"x","x":303,"y":192,"num":2},{"type":"x","x":330,"y":196,"num":3},{"type":"x","x":369,"y":206,"num":4},{"type":"te","x":477,"y":107},{"type":"ball","x":515,"y":71,"rot":-26},{"type":"o","x":380,"y":250,"num":3},{"type":"o","x":395,"y":224,"num":4}],
  // F18 — TD
  [{"type":"o","x":446,"y":168,"num":5},{"type":"o","x":357,"y":220,"num":2},{"type":"o","x":325,"y":224,"num":1},{"type":"qb","x":530,"y":283},{"type":"rb","x":469,"y":220},{"type":"fb","x":399,"y":91},{"type":"xr","x":438,"y":40},{"type":"z","x":507,"y":39},{"type":"x","x":539,"y":52,"num":6},{"type":"x","x":470,"y":102,"num":5},{"type":"x","x":436,"y":70,"num":1},{"type":"x","x":490,"y":56,"num":11},{"type":"x","x":472,"y":70,"num":10},{"type":"x","x":447,"y":102,"num":8},{"type":"x","x":423,"y":95,"num":7},{"type":"x","x":397,"y":205,"num":9},{"type":"x","x":302,"y":181,"num":2},{"type":"x","x":334,"y":193,"num":3},{"type":"x","x":373,"y":200,"num":4},{"type":"te","x":491,"y":92},{"type":"ball","x":515,"y":34,"rot":-26},{"type":"o","x":386,"y":244,"num":3},{"type":"o","x":403,"y":224,"num":4}],
]

const NFRAMES     = FRAMES.length      // 18
const INK         = '#8a8a80'
const FRAME_SPAN  = 0.82
const STEP        = FRAME_SPAN / (NFRAMES - 1)
const SVG_NS      = 'http://www.w3.org/2000/svg'
const BALL_FS     = 16.5
const N_DEFENDERS = 11

interface Pt { x: number; y: number }
type Track = (Marker | null)[]

function svgEl<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
  return document.createElementNS(SVG_NS, tag)
}

// ── Token factories (all greyscale) ──────────────────────────────────────────

function makeOToken(): SVGGElement {
  const g = svgEl('g')
  const sh = svgEl('ellipse')
  sh.setAttribute('cx','2'); sh.setAttribute('cy','4')
  sh.setAttribute('rx','8'); sh.setAttribute('ry','7')
  sh.setAttribute('fill','#000'); sh.setAttribute('opacity','0.4')
  g.appendChild(sh)
  const bd = svgEl('circle')
  bd.setAttribute('r','7.5'); bd.setAttribute('fill','#3a3a38')
  bd.setAttribute('stroke',INK); bd.setAttribute('stroke-width','1.3')
  g.appendChild(bd)
  const hl = svgEl('circle')
  hl.setAttribute('cx','-2.4'); hl.setAttribute('cy','-2.6')
  hl.setAttribute('r','2.2'); hl.setAttribute('fill','#6a6a68')
  hl.setAttribute('opacity','0.65')
  g.appendChild(hl)
  return g
}

function makeXToken(): SVGGElement {
  const g = svgEl('g')
  const sh = svgEl('ellipse')
  sh.setAttribute('cx','2'); sh.setAttribute('cy','4')
  sh.setAttribute('rx','8'); sh.setAttribute('ry','7')
  sh.setAttribute('fill','#000'); sh.setAttribute('opacity','0.4')
  g.appendChild(sh)
  const bk = svgEl('path')
  bk.setAttribute('d','M-6.5,-6.5 L6.5,6.5 M-6.5,6.5 L6.5,-6.5')
  bk.setAttribute('stroke','#4a4a48'); bk.setAttribute('stroke-width','4.4')
  bk.setAttribute('stroke-linecap','round')
  g.appendChild(bk)
  const fr = svgEl('path')
  fr.setAttribute('d','M-6,-7 L6,5 M-6,5 L6,-7')
  fr.setAttribute('stroke',INK); fr.setAttribute('stroke-width','2')
  fr.setAttribute('stroke-linecap','round')
  g.appendChild(fr)
  return g
}

function makeSkillToken(label: string): SVGGElement {
  const g = svgEl('g')
  const layers: [string,string,string,string][] = [
    ['1.5','2.5','#000','0.55'],
    ['0','0','#e8e6dc','1'],
    ['-0.6','-0.8','#ffffff','0.45'],
  ]
  layers.forEach(([x,y,fill,opacity]) => {
    const t = svgEl('text')
    t.setAttribute('x',x); t.setAttribute('y',y)
    t.setAttribute('text-anchor','middle')
    t.setAttribute('dominant-baseline','central')
    t.setAttribute('font-family','Arial, sans-serif')
    t.setAttribute('font-weight','900'); t.setAttribute('font-size','15')
    t.setAttribute('fill',fill); t.setAttribute('opacity',opacity)
    t.textContent = label
    g.appendChild(t)
  })
  return g
}

function makeTToken(): SVGGElement {
  const g = svgEl('g')
  const sh = svgEl('ellipse')
  sh.setAttribute('cx','2'); sh.setAttribute('cy','4')
  sh.setAttribute('rx','8'); sh.setAttribute('ry','5')
  sh.setAttribute('fill','#000'); sh.setAttribute('opacity','0.35')
  g.appendChild(sh)
  const bar = svgEl('line')
  bar.setAttribute('x1','-7'); bar.setAttribute('y1','-5')
  bar.setAttribute('x2','7');  bar.setAttribute('y2','-5')
  bar.setAttribute('stroke','#4a4a48'); bar.setAttribute('stroke-width','3.6')
  bar.setAttribute('stroke-linecap','round')
  g.appendChild(bar)
  const stem = svgEl('line')
  stem.setAttribute('x1','0'); stem.setAttribute('y1','-5')
  stem.setAttribute('x2','0'); stem.setAttribute('y2','6')
  stem.setAttribute('stroke',INK); stem.setAttribute('stroke-width','2')
  stem.setAttribute('stroke-linecap','round')
  g.appendChild(stem)
  return g
}

function makeBallToken(): SVGGElement {
  const g = svgEl('g')
  const em = svgEl('text')
  em.setAttribute('x','0'); em.setAttribute('y','0')
  em.setAttribute('text-anchor','middle')
  em.setAttribute('dominant-baseline','central')
  em.setAttribute('font-size', String(BALL_FS))
  em.textContent = '\uD83C\uDFC8'
  g.appendChild(em)
  return g
}

// ── Track building ────────────────────────────────────────────────────────────

// Defenders: keyed by permanent num (1–11). No position-matching needed.
function buildDefenderTracks(): (Pt|null)[][] {
  const tracks: (Pt|null)[][] = []
  for (let id = 1; id <= N_DEFENDERS; id++) {
    const t: (Pt|null)[] = new Array(NFRAMES).fill(null)
    for (let f = 0; f < NFRAMES; f++) {
      const m = FRAMES[f].find(e => e.type === 'x' && e.num === id)
      if (m) t[f] = {x: m.x!, y: m.y!}
    }
    tracks.push(t)
  }
  return tracks
}

function greedyMatch(prev: Pt[], cur: Pt[]): {i: number; j: number}[] {
  const pairs: {i:number;j:number;d:number}[] = []
  for (let i = 0; i < prev.length; i++)
    for (let j = 0; j < cur.length; j++) {
      const dx = prev[i].x-cur[j].x, dy = prev[i].y-cur[j].y
      pairs.push({i,j,d:dx*dx+dy*dy})
    }
  pairs.sort((a,b)=>a.d-b.d)
  const ui=new Set<number>(), uj=new Set<number>()
  const out: {i:number;j:number}[] = []
  for (const p of pairs)
    if (!ui.has(p.i)&&!uj.has(p.j)){ui.add(p.i);uj.add(p.j);out.push(p)}
  return out
}

function buildTracks(type: MarkerType): Track[] {
  const tracks: Track[] = []
  let prevAssign: Record<number,number>|null = null
  for (let f = 0; f < NFRAMES; f++) {
    const elems = FRAMES[f].filter(e => e.type === type)
    const cur: Record<number,number> = {}
    if (f === 0 || !prevAssign) {
      elems.forEach((e,idx) => {
        const t: Track = new Array(NFRAMES).fill(null)
        t[f]=e; tracks.push(t); cur[idx]=tracks.length-1
      })
    } else {
      const prev = FRAMES[f-1].filter(e => e.type===type)
      const matches = greedyMatch(
        prev.map(e=>({x:e.x!,y:e.y!})),
        elems.map(e=>({x:e.x!,y:e.y!})),
      )
      const matched=new Set<number>()
      matches.forEach(m=>{
        const ti=prevAssign![m.i]
        if(ti===undefined)return
        tracks[ti][f]=elems[m.j]; cur[m.j]=ti; matched.add(m.j)
      })
      elems.forEach((e,idx)=>{
        if(!matched.has(idx)){
          const t: Track=new Array(NFRAMES).fill(null)
          t[f]=e; tracks.push(t); cur[idx]=tracks.length-1
        }
      })
    }
    prevAssign=cur
  }
  return tracks
}

// ── Yard number helper ────────────────────────────────────────────────────────
function addYardNumber(fieldG: SVGGElement, x: number, y: number, label: string) {
  const g = svgEl('g')
  g.setAttribute('transform',`translate(${x},${y+5}) rotate(-90) skewX(-8)`)
  const outline = svgEl('text')
  outline.setAttribute('x','0'); outline.setAttribute('y','0')
  outline.setAttribute('text-anchor','middle'); outline.setAttribute('dominant-baseline','central')
  outline.setAttribute('font-family','Arial, sans-serif'); outline.setAttribute('font-weight','900')
  outline.setAttribute('font-style','italic'); outline.setAttribute('font-size','20')
  outline.setAttribute('fill','#2a2a28'); outline.setAttribute('stroke','#2a2a28')
  outline.setAttribute('stroke-width','3'); outline.setAttribute('stroke-linejoin','round')
  outline.setAttribute('opacity','0.6'); outline.textContent=label
  g.appendChild(outline)
  const fill = svgEl('text')
  fill.setAttribute('x','0'); fill.setAttribute('y','0')
  fill.setAttribute('text-anchor','middle'); fill.setAttribute('dominant-baseline','central')
  fill.setAttribute('font-family','Arial, sans-serif'); fill.setAttribute('font-weight','900')
  fill.setAttribute('font-style','italic'); fill.setAttribute('font-size','20')
  fill.setAttribute('fill',INK); fill.setAttribute('opacity','0.6'); fill.textContent=label
  g.appendChild(fill)
  fieldG.appendChild(g)
}

// ── Fireworks ─────────────────────────────────────────────────────────────────
const FW_PALETTE=['#FF0000','#FF7A00','#FFD400','#9DFF00','#00E03C','#00E5FF','#1E5BFF','#8A2BE2','#FF00D4','#FF2D8A']
const FW_SPARKS=35

function fwShuffle<T>(a: T[]): T[] {
  const arr=a.slice()
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}
  return arr
}
function fwRollColorway(){const r=Math.random();return fwShuffle(FW_PALETTE).slice(0,r<0.45?1:r<0.8?2:3)}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FleaFlicker() {
  const {wrapperRef,frameRef,progress}=useScrollProgress<HTMLDivElement,HTMLDivElement>()
  const fieldGRef  =useRef<SVGGElement|null>(null)
  const routesGRef =useRef<SVGGElement|null>(null)
  const tracksGRef =useRef<SVGGElement|null>(null)
  const tdTextGRef =useRef<SVGGElement|null>(null)
  const fwLayerRef =useRef<HTMLDivElement|null>(null)
  const renderRef  =useRef<((p:number)=>void)|null>(null)
  const fwFiredRef =useRef(false)
  const fwIntervalRef=useRef<number|null>(null)

  useEffect(()=>{
    const fieldG =fieldGRef.current
    const routesG=routesGRef.current
    const tracksG=tracksGRef.current
    const tdTextG=tdTextGRef.current
    const fwLayer=fwLayerRef.current
    if(!fieldG||!routesG||!tracksG||!tdTextG||!fwLayer)return

    // Static field
    const yardLines:[number,number,number,number,string][]=[
      [135,120,545,120,'10'],[135,180,545,180,'20'],
      [135,250,545,250,'30'],[135,330,545,330,'40'],
    ]
    const lx=yardLines[0][0]+45, rx=yardLines[0][2]-45
    yardLines.forEach(([x1,y1,x2,y2,label])=>{
      const line=svgEl('line')
      line.setAttribute('x1',String(x1));line.setAttribute('y1',String(y1))
      line.setAttribute('x2',String(x2));line.setAttribute('y2',String(y2))
      line.setAttribute('stroke','#5a5a58');line.setAttribute('stroke-width','1');line.setAttribute('opacity','0.85')
      fieldG.appendChild(line)
      addYardNumber(fieldG,lx,y1,label);addYardNumber(fieldG,rx,y1,label)
      void x2
    })
    const gl=svgEl('line')
    gl.setAttribute('x1','135');gl.setAttribute('y1','40');gl.setAttribute('x2','545');gl.setAttribute('y2','40')
    gl.setAttribute('stroke','#e8e6dc');gl.setAttribute('stroke-width','2.5');gl.setAttribute('opacity','0.85')
    fieldG.appendChild(gl)
    const los=svgEl('line')
    los.id='ff2Los';los.setAttribute('x1','135');los.setAttribute('y1','299');los.setAttribute('x2','545');los.setAttribute('y2','299')
    los.setAttribute('stroke','#4aa3df');los.setAttribute('stroke-width','2');los.setAttribute('opacity','0.7')
    fieldG.appendChild(los)

    // ── Offense tracks ───────────────────────────────────────────────────────
    interface ATE {track:Track;node:SVGGElement}
    const allTracks:ATE[]=[]

    buildTracks('o').forEach(track=>{const node=makeOToken();tracksG.appendChild(node);allTracks.push({track,node})})
    buildTracks('t').forEach(track=>{const node=makeTToken();tracksG.appendChild(node);allTracks.push({track,node})})
    ;(['qb','rb','fb','te','xr','z'] as MarkerType[]).forEach(type=>{
      buildTracks(type).forEach(track=>{
        const node=makeSkillToken(SKILL_LABEL[type]!);tracksG.appendChild(node);allTracks.push({track,node})
      })
    })
    buildTracks('ball').forEach(track=>{const node=makeBallToken();tracksG.appendChild(node);allTracks.push({track,node})})

    // ── Defender tracks — identity by num, never position-matched ────────────
    interface DTE {track:(Pt|null)[];node:SVGGElement}
    const defTracks:DTE[]=buildDefenderTracks().map(track=>{
      const node=makeXToken();tracksG.appendChild(node);return{track,node}
    })

    // ── Route trails ─────────────────────────────────────────────────────────
    const routeSegs:{node:SVGPathElement;frameIdx:number}[]=[]
    ;(['qb','rb','fb','te','xr','z'] as MarkerType[]).forEach(type=>{
      buildTracks(type).forEach(track=>{
        for(let f=0;f<NFRAMES-1;f++){
          const a=track[f],b=track[f+1]
          if(a?.x!=null&&b?.x!=null){
            const path=svgEl('path')
            path.setAttribute('d',`M${a.x!.toFixed(1)},${a.y!.toFixed(1)} L${b.x!.toFixed(1)},${b.y!.toFixed(1)}`)
            path.setAttribute('stroke',INK);path.setAttribute('stroke-width','1.4')
            path.setAttribute('stroke-dasharray','4 6');path.setAttribute('fill','none')
            routesG.appendChild(path);routeSegs.push({node:path,frameIdx:f})
          }
        }
      })
    })

    // ── Dash throw line (F14) ─────────────────────────────────────────────────
    const dashLine=svgEl('path')
    dashLine.setAttribute('fill','none');dashLine.setAttribute('stroke','#cc2222')
    dashLine.setAttribute('stroke-width','2.5');dashLine.setAttribute('stroke-dasharray','7 5')
    dashLine.setAttribute('opacity','0')
    tracksG.appendChild(dashLine)

    // ── Cadence overlay — grows 0→100px, fades out ────────────────────────────
    // Three layers for the same 3D-shadow look as the skill initials.
    const cadG=svgEl('g')
    cadG.setAttribute('opacity','0')
    tracksG.appendChild(cadG)
    const cadLayers:[string,string,string,string][]=[
      ['2','3','#000','0.5'],
      ['0','0','#e8e6dc','1'],
      ['-0.8','-1','#ffffff','0.4'],
    ]
    const cadTexts:SVGTextElement[]=cadLayers.map(([_dx,_dy,fill,opacity])=>{
      const t=svgEl('text')
      t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central')
      t.setAttribute('font-family','Arial, sans-serif');t.setAttribute('font-weight','900')
      t.setAttribute('font-style','italic');t.setAttribute('font-size','0')
      t.setAttribute('fill',fill);t.setAttribute('opacity',opacity)
      cadG.appendChild(t);return t
    })

    // ── TOUCHDOWN overlay ─────────────────────────────────────────────────────
    ;(()=>{
      const g=svgEl('g');g.setAttribute('transform','translate(340,230) skewX(-6)')
      const outline=svgEl('text')
      outline.setAttribute('x','0');outline.setAttribute('y','0')
      outline.setAttribute('text-anchor','middle');outline.setAttribute('dominant-baseline','central')
      outline.setAttribute('font-family','Arial, sans-serif');outline.setAttribute('font-weight','900')
      outline.setAttribute('font-style','italic');outline.setAttribute('font-size','48')
      outline.setAttribute('fill','#1a1a18');outline.setAttribute('stroke','#1a1a18')
      outline.setAttribute('stroke-width','5');outline.setAttribute('stroke-linejoin','round')
      outline.textContent='TOUCHDOWN!';g.appendChild(outline)
      const ft=svgEl('text')
      ft.setAttribute('x','0');ft.setAttribute('y','0')
      ft.setAttribute('text-anchor','middle');ft.setAttribute('dominant-baseline','central')
      ft.setAttribute('font-family','Arial, sans-serif');ft.setAttribute('font-weight','900')
      ft.setAttribute('font-style','italic');ft.setAttribute('font-size','48')
      ft.setAttribute('fill','#e0ded4');ft.textContent='TOUCHDOWN!';g.appendChild(ft)
      tdTextG.appendChild(g)
    })()

    // ── Fireworks ─────────────────────────────────────────────────────────────
    function fwFire(spot:{x:number;y:number},colorway:string[]){
      if(!fwLayer)return
      const anchor=document.createElement('div')
      anchor.className=styles.fwAnchor
      anchor.style.left=`${spot.x}%`;anchor.style.top=`${spot.y}%`
      for(let i=0;i<FW_SPARKS;i++){
        const sp=document.createElement('span');sp.className=styles.fwSpark
        const ang=Math.PI*2*(i/FW_SPARKS)+(Math.random()*0.35-0.175)
        const dist=70+Math.random()*70
        sp.style.setProperty('--dx',`${(Math.cos(ang)*dist).toFixed(1)}px`)
        sp.style.setProperty('--dy',`${(Math.sin(ang)*dist).toFixed(1)}px`)
        const c=colorway[i%colorway.length]
        sp.style.background=c
        sp.style.boxShadow=`0 -3px 4px ${c}cc, 0 -8px 5px ${c}77, 0 -14px 7px ${c}33`
        sp.style.animationDelay=`0s,${(Math.random()*0.3).toFixed(2)}s`
        anchor.appendChild(sp)
      }
      fwLayer.appendChild(anchor);void anchor.offsetWidth
      anchor.classList.add(styles.celebrate)
    }
    function fwLaunchAll(){
      if(!fwLayer||!fwFiredRef.current)return
      // Random burst count 2–4, random positions, random stagger
      const count=2+Math.floor(Math.random()*3)
      let delay=0
      for(let i=0;i<count;i++){
        const spot={x:10+Math.random()*80,y:5+Math.random()*50}
        const colorway=fwRollColorway()
        window.setTimeout(()=>{if(fwFiredRef.current)fwFire(spot,colorway)},delay)
        delay+=200+Math.floor(Math.random()*600)
      }
      // Schedule next cycle at a random interval 2400–4800ms
      const nextIn=2400+Math.floor(Math.random()*2400)
      fwIntervalRef.current=window.setTimeout(fwLaunchAll,nextIn) as unknown as number
    }
    function fwStart(){if(fwFiredRef.current)return;fwFiredRef.current=true;fwLaunchAll()}
    function fwStop(){fwFiredRef.current=false;if(fwIntervalRef.current!==null){clearTimeout(fwIntervalRef.current);fwIntervalRef.current=null};if(fwLayer)fwLayer.innerHTML=''}

    // ── Interpolation helpers ─────────────────────────────────────────────────
    function trackState(track:Track,i:number,frac:number){
      const a=track[i],b=track[i+1]
      if(a?.x!=null&&b?.x!=null)return{x:a.x+(b.x-a.x)*frac,y:a.y!+(b.y!-a.y!)*frac,rot:(a.rot??0)+((b.rot??0)-(a.rot??0))*frac,opacity:1}
      if(a?.x!=null&&!b)        return{x:a.x,y:a.y!,rot:a.rot??0,opacity:1-frac}
      if(!a&&b?.x!=null)        return{x:b.x,y:b.y!,rot:b.rot??0,opacity:frac}
      return{x:0,y:0,rot:0,opacity:0}
    }
    function defState(track:(Pt|null)[],i:number,frac:number){
      const a=track[i],b=track[i+1]
      if(a&&b)  return{x:a.x+(b.x-a.x)*frac,y:a.y+(b.y-a.y)*frac,opacity:1}
      if(a&&!b) return{x:a.x,y:a.y,opacity:1-frac}
      if(!a&&b) return{x:b.x,y:b.y,opacity:frac}
      return{x:0,y:0,opacity:0}
    }
    function fadeOpacity(frameIdx:number,p:number){
      const center=frameIdx*STEP+STEP*0.5,half=STEP*0.9,dist=Math.abs(p-center)
      if(dist<=half*0.4)return 0.7;if(dist>=half)return 0;return 0.7*(half-dist)/(half*0.6)
    }

    // ── Cadence grow-fade ─────────────────────────────────────────────────────
    // Within each cadence frame's STEP window:
    //   0→60%  — font grows 0→100px (ease-out: sqrt curve)
    //   60→100% — fades out opacity 1→0
    let lastCadFi = -1
    function updateCadence(frameFloat:number,fadeMul:number){
      const fi=Math.round(frameFloat)
      const cad=CADENCE_FRAMES[fi]
      if(!cad){cadG.setAttribute('opacity','0');lastCadFi=-1;return}

      // local progress within this frame's STEP window (0→1)
      const frameStart=fi*STEP
      const local=Math.max(0,Math.min(1,(frameFloat*STEP-frameStart*STEP)/(STEP*STEP) ))
      // simpler: fractional position within frame
      const frac=Math.max(0,Math.min(1,(frameFloat-fi+0.5)))

      // grow: 0→60% of frac → font 0→100 ease-out
      const growT=Math.min(1,frac/0.6)
      const fontSize=Math.round(100*Math.sqrt(growT))

      // fade: 60%→100% of frac → opacity 1→0
      const fadeT=Math.max(0,(frac-0.6)/0.4)
      const opacity=(1-fadeT)*fadeMul

      if(fi!==lastCadFi){
        lastCadFi=fi
        cadG.setAttribute('transform',`translate(${cad.ax},${cad.ay})`)
        cadTexts.forEach(t=>t.textContent=cad.word)
      }
      cadTexts.forEach(t=>t.setAttribute('font-size',String(fontSize)))
      cadG.setAttribute('opacity',String(opacity.toFixed(2)))
      void frac; void local
    }

    // ── Main render ───────────────────────────────────────────────────────────
    function render(p:number){
      const td    =p>FRAME_SPAN?(p-FRAME_SPAN)/(1-FRAME_SPAN):0
      const fadeMul=1-td
      const frameFloat=Math.min(NFRAMES-1,p/STEP)
      const i    =Math.min(NFRAMES-2,Math.floor(frameFloat))
      const frac =Math.max(0,Math.min(1,frameFloat-i))

      allTracks.forEach(({track,node})=>{
        const s=trackState(track,i,frac)
        const isBall =track.some(m=>m?.type==='ball')
        const isTTok =track.some(m=>m?.type==='t')
        const rot=(isBall||isTTok)?` rotate(${s.rot.toFixed(1)})`:''
        node.setAttribute('transform',`translate(${s.x.toFixed(1)},${s.y.toFixed(1)})${rot}`)
        node.setAttribute('opacity',(s.opacity*fadeMul).toFixed(2))
      })

      defTracks.forEach(({track,node})=>{
        const s=defState(track,i,frac)
        node.setAttribute('transform',`translate(${s.x.toFixed(1)},${s.y.toFixed(1)})`)
        node.setAttribute('opacity',(s.opacity*fadeMul).toFixed(2))
      })

      routeSegs.forEach(seg=>{
        seg.node.setAttribute('opacity',(fadeOpacity(seg.frameIdx,p)*fadeMul).toFixed(2))
      })

      // Dash throw line — frame 13 (F14)
      const dashMark=FRAMES[Math.min(NFRAMES-1,Math.round(frameFloat))].find(m=>m.type==='dash')
      if(dashMark?.points){
        const[a,b]=dashMark.points
        dashLine.setAttribute('d',`M${a.x},${a.y} L${b.x},${b.y}`)
        dashLine.setAttribute('opacity',(fadeOpacity(13,p)*fadeMul).toFixed(2))
      }else{dashLine.setAttribute('opacity','0')}

      // Cadence overlay
      updateCadence(frameFloat,fadeMul)

      // LOS cross-fades blue→mustard as TD fades in
      const losEl=document.getElementById('ff2Los') as SVGLineElement|null
      if(losEl){
        const r1=parseInt('4a',16),g1=parseInt('a3',16),b1=parseInt('df',16)
        const r2=parseInt('d9',16),g2=parseInt('a5',16),b2=parseInt('21',16)
        const mix=(a:number,b:number)=>Math.round(a+(b-a)*td)
        losEl.setAttribute('stroke',`rgb(${mix(r1,r2)},${mix(g1,g2)},${mix(b1,b2)})`)
      }
      tdTextG!.setAttribute('opacity',td.toFixed(2))
      if(td>0.05)fwStart();else if(td<0.02)fwStop()
    }

    renderRef.current=render;render(0)

    return()=>{
      renderRef.current=null;fwStop()
      fieldG.innerHTML='';routesG.innerHTML='';tracksG.innerHTML='';tdTextG.innerHTML=''
      if(fwLayer)fwLayer.innerHTML=''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{renderRef.current?.(progress)},[progress])

  const headerHeight=useHeaderHeight()

  return(
    <div className={styles.wrap} ref={wrapperRef}>
      <div className={styles.stickyFrame} ref={frameRef} style={{top:headerHeight}}>
        <div className={styles.stage}>
          <svg className={styles.board} viewBox="0 0 680 460">
            <g ref={fieldGRef}/>
            <g ref={routesGRef}/>
            <g ref={tracksGRef}/>
            <g ref={tdTextGRef} opacity={0}/>
          </svg>
          <div className={styles.fwLayer} ref={fwLayerRef}/>
        </div>
      </div>
    </div>
  )
}
