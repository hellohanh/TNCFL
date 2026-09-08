import { useEffect, useMemo, useState } from 'react'
import type { MutableRefObject } from 'react'
import { motion, animate, useReducedMotion } from 'framer-motion'
import { useInView } from '../lib/useInView'
import { useElementSize } from '../lib/useElementSize'
import styles from './FootballTransition.module.css'

// Natural pixel dimensions of the two source images — needed to compute the
// background-size percentage that shows the WHOLE image within the frame
// (the "contain" behavior), which CSS can't animate directly since it has no
// numeric interpolation path from the `contain` keyword to a percentage.
const IMAGES = [
  { src: import.meta.env.BASE_URL + 'football/football-1.png', w: 1401, h: 1123 },
  { src: import.meta.env.BASE_URL + 'football/football-2.png', w: 1140, h: 1140 },
  { src: import.meta.env.BASE_URL + 'football/football-3.png', w: 1140, h: 1140 },
  { src: import.meta.env.BASE_URL + 'football/football-4.png', w: 1140, h: 1140 },
  { src: import.meta.env.BASE_URL + 'football/football-5.png', w: 1140, h: 1140 },
]

// The .frame element's own dimensions are entirely CSS-determined: 55% of
// the .wrap's width, and a fixed 300px height (see the module CSS). Rather
// than measure .frame directly, its size is DERIVED from the .wrap's
// measured width below — a real bug caught during the Milestone 15 review:
// a ResizeObserver attached via a ref on the `motion.div` (Framer Motion's
// own ref-forwarding, not a plain DOM ref) never actually fired, so
// frameWidth/frameHeight stayed stuck at useElementSize's fallback default
// forever, silently making `fitZoom` always 100% regardless of the real
// viewport/frame size. Confirmed via the raw inline `style` attribute
// before fixing, not assumed — deriving from the reliably-measured `.wrap`
// sidesteps the motion.div ref issue entirely.
const FRAME_WIDTH_FRACTION = 0.55
const FRAME_HEIGHT_PX: number = 300

// Styling note (a judgment call, not explicitly specified): the source
// images are bright white line-art on a transparent background. Displayed
// at full brightness against this site's dark theme, they'd read as a
// glaring white blob rather than a subtle transition element — so this
// applies a grayscale/darken filter in the CSS, matching the "muted grey"
// aesthetic direction from the earlier (tabled) football-animation
// discussion, plus a radial mask (also in the CSS) so the frame's edges
// fade into the background instead of showing a hard rectangle.
export default function FootballTransition() {
  const { ref: inViewRef, isInView } = useInView({ once: false, threshold: 0.1 })
  const { ref: sizeRef, width: wrapWidth } = useElementSize<HTMLDivElement>({
    width: 400 / FRAME_WIDTH_FRACTION,
    height: 600,
  })
  const reduceMotion = useReducedMotion()

  // Both refs point at the same `.wrap` node — useInView needs its own ref
  // object (a separate IntersectionObserver instance), useElementSize needs
  // its own (a separate ResizeObserver instance) — but they can both
  // observe the identical DOM node via this combining callback. This is
  // back to a plain DOM element (not the motion.div `.frame`), which is
  // exactly why the ResizeObserver reliably fires here.
  const setRefs = (node: HTMLDivElement | null) => {
    ;(inViewRef as MutableRefObject<HTMLDivElement | null>).current = node
    ;(sizeRef as MutableRefObject<HTMLDivElement | null>).current = node
  }

  const frameWidth = wrapWidth * FRAME_WIDTH_FRACTION
  const frameHeight = FRAME_HEIGHT_PX

  const { image, targetZoom, targetPosX, targetPosY, justify } = useMemo(() => {
    const image = IMAGES[Math.floor(Math.random() * IMAGES.length)]
    const targetZoom = 100 + Math.random() * 100 // 100%-200%, per the user's explicit range
    const targetPosX = Math.round(Math.random() * 100)
    const targetPosY = Math.round(Math.random() * 100)
    const justifyOptions = ['flex-start', 'center', 'flex-end'] as const
    const justify = justifyOptions[Math.floor(Math.random() * justifyOptions.length)]
    return { image, targetZoom, targetPosX, targetPosY, justify }
  }, [])

  // The "show the full image first" state — the background-size percentage
  // (relative to the FRAME's width, since that's what CSS background-size
  // percentages are always relative to) that makes the whole image visible
  // without cropping, i.e. the same math as CSS `background-size: contain`,
  // computed manually because contain-to-percentage isn't animatable.
  const fitZoom = useMemo(() => {
    if (frameWidth === 0 || frameHeight === 0) return 100
    const scale = Math.min(frameWidth / image.w, frameHeight / image.h)
    return ((scale * image.w) / frameWidth) * 100
  }, [frameWidth, frameHeight, image])

  const [zoom, setZoom] = useState(fitZoom)
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(50)

  useEffect(() => {
    if (reduceMotion) {
      // Skip the animated zoom entirely — jump straight to whichever state
      // matches the current visibility, no tweening.
      setZoom(isInView ? targetZoom : fitZoom)
      setPosX(isInView ? targetPosX : 50)
      setPosY(isInView ? targetPosY : 50)
      return
    }

    // animate() (the same imperative Framer Motion API AnimatedNumber uses)
    // tweens a plain 0-1 progress value and hands back the in-between
    // numbers on every frame via onUpdate — this is how three DIFFERENT
    // properties (zoom, posX, posY) end up animating in sync from one
    // single driver, since CSS itself can't tween background-size and
    // background-position as a matched pair reliably across browsers.
    const controls = animate(0, 1, {
      duration: 1.1,
      ease: 'easeInOut',
      onUpdate: (progress) => {
        const from = isInView ? fitZoom : targetZoom
        const to = isInView ? targetZoom : fitZoom
        setZoom(from + (to - from) * progress)
        const fromX = isInView ? 50 : targetPosX
        const toX = isInView ? targetPosX : 50
        setPosX(fromX + (toX - fromX) * progress)
        const fromY = isInView ? 50 : targetPosY
        const toY = isInView ? targetPosY : 50
        setPosY(fromY + (toY - fromY) * progress)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- targetZoom/targetPosX/targetPosY ARE
    // stable per-mount (from a useMemo with an empty dep array) and deliberately excluded so this
    // effect only re-runs on isInView/reduceMotion changes, not every render. fitZoom is DIFFERENT —
    // it depends on the real measured frame width, which arrives asynchronously after mount (a real
    // bug caught here: fitZoom was previously treated as "stable" too, so the resting zoom got
    // permanently stuck at the fallback-dimension value the instant frameWidth's real measurement
    // arrived, since nothing ever re-synced it) — it MUST stay in this dependency array.
  }, [isInView, reduceMotion, fitZoom])

  const frameStyle = {
    backgroundImage: `url(${image.src})`,
    backgroundSize: `${zoom}% auto`,
    backgroundPosition: `${posX}% ${posY}%`,
  }

  return (
    <div className={styles.wrap} style={{ justifyContent: justify }} ref={setRefs}>
      <motion.div
        className={styles.frame}
        style={frameStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </div>
  )
}
