import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useInView } from '../lib/useInView'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  marginTop?: number
}

// This is where the two building blocks meet: useInView (above) says WHEN
// to animate, Framer Motion's <motion.div> handles HOW. `initial` is the
// starting state, `animate` is the state to transition to once `isInView`
// flips true — Framer Motion tweens between them automatically; you never
// hand-write the frame-by-frame interpolation yourself.
//
// useReducedMotion() is Framer Motion's built-in read of the OS-level
// "prefers-reduced-motion" accessibility setting. When it's true, this
// skips the transform/opacity animation entirely and just shows the content
// immediately — respecting that setting from the start, per the roadmap's
// accessibility note, rather than retrofitting it later across 15 seasons
// of chapters.
export default function RevealOnScroll({ children, delay = 0, marginTop = 100 }: RevealOnScrollProps) {
  // once: false — this section needs to fade back OUT as you scroll past it,
  // not just fade in once and stay. See the fix below for the other half of
  // this: the animate target when hidden must be an explicit state, not {}.
  const { ref, isInView } = useInView({ once: false })
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    // No ref needed at all here — nothing is being observed for animation
    // purposes, so just render the content as-is. Also skip the large
    // marginTop gap — that space exists purely to give the fade transition
    // room to breathe, which is meaningless once the fade itself is off.
    return <>{children}</>
  }

  return (
    <div ref={ref} style={{ marginTop }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        // Explicit hidden state ({ opacity: 0, y: 16 }), not {} — an empty
        // object gives Framer Motion no target for opacity/y, so it just
        // holds whatever value they last had (stuck at opacity: 1) instead
        // of animating back down. This is what makes the fade genuinely
        // bidirectional.
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
