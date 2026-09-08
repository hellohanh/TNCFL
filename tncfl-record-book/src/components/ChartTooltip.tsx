import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './ChartTooltip.module.css'

export interface ChartTooltipState {
  /** raw mouse position (clientX/clientY) — clamping to the viewport happens internally */
  x: number
  y: number
  color: string
  name: string
  lines: ReactNode[]
}

const OFFSET = 14

// Floating tooltip that follows the mouse, matching the old hub's real
// per-chart tooltip behavior (Despair/Spread had their own copies of this
// exact positioning logic — pad 14px from the cursor, flip to the other
// side of the cursor if it would overflow the viewport edge). Consolidated
// here as one shared component instead of duplicating it per chart.
export default function ChartTooltip({ state }: { state: ChartTooltipState | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })

  useLayoutEffect(() => {
    if (!state || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    let left = state.x + OFFSET
    let top = state.y + OFFSET
    if (left + rect.width > window.innerWidth) left = state.x - rect.width - OFFSET
    if (top + rect.height > window.innerHeight) top = state.y - rect.height - OFFSET
    setPos({ left, top })
  }, [state])

  if (!state) return null

  return (
    <div ref={ref} className={styles.tip} style={{ left: pos.left, top: pos.top }}>
      <div className={styles.name} style={{ color: state.color }}>
        {state.name}
      </div>
      {state.lines.map((line, i) => (
        <div key={i} className={styles.row}>
          {line}
        </div>
      ))}
    </div>
  )
}
