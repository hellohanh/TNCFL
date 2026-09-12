import { useEffect, useRef } from 'react'
import { useScrollProgress } from '../lib/useScrollProgress'
import { useHeaderHeight } from '../lib/HeaderHeightContext'
import styles from './FleaFlicker.module.css'

// ─────────────────────────────────────────────────────────────────────────────
// FF2 — 18-frame flea-flicker play diagram
//
// All 18 frames authored by hand in the inline SVG whiteboard editor,
// frame-by-frame, and locked in sequence. The authoring space is a 680×460
// SVG with:
//   - Goal line at y=40
//   - LOS at y=299
//   - Yard lines at y=120/180/250/330
//   - Centre guides at x=340 / y=230
//
// Marker types in each frame array:
//   o   — O-line circle
//   x   — Defender X
//   t   — Block-T marker (has rot)
//   qb/rb/fb/te/xr/z — Skill positions (bare 3D initials, no bubble)
//   ball — Football emoji 🏈 (has rot)
//   dash — Dashed throw line {points:[{x,y},{x,y}]}
//   cadence — QB cadence word overlay {word, ax, ay}
//
// Frames 5–8 share the same player layout as frame 4 (Motion back);
// the cadence field on those elements is what distinguishes them visually.
//
// All tokens render in greyscale — no colour IDs on defenders or O-line.
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
const SKILL_TYPES = new Set<MarkerType>(['qb','rb','fb','te','xr','z'])

