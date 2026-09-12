import { useElementSize } from './useElementSize'

/** Measures one row's real rendered height (via a ref on that row), then
 * returns a maxHeight equal to `visibleRows` rows worth of that height —
 * for capping a list at N visible rows while still rendering more (for
 * scrolling to the rest). Real-measurement based, same discipline as the
 * height-matching already used in SeasonExtremesRow, rather than a guessed
 * pixel constant that could clip or leave a gap if row content/font ever
 * changes.
 *
 * Uses a generous non-zero FALLBACK row height (32px) rather than 0/none —
 * a real bug surfaced two cards sharing a flex row with `align-items:
 * stretch`: on first paint (before either card's ResizeObserver has fired),
 * both rendered at full uncapped height, and the row locked its cross-size
 * to whichever was naturally taller; a card can end up stretched even after
 * its own cap kicks in, or (as seen) never visibly cap at all depending on
 * timing. A 0-height fallback meant "no cap yet" was indistinguishable from
 * "genuinely uncapped," so a stalled measurement silently produced an
 * unbounded list. A non-zero fallback guarantees SOME cap is always active
 * from the very first render — refined to the exact real value once
 * measured, never absent. Deliberately generous (overestimating is safe:
 * it just shows a bit more than 15 rows briefly; underestimating is also
 * safe, since max-height+overflow never clips text mid-row, it only
 * changes how much is visible before scrolling). */
export function useRowCapHeight(visibleRows: number, fallbackRowHeight = 32) {
  const { ref, height } = useElementSize<HTMLDivElement>({ width: 0, height: fallbackRowHeight })
  const rowHeight = height > 0 ? height : fallbackRowHeight
  const maxHeight = rowHeight * visibleRows
  return { rowRef: ref, maxHeight }
}
