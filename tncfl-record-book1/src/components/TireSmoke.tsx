import { motion } from 'framer-motion'

interface TireSmokeProps {
  active: boolean
  cx: number
  cy: number
}

// A handful of small gray puffs expanding outward and fading, at a single
// wheel's local position. Positioned relative to the SAME <g> transform the
// car itself uses (translate + CAR_SCALE), so it automatically lines up
// with each manager's actual rear wheel regardless of the car's own
// position on the chart — this component doesn't need to know about chart
// coordinates at all, just the wheel's fixed LOCAL position within the car.
const PUFFS = [
  { dx: 0, dy: 0, delay: 0 },
  { dx: -0.6, dy: 0.4, delay: 0.04 },
  { dx: 0.5, dy: -0.3, delay: 0.08 },
  { dx: -0.3, dy: -0.5, delay: 0.02 },
]

export default function TireSmoke({ active, cx, cy }: TireSmokeProps) {
  if (!active) return null
  return (
    <>
      {PUFFS.map((p, i) => (
        <motion.circle
          key={i}
          cx={cx + p.dx}
          cy={cy + p.dy}
          r="2.5"
          fill="#ccc"
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.55, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}
