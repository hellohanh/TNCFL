import styles from './HeroEssay.module.css'

// Ported from the old hub's `.hof-hero` block (TNCFL_hub.html), verbatim
// except one fix: the "eleven of fifteen defending champions" line was
// stale (a from-scratch recount against current data gives ten of
// fourteen — there are only 14 defending-champion transitions possible in
// 15 seasons, not 15 — see SESSION_LEDGER.md). Corrected per the user's
// explicit request; everything else in the essay is untouched.
//
// Same dangerouslySetInnerHTML pattern as RecapBody.tsx: hand-authored
// trusted prose with inline <strong>/<span> markup baked in, not user
// input, so this is the same safe use case that component already
// established.
const PARAGRAPHS: string[] = [
  'It started with six men, an easel pad, and a few long smoke breaks. Nobody had a trophy. Nobody had a system. Nobody had any idea what they were walking into.',
  'That was 2011. This is now.',
  "Fifteen seasons. Eighteen managers. <strong>$75,370</strong> that has moved from pocket to pocket like contraband — won, lost, and won again. Ten men have held the championship. Three of them — <strong>Hanh</strong>, <strong>Randy</strong>, and <strong>Damian</strong> — have held it more than once. Two of them — Hanh and Randy — have held it three times. They are, by any measure, the most dangerous men in the room.",
  "But the room has a memory. Win this league and it marks you. <strong>Ten of fourteen defending champions</strong> came back the following year and fell — not to second, not to third, but to the middle of the table or worse. Hanh won in 2011 and finished 9th in 2012. Damian won in 2012 and finished dead last in 2013. Kevin, Randy, Mikey — all kings, all dethroned before they could catch their breath. The league doesn't let you enjoy it. The league watches you celebrate and then starts loading.",
  "There are the droughts. God, the droughts. <strong>Bao</strong> went <strong>96 weeks</strong> without a single High Man crown — the longest earned desert in league history, spanning five seasons of accumulated misery. He made it back, he closed it out, and then he disappeared. <strong>Mikey</strong> is currently sitting at <strong>95 weeks</strong> and counting, one week short of Bao's record, inactive and unable to do a thing about it. The clock runs whether you play or not.",
  "There is the money. <strong>Randy</strong> is the all-time net leader at <strong>+$5,583</strong> — a number that sounds like a salary until you realize he earned it by surviving fifteen seasons of this. At the other end of the ledger, <strong>D'lyn</strong> sits at <strong>−$2,248</strong>. The range between them is the full width of what this league can do to a person.",
  "There is the record book. <strong>Kevin's 256-point week in 2013</strong> stands as the single greatest individual performance in league history — a number so far ahead of its era that it still sits at the top of the all-time list twelve years later. <strong>Randy's 10.0 HMOTW tally in 2024</strong> — three full crowns ahead of the next best single-season mark — rewrote what we thought was possible on a weekly basis. These are not flukes. These are moments that redefined the ceiling.",
  'Fifteen seasons. Every Thursday, someone wins. Every Thursday, someone else loses. The standings shift. The droughts grow. The curse keeps its ledger. And somewhere out there, a manager who hasn\'t been born into this league yet is going to walk in one day, look at this record, and think they can break it.',
  '😈 The <span class="CURSE_SPAN">curse</span> has a name for a reason. Every week, the Thursday night games drop first — and sometimes a manager goes absolutely nuclear on Thursday, piling up a monstrous score before the rest of the week has even started. You\'d think that\'s a good thing. You\'d be wrong. Time and again, the manager who dominates Thursday night watches the rest of the field catch up and pass him over the weekend. Monster Thursday numbers. Still not enough. The week closes, the crown goes somewhere else, and the Thursday night points sit there like evidence of something the league finds deeply funny. Thus the name. The curse is <strong>real</strong>, it is <strong>strong</strong>, and it does not negotiate. It has humbled veterans, ambushed front-runners, and laughed at mathematically certain leads. You will feel it. Every manager in this league already has. <strong>Beware.</strong>',
]

export default function HeroEssay() {
  return (
    <div className={styles.hero}>
      <div className={styles.eyebrow}>THURSDAY NIGHT CURSE FANTASY LEAGUE — EST. 2011</div>
      <h1 className={styles.title}>
        15 Years. 18 Men. $75,000 on the Table. <span className={styles.accent}>One Curse.</span>
      </h1>
      <div className={styles.sub}>
        {PARAGRAPHS.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p.replace('CURSE_SPAN', styles.accent) }} />
        ))}
      </div>
    </div>
  )
}
