import { useState } from 'react'
import styles from './HowLeagueWorks.module.css'

interface Callout {
  label: string
  text: string
  dim?: boolean
}

interface AccordionItem {
  title: string
  paragraphs: string[]
  list?: string[]
  callouts: Callout[]
}

// Ported from the old hub's real "How Our League Works" accordion
// (TNCFL_hub.html, htw-* classes) — content verified against real data
// before porting (buy-in amounts by era, Randy's 2024 net breakdown, Bao's
// 96-week drought) rather than assumed accurate.
const ITEMS: AccordionItem[] = [
  {
    title: '\uD83C\uDFC6 HMOTW \u2014 High Man of the Week',
    paragraphs: [
      "Every week of the regular season, all 10 managers score points based on their NFL players' real-game stats. The manager with the highest score that week wins the HMOTW crown.",
      'Winning HMOTW pays out real money \u2014 the weekly pot equals $10 \u00d7 the number of managers that season ($100 in most years). It also adds 1.0 to your tally \u2014 a running career counter that tracks how many weekly crowns you\u2019ve earned across your entire history in the league.',
      "If two managers tie for the week's high score, the pot is split equally between them and each receives 0.5 tally.",
    ],
    callouts: [
      {
        label: 'Example',
        text: "Randy wins Week 7 outright with 198 points. He collects $100 and his tally climbs by 1.0. D'lyn and Kito tie for the high score in Week 12 \u2014 each gets $50 and 0.5 tally.",
      },
    ],
  },
  {
    title: '\u26A1 DHMOTW \u2014 Double High Man (2017+)',
    paragraphs: [
      'Starting in the 2017 season, a new rule was introduced: if the week\u2019s sole high scorer breaks 200 points, the weekly pot doubles and their tally credit doubles to 2.0. This is called DHMOTW \u2014 Double High Man of the Week.',
      'The threshold only applies to outright winners. If two managers both score over 200 and tie, the doubled pot is still split \u2014 each receives 1.0 tally instead of 2.0.',
    ],
    callouts: [
      {
        label: 'Example',
        text: 'Randy scores 215 points in Week 3, the week\u2019s sole high score. He collects $200 (doubled) and 2.0 tally. In 2024 he posted 10.0 tally for the season \u2014 the all-time single-season record.',
      },
      {
        label: 'Note',
        text: "Pre-2017 scores over 200 still counted as regular HMOTW wins (1.0 tally, standard pot). Kevin's all-time record 256-point week in 2013 earned standard payout.",
        dim: true,
      },
    ],
  },
  {
    title: '\uD83C\uDF35 The Drought System',
    paragraphs: [
      'Every manager has a drought clock \u2014 the number of consecutive league weeks since their last HMOTW win. The clock starts at Week 1 of your debut season and never stops.',
      'Three things make the drought system brutal:',
    ],
    list: [
      'It never resets between seasons. The clock runs continuously across all 15+ years of the league. A drought that starts in October carries into September of the next year without interruption.',
      "Inactivity doesn't pause it. If you sit out a season, every week still counts. The clock doesn't care whether you played.",
      "Only a win resets it. A tie resets the drought to zero \u2014 but nothing else does. Second place doesn't help. A 199-point week that loses to a 200-point week adds one more week to your drought.",
    ],
    callouts: [
      {
        label: 'Departed managers',
        text: 'When a manager goes inactive for 7+ straight seasons they are formally marked departed. Their drought record is trimmed to their last active week \u2014 the inactive inflation is removed from the permanent record.',
        dim: true,
      },
    ],
  },
  {
    title: '\uD83D\uDCB0 Payout Structure',
    paragraphs: [
      'Every manager pays a $200 buy-in at the start of the season (it was $100 in 2011\u20132014). That money builds the season pot, which is topped up by weekly transaction fees every time a manager adds or drops a player.',
      'Season pot splits (current era, 2015+): the top four finishers at the end of the regular season split the pot \u2014 40% to 1st, 30% to 2nd, 20% to 3rd, 10% to 4th. The 1st-place finisher also receives a separate $250 ring voucher redeemable for a physical championship ring.',
      "Weekly HMOTW: each week's pot ($10 \u00d7 managers) is paid out to that week's high scorer. The league tally \u2014 total HMOTW points across all managers \u2014 determines how much each manager contributed to the weekly pool over the course of the season.",
      'The Sidebet (2017+): a voluntary side pool where participating managers each throw in $100. The highest-scoring participant across the entire regular season takes the whole pool.',
      'The Playoff Bracket (2020+): a separate voluntary bracket pool. Participants buy in and compete in a single-elimination bracket run alongside the fantasy playoffs. Payout is based on bracket finish.',
    ],
    callouts: [
      {
        label: 'The math',
        text: 'In 2024, Randy won the season title, the sidebet, and 10.0 HMOTW crowns in a 10-manager league. His total earnings: season prize + ring + $1,000 sidebet + $1,000 HMOTW pool (10.0 \u00d7 $10 \u00d7 10) = +$2,902 net \u2014 the all-time single-season record.',
      },
    ],
  },
]

export default function HowLeagueWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      <div className="module-title">How Our League Works</div>
      <p className={styles.intro}>
        Thursday Night Curse Fantasy Football League has been running since 2011. Here&rsquo;s how the money, the weekly game, and the drought
        clock all work &mdash; for anyone not in the room.
      </p>

      <div className={styles.accordion}>
        {ITEMS.map((item, i) => {
          const open = openIndex === i
          return (
            <div className={styles.item} key={item.title}>
              <button type="button" className={styles.trigger} onClick={() => setOpenIndex(open ? null : i)}>
                <span className={styles.triggerTitle}>{item.title}</span>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>&#9662;</span>
              </button>
              {open && (
                <div className={styles.body}>
                  {item.paragraphs.map((p, pi) => (
                    <p key={pi}>{p}</p>
                  ))}
                  {item.list && (
                    <ul className={styles.list}>
                      {item.list.map((li, li_i) => (
                        <li key={li_i}>{li}</li>
                      ))}
                    </ul>
                  )}
                  {item.callouts.map((c, ci) => (
                    <div key={ci} className={`${styles.callout} ${c.dim ? styles.calloutDim : ''}`}>
                      <span className={styles.calloutLabel}>{c.label}</span>
                      {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
