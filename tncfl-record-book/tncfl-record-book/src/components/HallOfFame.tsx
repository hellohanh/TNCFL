import { useOutletContext } from 'react-router-dom'
import type { RecordBookData } from '../types/data'
import TrophyCabinet from './TrophyCabinet'
import HeroEssay from './HeroEssay'

// Milestone 17, League/Hall of Fame landing. Final scope for THIS page,
// confirmed with the user: trophy cabinet + hero essay only — the other 3
// sections found in the old hub's "🏆 Hall of Fame" sub-tab (League Records
// stat grid, Season-by-Season timeline, All-Time Top Scores/Longest Reigns
// at #1) move to a separate RECORDS sub-page instead (see Records.tsx),
// not this one. See SESSION_LEDGER.md for the full history of how this
// scope narrowed from the original 5-section port.
//
// The essay itself is ported from the old hub, with one fix: the
// "eleven of fifteen" defending-champions claim was stale and has been
// corrected to "ten of fourteen" against current data — everything else
// is unchanged. See HeroEssay.tsx's own comment for that.
export default function HallOfFame() {
  const data = useOutletContext<RecordBookData>()

  return (
    <div>
      <div className="module-title">The Trophy Cabinet</div>
      <TrophyCabinet payouts={data.payouts} yearsDesc={data.meta.years_desc} meta={data.meta} />

      <HeroEssay />
    </div>
  )
}
