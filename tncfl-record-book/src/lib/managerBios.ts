// Manager Profile bios — 2 paragraphs each, drafted from real career/streaks
// data (not the old hub's 1-paragraph ARCS, though those were the starting
// reference point). Every specific number here was checked against
// `career`/`streaks_at_1`/`payouts`, not carried over from the old hub
// unverified — that check caught 2 real errors before this was confirmed:
// Daniel's departure year (was "after 2017", actually played through 2018)
// and Titi's rival record direction (old arc implied he led Tony; the real
// head-to-head has Tony leading 29-25). Also caught mid-review: Hanh's own
// bio originally claimed to be the ONLY manager to play every season since
// 2011 — Kito also has a perfect 15-season attendance record, so that's
// corrected too. Locked with the user paragraph-by-paragraph before wiring
// this in.
export const MANAGER_BIOS: Record<string, [string, string]> = {
  Aidan: [
    "Two years in the league, one championship banner. His rookie season in 2024 was a quiet 9th-place feeling-out year, best week just 93.44 — a warning sign, in retrospect, for how much better he'd get. In 2025 he flipped a switch entirely: took the lead in Week 5, never gave it back, held first for 14 straight weeks, and closed the year with a 215.84 explosion in Week 7, the 5th-highest single week in league history.",
    "The turnaround shows up everywhere in the numbers — from a net of \u2212$588 in his debut to +$2,183 the very next year, a swing of nearly $2,800 in twelve months. His toughest matchup has been Hanh, who's beaten him 24 times to Aidan's 12 so far — a rivalry Aidan is very much still writing the second half of.",
  ],
  Bao: [
    "Bao's league membership has two distinct chapters separated by a five-year gap. He was there at the very beginning in 2011, played through 2013, then vanished — and came back in 2019 carrying the longest drought the league has ever recorded: 96 weeks without a High Man crown, quietly accumulating the entire time he was gone. He broke it in Week 4 of his return season.",
    "He left again after that single comeback year, closing his ledger at \u2212$1,139 across four seasons and a career-best 204-point week back in 2013. His most frequent opponent was Kito, who beat him 40 times to Bao's 27 — a rivalry that never really had a chance to finish, given how much of Bao's career happened off the grid entirely.",
  ],
  "D'lyn": [
    "D'lyn owns the least enviable record in franchise history: the all-time low career net, at \u2212$2,248. But the ledger doesn't tell the whole story — in 2023 he won the playoff bracket as a 5th-place regular-season finisher and snapped a personal 39-week drought on the literal final game of that same regular season, Week 18. Clutch, just not profitable.",
    "Six seasons in, still active, still grinding — his 202.18 in Week 11 of 2024 is his career-best week, and his longest streak at #1 is a modest 2 weeks, which tells you a lot about a career built on scrapping rather than dominating. His rival is Ted, who's beaten him 62 times to 45.",
  ],
  Damian: [
    'Damian is the league\u2019s iron man — fourteen straight seasons, two championships eleven years apart, and more individual weekly crowns than anyone else who\u2019s ever played here (37.5 HMOTW tally, the all-time record). He won as a rookie in 2012 by nearly 200 points, fell to dead last the very next year, then spent two seasons in the wilderness before clawing all the way back to a second title in 2016.',
    "He's never had a signature moment so much as a signature career — a 233.6-point week in 2024 (his personal best) and a net that's stayed solidly positive at +$839 across a decade and a half. His longtime rival is Hanh, in the closest real rivalry in the league — 128-113 in Hanh's favor.",
  ],
  Daniel: [
    "Daniel's run spanned the era right before and after the Double High Man rule changed the league's economics, and his record reflects a solid, unspectacular career: six seasons, a 202-point best week in 2014, and a net that settled at \u2212$943 by the time he departed after 2018.",
    'He never cracked the top three in a season, and his rivalry with Mikey — who beat him 60 times to Daniel\u2019s 41 — was as lopsided as his career was steady. No drama, no ring, but a real, honest run through the league\u2019s formative years.',
  ],
  Douang: [
    "Douang was one of the league's early powerhouses, running from the 2012 expansion all the way through 2018. His 217-point week in 2013 was, for years, the second-highest score in league history — trailing only Kevin's 256 from that same season — and he racked up 12 career HMOTW crowns along the way.",
    "He left after 2018 with a net of \u2212$492, a respectable finish for a seven-year run. Mikey was his toughest matchup by volume, beating him 66 times to 50 — a rivalry built on sheer repetition more than any single dramatic year.",
  ],
  Hanh: [
    "Hanh and Kito are the only two managers who've played every single season since the league's easel-pad origins in 2011. Hanh also shared glory with Randy, both of whom have worn the crown \u2014 three times. Hanh accomplished this across three separate eras: 2011 before anyone knew the rules, 2017 after a six-year wait, and a perfect wire-to-wire 2020 that never surrendered first place across all 17 weeks, the only undefeated-at-the-top season in league history.",
    "Fifteen seasons in, he's still net positive at +$528 and has never finished in the league's basement. His longest-running rivalry is with Kito, and for once Hanh has the edge, 134 wins to 124.",
  ],
  Kevin: [
    "Kevin owns the single most untouchable record in the league's history books: a 256-point week in 2013, the highest individual score anyone has ever posted here, still standing atop the leaderboard twelve years later with no real challenger in sight. He won the whole thing that same season.",
    "The decade since has been quieter — a net that's settled at \u2212$1,442 and finishes bouncing between 2nd and 10th, never quite recapturing that 2013 magic. His closest rivalry is with Hanh, a near-even series at 120-123 that's stayed tight for over a decade.",
  ],
  Kito: [
    "Fifteen seasons, one ring, and one of the most improbable championship runs in league history — Kito won 2019 with exactly one HMOTW crown all year, proof that consistency beats fireworks over a full season. His 235.48 in 2021 is the second-highest single-week score anyone has ever posted, yet that same year he didn't even win the title.",
    "He broke a 33-week drought in 2025 with a monster comeback and finished 5th — the arc isn't over. His longest-running rival is Hanh, who holds a 134-124 edge in a series that's spanned the league's entire history.",
  ],
  La: [
    "La is one of the league's most productive managers to never win a title — ten seasons, 21.5 career HMOTW crowns (10th all-time), and a career-best 212-point week in 2013 where he held the weekly crown four separate times that season alone.",
    "He departed after 2020 with a net of \u2212$700 and no ring to show for a genuinely strong decade of weekly production. Mikey was his most frequent opponent, and won more often than not — 97 times to La's 69.",
  ],
  Lam: [
    "Lam's entire league career is a single season: 2012, the year the league doubled in size to ten managers. He finished last, collected one HMOTW crown (a 153-point week in Week 14), and didn't return.",
    "His lone matchup of note was against Damian, who beat him 14 times to Lam's 3 in their one shared season — a short, one-sided introduction to a league Lam never came back to.",
  ],
  Lonny: [
    "Lonny was one of the league's six founding members in 2011 — the easel-pad-and-smoke-breaks era — and finished mid-table in that inaugural year before not returning. His 134-point best week is a relic of an era when scores across the board ran lower.",
    "His rivalry with Mikey was close, 10-7 in Mikey's favor, in what amounted to one shared season neither of them repeated. One year, one line in the ledger, but a founding one.",
  ],
  Mikey: [
    "Mikey opened his career with four straight third-place finishes — 2011 through 2014 — before finally breaking through for a title in 2015. Ten seasons, one ring, and a net that actually finished positive at +$1,301, a rarer outcome than the league's droughts might suggest.",
    "He's currently sitting on a 95-week High Man drought, one short of the all-time record — and since he's been inactive the whole time, that clock keeps running without him even at the table. His rivalry with Hanh was one he actually won, 91 wins to 77.",
  ],
  Randy: [
    "Randy is the league's all-time money leader by a wide margin — +$5,583, more than four thousand dollars clear of second place — built across three championships in three different eras: an immediate 2014 rookie title, a 2018 return to the top, and a 2024 season so dominant it rewrote the record book (10.0 HMOTW tally, the highest single-season mark anyone's ever posted).",
    "His longest streak at #1 ran an incredible 23 weeks, crossing from the end of 2018 into the start of 2019. His rivalry with Kevin favors him narrowly, 108-100 — a fitting margin for a career defined by fine margins tipping his way.",
  ],
  Ted: [
    "Ted has been good enough to make the money and never quite good enough to keep it — seven seasons, three top-three finishes, and a career net that's settled at \u2212$1,973 despite real flashes of quality, including a 220.52-point week in 2023 that ranks among the highest single scores in league history.",
    "He closed 2025 with a 24-week drought and one of the worst single-season nets in the league that year. His rival is Kito, in a tight series Ted trails 60-63 — close enough that either side could probably tell you it should be even by now.",
  ],
  Tim: [
    "Tim's career opened with a 39-week drought spanning his first two full seasons — the longest active winless streak the league had going. Then in 2023 he broke it in Week 4, grabbed first place by Week 8, and never gave it back, sweeping the standings, the sidebet, the HMOTW race, and the ring in one of the most complete seasons anyone's ever put together here.",
    "His 231.4-point week in 2025 is the 4th-highest single-week score in league history — proof the turnaround wasn't a one-year fluke. His toughest matchup has been Randy, who's beaten him 59 times to Tim's 31.",
  ],
  Titi: [
    "Titi's entire league r\u00e9sum\u00e9 is three seasons long, and it opens about as strong as a career can open: a rookie-year championship in 2021, leading 16 straight weeks en route to the title and posting the 6th-highest single-week score in league history along the way.",
    "He went inactive after 2023 with a 45-week drought and a career net still comfortably positive at +$1,257 — a short run, but a genuinely heavy one. His closest rival was Tony, in a series he trails 25-29.",
  ],
  Tony: [
    "For most of a decade, Tony was the league's favorite target — years of finishing in the middle of the pack, collecting cellar finishes (8th, 9th, 10th, 9th to open his career), and having entire desert nicknames built around his droughts. Then in 2022 he simply took over: led in sixteen of eighteen weeks and finally got his ring, an eleven-year wait ending in a front-running coronation.",
    "The very next year he went 0-for-18 on HMOTW crowns — a reminder that a title never buys you an easy season after, in this league. Fourteen years in, his net still sits at \u2212$889, and his longest-running rival is Kito, who's beaten him 126 times to Tony's 117.",
  ],
}
