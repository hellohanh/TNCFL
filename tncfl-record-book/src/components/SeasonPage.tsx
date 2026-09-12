import { useMemo } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import type { RecordBookData } from '../types/data'
import { useSeasonSummary } from '../lib/useSeasonSummary'
import { computeSeasonTotals } from '../lib/computeSeasonTotals'
import SeasonHero from './SeasonHero'
import RecapBody from './RecapBody'
import ScrollCue from './ScrollCue'
import DissolveOverlay from './DissolveOverlay'
// import FleaFlicker from './FleaFlicker' // commented out for now — rewire in when ready
import { useCrossedLine } from '../lib/useCrossedLine'
import { useRowCapHeight } from '../lib/useRowCapHeight'
import { useHeaderHeight } from '../lib/HeaderHeightContext'
import SeasonStatTiles from './SeasonStatTiles'
import ManagerFilterToggle from './ManagerFilterToggle'
import ScoreTable from './ScoreTable'
import RevealOnScroll from './RevealOnScroll'
import BumpChart from './BumpChart'
import ScoringSpreadIndex from './ScoringSpreadIndex'
import DespairDifferential from './DespairDifferential'
import PeakPerformance from './PeakPerformance'
import DroughtBars from './DroughtBars'
import DancingShoes from './DancingShoes'
import AtdrCard from './AtdrCard'
import SeasonTotalsCard from './SeasonTotalsCard'
import SalaryDonuts from './SalaryDonuts'
import NuggetGrid from './NuggetGrid'
import SalaryRulesCard from './SalaryRulesCard'
import SalaryLedgerTable from './SalaryLedgerTable'
import SeasonExtremesRow from './SeasonExtremesRow'
import ManagerHoverCard from './ManagerHoverCard'

// Milestone 7: the recap's full prose body now renders right under the hero
// (still part of the "story" read, not gated behind a scroll-reveal — same
// as the hero itself). Dancing Shoes is grouped alongside DroughtBars since
// they tell the same drought story two different ways (already cross-checked
// against each other back in Milestone 5). NuggetGrid closes the page out,
// matching where the old hub placed its nugget cards.
export default function SeasonPage() {
  const { year } = useParams<{ year: string }>()
  const data = useOutletContext<RecordBookData>()

  const season = year ? data.seasons[year] : undefined
  const fallbackYear = String(data.meta.years_desc[0])
  const summary = useSeasonSummary(season ?? data.seasons[fallbackYear])

  if (!season || !year) {
    return <p>No data for season {year}.</p>
  }

  const recap = data.recaps[year]
  const dance = data.dance[year]
  const nuggets = data.nuggets[year]
  const payouts = data.payouts[year]
  const engineSummary = data.summary[year]
  const cumulative = data.cumulative[year]
  const atdrRows = (data.meta.hmotw.atdr_snapshots[year] || []).slice(0, 50)
  const statusByYear = data.meta.hmotw.status_by_year[year] || {}
  const { rowRef: atdrRowRef, maxHeight: atdrMaxHeight } = useRowCapHeight(15)
  const seasonTotals = useMemo(
    () => computeSeasonTotals(data.seasons, data.meta.years_desc, season.year, 50),
    [data.seasons, data.meta.years_desc, season.year],
  )

  // Milestone 7e continuation: the dissolve overlay is scoped specifically
  // to the recap's own scroll position — it activates once the recap's top
  // edge crosses the header's bottom edge, and deactivates again if you
  // scroll back up past that line (bidirectional, same as RevealOnScroll).
  const headerHeight = useHeaderHeight()
  const { ref: recapRef, crossed: recapPastHeader } = useCrossedLine<HTMLDivElement>(headerHeight)

  return (
    <div className="season-page">
      <SeasonHero season={season} summary={summary} recap={recap} meta={data.meta} />
      <DissolveOverlay visible={recapPastHeader} />
      <div ref={recapRef}>
        <RecapBody recap={recap} />
      </div>
      <ScrollCue />
      {/* <FleaFlicker key={year} /> */}
      <RevealOnScroll marginTop={0}>
        <SeasonStatTiles season={season} summary={summary} meta={data.meta} />
        <ManagerFilterToggle />
        <ScoreTable season={season} championName={summary.championName} />
      </RevealOnScroll>
      <RevealOnScroll>
        <BumpChart key={year} season={season} meta={data.meta} />
      </RevealOnScroll>
      <RevealOnScroll>
        <ScoringSpreadIndex season={season} meta={data.meta} />
      </RevealOnScroll>
      <RevealOnScroll>
        <DespairDifferential season={season} meta={data.meta} />
      </RevealOnScroll>
      <RevealOnScroll>
        <PeakPerformance season={season} meta={data.meta} />
      </RevealOnScroll>
      <RevealOnScroll>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <AtdrCard rows={atdrRows} statusByYear={statusByYear} meta={data.meta} rowRef={atdrRowRef} maxHeight={atdrMaxHeight} />
          </div>
          <div style={{ flex: 1 }}>
            <SeasonTotalsCard rows={seasonTotals} maxHeight={atdrMaxHeight} meta={data.meta} />
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <DancingShoes dance={dance} meta={data.meta} />
          </div>
          <div style={{ flex: 1 }}>
            <DroughtBars season={season} meta={data.meta} />
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll>
        <NuggetGrid key={year} nuggets={nuggets} />
      </RevealOnScroll>
      <RevealOnScroll>
        <SeasonExtremesRow
          competence={engineSummary.competence}
          topweeks={engineSummary.topweeks}
          lowweeks={engineSummary.lowweeks}
          meta={data.meta}
        />
      </RevealOnScroll>
      <RevealOnScroll>
        <SalaryRulesCard year={season.year} payouts={payouts} />
        <SalaryLedgerTable rows={payouts.rows} meta={data.meta} moneyCircle={season.money_circle} />
      </RevealOnScroll>
      <RevealOnScroll>
        <SalaryDonuts rows={payouts.rows} meta={data.meta} />
      </RevealOnScroll>
      <RevealOnScroll>
        <div className="module-title-row">
          <div className="module-title">Career Salary Cap Contributions</div>
        </div>
        <div className="module-subtitle" style={{ marginBottom: 10 }}>
          Every dollar each manager has cycled through the league, summed from 2011 through the
          selected season
        </div>
        <SalaryLedgerTable
          rows={cumulative.rows}
          meta={data.meta}
          moneyCircle={season.money_circle}
          seasonPurseLabel="Career"
        />
      </RevealOnScroll>
      <RevealOnScroll>
        <SalaryDonuts
          rows={cumulative.rows}
          meta={data.meta}
          title="Career Salary Cap Contributions — Winners & Losers"
          subtitle="All-time net gains and losses through the selected season, shown as a share of the money won and the money lost"
          winnersTitle="Cumulative Winners"
          losersTitle="Cumulative Losers"
        />
      </RevealOnScroll>
      <ManagerHoverCard season={season} meta={data.meta} payoutRows={payouts.rows} />
    </div>
  )
}
