import type { ReactElement } from 'react'

// Ported from the old hub's real makeAvatar() (TNCFL_hub.html) — same
// per-manager shape assignments, same dimming rule for non-active
// managers, same crown-for-champion badge. Translated from string-built
// SVG to JSX, not re-designed.
const SHAPES: Record<string, string> = {
  Hanh: 'pentagon',
  Randy: 'hexagon',
  Damian: 'shield',
  Aidan: 'squircle',
  Kevin: 'diamond',
  Kito: 'hexagon',
  Mikey: 'squircle',
  Tim: 'octagon',
  Titi: 'shield',
  Tony: 'squircle',
  "D'lyn": 'circle',
  Ted: 'hexagon',
  La: 'diamond',
  Daniel: 'octagon',
  Douang: 'squircle',
  Bao: 'circle',
  Lam: 'octagon',
  Lonny: 'diamond',
}

const cx = 40
const cy = 40
const r = 30
const ly = 38

function nGon(n: number, off: number): string {
  return Array.from({ length: n }, (_, i) => {
    const a = (Math.PI / 180) * ((360 / n) * i + off)
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

function diamondPoints(): string {
  return `${cx},${(cy - r).toFixed(2)} ${(cx + r).toFixed(2)},${cy} ${cx},${(cy + r).toFixed(2)} ${(cx - r).toFixed(2)},${cy}`
}

function shieldPath(): string {
  const t = cy - r
  const b = cy + r
  const l = cx - r
  const rt = cx + r
  const mid = cy + r * 0.15
  return `M${cx},${t} L${rt},${cy - r * 0.3} L${rt},${mid} Q${rt},${b} ${cx},${b} Q${l},${b} ${l},${mid} L${l},${cy - r * 0.3} Z`
}

function lum(hex: string): number {
  return (
    0.299 * parseInt(hex.slice(1, 3), 16) +
    0.587 * parseInt(hex.slice(3, 5), 16) +
    0.114 * parseInt(hex.slice(5, 7), 16)
  )
}

function dimColor(hex: string): string {
  const rv = parseInt(hex.slice(1, 3), 16)
  const gv = parseInt(hex.slice(3, 5), 16)
  const bv = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.round(rv * 0.32)},${Math.round(gv * 0.32)},${Math.round(bv * 0.32)})`
}

interface ManagerAvatarProps {
  name: string
  color: string
  rings: number
  status: string // 'A'/'Active' = not dimmed; anything else = dimmed
  size?: number
}

export default function ManagerAvatar({ name, color, rings, status, size = 80 }: ManagerAvatarProps) {
  const shape = SHAPES[name] ?? 'circle'
  const dim = status !== 'A' && status !== 'Active'
  const fill = dim ? dimColor(color) : color
  const stroke = dim ? '#444' : color
  const strokeWidth = dim ? 1.5 : 2.5
  const textFill = dim ? '#777' : lum(color) > 148 ? '#111' : '#fff'
  const letter = name[0]?.toUpperCase() ?? '?'
  const svgH = Math.round((size * 100) / 80)

  let shapeEl: ReactElement
  if (shape === 'pentagon') {
    shapeEl = <polygon points={nGon(5, -90)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  } else if (shape === 'hexagon') {
    shapeEl = <polygon points={nGon(6, -30)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  } else if (shape === 'octagon') {
    shapeEl = <polygon points={nGon(8, -22.5)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  } else if (shape === 'shield') {
    shapeEl = <path d={shieldPath()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  } else if (shape === 'diamond') {
    shapeEl = <polygon points={diamondPoints()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  } else if (shape === 'squircle') {
    const h = r * 0.92
    const rx = r * 0.38
    shapeEl = (
      <rect
        x={(cx - h).toFixed(2)}
        y={(cy - h).toFixed(2)}
        width={(h * 2).toFixed(2)}
        height={(h * 2).toFixed(2)}
        rx={rx.toFixed(2)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    )
  } else {
    shapeEl = <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  }

  return (
    <svg width={size} height={svgH} viewBox="-5 -22 90 112" xmlns="http://www.w3.org/2000/svg">
      {shapeEl}
      <text
        x={cx}
        y={ly}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={28}
        fontWeight={800}
        fill={textFill}
        fontFamily="'Segoe UI Black','Segoe UI',sans-serif"
      >
        {letter}
      </text>
      {rings > 0 && (
        <text x={cx} y={cy - r - 2} textAnchor="middle" dominantBaseline="auto" fontSize={28}>
          👑
        </text>
      )}
    </svg>
  )
}
