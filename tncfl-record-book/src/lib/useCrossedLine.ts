import { useEffect, useRef, useState } from 'react'

// Purpose-built for the dissolve-overlay trigger: unlike useInView (which
// answers "is this element visible at all," a yes/no threshold), this
// answers a more specific question — "has this element's OWN TOP EDGE
// scrolled above a specific fixed line in the viewport (e.g. the header's
// bottom edge)." That's a genuinely different check: an element can be
// fully visible and still not have crossed this line yet, or can have
// crossed it while still mostly on screen.
//
// Implemented with a plain scroll listener rather than IntersectionObserver,
// because IntersectionObserver answers "is this element within a region,"
// not "has this exact point been crossed" — forcing that shape onto it
// needs a fragile rootMargin calculation that has to be recomputed on every
// resize. A direct getBoundingClientRect() check against `lineY` is more
// direct for this specific question. `requestAnimationFrame` throttles the
// check to at most once per frame, so rapid scroll events don't trigger a
// layout read on every single one.
export function useCrossedLine<T extends HTMLElement>(lineY: number) {
  const ref = useRef<T>(null)
  const [crossed, setCrossed] = useState(false)
  const tickingRef = useRef(false)

  useEffect(() => {
    const check = () => {
      tickingRef.current = false
      const node = ref.current
      if (!node) return
      const top = node.getBoundingClientRect().top
      setCrossed(top <= lineY)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(check)
    }

    check() // set the correct initial state on mount, don't wait for the first scroll event
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [lineY])

  return { ref, crossed }
}