const FRAMES: Marker[][] = [
  // F1 — Huddle
  [{"type":"o","x":386,"y":404},{"type":"o","x":380,"y":384},{"type":"o","x":309,"y":410},{"type":"o","x":328,"y":374},{"type":"o","x":318,"y":386},{"type":"qb","x":348,"y":440},{"type":"rb","x":373,"y":433},{"type":"xr","x":345,"y":368},{"type":"te","x":323,"y":432},{"type":"z","x":362,"y":372},{"type":"x","x":348,"y":171},{"type":"x","x":347,"y":244},{"type":"x","x":312,"y":210},{"type":"x","x":390,"y":204},{"type":"x","x":384,"y":226},{"type":"x","x":364,"y":239},{"type":"x","x":363,"y":178},{"type":"x","x":380,"y":190},{"type":"x","x":323,"y":187},{"type":"x","x":318,"y":230},{"type":"x","x":326,"y":242},{"type":"fb","x":395,"y":424}],
  // F2 — Formation
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"xr","x":191,"y":310},{"type":"te","x":415,"y":334},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":409,"y":278},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":339,"y":230},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":327,"y":279},{"type":"x","x":296,"y":279},{"type":"x","x":353,"y":279},{"type":"fb","x":298,"y":388},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F3 — Motion going
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"te","x":262,"y":335},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":264,"y":264},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":323,"y":230},{"type":"x","x":265,"y":238},{"type":"x","x":375,"y":240},{"type":"x","x":297,"y":279},{"type":"x","x":327,"y":279},{"type":"x","x":354,"y":280},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F4 — Motion back
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":422,"y":271},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":335,"y":215},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44}],
  // F5 — Cadence: BLUE 42
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":422,"y":271},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":335,"y":215},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44},{"type":"cadence","word":"BLUE 42","ax":338,"ay":330}],
  // F6 — Cadence: OMAHA
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":422,"y":271},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":335,"y":215},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44},{"type":"cadence","word":"OMAHA","ax":338,"ay":330}],
  // F7 — Cadence: OMAHA
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":422,"y":271},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":335,"y":215},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44},{"type":"cadence","word":"OMAHA","ax":338,"ay":330}],
  // F8 — Cadence: HUT
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":354,"y":390},{"type":"fb","x":298,"y":388},{"type":"xr","x":191,"y":310},{"type":"z","x":487,"y":310},{"type":"x","x":486,"y":275},{"type":"x","x":422,"y":271},{"type":"x","x":194,"y":276},{"type":"x","x":420,"y":183},{"type":"x","x":327,"y":175},{"type":"x","x":335,"y":215},{"type":"x","x":265,"y":238},{"type":"x","x":390,"y":240},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":422,"y":337},{"type":"ball","x":339,"y":301,"rot":-44},{"type":"cadence","word":"HUT","ax":338,"ay":330}],
  // F9 — Snap
  [{"type":"o","x":339,"y":313},{"type":"o","x":384,"y":314},{"type":"o","x":362,"y":313},{"type":"o","x":316,"y":314},{"type":"o","x":295,"y":314},{"type":"qb","x":338,"y":365},{"type":"rb","x":359,"y":381},{"type":"fb","x":280,"y":371},{"type":"xr","x":194,"y":292},{"type":"z","x":487,"y":292},{"type":"x","x":482,"y":254},{"type":"x","x":435,"y":264},{"type":"x","x":194,"y":261},{"type":"x","x":423,"y":156},{"type":"x","x":311,"y":158},{"type":"x","x":332,"y":224},{"type":"x","x":270,"y":243},{"type":"x","x":391,"y":244},{"type":"x","x":302,"y":279},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":432,"y":303},{"type":"ball","x":338,"y":355,"rot":-44},{"type":"t","x":296,"y":297,"rot":4},{"type":"t","x":320,"y":295,"rot":16},{"type":"t","x":340,"y":296,"rot":-11},{"type":"t","x":361,"y":293,"rot":-18},{"type":"t","x":384,"y":296,"rot":-5}],
  // F10 — Handoff
  [{"type":"o","x":377,"y":295},{"type":"o","x":311,"y":301},{"type":"o","x":289,"y":301},{"type":"qb","x":337,"y":378},{"type":"rb","x":359,"y":381},{"type":"fb","x":273,"y":342},{"type":"xr","x":196,"y":230},{"type":"z","x":485,"y":228},{"type":"x","x":487,"y":208},{"type":"x","x":424,"y":240},{"type":"x","x":206,"y":210},{"type":"x","x":412,"y":175},{"type":"x","x":304,"y":187},{"type":"x","x":361,"y":247},{"type":"x","x":305,"y":247},{"type":"x","x":403,"y":264},{"type":"x","x":298,"y":285},{"type":"x","x":331,"y":279},{"type":"x","x":360,"y":279},{"type":"te","x":434,"y":252},{"type":"ball","x":358,"y":375,"rot":-44},{"type":"o","x":334,"y":298},{"type":"o","x":358,"y":296}],
  // F11 — Run Fake
  [{"type":"o","x":381,"y":287},{"type":"o","x":314,"y":293},{"type":"o","x":299,"y":295},{"type":"qb","x":370,"y":393},{"type":"rb","x":356,"y":337},{"type":"fb","x":252,"y":299},{"type":"xr","x":199,"y":184},{"type":"z","x":483,"y":179},{"type":"x","x":466,"y":197},{"type":"x","x":400,"y":242},{"type":"x","x":223,"y":216},{"type":"x","x":391,"y":195},{"type":"x","x":319,"y":201},{"type":"x","x":361,"y":247},{"type":"x","x":276,"y":248},{"type":"x","x":383,"y":266},{"type":"x","x":299,"y":277},{"type":"x","x":327,"y":272},{"type":"x","x":356,"y":271},{"type":"te","x":430,"y":233},{"type":"ball","x":354,"y":323,"rot":-44},{"type":"o","x":335,"y":290},{"type":"o","x":360,"y":289}],
  // F12 — Reverse
  [{"type":"o","x":386,"y":290},{"type":"o","x":323,"y":294},{"type":"o","x":299,"y":295},{"type":"qb","x":389,"y":389},{"type":"rb","x":374,"y":308},{"type":"fb","x":260,"y":252},{"type":"xr","x":207,"y":143},{"type":"z","x":476,"y":143},{"type":"x","x":466,"y":163},{"type":"x","x":409,"y":219},{"type":"x","x":225,"y":176},{"type":"x","x":396,"y":167},{"type":"x","x":338,"y":172},{"type":"x","x":365,"y":217},{"type":"x","x":277,"y":235},{"type":"x","x":372,"y":273},{"type":"x","x":300,"y":280},{"type":"x","x":323,"y":278},{"type":"x","x":343,"y":275},{"type":"te","x":426,"y":205},{"type":"ball","x":388,"y":377,"rot":-44},{"type":"o","x":345,"y":290},{"type":"o","x":367,"y":291}],
  // F13 — Flea Flick
  [{"type":"o","x":400,"y":277},{"type":"o","x":326,"y":284},{"type":"o","x":299,"y":295},{"type":"qb","x":409,"y":377},{"type":"rb","x":374,"y":308},{"type":"fb","x":260,"y":252},{"type":"xr","x":238,"y":115},{"type":"z","x":495,"y":116},{"type":"x","x":476,"y":148},{"type":"x","x":418,"y":182},{"type":"x","x":266,"y":160},{"type":"x","x":407,"y":151},{"type":"x","x":354,"y":156},{"type":"x","x":365,"y":217},{"type":"x","x":303,"y":206},{"type":"x","x":376,"y":248},{"type":"x","x":299,"y":263},{"type":"x","x":323,"y":262},{"type":"x","x":346,"y":253},{"type":"te","x":438,"y":178},{"type":"ball","x":409,"y":366,"rot":-44},{"type":"o","x":350,"y":283},{"type":"o","x":374,"y":274}],
  // F14 — Throw
  [{"type":"o","x":412,"y":249},{"type":"o","x":330,"y":254},{"type":"o","x":305,"y":278},{"type":"qb","x":419,"y":359},{"type":"rb","x":398,"y":275},{"type":"fb","x":273,"y":194},{"type":"xr","x":284,"y":83},{"type":"z","x":527,"y":78},{"type":"x","x":501,"y":96},{"type":"x","x":434,"y":161},{"type":"x","x":310,"y":119},{"type":"x","x":452,"y":105},{"type":"x","x":377,"y":125},{"type":"x","x":396,"y":185},{"type":"x","x":346,"y":179},{"type":"x","x":387,"y":231},{"type":"x","x":302,"y":233},{"type":"x","x":328,"y":226},{"type":"x","x":357,"y":235},{"type":"te","x":450,"y":152},{"type":"ball","x":474,"y":194,"rot":-26},{"type":"o","x":356,"y":275},{"type":"o","x":374,"y":261},{"type":"dash","points":[{"x":417,"y":351},{"x":517,"y":80}]}],
  // F15 — Catch
  [{"type":"o","x":422,"y":218},{"type":"o","x":341,"y":241},{"type":"o","x":307,"y":244},{"type":"qb","x":459,"y":346},{"type":"rb","x":445,"y":244},{"type":"fb","x":306,"y":156},{"type":"xr","x":330,"y":77},{"type":"z","x":521,"y":91},{"type":"x","x":505,"y":94},{"type":"x","x":446,"y":144},{"type":"x","x":352,"y":105},{"type":"x","x":474,"y":97},{"type":"x","x":411,"y":108},{"type":"x","x":411,"y":145},{"type":"x","x":361,"y":144},{"type":"x","x":394,"y":216},{"type":"x","x":300,"y":209},{"type":"x","x":329,"y":207},{"type":"x","x":364,"y":220},{"type":"te","x":466,"y":133},{"type":"ball","x":519,"y":102,"rot":-26},{"type":"o","x":360,"y":268},{"type":"o","x":377,"y":238}],
  // F16 — Break Tackle 1
  [{"type":"o","x":431,"y":198},{"type":"o","x":352,"y":232},{"type":"o","x":319,"y":232},{"type":"qb","x":486,"y":323},{"type":"rb","x":459,"y":234},{"type":"fb","x":357,"y":135},{"type":"xr","x":385,"y":71},{"type":"z","x":518,"y":107},{"type":"x","x":540,"y":91},{"type":"x","x":455,"y":123},{"type":"x","x":397,"y":97},{"type":"x","x":490,"y":93},{"type":"x","x":449,"y":104},{"type":"x","x":439,"y":133},{"type":"x","x":403,"y":126},{"type":"x","x":396,"y":211},{"type":"x","x":300,"y":196},{"type":"x","x":331,"y":204},{"type":"x","x":365,"y":214},{"type":"te","x":466,"y":133},{"type":"ball","x":523,"y":98,"rot":-26},{"type":"o","x":373,"y":257},{"type":"o","x":389,"y":227}],
  // F17 — Break Tackle 2
  [{"type":"o","x":431,"y":192},{"type":"o","x":353,"y":226},{"type":"o","x":324,"y":229},{"type":"qb","x":509,"y":313},{"type":"rb","x":469,"y":220},{"type":"fb","x":380,"y":113},{"type":"xr","x":409,"y":64},{"type":"z","x":504,"y":80},{"type":"x","x":550,"y":76},{"type":"x","x":459,"y":119},{"type":"x","x":411,"y":90},{"type":"x","x":494,"y":79},{"type":"x","x":455,"y":90},{"type":"x","x":445,"y":117},{"type":"x","x":417,"y":114},{"type":"x","x":397,"y":205},{"type":"x","x":303,"y":192},{"type":"x","x":330,"y":196},{"type":"x","x":369,"y":206},{"type":"te","x":477,"y":107},{"type":"ball","x":515,"y":71,"rot":-26},{"type":"o","x":380,"y":250},{"type":"o","x":395,"y":224}],
  // F18 — TD
  [{"type":"o","x":446,"y":168},{"type":"o","x":357,"y":220},{"type":"o","x":325,"y":224},{"type":"qb","x":530,"y":283},{"type":"rb","x":469,"y":220},{"type":"fb","x":399,"y":91},{"type":"xr","x":438,"y":40},{"type":"z","x":507,"y":39},{"type":"x","x":539,"y":52},{"type":"x","x":470,"y":102},{"type":"x","x":436,"y":70},{"type":"x","x":490,"y":56},{"type":"x","x":472,"y":70},{"type":"x","x":447,"y":102},{"type":"x","x":423,"y":95},{"type":"x","x":397,"y":205},{"type":"x","x":302,"y":181},{"type":"x","x":334,"y":193},{"type":"x","x":373,"y":200},{"type":"te","x":491,"y":92},{"type":"ball","x":515,"y":34,"rot":-26},{"type":"o","x":386,"y":244},{"type":"o","x":403,"y":224}],
]

