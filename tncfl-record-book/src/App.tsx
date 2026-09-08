import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useRecordBookData } from './lib/useRecordBookData'
import { HoveredManagerProvider } from './lib/HoveredManagerContext'
import { ManagerFilterProvider } from './lib/ManagerFilterContext'
import Layout from './components/Layout'
import SeasonPage from './components/SeasonPage'
import HallOfFame from './components/HallOfFame'
import Records from './components/Records'
import ManagerProfiles from './components/ManagerProfiles'
import HeadToHead from './components/HeadToHead'
import HowLeagueWorks from './components/HowLeagueWorks'

// The data fetch is lifted ALL THE WAY up to App — the top of the component
// tree — because it's the one piece of state every route needs (the
// timeline rail needs the year list; every SeasonPage needs its own slice).
// "Lift state to the nearest common ancestor of everything that needs it" is
// the whole rule; App is that ancestor here since literally everything is
// nested under it.
//
// HoveredManagerProvider wraps EVERYTHING (outside the router, not inside a
// specific route) — the hovered-manager state needs to survive route changes
// and be reachable from any component anywhere on the site, which is
// precisely what Context is for.
function App() {
  const { data, loading, error } = useRecordBookData()

  if (loading) return <p style={{ padding: 24 }}>Loading site_data.json...</p>
  if (error) return <p style={{ padding: 24, color: 'salmon' }}>Error: {error}</p>
  if (!data) return <p style={{ padding: 24 }}>No data.</p>

  return (
    <HoveredManagerProvider>
      <ManagerFilterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout data={data} />}>
              {/* Visiting just "/" redirects to the most recent season by
                  default — meta.years_desc[0] is already sorted newest-first,
                  so this is real data driving the default, not a hardcoded
                  "2025". */}
              <Route index element={<Navigate to={`/season/${data.meta.years_desc[0]}`} replace />} />
              <Route path="season/:year" element={<SeasonPage />} />
              {/* Milestone 17 — LEAGUE nav entry, all 5 sub-pages now have
                  real content. See SESSION_LEDGER.md for the build history
                  of each. */}
              <Route path="league/hof" element={<HallOfFame />} />
              <Route path="league/profiles" element={<ManagerProfiles />} />
              <Route path="league/profiles/:manager" element={<ManagerProfiles />} />
              <Route path="league/records" element={<Records />} />
              <Route path="league/h2h" element={<HeadToHead />} />
              <Route path="league/how-it-works" element={<HowLeagueWorks />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ManagerFilterProvider>
    </HoveredManagerProvider>
  )
}

export default App
