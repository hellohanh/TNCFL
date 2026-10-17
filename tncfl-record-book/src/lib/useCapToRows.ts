import { useCallback, useLayoutEffect, useRef, useState } from 'react'

/** Caps a scrollable list to exactly its first `n` rows, measured from the
 * list's OWN rows (Entry 92). Unlike useRowCapHeight (one row's height x N,
 * borrowed across cards), this measures where row n actually ends, so rows of
 * different heights — e.g. a two-line drought row — still show exactly n.
 *
 * Returns a callback ref for the scroll wrapper and the measured maxHeight
 * (undefined until measured, or when `enabled` is false — the caller then
 * keeps its existing cap). Rows are the wrapper's children, or its single
 * child's children when the rows sit inside one inner list element. */
export function useCapToRows(n: number, enabled: boolean) {
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const [el, setEl] = useState<HTMLElement | null>(null)
  const ref = useCallback((node: HTMLElement | null) => setEl(node), [])
  const raf = useRef(0)

  useLayoutEffect(() => {
    if (!enabled || !el) {
      setMaxHeight(undefined)
      return
    }
    const measure = () => {
      const container = el.children.length === 1 ? el.firstElementChild! : el
      const rows = container.children
      if (rows.length <= n) {
        setMaxHeight(undefined)
        return
      }
      const bottom = rows[n - 1].getBoundingClientRect().bottom
      const top = el.getBoundingClientRect().top
      setMaxHeight(Math.ceil(bottom - top + el.scrollTop))
    }
    measure()
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(measure)
    })
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf.current)
    }
  }, [el, n, enabled])

  return { capRef: ref, capHeight: maxHeight }
}