const NFRAMES = FRAMES.length
const INK = '#8a8a80'
const FRAME_SPAN = 0.82
const STEP = FRAME_SPAN / (NFRAMES - 1)
const SVG_NS = 'http://www.w3.org/2000/svg'
const BALL_FONT_SIZE = 16.5

interface Pt { x: number; y: number }

type Track = (Marker | null)[]

function el<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
  return document.createElementNS(SVG_NS, tag)
}

// ── Token factories (all greyscale) ──────────────────────────────────────────

function makeOToken(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx','2'); shadow.setAttribute('cy','4')
  shadow.setAttribute('rx','8'); shadow.setAttribute('ry','7')
  shadow.setAttribute('fill','#000'); shadow.setAttribute('opacity','0.4')
  g.appendChild(shadow)
  const body = el('circle')
  body.setAttribute('r','7.5'); body.setAttribute('fill','#3a3a38')
  body.setAttribute('stroke',INK); body.setAttribute('stroke-width','1.3')
  g.appendChild(body)
  const hl = el('circle')
  hl.setAttribute('cx','-2.4'); hl.setAttribute('cy','-2.6')
  hl.setAttribute('r','2.2'); hl.setAttribute('fill','#6a6a68')
  hl.setAttribute('opacity','0.65')
  g.appendChild(hl)
  return g
}

