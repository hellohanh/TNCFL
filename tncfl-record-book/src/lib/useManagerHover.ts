import type { MouseEvent } from 'react'
import { useHoveredManagerContext } from './HoveredManagerContext'

// This is what makes "hover ANY manager name anywhere" practical to actually
// wire up: instead of writing separate onMouseEnter/onMouseLeave/onClick
// logic in every component that shows a manager's name, every one of them
// just spreads {...useManagerHover(name)} onto whatever element shows that
// manager's name. Works on HTML elements (td, span) and SVG elements (text,
// path) identically, since these are standard React event props on both.
//
// Click pins the manager (persists after the mouse leaves); the click
// handler stops propagation so it doesn't reach the page-level "click
// background to clear" listener. `isHovered` reads `displayed`
// (hover-or-pin) rather than raw `hovered`, so consumers of this hook don't
// need to know pin exists at all — they just get "am I the highlighted one
// right now" either way.
export function useManagerHover(manager: string) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  return {
    onMouseEnter: () => setHovered(manager),
    onMouseLeave: () => setHovered(null),
    onClick: (e: MouseEvent) => {
      e.stopPropagation()
      setPinned(manager)
    },
    isHovered: displayed === manager,
  }
}
