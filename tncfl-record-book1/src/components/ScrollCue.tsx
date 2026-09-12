import { motion, useReducedMotion } from 'framer-motion'
import styles from './ScrollCue.module.css'

// Moved out of SeasonHero to sit below the recap instead of above it, and
// upgraded from static text to an actual bouncing indicator — a repeating
// `y` oscillation via Framer Motion's `animate` array shorthand ([0, 8, 0]
// means "go from 0 to 8 and back to 0"), looped with `repeat: Infinity`.
// This is a different Framer Motion pattern than RevealOnScroll's one-shot
// transitions: `repeat` is what turns a transition into a loop instead of a
// single play.
export default function ScrollCue() {
  const reduceMotion = useReducedMotion()

  return (
    <div className={styles.wrap}>
      <motion.p
        className={styles.cue}
        animate={reduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        &#8595; scroll for the full ledger
      </motion.p>
    </div>
  )
}
