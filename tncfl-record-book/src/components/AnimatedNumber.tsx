import { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  decimals?: number
}

// Framer Motion's `animate()` (imperative form, not the <motion.div> JSX
// form RevealOnScroll uses) tweens a plain number from a start to an end
// value over time, calling `onUpdate` on every frame — which is exactly what
// a counting-up stat needs. This is a different corner of the same library:
// <motion.div> animates CSS-ish properties on an element, `animate()` can
// tween ANY number and hand you the in-between values yourself to do
// whatever you want with (here: put it in React state and render it).
export default function AnimatedNumber({ value, decimals = 1 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      // Jump straight to the final value — no motion at all when the user
      // has asked the OS for reduced motion.
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [value, reduceMotion])

  return <>{display.toFixed(decimals)}</>
}
