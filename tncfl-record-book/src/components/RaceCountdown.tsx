import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './RaceCountdown.module.css'

interface RaceCountdownProps {
  active: boolean
  onComplete: () => void
}

const NUMBERS = [5, 4, 3, 2, 1]
const MS_PER_NUMBER = 450 // still fast, but readable — "visual candy," not a literal 5-second wait

// Each number mounts, zooms from 0 to its final size, then AnimatePresence
// handles the fade-out as the next one replaces it (that's what `exit`
// does here — animates the outgoing number out before it's removed from
// the DOM, rather than an abrupt cut). `key={number}` is what makes
// AnimatePresence treat each digit as a distinct element to exit/enter,
// not update in place.
export default function RaceCountdown({ active, onComplete }: RaceCountdownProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      return
    }
    if (index >= NUMBERS.length) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), MS_PER_NUMBER)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onComplete is stable enough for this; re-running on it would restart the countdown
  }, [active, index])

  if (!active || index >= NUMBERS.length) return null

  return (
    <div className={styles.overlay}>
      <AnimatePresence>
        <motion.div
          key={NUMBERS[index]}
          className={styles.number}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
        >
          {NUMBERS[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
