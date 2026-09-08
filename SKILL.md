---
name: tncfl-record-book
description: >
  The TNCFL RECORD BOOK (RB) — the standalone all-time archive website for the Thursday Night
  Curse Fantasy League (2011–present), split off from the old combined "TNCFL hub" project so it
  no longer shares a skill/file set with the live 2026 season tracker. Use this skill for ANY work
  on the Record Book: its modern visual redesign, layout/template, charts, season-by-season
  rebuild (2011 forward), the data feed it reads, and its own README/session ledger. Trigger on:
  TNCFL Record Book, RB, the archive site, TNCFL_hub.html's successor, season hub facelift,
  modern hub redesign. This skill SUPERSEDES the old combined "tncfl-website" skill for anything
  that is Record-Book-scoped; that old skill's content is kept only as a legacy build/format
  reference (see "Relationship to the old hub" below) and is NOT the source of truth going
  forward for this project.
---

# TNCFL Record Book (RB)

> **Paired skills (read all three):**
> - `tncfl-hmotw-engine` — the VERIFIED engine + golden record. Every number on the RB comes from
>   here. Never re-type or hand-derive a stat.
> - `collaborative-build-method` — HOW to work with this user on this project. Full text lives in
>   that skill; the load-bearing rules are restated below so this skill is self-contained.
> - `tncfl-website` (legacy, archived) — the OLD combined hub skill. Read-only reference for prior
>   module architecture, prior locked-prose, and design decisions that may still be worth reusing.
>   Its "IN PROGRESS" status and module log describe the OLD file, not this project.

## What changed in the split (2026-09-04)

The old project bundled three different things under one roof: the 15-season archive hub, the
live 2026 season tracker, and the Cloudflare Worker infrastructure. That made the shared skill file
enormous (~1,900 lines) and mixed a "finished, about to be redesigned" archive with an
"in-season, actively changing" tracker. This project (Record Book) is now the archive **only**:

- **In scope:** the 2011–present all-time archive site, its data feed, its logos/PWA files, and
  the two living reference docs (`TNCFL_Scope.html`, `TNCFL_TechRef.html`).
- **Out of scope (stays in the original TNCFL project):** `TNCFL_2026_Tracker.html`, the Sandbox
  file, `TNCFL_2026_TRACKER_RULES.md`, `server.py`'s ESPN-proxy duties, and `worker.js`. Don't pull
  season-2026 work into this project, and don't pull Record Book work into that one.
- **Renamed:** "TNCFL Hub" → **TNCFL Record Book**. Update any new prose, titles, or filenames
  accordingly. The old `TNCFL_hub.html` is carried over unmodified for now — it is the CURRENT
  live site and the reference for "all the data" (18 modules, 15 seasons, verified) until the
  rebuild replaces it season-by-season. Do not treat its filename or its dated visual design as
  the target — both are slated to change.

## The rebuild mandate

The user considers the current Record Book (the old hub) data-complete but visually dated. The
goal is a full front-end facelift — "more immersive, interactive, and modern" — built
**systematically, one season at a time, starting at 2011 and moving forward**, not a big-bang
reskin of all 15 seasons at once.

**Sequencing rule:** no season data goes into the new template until the template itself is
agreed. Build/confirm the empty template (structure, visual design, interaction model) first,
prove it end-to-end on **2011 only**, get it reacted to and locked, and only then move to 2012,
2013, etc. Do not get ahead of the current season under construction.

**Data rule is unchanged from the old hub and is NON-NEGOTIABLE:** every number (scores, tallies,
weekly winners, droughts, streaks, ATDR, payouts) is DERIVED from the verified engine
(`hmotw_engine_aidf` / the golden record referenced by `tncfl-hmotw-engine`) — never hand-typed.
Only prose (recaps, nuggets, narrative) is hand-written, and it stays visibly separated from data.
This is the exact discipline that kept the old hub's 15 years balanced to $0; the redesign does
not get a pass on it just because the visuals are changing.

## Status

🟢 **MILESTONE 15 DONE — 2011 IS THE LOCKED TEMPLATE. MILESTONE 16 IS COMPLETE — ALL 15 SEASONS
(2011-2025) ROLLED OUT across 5 batches, zero code changes needed for any of them. Milestone 14
BUILT. Milestone 9 (simplified) BUILT. Milestone 12 CANCELLED.
Sub-milestones `7a` through `7p` are built.**

