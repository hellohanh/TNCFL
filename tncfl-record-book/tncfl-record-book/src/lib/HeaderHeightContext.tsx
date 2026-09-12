import { createContext, useContext } from 'react'

// Same createContext + hook shape as HoveredManagerContext. This exists
// because the dissolve-overlay trigger (Milestone 7e continuation) needs the
// header's real height in a plain JS number, not just as a CSS variable —
// the trigger math (`element top <= headerHeight`) happens in a scroll
// listener, not in CSS. Layout.tsx already measures this via useElementSize
// for the sticky rail's CSS offset; this just makes that same number
// reachable from anywhere else in the tree instead of re-measuring it.
const HeaderHeightContext = createContext<number>(119)

export const HeaderHeightProvider = HeaderHeightContext.Provider

export function useHeaderHeight(): number {
  return useContext(HeaderHeightContext)
}
