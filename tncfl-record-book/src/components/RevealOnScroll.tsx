import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useInView } from '../lib/useInView'
import { useIsPhone } from '../lib/useIsPhone'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  marginTop?: number
}

// Fades/slides a section in as it scrolls into view.
//
// Entry 112 (speed, phones only): a section's content isn't BUILT until it's
// within ~1.5 screens of the viewport. A season page is ~20,000px tall on a
// phone; building and laying out every chart, table and canvas the moment a
// tab is tapped froze the phone for up to a second. Until then a placeholder
// holds roughly a section's height so the page below doesn't jump much. Once
// built, a section stays built (scrolling back up doesn't rebuild it), and
// it resets when you switch to another season. Desktop is unchanged.
const PLACEHOLDER_H = 640

export default function RevealOnScroll({ children, delay = 0, marginTop = 100 }: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ once: false })
  const reduceMotion = useReducedMotion()
  const isPhone = useIsPhone()
  const { pathname } = useLocation()
  const [mounted, setMounted] = useState(!isPhone)
  const lazyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPhone) {
      setMounted(true)
      return
    }
    setMounted(false)
    const node = lazyRef.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: '1200px 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [isPhone, pathname])

  const content = mounted ? children : <div style={{ height: PLACEHOLDER_H }} />

  if (reduceMotion) {
    return <div ref={lazyRef}>{content}</div>
  }

  return (
    <div
      ref={(el) => {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        lazyRef.current = el
      }}
      style={{ marginTop }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    </div>
  )
}