🟢 **MILESTONE 20 DONE (2026-09-08) — the nugget layout system was rebuilt from the ground up.**
The `cells`/`stack`/`stackWidth` row-letter CSS-grid model (built across Milestones 7l/59/60) is
**retired for good**, replaced by a flat, per-card authored-pixel-position model
(`colStart`/`colSpan`/`top`/`ownHeight`), matching a new standalone authoring tool
(`nugget-panel/index.html`) built this session specifically for hand-tuning layouts outside the
`npm run dev` loop. `NuggetGrid.tsx` fully rewritten around absolute positioning; `parseGridCells.ts`
deleted; the `Nugget` type changed accordingly. Three explicit, confirmed tradeoffs: fixed 1200px
width (was fluid/responsive — a real regression for other viewport widths, accepted knowingly),
fixed height not `min-height` (accepts a clipping risk in exchange for pixel-exact positioning,
paired with `overflow: hidden`), and — **superseded same day, see Entry 64** — auto-stretch, not the
originally-recorded "no auto-stretch." A panel now stretches to fill dead space below it, capped at
whichever other column-overlapping panel sits closest below it in every column the panel spans,
ported directly from the `nugget-panel-sandbox` tool (which had been applying this the whole time
during Final Layout authoring — the earlier "no auto-stretch" note didn't match what the sandbox
was actually doing). `site_data.json`'s `nuggets` section fully replaced,
both copies, from the user's own hand-arranged layout — all 15 years. Full production build
(`npm run build`) verified clean. **This means every season's nugget section needs the same kind
of fresh visual review 2011 originally got under Milestone 15** — the positioning model changed
completely, so "was reviewed under the old system" no longer carries forward automatically. See
`ROADMAP.md` Milestone 20 and `SESSION_LEDGER.md` Entries 61-63 for full detail. Standing gap,
unchanged and more consequential now than before: no headless-browser access all session (confirmed
network-blocked, not just unavailable) — **no season has ever been visually screenshotted this
entire project**, and that gap now covers a genuinely new rendering model with zero visual
confirmation, not just unreviewed content on a proven template.

**Milestone 16, batch 1 (2012 + 2013):** checked real underlying data for structural edge cases
BEFORE touching code, per the roadmap's explicit call — found genuine exact-score HMOTW ties in
both seasons (e.g. 2012 Week 3: Damian/La at 165.0). Confirmed the engine already splits HMOTW
credit in half for a tie (`hmotw_tally` has real fractional values like 5.5), and confirmed
`ScoreTable`'s weekly-high pill correctly highlights BOTH tied managers (works by construction —
the check is per-row against the week's max, not a single hardcoded winner). A genuinely new visual
state got exercised for the first time (the "diag" pill: a score that's both >=200 AND that week's
high) and rendered correctly. Full top-to-bottom screenshot sweeps of both seasons confirmed every
cross-season panel (Peak Performance, ATDR, Dancing Shoes prose, Season Totals, the Career ledger/
donuts, Competence medals) correctly handles a growing/changing roster (new managers joining,
managers departing mid-history) — see SESSION_LEDGER Entry 46 for full detail.

**Milestone 16, batch 2 (2014 + 2015 + 2016):** same real-data-first check — no partial-season
managers, no nulls, two more genuine 2-way HMOTW ties (2014 Wk13, 2016 Wk17), both correctly split
by the engine. **Surfaced and resolved a real, already-shipped discrepancy in the process:** the
≥200 score-cell pill rule was originally meant to gate to 2017+ only (matching the engine's real
DHMOTW rule, which does nothing pre-2017) but that gate was never implemented, and 2013's already-
rolled-out season has 7 real ≥200 scores rendering the ungated pill. **User's locked call: keep it
ungated on purpose, for visual consistency across every season** — this is now the confirmed rule,
not a bug; see `ROADMAP.md`'s Milestone 4 write-up for the full correction. Verified via direct
data-level checks (this session's sandbox had no network access for a headless-browser download,
flagged explicitly rather than silently skipped) — Peak Performance's Active/Inactive split,
ATDR/Season Totals/Competence derivations, and all 3 years' Dancing Shoes victims cross-checked
against real active-manager-scoped drought data (exact matches). A real screenshot-based visual
pass on 2014-2016 is still worth doing whenever headless-browser access is available, before
treating this batch as fully at parity with 2011-2013's verification bar.

