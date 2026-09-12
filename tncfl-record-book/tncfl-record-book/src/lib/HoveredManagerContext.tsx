import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// Same shape as Wanderlog's AuthContext: createContext + a Provider component
// that holds the actual state + a custom hook to read it. The state here
// (which manager is currently hovered/pinned, anywhere on the site) needs to
// be visible to components that have no parent/child relationship to each
// other — a table cell in ScoreTable and a legend row in SalaryDonuts share
// nothing except both being somewhere under this Provider. That's exactly
// the case Context exists for, as opposed to Milestone 2's Outlet-context
// approach, which only worked because Layout was a direct ancestor of
// everything that needed the data.
//
// `hovered` is transient (set on mouseenter, cleared on mouseleave).
// `pinned` is persistent (set on click, cleared only by clicking a
// background area). `displayed` is what every consumer should actually read
// for dim/highlight decisions — hover temporarily overrides a pin (per the
// user's explicit call), falling back to the pin when the mouse leaves.
interface HoveredManagerContextValue {
  hovered: string | null
  setHovered: (manager: string | null) => void
  pinned: string | null
  setPinned: (manager: string | null) => void
  displayed: string | null
}

const HoveredManagerContext = createContext<HoveredManagerContextValue | undefined>(undefined)

export function HoveredManagerProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const displayed = hovered ?? pinned
  const value = useMemo(
    () => ({ hovered, setHovered, pinned, setPinned, displayed }),
    [hovered, pinned, displayed],
  )
  return <HoveredManagerContext.Provider value={value}>{children}</HoveredManagerContext.Provider>
}

// Same "throw if used outside the Provider" pattern Wanderlog's useAuth used
// — it turns "I forgot to wrap this in the Provider" into an immediate,
// obvious error instead of a silent `undefined` bug somewhere downstream.
export function useHoveredManagerContext(): HoveredManagerContextValue {
  const ctx = useContext(HoveredManagerContext)
  if (!ctx) {
    throw new Error('useHoveredManagerContext must be used within a HoveredManagerProvider')
  }
  return ctx
}
