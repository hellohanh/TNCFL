import { useEffect, useRef, useState } from 'react'

// This is the OTHER building block the roadmap called for, alongside a
// motion library: IntersectionObserver is a browser API that watches an
// element and tells you when it enters/exits the viewport, without you
// having to manually listen to scroll events and do math on positions
// yourself (which is slow and was the old way of doing this).
//
// The hook's job: attach a ref to whatever element you want to watch, and
// get back a boolean that flips to true once that element scrolls into
// view. `once` (default true) stops watching after the first reveal — a
// season chapter shouldn't re-animate every time you scroll past it again.
export function useInView(options?: { threshold?: number; once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const once = options?.once ?? true

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold: options?.threshold ?? 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, options?.threshold])

  return { ref, isInView }
}
