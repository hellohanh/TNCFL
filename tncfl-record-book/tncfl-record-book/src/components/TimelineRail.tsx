import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface TimelineRailProps {
  years: number[] // meta.years_desc — already sorted newest-first by the data feed
}

const LEAGUE_LINKS = [
  { to: '/league/hof', label: 'Hall of Fame' },
  { to: '/league/profiles', label: 'Manager Profiles' },
  { to: '/league/records', label: 'Records' },
  { to: '/league/h2h', label: 'Head-to-Head' },
  { to: '/league/how-it-works', label: 'How Our League Works' },
]

// The persistent year-timeline rail. NavLink is Link's sibling — same
// navigation behavior, but it also tells you (via the `className` function
// below) whether ITS OWN route currently matches the URL. That's what lights
// up the active year automatically: no manually-tracked "which year is
// selected" state anywhere in this app. The URL itself IS that state — React
// Router reads it, and NavLink reacts to it. This is the payoff of routing
// being in charge of navigation state instead of a hand-rolled `useState`.
//
// Milestone 17: one LEAGUE entry above the year list, expanding to the 4
// sub-pages (locked this session — a single grouped entry, not 4 flat
// top-level links). Starts expanded if the user is already on a /league/*
// route (deep-linking or a refresh shouldn't hide where they are), and is
// otherwise a plain useState toggle — no need for this to survive a route
// change once it does.
export default function TimelineRail({ years }: TimelineRailProps) {
  const location = useLocation()
  const onLeagueRoute = location.pathname.startsWith('/league')
  const [expanded, setExpanded] = useState(onLeagueRoute)

  return (
    <nav className="timeline-rail">
      <ul className="timeline-rail-years">
        <li>
          <button
            type="button"
            className={onLeagueRoute ? 'timeline-year active' : 'timeline-year'}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
            }}
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            LEAGUE
          </button>
          {expanded && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {LEAGUE_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => (isActive ? 'timeline-year active' : 'timeline-year')}
                    style={{ fontSize: 14, paddingLeft: 32 }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
        {years.map((year) => (
          <li key={year}>
            <NavLink
              to={`/season/${year}`}
              className={({ isActive }) => (isActive ? 'timeline-year active' : 'timeline-year')}
            >
              {year}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
