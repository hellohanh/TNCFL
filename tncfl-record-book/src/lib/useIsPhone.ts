import { useEffect, useState } from 'react'

// True on phones / narrow screens — the same <=820px breakpoint the CSS uses
// (index.css, MobileTabDrawer, SiteHeader) and the 2026 Tracker uses. For the
// few places where phone behavior is JS-driven (e.g. TrophyCabinet's carousel
// spacing), so they switch at exactly the same width as the CSS.
const QUERY = '(max-width: 820px)'

export function useIsPhone(): boolean {
  const [isPhone, setIsPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setIsPhone(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isPhone
}