function makeXToken(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx','2'); shadow.setAttribute('cy','4')
  shadow.setAttribute('rx','8'); shadow.setAttribute('ry','7')
  shadow.setAttribute('fill','#000'); shadow.setAttribute('opacity','0.4')
  g.appendChild(shadow)
  const back = el('path')
  back.setAttribute('d','M-6.5,-6.5 L6.5,6.5 M-6.5,6.5 L6.5,-6.5')
  back.setAttribute('stroke','#4a4a48'); back.setAttribute('stroke-width','4.4')
  back.setAttribute('stroke-linecap','round')
  g.appendChild(back)
  const front = el('path')
  front.setAttribute('d','M-6,-7 L6,5 M-6,5 L6,-7')
  front.setAttribute('stroke',INK); front.setAttribute('stroke-width','2')
  front.setAttribute('stroke-linecap','round')
  g.appendChild(front)
  return g
}

// Bare 3D initials — dark drop shadow + base fill + white highlight offset.
// No bubble circle, matching the authoring-space visual design.
function makeSkillToken(label: string): SVGGElement {
  const g = el('g')
  const layers: [string, string, string, string][] = [
    ['1.5','2.5','#000','0.55'],
    ['0','0','#e8e6dc','1'],
    ['-0.6','-0.8','#ffffff','0.45'],
  ]
  layers.forEach(([x, y, fill, opacity]) => {
    const t = el('text')
    t.setAttribute('x', x); t.setAttribute('y', y)
    t.setAttribute('text-anchor','middle')
    t.setAttribute('dominant-baseline','central')
    t.setAttribute('font-family','Arial, sans-serif')
    t.setAttribute('font-weight','900')
    t.setAttribute('font-size','15')
    t.setAttribute('fill', fill); t.setAttribute('opacity', opacity)
    t.textContent = label
    g.appendChild(t)
  })
  return g
}

function makeTToken(): SVGGElement {
  const g = el('g')
  const shadow = el('ellipse')
  shadow.setAttribute('cx','2'); shadow.setAttribute('cy','4')
  shadow.setAttribute('rx','8'); shadow.setAttribute('ry','5')
  shadow.setAttribute('fill','#000'); shadow.setAttribute('opacity','0.35')
  g.appendChild(shadow)
  const bar = el('line')
  bar.setAttribute('x1','-7'); bar.setAttribute('y1','-5')
  bar.setAttribute('x2','7'); bar.setAttribute('y2','-5')
  bar.setAttribute('stroke','#4a4a48'); bar.setAttribute('stroke-width','3.6')
  bar.setAttribute('stroke-linecap','round')
  g.appendChild(bar)
  const stem = el('line')
  stem.setAttribute('x1','0'); stem.setAttribute('y1','-5')
  stem.setAttribute('x2','0'); stem.setAttribute('y2','6')
  stem.setAttribute('stroke',INK); stem.setAttribute('stroke-width','2')
  stem.setAttribute('stroke-linecap','round')
  g.appendChild(stem)
  return g
}

