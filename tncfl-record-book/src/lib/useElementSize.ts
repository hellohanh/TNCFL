import { useEffect, useRef, useState } from 'react'

// Generalized version of the earlier width-only hook — now returns both
// dimensions from ONE ResizeObserver, since the hero needs to measure two
// different elements for two different reasons: the stat-number block's
// HEIGHT (so the sparkline can match it) and the sparkline wrapper's own
// WIDTH (so the line fills the remaining row space). Same underlying API as
// before, just not artificially restricted to one dimension.
//
// Milestone 7e bug fix: this reads `entry.target.getBoundingClientRect()`
// instead of `entry.contentRect`. contentRect is the CSS content box only —
// it excludes padding and border — so an element with padding reports a
// SMALLER size than what actually needs to be measured for layout purposes
// (e.g. offsetting a sticky sidebar below a padded header). Caught this via
// real testing: SiteHeader's padding (14px top+bottom) made contentRect
// report ~90px for a header that's actually 119px tall.
export function useElementSize<T extends HTMLElement>(fallback: { width: number; height: number }) {
  const ref = useRef<T>(null)
  const [size, setSize] = useState(fallback)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const rect = entry.target.getBoundingClientRect()
        setSize({ width: rect.width, height: rect.height })
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, width: size.width, height: size.height }
}
