import { motion, useReducedMotion } from 'framer-motion'
import styles from './DissolveOverlay.module.css'

interface DissolveOverlayProps {
  visible: boolean
}

// The "fake it" approach (Option 1, user's choice over restructuring the
// scroll model for a true CSS mask): this is NOT actually making the recap
// text transparent. It's a sticky, non-interactive gradient painted in the
// exact color of the page background (#111111, opaque at the top fading to
// transparent 400px down), sitting on top of whatever content is currently
// scrolling underneath it. Content passing beneath the opaque part of the
// gradient is visually covered, and the covering itself fades away over the
// band — the same effect as an app's content fading into a nav bar —
// without ever touching the real opacity of the text underneath.
//
// Always mounted now (not conditionally rendered) — the fade transition
// needs the element to exist continuously so Framer Motion can animate
// opacity between 0 and 1, rather than popping in/out abruptly on
// mount/unmount. `margin-bottom: -400px` in the CSS keeps it from pushing
// document content down by its own height either way.
export default function DissolveOverlay({ visible }: DissolveOverlayProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={styles.overlay}
      aria-hidden="true"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeInOut' }}
    />
  )
}