**Milestone 16, batch 3 (2017 + 2018 + 2019):** chosen specifically to exercise DHMOTW (2.0 tally
credit for a sole ≥200 winner) activating for real, since none of batches 1-2 had. 2018's six
DHMOTW-eligible weeks were hand-verified against `hmotw_tally` and check out exactly. 2019
introduced a genuinely new edge case — Bao returning after 5 years inactive, the first comeback
either prior batch had seen — checked that every cross-season status-dependent component
(Peak Performance, ATDR, Drought Bars) recomputes active/departed fresh per-year with no permanent
flag, then proved it with a real `tsc -b` + `vite build` test before committing to the rollout.
See `SESSION_LEDGER.md` Entry 53 for full detail.

**Milestone 16, batch 4 (2020 + 2021 + 2022):** three genuinely new structural variations exercised
for the first time — 18-week seasons (vs 17 every prior year), a manager name with an apostrophe
(D'lyn), and decimal/non-integer scores — all confirmed handled correctly by existing code with no
fix needed (weeks are read dynamically everywhere, no `dangerouslySetInnerHTML` risk from names,
and score formatting/comparison was already decimal-safe). Proved with a real `tsc -b` + `vite
build` test before committing to the rollout. See `SESSION_LEDGER.md` Entry 54 and `ROADMAP.md`'s
Milestone 16 write-up for full detail.

`Layout.tsx`'s sidebar and `lib/lockedYears.ts` both now cover all 15 seasons,
`[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]`.
`Layout.tsx`'s temporary rollout-staging filter has been removed — it now renders
`data.meta.years_desc` directly.

**Milestone 16, batch 5 (2023 + 2024 + 2025) — MILESTONE 16 COMPLETE.** 2025's nuggets turned out
to contain the real hub's own complete "All-Time Season Totals" leaderboard (146 real entries,
authored as a collapsed HTML block) — cross-checked all 146 against `computeSeasonTotals`'s own
derivation for the full 15-season range: zero mismatches, the strongest verification this feature
has had. All 15 seasons now render through the locked 2011 template, each independently verified
against the engine. See `SESSION_LEDGER.md` Entry 55 and `ROADMAP.md`'s Milestone 16 write-up for
full detail. **Headless-browser access resolved (see SESSION_LEDGER.md Entry 65)** — a real
Chromium is now available in-session; the screenshot-based visual pass across 2014-2025 is still
outstanding (not yet done), but is no longer blocked on tooling. Still the top priority for any
future session on this project, before new feature work.

Milestone 9 (manager/week filters) was recapped in full (twice — the panel set had grown from 3 to
8 by the second pass), then dramatically simplified per explicit user request: no individual
manager pills (hover/click-to-pin covers that now), no Clear All, and NO WEEK FILTER AT ALL — just
a plain All Managers/Money Circle 2-state toggle (`ManagerFilterContext` +
`ManagerFilterToggle.tsx`), placed between the info tiles and the scoreboard (not the hub's real
position). A separate, bigger piece of work came with it: a full click-to-pin system layered onto
the existing hover infrastructure (`HoveredManagerContext` now tracks `hovered`/`pinned`/
`displayed`), retrofitted onto all 11 components that show manager names/colors (6 already had
hover; 5 — `AtdrCard`, `CompetenceChart`, `WeekExtremeCard`, `SalaryLedgerTable`, `PeakPerformance`
— had none at all until this pass). Real bug caught and fixed: the background-click-clears-pin
handler needed to live on `.layout-body`, not `.season-page` — the Milestone 7r width cap means
wide-screen side margins are outside both narrower elements. The Money Circle toggle is wired into
all 8 panels the hub's real filter code touches (ScoreTable hides rows; BumpChart/Despair/Spread/
DroughtBars/PeakPerformance/both salary ledgers dim) — EXCEPT BumpChart's race-car sequence itself,
explicitly left unfiltered (restructuring its deeply-interrelated roll-delay/finish-time/animation-
frame hooks was judged too risky for this pass, flagged rather than silently skipped).

Milestone 12 (Superiority Beatdown Index / H2H matrix) will not be built — the user's call, after
the real hub code was read and confirmed fully derivable from already-typed data, was that it
"doesn't provide any meaningful context." Not deferred like Milestone 9 — permanently out of
scope; milestone numbers are not renumbered.