function makeBallToken(): SVGGElement {
  const g = el('g')
  const em = el('text')
  em.setAttribute('x','0'); em.setAttribute('y','0')
  em.setAttribute('text-anchor','middle')
  em.setAttribute('dominant-baseline','central')
  em.setAttribute('font-size', String(BALL_FONT_SIZE))
  em.textContent = '\uD83C\uDFC8'
  g.appendChild(em)
  return g
}

// ── Track building ────────────────────────────────────────────────────────────
// One track per unique marker across all 18 frames.
// We match by type and closest position (greedy) for o/x/t/skill;
// there is exactly one ball per frame so no matching needed.

function greedyMatch(prev: Pt[], cur: Pt[]): {i: number; j: number}[] {
  const pairs: {i: number; j: number; d: number}[] = []
  for (let i = 0; i < prev.length; i++)
    for (let j = 0; j < cur.length; j++) {
      const dx = prev[i].x - cur[j].x, dy = prev[i].y - cur[j].y
      pairs.push({i, j, d: dx*dx + dy*dy})
    }
  pairs.sort((a,b) => a.d - b.d)
  const usedI = new Set<number>(), usedJ = new Set<number>()
  const out: {i: number; j: number}[] = []
  for (const p of pairs)
    if (!usedI.has(p.i) && !usedJ.has(p.j))
      { usedI.add(p.i); usedJ.add(p.j); out.push(p) }
  return out
}

function buildTracks(type: MarkerType): Track[] {
  const tracks: Track[] = []
  let prevAssign: Record<number,number> | null = null
  for (let f = 0; f < NFRAMES; f++) {
    const elems = FRAMES[f].filter(e => e.type === type)
    const cur: Record<number,number> = {}
    if (f === 0 || !prevAssign) {
      elems.forEach((e, idx) => {
        const t: Track = new Array(NFRAMES).fill(null)
        t[f] = e; tracks.push(t); cur[idx] = tracks.length - 1
      })
    } else {
      const prev = FRAMES[f-1].filter(e => e.type === type)
      const matches = greedyMatch(
        prev.map(e => ({x: e.x!, y: e.y!})),
        elems.map(e => ({x: e.x!, y: e.y!})),
      )
      const matched = new Set<number>()
      matches.forEach(m => {
        const ti = prevAssign![m.i]
        if (ti === undefined) return
        tracks[ti][f] = elems[m.j]; cur[m.j] = ti; matched.add(m.j)
      })
      elems.forEach((e, idx) => {
        if (!matched.has(idx)) {
          const t: Track = new Array(NFRAMES).fill(null)
          t[f] = e; tracks.push(t); cur[idx] = tracks.length - 1
        }
      })
    }
    prevAssign = cur
  }
  return tracks
}

// ── Yard number helper (same stadium-font style as before) ────────────────────
function addYardNumber(fieldG: SVGGElement, x: number, y: number, label: string) {
  const g = el('g')
  g.setAttribute('transform', `translate(${x},${y+5}) rotate(-90) skewX(-8)`)
  const outline = el('text')
  outline.setAttribute('x','0'); outline.setAttribute('y','0')
  outline.setAttribute('text-anchor','middle'); outline.setAttribute('dominant-baseline','central')
  outline.setAttribute('font-family','Arial, sans-serif'); outline.setAttribute('font-weight','900')
  outline.setAttribute('font-style','italic'); outline.setAttribute('font-size','20')
  outline.setAttribute('fill','#2a2a28'); outline.setAttribute('stroke','#2a2a28')
  outline.setAttribute('stroke-width','3'); outline.setAttribute('stroke-linejoin','round')
  outline.setAttribute('opacity','0.6'); outline.textContent = label
  g.appendChild(outline)
  const fill = el('text')
  fill.setAttribute('x','0'); fill.setAttribute('y','0')
  fill.setAttribute('text-anchor','middle'); fill.setAttribute('dominant-baseline','central')
  fill.setAttribute('font-family','Arial, sans-serif'); fill.setAttribute('font-weight','900')
  fill.setAttribute('font-style','italic'); fill.setAttribute('font-size','20')
  fill.setAttribute('fill',INK); fill.setAttribute('opacity','0.6'); fill.textContent = label
  g.appendChild(fill)
  fieldG.appendChild(g)
}

// ── Fireworks (unchanged from the original) ───────────────────────────────────
const FW_PALETTE = [
  '#FF0000','#FF7A00','#FFD400','#9DFF00','#00E03C',
  '#00E5FF','#1E5BFF','#8A2BE2','#FF00D4','#FF2D8A',
]
const FW_SPOTS = [{x:22,y:18},{x:78,y:14},{x:50,y:10}]
const FW_SPARKS = 35

