import { useEffect, useRef, useState } from 'react'

// Drives a "tall wrapper + sticky inner frame" scrollytelling section: as the
// user scrolls through the wrapper's height, this returns a 0-1 progress
// value representing how far through that scroll range they are. 0 = the
// wrapper's top has just reached the top of the viewport (frame about to
// pin); 1 = the wrapper's bottom has reached the bottom of the sticky
// frame's travel (about to un-pin). Standard formula for this pattern:
// progress = clamp(-wrapperTop / (wrapperHeight - frameHeight), 0, 1).
export function useScrollProgress<
  W extends HTMLElement = HTMLDivElement,
  F extends HTMLElement = HTMLDivElement,
>() {
  const wrapperRef = useRef<W | null>(null)
  const frameRef = useRef<F | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0

    const compute = () => {
      const wrapper = wrapperRef.current
      const frame = frameRef.current
      if (!wrapper || !frame) return

      const wrapperRect = wrapper.getBoundingClientRect()
      const frameHeight = frame.getBoundingClientRect().height
      const scrollable = wrapperRect.height - frameHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      const raw = -wrapperRect.top / scrollable
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { wrapperRef, frameRef, progress }
}