Milestone 13 (Peak Performance Distribution) is built: two 3D-isometric HMOTW-win pyramid charts
(Active/Inactive managers), ported faithfully from the hub's real cross-season engine
(`lib/drawPeakChart.ts`) per explicit user request to build it exactly like the hub, minus the
panel's background/border. For 2011 the "Inactive Managers" panel correctly shows its real empty
state (no departed managers exist yet in year 1) — not a bug, verified against real data.

Milestone 14 (Cumulative Competence Chart) is built. Real naming trap caught before building: the
hub's `CSCC` (Cumulative Salary Cap Contributions — career-spanning ledger + pies) is unrelated to
this milestone; the real target is a small nugget-style points-per-finish leaderboard
(`summary[year].competence`) with hand-drawn medal icons (`MedalIcon.tsx`, ported faithfully, not
simplified). Built as its own standalone component (`CompetenceChart.tsx`, matching Dancing Shoes'
precedent) alongside two new all-time single-week leaderboards (`WeekExtremeCard.tsx`, shared for
Highest/Lowest), all three split evenly 33/33/33 in `SeasonExtremesRow.tsx` — reversing the hub's
real 50/25/25 grid proportions per explicit request. Row count for the two leaderboards is
DYNAMIC, matching Competence's real rendered height via DOM measurement (ported from the hub's real
`sumFitTopWeeks()`) — accepted despite being flagged as the same category of problem as the
Milestone 7l nugget-layout saga, because it's a simpler 1D "rows that fit" problem, not 7l's 2D
masonry placement, and because Competence's list will keep growing as more seasons are added.
Placed below `NuggetGrid`. Dancing Shoes' left accent border also gained `border-radius: 8px` to
match the nugget cards' rounded corners (a follow-up fix rolled into this milestone).

**Two more cards added post-Milestone-14:** All-Time Longest Drought (`AtdrCard.tsx`, real
`meta.hmotw.atdr_snapshots` data) and All-Time Season Totals (`SeasonTotalsCard.tsx` — genuinely
new, no hub markup exists for this as a standalone feature; it was only ever a one-off authored
nugget around 2025). Redefined per the user's explicit request as a dynamic top-15 leaderboard of
every manager-season's final total through the selected year, derived client-side
(`lib/computeSeasonTotals.ts`) since no engine field computes it. Both cards sit in their own 50/50
row directly above the Dancing Shoes/DroughtBars row.

**Career Salary Cap Contributions (CSCC)** — the career-spanning ledger + donut pies flagged as
unrelated during Milestone 14's grounding — is now built too, placed last on the page (after all
existing Salary content). `SalaryDonuts.tsx` and `SalaryLedgerTable.tsx` were generalized (props
for title/subtitle/labels, a shared `LedgerRowLike` row shape) rather than duplicating a second
engine, since the hub's real `renderCSCCPies()` is the identical pie engine reading different data.
Renamed both "Cumulative Salary Cap Contributions" titles to "Career Salary Cap Contributions" per
explicit request (pie-box titles "Cumulative Winners/Losers" were not part of that rename).
`cumulative` is now properly typed (`CumulativeRow`, was `unknown`).

