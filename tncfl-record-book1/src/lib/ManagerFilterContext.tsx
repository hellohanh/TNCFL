import { createContext, useContext, useState, type ReactNode } from 'react'

// Simple 2-state manager filter — "All Managers" or "Money Circle" only, per
// the user's explicit simplification of the hub's real filter bar (which
// also had Clear All + individual per-manager pills; those are out of scope
// here since hover/click-to-pin already covers individual selection). Reset
// per season isn't needed the way sort state was (Milestone 7p) since
// there's no season-specific meaning to carry over incorrectly, but kept as
// a plain top-level state for now — simplest thing that works.
export type ManagerFilterMode = 'all' | 'moneyCircle'

interface ManagerFilterContextValue {
  mode: ManagerFilterMode
  setMode: (mode: ManagerFilterMode) => void
}

const ManagerFilterContext = createContext<ManagerFilterContextValue | undefined>(undefined)

export function ManagerFilterProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ManagerFilterMode>('all')
  return <ManagerFilterContext.Provider value={{ mode, setMode }}>{children}</ManagerFilterContext.Provider>
}

export function useManagerFilterContext(): ManagerFilterContextValue {
  const ctx = useContext(ManagerFilterContext)
  if (!ctx) {
    throw new Error('useManagerFilterContext must be used within a ManagerFilterProvider')
  }
  return ctx
}