function fwShuffle<T>(a: T[]): T[] {
  const arr = a.slice()
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]]
  }
  return arr
}
function fwRollColorway(): string[] {
  const r = Math.random()
  const count = r<0.45?1:r<0.8?2:3
  return fwShuffle(FW_PALETTE).slice(0,count)
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FleaFlicker() {
  const { wrapperRef, frameRef, progress } = useScrollProgress<HTMLDivElement,HTMLDivElement>()
  const fieldGRef  = useRef<SVGGElement|null>(null)
  const routesGRef = useRef<SVGGElement|null>(null)
  const tracksGRef = useRef<SVGGElement|null>(null)
  const tdTextGRef = useRef<SVGGElement|null>(null)
  const fwLayerRef = useRef<HTMLDivElement|null>(null)

  const renderRef    = useRef<((p: number) => void)|null>(null)
  const fwFiredRef   = useRef(false)
  const fwIntervalRef= useRef<number|null>(null)

  useEffect(() => {
    const fieldG  = fieldGRef.current
    const routesG = routesGRef.current
    const tracksG = tracksGRef.current
    const tdTextG = tdTextGRef.current
    const fwLayer = fwLayerRef.current
    if (!fieldG||!routesG||!tracksG||!tdTextG||!fwLayer) return

    // Static field
    const yardLines: [number,number,number,number,string][] = [
      [135,120,545,120,'10'],[135,180,545,180,'20'],
      [135,250,545,250,'30'],[135,330,545,330,'40'],
    ]
    const leftX  = yardLines[0][0]+45
    const rightX = yardLines[0][2]-45
    yardLines.forEach(([x1,y1,x2,y2,label]) => {
      const line = el('line')
      line.setAttribute('x1',String(x1)); line.setAttribute('y1',String(y1))
      line.setAttribute('x2',String(x2)); line.setAttribute('y2',String(y2))
      line.setAttribute('stroke','#5a5a58'); line.setAttribute('stroke-width','1')
      line.setAttribute('opacity','0.85')
      fieldG.appendChild(line)
      addYardNumber(fieldG, leftX,  y1, label)
      addYardNumber(fieldG, rightX, y1, label)
      void x2
    })
    // Goal line
    const gl = el('line')
    gl.setAttribute('x1','135'); gl.setAttribute('y1','40')
    gl.setAttribute('x2','545'); gl.setAttribute('y2','40')
    gl.setAttribute('stroke','#e8e6dc'); gl.setAttribute('stroke-width','2.5')
    gl.setAttribute('opacity','0.85')
    fieldG.appendChild(gl)
    // LOS
    const los = el('line')
    los.setAttribute('x1','135'); los.setAttribute('y1','299')
    los.setAttribute('x2','545'); los.setAttribute('y2','299')
    los.setAttribute('stroke','#4aa3df'); los.setAttribute('stroke-width','2')
    los.setAttribute('opacity','0.7')
    fieldG.appendChild(los)

    // ── Build all token tracks ───────────────────────────────────────────────
    interface AnyTrackEntry { track: Track; node: SVGGElement }
    const allTracks: AnyTrackEntry[] = []

    buildTracks('o').forEach(track => {
      const node = makeOToken(); tracksG.appendChild(node)
      allTracks.push({track, node})
    })
    buildTracks('t').forEach(track => {
      const node = makeTToken(); tracksG.appendChild(node)
      allTracks.push({track, node})
    })
    const skillTypes: MarkerType[] = ['qb','rb','fb','te','xr','z']
    skillTypes.forEach(type => {
      buildTracks(type).forEach(track => {
        const label = SKILL_LABEL[type]!
        const node = makeSkillToken(label); tracksG.appendChild(node)
        allTracks.push({track, node})
      })
    })
    buildTracks('ball').forEach(track => {
      const node = makeBallToken(); tracksG.appendChild(node)
      allTracks.push({track, node})
    })
    buildTracks('x').forEach(track => {
      const node = makeXToken(); tracksG.appendChild(node)
      allTracks.push({track, node})
    })

    // ── Route trails for skill positions ────────────────────────────────────
    const routeSegments: {node: SVGPathElement; frameIdx: number}[] = []
    const routeTypes: MarkerType[] = ['qb','rb','fb','te','xr','z']
    routeTypes.forEach(type => {
      buildTracks(type).forEach(track => {
        for (let f = 0; f < NFRAMES-1; f++) {
          const a = track[f], b = track[f+1]
          if (a?.x != null && b?.x != null) {
            const path = el('path')
            path.setAttribute('d', `M${a.x!.toFixed(1)},${a.y!.toFixed(1)} L${b.x!.toFixed(1)},${b.y!.toFixed(1)}`)
            path.setAttribute('stroke', INK); path.setAttribute('stroke-width','1.4')
            path.setAttribute('stroke-dasharray','4 6'); path.setAttribute('fill','none')
            routesG.appendChild(path)
            routeSegments.push({node: path, frameIdx: f})
          }
        }
      })
    })

    // ── Dash throw line (F14 only) ────────────────────────────────────────
    // Rendered inline per-frame in the render fn, stored as a reusable node.
    const dashLine = el('path')
    dashLine.setAttribute('fill','none')
    dashLine.setAttribute('stroke','#cc2222'); dashLine.setAttribute('stroke-width','2.5')
    dashLine.setAttribute('stroke-dasharray','7 5')
    dashLine.setAttribute('opacity','0')
    tracksG.appendChild(dashLine)

    // ── Cadence overlay ────────────────────────────────────────────────────
    const cadenceText = el('text')
    cadenceText.setAttribute('text-anchor','middle'); cadenceText.setAttribute('dominant-baseline','central')
    cadenceText.setAttribute('font-family','Arial, sans-serif'); cadenceText.setAttribute('font-weight','900')
    cadenceText.setAttribute('font-style','italic'); cadenceText.setAttribute('font-size','38')
    cadenceText.setAttribute('fill','#d9a521'); cadenceText.setAttribute('opacity','0')
    tracksG.appendChild(cadenceText)

    // ── TOUCHDOWN overlay ─────────────────────────────────────────────────
    ;(() => {
      const g = el('g')
      g.setAttribute('transform','translate(340,230) skewX(-6)')
      const outline = el('text')
      outline.setAttribute('x','0'); outline.setAttribute('y','0')
      outline.setAttribute('text-anchor','middle'); outline.setAttribute('dominant-baseline','central')
      outline.setAttribute('font-family','Arial, sans-serif'); outline.setAttribute('font-weight','900')
      outline.setAttribute('font-style','italic'); outline.setAttribute('font-size','48')
      outline.setAttribute('fill','#1a1a18'); outline.setAttribute('stroke','#1a1a18')
      outline.setAttribute('stroke-width','5'); outline.setAttribute('stroke-linejoin','round')
      outline.textContent = 'TOUCHDOWN!'
      g.appendChild(outline)
      const fillText = el('text')
      fillText.setAttribute('x','0'); fillText.setAttribute('y','0')
      fillText.setAttribute('text-anchor','middle'); fillText.setAttribute('dominant-baseline','central')
      fillText.setAttribute('font-family','Arial, sans-serif'); fillText.setAttribute('font-weight','900')
      fillText.setAttribute('font-style','italic'); fillText.setAttribute('font-size','48')
      fillText.setAttribute('fill','#e0ded4'); fillText.textContent = 'TOUCHDOWN!'
      g.appendChild(fillText)
      tdTextG.appendChild(g)
    })()

    // ── Fireworks ─────────────────────────────────────────────────────────
    function fwFire(spot: {x:number;y:number}, colorway: string[]) {
      if (!fwLayer) return
      const anchor = document.createElement('div')
      anchor.className = styles.fwAnchor
      anchor.style.left = `${spot.x}%`; anchor.style.top = `${spot.y}%`
      for (let i = 0; i < FW_SPARKS; i++) {
        const sp = document.createElement('span')
        sp.className = styles.fwSpark
        const ang = Math.PI*2*(i/FW_SPARKS)+(Math.random()*0.35-0.175)
        const dist = 70+Math.random()*70
        sp.style.setProperty('--dx',`${(Math.cos(ang)*dist).toFixed(1)}px`)
        sp.style.setProperty('--dy',`${(Math.sin(ang)*dist).toFixed(1)}px`)
        const c = colorway[i%colorway.length]
        sp.style.background = c
        sp.style.boxShadow = `0 -3px 4px ${c}cc, 0 -8px 5px ${c}77, 0 -14px 7px ${c}33`
        sp.style.animationDelay = `0s,${(Math.random()*0.3).toFixed(2)}s`
        anchor.appendChild(sp)
      }
      fwLayer.appendChild(anchor)
      void anchor.offsetWidth
      anchor.classList.add(styles.celebrate)
    }
    function fwLaunchAll() {
      if (!fwLayer) return
      fwLayer.innerHTML = ''
      FW_SPOTS.forEach((spot,idx) => window.setTimeout(()=>fwFire(spot,fwRollColorway()),idx*350))
    }
    function fwStart() {
      if (fwFiredRef.current) return
      fwFiredRef.current = true; fwLaunchAll()
      fwIntervalRef.current = window.setInterval(fwLaunchAll, 3400)
    }
    function fwStop() {
      fwFiredRef.current = false
      if (fwIntervalRef.current!==null) { clearInterval(fwIntervalRef.current); fwIntervalRef.current=null }
      if (fwLayer) fwLayer.innerHTML = ''
    }

    // ── Per-frame state interpolation ─────────────────────────────────────
    function trackState(track: Track, i: number, frac: number) {
      const a = track[i], b = track[i+1]
      if (a?.x!=null && b?.x!=null) return {x:a.x+(b.x-a.x)*frac, y:a.y!+(b.y!-a.y!)*frac, rot:(a.rot??0)+((b.rot??0)-(a.rot??0))*frac, opacity:1}
      if (a?.x!=null && !b)         return {x:a.x, y:a.y!, rot:a.rot??0, opacity:1-frac}
      if (!a && b?.x!=null)         return {x:b.x, y:b.y!, rot:b.rot??0, opacity:frac}
      return {x:0, y:0, rot:0, opacity:0}
    }
    function fadeOpacity(frameIdx: number, p: number) {
      const center = frameIdx*STEP+STEP*0.5
      const half = STEP*0.9
      const dist = Math.abs(p-center)
      if (dist<=half*0.4) return 0.7
      if (dist>=half)     return 0
      return 0.7*(half-dist)/(half*0.6)
    }

    // ── Main render ───────────────────────────────────────────────────────
    function render(p: number) {
      const td     = p > FRAME_SPAN ? (p-FRAME_SPAN)/(1-FRAME_SPAN) : 0
      const fadeMul = 1-td

      const frameFloat = Math.min(NFRAMES-1, p/STEP)
      const i    = Math.min(NFRAMES-2, Math.floor(frameFloat))
      const frac = Math.max(0, Math.min(1, frameFloat-i))

      allTracks.forEach(({track, node}) => {
        const s = trackState(track, i, frac)
        const isSkill = track.find(m=>m!=null&&SKILL_TYPES.has(m.type))
        const isBall  = track.find(m=>m!=null&&m.type==='ball')
        const isTToken= track.find(m=>m!=null&&m.type==='t')
        const rot = (isBall||isTToken) ? ` rotate(${s.rot.toFixed(1)})` : ''
        node.setAttribute('transform', `translate(${s.x.toFixed(1)},${s.y.toFixed(1)})${rot}`)
        node.setAttribute('opacity', (s.opacity*fadeMul).toFixed(2))
        void isSkill
      })

      routeSegments.forEach(seg => {
        seg.node.setAttribute('opacity', (fadeOpacity(seg.frameIdx,p)*fadeMul).toFixed(2))
      })

      // Dash throw line — only visible around F14 (frame index 13)
      const dashMarker = FRAMES[Math.min(NFRAMES-1, Math.round(frameFloat))].find(m=>m.type==='dash')
      if (dashMarker?.points) {
        const [a,b] = dashMarker.points
        dashLine.setAttribute('d',`M${a.x},${a.y} L${b.x},${b.y}`)
        dashLine.setAttribute('opacity', (fadeOpacity(13,p)*fadeMul).toFixed(2))
      } else {
        dashLine.setAttribute('opacity','0')
      }

      // Cadence — frames 4-7 (indices 4–7)
      const cadMarker = FRAMES[Math.min(NFRAMES-1, Math.round(frameFloat))].find(m=>m.type==='cadence')
      if (cadMarker?.word) {
        cadenceText.textContent = cadMarker.word
        cadenceText.setAttribute('x', String(cadMarker.ax))
        cadenceText.setAttribute('y', String(cadMarker.ay))
        // fade: fully in at frame centre, out at edges
        const fi = Math.round(frameFloat)
        const cadFade = (fi>=4&&fi<=7) ? Math.min(1,(1-Math.abs(frameFloat-fi))*3)*fadeMul : 0
        cadenceText.setAttribute('opacity', cadFade.toFixed(2))
      } else {
        cadenceText.setAttribute('opacity','0')
      }

      tdTextG!.setAttribute('opacity', td.toFixed(2))
      if (td>0.05) fwStart()
      else if (td<0.02) fwStop()
    }

    renderRef.current = render
    render(0)

    return () => {
      renderRef.current = null
      fwStop()
      fieldG.innerHTML = ''; routesG.innerHTML = ''
      tracksG.innerHTML = ''; tdTextG.innerHTML = ''
      if (fwLayer) fwLayer.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { renderRef.current?.(progress) }, [progress])

  const headerHeight = useHeaderHeight()

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <div className={styles.stickyFrame} ref={frameRef} style={{top: headerHeight}}>
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
