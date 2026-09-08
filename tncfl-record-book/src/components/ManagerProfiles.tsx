import { NavLink, useOutletContext, useParams } from 'react-router-dom'
import type { RecordBookData } from '../types/data'
import ManagerAvatar from './ManagerAvatar'
import ManagerProfileCard from './ManagerProfileCard'
import styles from './ManagerProfiles.module.css'

// URL-driven manager selection (/league/profiles/:manager), confirmed with
// the user over the old hub's in-page click-only state — matches how every
// other page in this app treats the URL as the actual state (same
// philosophy TimelineRail.tsx's own comment already documents). The slug is
// just the manager's name lowercased; matched case-insensitively against
// `meta.hmotw.all_players` rather than assuming the slug IS a valid name.
export default function ManagerProfiles() {
  const data = useOutletContext<RecordBookData>()
  const { manager: managerSlug } = useParams<{ manager?: string }>()
  const allPlayers = data.meta.hmotw.all_players
  const selected = managerSlug ? allPlayers.find((m) => m.toLowerCase() === managerSlug.toLowerCase()) : undefined

  return (
    <div>
      <div className="module-title">Manager Profiles</div>
      <div className={styles.pillBar}>
        {allPlayers.map((m) => {
          const color = data.meta.manager_colors[m] ?? '#aaa'
          const rings = Object.values(data.career[m]?.rank ?? {}).filter((r) => r === 1).length
          return (
            <NavLink
              key={m}
              to={`/league/profiles/${m.toLowerCase()}`}
              className={({ isActive }) => `${styles.pill} ${isActive ? styles.pillActive : ''}`}
              style={{ borderColor: color, color }}
            >
              <ManagerAvatar name={m} color={color} rings={rings} status={data.career[m]?.status ?? 'D'} size={20} />
              {m}
            </NavLink>
          )
        })}
      </div>

      {selected ? (
        <ManagerProfileCard
          name={selected}
          career={data.career[selected]}
          meta={data.meta}
          streaks={data.streaks_at_1}
          payouts={data.payouts}
        />
      ) : (
        <p className={styles.hint}>Select a manager above to view their career profile.</p>
      )}
    </div>
  )
}