**Milestone 9 history:** originally recapped against the hub's real filter logic, then deliberately
set aside until after 14 — by then every filter-reactive panel the hub has would exist in the RB.
Revisited and built (in simplified form) once 14 was done — see the Milestone 9 section above.
**Sub-milestone numbering convention:** incremental fix/polish rounds between two numbered
milestones get lettered — `7a` through `7p` so far — off the milestone they follow, rather than
being their own planned milestone. See `ROADMAP.md`'s `Milestone 7a`–`7p` entries for exactly
what's in each round: `7a`–`7e` cover the font/color systems, layout fixes, hero-sparkline
refinement, scroll fixes, sticky header/rail, and the dissolve effect; `7f` covers the football
transition artwork; `7g` covers the stat tiles restyle and score-cell pill system; `7h`–`7i` cover
the BumpChart's full rebuild, the F1 car's design journey, the race finish-time math, the
checkered finish line, and the complete 4-stage race intro sequence (roll-up, countdown, burnout
smoke, race playback) with a working Replay button; `7j` covers the sticky football image and
DroughtBars' real bar-color logic + full panel styling match; `7k` covers panel titles matched
project-wide via shared global CSS, plus DroughtBars' title/subtitle split; `7l` covers the long
nugget-layout saga — two full algorithmic-layout attempts (character-count estimation, then real
DOM measurement) that each surfaced genuine bugs on data beyond the one season tuned against,
ultimately reverted in favor of the old hub's own authored per-nugget grid position, plus a real
row/column transposition bug fix and the page-turn entrance animation; `7m` covers the race firing
once per season-navigation (not on rescroll) and SalaryDonuts rebuilt as a faithful canvas port of
the old hub's real 3D-extruded pie engine; `7o` covers body-text sizing; `7p` covers three fixes
from the same round (originally logged as separate letters, later consolidated into one at the
user's request): ScoreTable click-to-sort (default alphabetical, descending-first on Week/Total,
resets on season change) plus moving `Total` to right after `Manager`; the nugget card
title's font corrected to match the old hub's real `.nugget h4` exactly (`--font-sans` at weight
600, `#e8e8e8`, was incorrectly `--font-black`/`#f2f2f0`) — title only, the 15px body-text size from
`7o` is unchanged; and the content column's width capped to match the hub exactly
(`max-width:1250px; margin:0 auto; padding:24px`, replacing the previous uncapped
`padding:40px 48px`) — the RB's timeline rail itself is unaffected, since the hub has no rail to
compare against. **Milestone 10** (built this round, verified against real 2011 payout data) adds
`SalaryRulesCard.tsx` (Pools & Fees / Prizes grid — 3-way vs 4-way split + ring bonus handled
exactly as the hub does, but laid out per the user's explicit override: card first at 60%, logo
second at 40%, reversed from the hub's logo-first/30% layout) and `SalaryLedgerTable.tsx` (all 16
real columns, hub's real grouping/widths/money-formatting rules, own click-to-sort with a ▲/▼
indicator). Both sit directly below `NuggetGrid` — a deliberate departure from the hub, where the
rules card sits near the top and the ledger sits right before the donut pies. ScoreTable also
gained a ▲/▼ sort indicator retroactively (reversing 7p's "no indicator" call) so both sortable
tables stay consistent; the ledger's manager-filter row-dimming CSS (`.faded`) is built but
dormant, with no filter to drive it until Milestone 9 is revisited. **Milestone 11** adds
`ScoringSpreadIndex.tsx` and `DespairDifferential.tsx`, placed between BumpChart and DroughtBars
(matching the hub's relative chart ordering) but with Spread explicitly ABOVE Despair — reversed
from the hub. Despair's Money-Circle line/dot emphasis and dashed cubic trend line (`polyfit3`)
were dropped per the user's call — both charts now use a uniform 2px line / 2.5px dots (Despair)
and 2.5px dots (Spread, was the hub's uniform 3px). Spread's league-average line/label recolored
from the hub's brand red to the RB's established mustard (`#d9a521`). Both charts keep the shared
`ManagerHoverCard` on hover AND add back a small per-dot tooltip (new shared `ChartTooltip`
component) — the only two charts where the hub's original per-chart tooltip pattern was restored
alongside the shared card, per explicit user request. The React+Vite project
lives in `tncfl-record-book/` (real source, not yet a build artifact) — scaffold, routing,
hero/score-table, motion/scroll-reveal, all three original charts, the reusable manager hover-card,
the recap/nuggets/Dancing Shoes content, and the site branding header are all built and
individually verified against real 2011 data (see `ROADMAP.md` for full per-milestone detail).
**A visual survey against four old-hub screenshots found the roadmap covered only about half of the
old hub's actual 2011 page** — the six still-unbuilt sections above (plus the now-built Milestone 8)
were all missing from the plan entirely. User's call: insert all seven as new
numbered Milestones 8–14 now (planning only), pushing the full review & lock to Milestone 15 and
shifting everything after it accordingly. See `ROADMAP.md` for each new milestone's scope and data
notes.

**Known deferred item (not a 2011 bug):** 2025's "All-Time Season Totals" nugget needs a dynamic
row-reveal matching a sibling card's height (the old hub's `sumFitTopSeasons()`) — real work only
once Milestone 16 reaches 2025.

**Sidebar is temporarily restricted to 2011 only** (`Layout.tsx` filters `years_desc` down to just
2011) — restore the full list once more seasons are actually being built, per the project's
explicit one-season-at-a-time rule.


**Carried-over reference material (not the new design target, just useful raw material):**
`TNCFL_hub.html` (current live site, all 15 seasons, 18 modules, engine-verified — still the thing
to check the React rebuild's numbers against), `site_data.json` (the data feed both the old site and
the new React app read — do not hand-edit, it's generated by the pipeline described in
`tncfl-hmotw-engine`), the logo assets, and the PWA files (`manifest.json`, `sw.js`, icons).
`TNCFL_Scope.html` / `TNCFL_TechRef.html` are living docs about the OLD hub's architecture — they
describe the site being replaced and will need a pass once the new template is locked (see "Living
docs" below).

## NON-NEGOTIABLE: HOW TO ASK QUESTIONS (user-mandated, locked — carried over unchanged)

When clarification is needed during ANY Record Book work, ALWAYS use the `ask_user_input_v0` tool
with tappable `single_select` options. NEVER ask questions in prose. NEVER ask more than one
question at a time. One question → 2–4 options → wait for answer → proceed. No exceptions.

## STANDING REQUIREMENT — ALWAYS SHOW A RENDERED PREVIEW (user-mandated, carried over)

The user always wants to SEE a visual preview before reacting to or locking any change — never
just a description or a verification log. After any change that affects what the Record Book
looks like, render the affected part (screenshot via headless Chromium, or present the built HTML)
and show it, THEN ask for the react/lock decision. Once the rebuild starts producing an actual
site file, present the FULL built page, not just a module close-up, every time — a module-only
screenshot is a fine supplement, not a replacement.

## Collaboration method (restated from `collaborative-build-method`)

1. **Never infer — stop and ask** (tappable, one at a time; see rule above).
2. **Spar honestly.** If a design or data proposal has a flaw or a better alternative exists, say
   so and argue it before building. Argue against your own suggestions too.
3. **Derive, don't editorialize.** Any stat or count comes from a real check against the engine —
   never mental math, never impression.
4. **Verify every derived output against the user's records** before it's treated as correct.
5. **Build incrementally.** Template before data. One season before the next. The rule before the
   chart.
6. **Lock and document.** Once something is confirmed, capture the decision here (or in the
   session ledger) so it isn't re-litigated next session.

## Roadmap

`ROADMAP.md` is the milestone-by-milestone build plan: Milestone 0 is a throwaway React/Vite
warm-up exercise, Milestones 1–7 built the first pass of the 2011 template (scaffold → routing
shell → functional parity → motion → charts → hover-card → recap/nuggets/Dancing Shoes), Milestones
8–14 are seven newly-identified sections (found by surveying the old hub's actual 2011 page against
four screenshots) — site branding header (built), manager/week filters (deferred), salary rules
card + full ledger table (built), Despair Differential + Scoring Spread Index (built), the
Superiority Beatdown Index / H2H matrix (CANCELLED — user's call, no meaningful context), Peak
Performance Distribution (built), and the Cumulative Competence Chart (built). Milestone 15 is the full review &
lock (pushed back from its original
number 8 to make room for those seven), Milestone 16 rolls the locked template out across
2012–2025, and Milestones 17–19 cover the League/
Hall of Fame section, PWA/deploy, and a final polish pass. It's also where the user's explicit
"learn React/Vite along the way" goal lives — each milestone flags which concepts carry over
directly from the Wanderlog project (routing, `useState`/`useEffect`, CSS Modules, Context,
`vite-plugin-pwa`) vs. which are genuinely new (custom hooks, scroll-driven animation via
IntersectionObserver + Framer Motion, reconciling D3 with React's rendering model). Keep this file
current as milestones complete — check off / annotate status rather than letting it drift from
actual progress.

## Applying this elsewhere (post-RB)

Full reasoning lives in `ROADMAP.md`'s closing section. Short version: **Hanh's Chord Book** is the
strongest next candidate for a React/Vite rebuild — it shares the same single-file/custom-build-
script/hand-templated-HTML architecture the old hub had, and several of its locked rules (E26, E27,
L13, the `node --check` guard) exist only because of that architecture and would likely disappear
under React+TypeScript. The **2026 Tracker** is architecturally similar but is a live in-season file
right now — lower priority until the off-season.

## Living docs

`TNCFL_Scope.html` and `TNCFL_TechRef.html` were written as living documentation of the old hub
(product overview / full dev reference) and are carried over as-is for now. Once the new template
is locked and 2011 is rebuilt, both need a rebrand-and-update pass (Hub → Record Book naming, new
architecture description, new visual language) — flagged here so it isn't forgotten, per the
carried-over living-doc rule: update them when a change materially affects their documented facts;
skip updates for cosmetic/prose-only tweaks.

## Technical approach — LOCKED (2026-09-04)

**Decision: rebuild as a React application with a build step, not a continuation of the old
Python-assembled/vanilla-JS architecture.** The user's explicit reasons: they want to invest real
time in this redesign and want it to double as a chance to learn React, and the interaction model
they want (a persistent timeline rail, reusable "season chapter" and "manager hover card"
components, animated reveals) is a better fit for a component framework than for hand-wired DOM
code. This was a deliberate tradeoff, sparred out loud before locking it — the alternative
(same no-build-step model, swap canvas→SVG/D3 + add scroll animation) would have been faster to
ship and required no new tooling, but the user chose to accept the added build-pipeline
/deployment complexity in exchange for a real component codebase and the learning goal.

**Consequences to plan for (not yet resolved, revisit when scaffolding starts):**
- A build tool (e.g. Vite) is needed; local dev moves away from `python server.py` opening the
  HTML directly to running a dev server instead.
- GitHub Pages deployment gains a build step — publish the built output, not raw source, and the
  existing GitHub Actions deploy flow (`tncfl/` → `docs/`) will need updating for this project once
  the RB has its own repo/deploy path.
- `site_data.json` / the runtime-fetch data layer can very likely be kept as-is as the data source
  a React app fetches from — the engine-driven-data rule doesn't change just because the rendering
  layer does. Confirm this when the first component is scaffolded, don't assume.
- Reusable component candidates identified from the design discussion: a manager hover-card, a
  season-chapter container, a timeline-rail navigation component. These are candidates, not yet
  designed or locked as an API/props shape.

## Design direction — CONFIRMED and LOCKED (2026-09-06, Milestone 15)

The scrollytelling/season-chapter concept proposed early in this project (timeline rail replacing
tabs, hero-stat-first season chapters revealed on scroll, hover cards for managers everywhere,
animated counters/chart transitions) was confirmed by the user via an inline mockup blending
FiveThirtyEight-style storytelling with Baseball Savant-style data density, and has since been built
out for real across Milestones 0-14 plus Milestone 9 (simplified) — see `ROADMAP.md` for the full
build/verification detail per milestone. Reference sites used for the original inspiration pass:
pudding.cool, NYT's "Snow Fall," Scrollama.js, Baseball-Reference (contrast case), NFL Next Gen
Stats, Baseball Savant, NBA.com/stats, and Linear.app. Milestone 15 (2011's full review and lock)
is DONE — the user reviewed a complete top-to-bottom render of the 2011 page and confirmed it as
the locked template for every remaining season. A "LOCKED" badge (green pill, matching the hub's
real `.lock-badge` styling) now renders next to a formally-reviewed season's eyebrow line —
currently just 2011 (`lib/lockedYears.ts` — a plain per-season list, added to as each subsequent
season passes its own review during Milestone 16).

**Template vs 2011-specific** (so Milestone 16 doesn't accidentally copy something that shouldn't
generalize): every COMPONENT, layout position, panel ordering, sub-milestone decision (widths,
accent colors, dim/hide rules, height-matching logic, etc.) is template — reusable as-is for every
season. What is NOT template, and must come from that season's own real data every time: the
recap's prose/title/subtitle (`data.recaps[year]`), the Dancing Shoes roast body (`data.dance[year]`),
every NuggetGrid card's title/body/position (`data.nuggets[year]` — as of Milestone 20, authored
`colStart`/`colSpan`/`top`/`ownHeight`, not a grid-cell string), and the LOCKED badge's
inclusion itself (an editorial per-season decision, not automatic). Everything else — ScoreTable,
BumpChart, the salary tables/donuts, ATDR, Competence, Season Totals, Peak Performance, the Money
Circle toggle, click-to-pin — reads whatever season/year is selected and needs no per-season
authoring beyond the underlying data already in `site_data.json`.

