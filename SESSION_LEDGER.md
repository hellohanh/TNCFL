# TNCFL Record Book — Session Ledger

Locked change log for the Record Book project only. Numbering restarts at Entry 1 — this is a new
project split off from the original TNCFL session ledger (which continues separately for the 2026
Tracker / Worker work).

---

## Entry 1 (2026-09-04) — Project split from the original TNCFL hub

**Context:** the original TNCFL project combined the 15-season archive hub, the live 2026 season
tracker, and the Cloudflare Worker under one skill/README/ledger set (see original project,
Part 23 / Entry 87). The user asked to split the archive out into its own project — the **TNCFL
Record Book (RB)** — ahead of a full visual/interaction redesign, renaming "TNCFL Hub" to "TNCFL
Record Book" in the process.

**What was carried over from the original project's zip** (`S023_2026-09-04_TNCFL_Tracker.zip`),
unmodified: `TNCFL_hub.html`, `site_data.json`, `header_logo.png`, `salary_logo.png`,
`h2h_logo.png`, `manifest.json`, `sw.js`, `icon192.png`, `icon512.png`, `icon_generator.py`,
`server.py`, `TNCFL_Scope.html`, `TNCFL_TechRef.html`. Verified the standalone `TNCFL_hub.html`
uploaded this session is byte-identical to the copy inside the tracker zip — one source of truth,
no divergence to reconcile.

**What was deliberately left behind** in the original project (not part of Record Book going
forward): `TNCFL_2026_Tracker.html`, `TNCFL_2026_Sandbox.html`, `TNCFL_2026_TRACKER_RULES.md`,
`worker.js` (which was never in this project's files to begin with — it lives only in the
Cloudflare dashboard).

**New docs written for this project** (this entry): `SKILL.md`, `README.md`,
`SESSION_LEDGER.md` (this file). Sourced the collaboration method (never infer / tappable
questions / spar honestly / derive-don't-editorialize / verify-against-records) and the
always-show-a-rendered-preview standing rule from the original project's `SKILL.md`, carried over
verbatim since the user asked for the same working style on this project.

**Rebuild plan set this session:** modernize the Record Book's visual design and interactivity.
Sequencing is template-first: agree on the new design/template with no season data attached, prove
it on **2011 only**, lock it, then proceed forward one season at a time (2012, 2013, ...). A
design-direction proposal (visual style, layout, interaction model) was drafted in chat for the
user's review; not yet confirmed as of this entry.

**Open question raised, not yet answered:** whether the rebuild reuses the old hub's technical
approach (single HTML file assembled by `build_hub.py` from per-chart `modules/*.js` files, data
fetched at runtime from `site_data.json`) or takes a different technical approach as part of the
modernization. This determines how the "Technical approach" part of the template proposal gets
finalized.

**Status at end of entry:** 🟡 Template phase, awaiting user reaction to the design-direction
proposal and to the open architecture question above. No `.md` file yet contains a locked template
— once the user confirms, update `SKILL.md`'s "Status" section with the final spec and update this
ledger with a new entry recording the lock.

---

## Entry 2 (2026-09-04, cont.) — Technical approach locked: React + build step

**Decision:** the user reviewed the option-2-vs-option-3 tradeoff (spelled out in chat: no-build
vanilla/SVG modernization vs. a React rebuild with a build step) and chose **React (Option 3)**
explicitly — stated reasons were wanting to invest real time in the redesign and wanting to learn
React along the way, on top of it being the better technical fit for the timeline-rail /
season-chapter / hover-card interaction model. Recorded as LOCKED in `SKILL.md` under "Technical
approach," including the consequences flagged for later (build tooling, GitHub Pages deploy flow
changes, confirming `site_data.json` stays the data source, and the three candidate reusable
components: manager hover-card, season-chapter container, timeline-rail nav).

**Inspiration gathered, at the user's request** ("find data heavy websites similar to mine, sports
if possible"): shared pudding.cool, NYT "Snow Fall," Scrollama.js, and Baseball-Reference in the
first pass (scrollytelling technique + a table-first contrast case); then NFL Next Gen Stats,
Baseball Savant, NBA.com/stats, and Linear.app in a second pass focused on data-heavy sites closer
to the RB's own domain. None of these have been reacted to by the user yet as of this entry — the
design/template itself is still NOT locked, only the technical approach is.

**Status at end of entry:** 🟡 Template phase continues. Technical approach (React) is locked.
Visual/interaction design is still an open proposal awaiting the user's reaction to both the
original design-direction pitch and the inspiration sites just shared. Next step once the user
responds: either refine the design proposal against what they liked/disliked in the reference
sites, or move to scaffolding the React app skeleton if they're ready to lock the template as-is.

---

## Entry 3 (2026-09-04, cont.) — Wanderlog compared; roadmap + educational plan written

**Context:** the user uploaded their existing React project, Hanh's Wanderlog (a trip-tracking
app: Vite + React + TypeScript, `react-router-dom`, Supabase auth/database, Google Maps SDK,
`@dnd-kit` drag-and-drop, ~4,900 lines, 56 `useState`/18 `useEffect`/10 `useMemo` calls across its
components), and asked whether the Record Book's React usage would be similar in level. Answer
given: foundational React (components/props/`useState`/`useEffect`/`useMemo`/TypeScript typing)
carries over directly, but the specific skills differ — Wanderlog is backend/auth/maps/drag-and-
drop heavy; the RB will be data-visualization and scroll/motion-choreography heavy instead. Neither
codebase inspected has an obviously higher total-effort ceiling; they're just pointed at different
specialties.

**Roadmap written:** `ROADMAP.md` (new file), 12 milestones (0–11) covering a React/Vite warm-up
exercise, scaffold, routing shell, 2011 functional parity, motion pass, chart components, the
reusable manager hover-card, the full 2011 review/lock, the 2012–2025 rollout, the League/Hall of
Fame port, PWA/deploy, and a final polish pass. Each milestone flags which concepts reuse
Wanderlog's existing patterns (routing, CSS Modules, Context, `vite-plugin-pwa`) vs. which are
genuinely new (custom hooks, IntersectionObserver + Framer Motion scroll animation, reconciling D3
with React). `SKILL.md` and `README.md` updated to reference it.

**"Apply elsewhere" analysis (user asked to look at other projects):** read `hanh-chord-book`'s
`SKILL.md`. Identified it as the strongest next candidate for a React/Vite rebuild post-RB — it has
the same single-file/custom-build-script/hand-templated-HTML architecture the old hub had, and
several of its locked rules (E26, E27, L13, the `node --check` guard) exist specifically because of
that architecture and would likely disappear under React+TypeScript. Flagged the 2026 Tracker as
architecturally similar but lower priority since it's a live in-season file right now (draft Sep 7,
kickoff Sep 9) — revisit in the off-season.

**Status at end of entry:** 🟡 Template phase. Roadmap now exists; visual/interaction design still
awaiting the user's reaction to the design proposal and inspiration sites from Entry 2. Next
concrete step per the roadmap is Milestone 0 (a throwaway React/Vite warm-up exercise) whenever the
user is ready to start building rather than continuing to plan/react to references.

---

## Entry 4 (2026-09-04, cont.) — Stop protocol run; project folder recorded

**Project folder recorded:** the user's local copy of this project lives at
`\\10.0.0.198\UG_Websites\Websites\TNcFL Record Book` (a network share). Added to `README.md`'s
"Current State" and resume prompt so future sessions know where the user keeps these files.

**Docs synced:** `README.md`'s "Current State" and resume prompt rewritten to reflect everything
locked so far (React+Vite technical approach, `ROADMAP.md` existing, design proposal still
unconfirmed, post-RB plan for Chord Book/2026 Tracker). No new rule changes to `SKILL.md` this
entry — it was already current as of Entry 2's edits.

**Zip built:** `S001_2026-09-04_TNCFL_RecordBook.zip` — first zip under this project's own,
separate numbering sequence (does not share a counter with the original TNCFL project's `S0XX`
zips, but follows the identical filename pattern/casing: `S0XX_YYYY-MM-DD_TNCFL_<Label>.zip`, no
extra prefix). Contains: `SKILL.md`, `README.md`, `SESSION_LEDGER.md`, `ROADMAP.md`,
`TNCFL_hub.html`, `site_data.json`, `header_logo.png`, `salary_logo.png`, `h2h_logo.png`,
`manifest.json`, `sw.js`, `icon192.png`, `icon512.png`, `icon_generator.py`, `server.py`,
`TNCFL_Scope.html`, `TNCFL_TechRef.html`. No standalone rebuild file to deliver alongside it — no
React code exists yet as of this stop.

**Status at end of entry:** 🟡 Template phase, stopped cleanly. Next session should either react to
the design proposal/inspiration sites to lock the template, or jump straight to Milestone 0 if
ready to start building.

---

## Entry 5 (2026-09-04, cont.) — Milestones 0–3 built and verified

**Milestone 0 (React/Vite warm-up):** scaffolded a throwaway `rb-warmup` Vite+React+TS project
outside this project's real codebase. Built a `SeasonCard` component taking typed props, confirmed
HMR live (screenshot), and confirmed via a live debugging exchange with the user that `npm run dev`
does NOT type-check (Vite strips types) — only the editor (once VS Code's Restricted Mode was
disabled) and `npm run build`'s `tsc -b` step catch type errors. Verified end-to-end: user deleted
an interface, saw `npm run build` fail with the exact expected error, restored it, saw it pass.

**Milestone 1 (project scaffold + typed data layer):** real `tncfl-record-book` project created.
`src/types/data.ts` typed directly against the real `site_data.json` (inspected via Python, not
guessed) — `Season`, `Recap`, `Nugget`, `DanceCard`, `Meta` (manager_colors only). Deliberately left
`career`, `h2h`, `all_time_scores`, `streaks_at_1`, `payouts`, `cumulative`, and most of
`meta.hmotw` as `unknown` — real data, just not needed yet. `useRecordBookData.ts` (fetch hook) +
a throwaway `DataVerification.tsx` proved the pipeline. Verified: user ran it locally, confirmed
Bao's scores/cum_points and every manager's HMOTW tally against the old hub's 2011 section.

**User asked directly whether `site_data.json` includes weekly scores + transaction/trade
history.** Answered precisely: weekly scores yes (confirmed both 2011 and 2025 have the same
shape), transaction/trade history is aggregate COUNTS only (`career[m].trans/.trades`,
`payouts[year].rows[i].trans/.trades`) — no per-transaction log exists in this data. User confirmed
season-end totals are all that's wanted, so no gap to fill.

**Milestone 2 (timeline rail shell):** `react-router-dom@^6.26.0` installed. `TimelineRail.tsx`
(NavLink-based, active state from the URL itself), `Layout.tsx` (`<Outlet context={data}/>`),
`SeasonPage.tsx` (placeholder shell reading `useParams`/`useOutletContext`). Verified via headless
browser: `/` redirects to the most recent season, clicking a year navigates correctly, and direct
deep-linking to `/season/2017` resolves correctly (all three confirmed via screenshot + URL checks,
not just "it builds"). User then asked whether it was intentional that all 15 seasons render, not
just 2011 — answered honestly: yes, side effect of the component being generic and the data feed
already containing all 15 seasons, not a deliberate build-ahead. User's call: leave it, but only
2011 counts as reviewed; logged in `ROADMAP.md`.

**Milestone 3 (2011 functional parity):** `useSeasonSummary.ts` (first computed-value hook, via
`useMemo`) derives season champion + highest single week from real per-week data, cross-checked
against `career['Hanh'].pts['2011']` before trusting it. `ScoreTable.tsx` (real week-by-week grid,
weekly-highs bolded from the engine's own `weekly_high` field) + `SeasonHero.tsx` (hero-stat-first
moment). Verified via headless browser against real 2011 numbers (champion Hanh 1952.0, highest
week Kito 168.0 in Week 14) — user then did their own spot check against the old hub and confirmed.

---

## Entry 6 (2026-09-04, cont.) — Milestones 4–5 built and verified; score-cell color coding derived and deferred

**Design direction confirmed before building, per the sequencing rule:** user asked to see an
inline preview blending FiveThirtyEight-style storytelling with Baseball Savant's data density
before any Milestone 4 code was written. Built a live inline mockup (Visualizer widget) with a real
scroll-triggered reveal demo; user confirmed it as a good foundation.

**Milestone 4 (motion & scroll pass):** `useInView.ts` (real `IntersectionObserver` hook, fires
once), `RevealOnScroll.tsx` (Framer Motion `motion.div` + `useReducedMotion()` check — skips
animation entirely if the OS reduced-motion setting is on), `AnimatedNumber.tsx` (Framer Motion's
imperative `animate()` for the count-up). `SeasonHero.tsx` rewritten with a real SVG sparkline
plotted from the champion's actual `cum_points`. Verified: counter genuinely animates 0.0→1952.0;
forced a short (340px) viewport to confirm the dense section is genuinely hidden pre-scroll and
reveals correctly, since at normal viewport heights 2011's content is short enough to already sit
near the fold (not a bug).

**Milestone 5 (chart components):** surfaced a real scope conflict before building — drought bars
and salary donuts need `payouts` and part of `meta.hmotw`, both deliberately `unknown` since
Milestone 1. Resolved by typing only the 2011-relevant slices (`PayoutRow`/`PayoutsEntry` in full,
`HmotwMeta.drought_snapshot` only), leaving the rest deferred to (what is now, post-renumbering)
Milestone 10. Built `BumpChart.tsx` and `SalaryDonuts.tsx` as hand-rolled SVG (explicitly chose NOT
to use D3 — the shapes are simple enough that D3's helpers aren't worth the integration cost) and
`DroughtBars.tsx` as plain sized divs. Verified against independently-checkable facts: bump chart's
final rank order matches the score table; drought bars show La at 14 weeks matching the old hub's
actual "Dancing Shoes" text; donuts balance exactly ($572 winners = $572 losers, matching
`payouts['2011'].balanced: true`).

**Score-cell color coding (from a 2024 old-hub screenshot):** user asked whether to build this now.
Identified the screenshot as 2024 (totals matched exactly), then derived the FULL color rule from
real per-week 2024 data (not guessed): blue = score < 100; gold = that week's outright high AND
<200; red/gold split = that week's outright high AND ≥200 (the engine's DHMOTW rule, visible); red
= ≥200 but not that week's high. Caught and corrected an off-by-one week-column misread mid-
verification before confirming the rule. Must gate the ≥200 styling to 2017+ only (engine rule:
DHMOTW does nothing pre-2017). **User's call: defer to a later polish pass** — logged in full in
`ROADMAP.md` so the derived rule doesn't need to be re-derived later.

---

## Entry 7 (2026-09-04, cont.) — Milestone 6 built and verified (manager hover-card)

`HoveredManagerContext.tsx` (same shape as Wanderlog's `AuthContext`) wraps the ENTIRE app in
`App.tsx`, outside the router. `useManagerHover.ts` for single-manager components.
`ManagerHoverCard.tsx` — fixed-position card using Framer Motion's `AnimatePresence` for the first
time (needed specifically to animate an element OUT, which normal React can't do). Card shows
2011-season-scoped stats only (rank, points, HMOTW tally, drought, net) — a real career "vs the
field" comparison needs `career`/`h2h`, still deferred.

**A real bug caught before shipping:** the first pass called `useManagerHover()` INSIDE a `.map()`
in `ScoreTable` — a genuine Rules-of-Hooks violation (hook calls must run the same number of
times/order every render; a hook inside a loop breaks that the moment the list's length changes).
Fixed by reading `useHoveredManagerContext()` ONCE at the top of all four list-based components
(`ScoreTable`, `BumpChart`, `DroughtBars`, `SalaryDonuts`) and building each item's handlers as
plain functions instead.

**Verified via headless browser:** hovering "Kito" in the score table simultaneously highlighted
Kito's bump-chart line, bolded the Kito drought-bar row while dimming others, dimmed the other
donut slice, and showed the correct card (#2, 1924.0, 3 tally, 3w drought, +91 net). Repeated
starting from the bump chart's own label to confirm the shared state works bidirectionally.

---

## Entry 8 (2026-09-04, cont.) — Roadmap gap found and fixed: Milestone 7 inserted, renumbered

**User asked directly** whether any milestone covered the recap prose, nuggets, and Dancing Shoes.
Checked `ROADMAP.md` directly rather than relying on memory — confirmed there was a real gap: only
`recap.title`/`.subtitle` were ever used (Milestone 4's `SeasonHero`); `data.nuggets` and
`data.dance` were typed since Milestone 1 but nothing had ever rendered them. Flagged as a real
problem since the old (soon-to-be-renumbered) Milestone 7 — "2011 full review & lock" — would have
declared 2011 complete while missing three real content pieces.

**User's call: insert as the new Milestone 7, renumber the rest down.** Old Milestones 7–11 became
8–12 (renumbered via `sed` on the header lines, verified with a grep pass afterward). All internal
cross-references to the old Milestone 9 (League/Hall of Fame — the reason certain data was left
`unknown`) were found and corrected to point at the new Milestone 10, in `ROADMAP.md`, `SKILL.md`,
and `README.md`.

---

## Entry 9 (2026-09-04, cont.) — Milestone 7 built and verified (recap, nuggets, Dancing Shoes)

`RecapBody.tsx` (renders `recap.body` under the hero, not gated behind scroll-reveal — part of the
immediate story read). `parseGridCells.ts` (converts nugget's spreadsheet-style `cells` strings like
`"A1:A4"` into real CSS grid-column/grid-row values; computes the grid's own dimensions from the
actual data rather than hardcoding 2011's 4-column shape). `NuggetGrid.tsx` (accent-color map for
six color words seen so far, gray fallback for anything unrecognized). `DancingShoes.tsx` (wired
into the shared hover context). All three render body text via `dangerouslySetInnerHTML` since the
recap/nugget/dance strings contain real hand-authored inline HTML — documented in-code exactly why
that's safe here (trusted project data) and where it would NOT be (user-submitted content).

**A genuine test-methodology catch, not a real bug:** an initial "jump straight to bottom"
screenshot showed several sections (stat tiles, score table, bump chart, drought bars/dance)
completely missing. Traced to `IntersectionObserver` never getting an intermediate frame during an
instant `scrollTo` jump — re-verified with gradual, incremental scrolling (simulating a real mouse
wheel/trackpad) and every section revealed correctly. Logged as a known (rare) edge case: an
instant "jump to bottom" shortcut could theoretically skip a reveal; normal scrolling never
triggers it.

**Verified:** recap's six paragraphs render with bold emphasis intact; nugget grid's layout matches
the real data's cell positions exactly; Dancing Shoes shows La at 14 weeks, consistent with the
drought bars beside it.

---

## Entry 10 (2026-09-04, cont.) — Stop protocol run

**Docs synced:** `SKILL.md`'s "Status" and "Design direction" sections rewritten to reflect
Milestones 0–7 actually built (previously still described the pre-build template-phase state).
`README.md`'s "Current State," file map (added `tncfl-record-book/`, the real React source), and
resume prompt rewritten to match.

**Zip built:** `S002_2026-09-04_TNCFL_RecordBook.zip`. Contains everything from `S001` plus the
current `tncfl-record-book/` React project source (no `node_modules`/`dist` — those regenerate via
`npm install`/`npm run build`).

**Status at end of entry:** 🟢 2011 in progress, stopped cleanly. Milestones 0–7 built and verified.
Next session's concrete step is Milestone 8 — the full review and lock of 2011 as the template.

---

## Entry 11 (2026-09-05) — Visual survey against 4 old-hub screenshots: 7 missing sections found

User provided 4 screenshots of the old hub's real 2011 page (header/nav, recap, salary rules card,
score table, draft-day-burnout; despair differential, scoring spread index, H2H matrix, peak
performance pyramids; drought bars, full salary ledger, cumulative salary; nugget grid, all-time
drought leaderboard, dancing shoes, competence chart, all-time high/low leaderboards). Full
top-to-bottom inventory built comparing every section against what's actually built — found the
roadmap covered only about half the real page. Seven genuinely missing sections identified: site
branding header, manager/week filters, salary rules card + full ledger table, Despair Differential
+ Scoring Spread Index, Superiority Beatdown Index (H2H matrix), Peak Performance Distribution,
Cumulative Competence Chart. Two good findings surfaced while scoping these: the H2H matrix and the
Despair/Spread charts need NO new data typing (fully derivable from already-typed `season.scores`),
and `summary[year].competence` already exists as a named (if untyped) field, meaning the
points-per-finish table should be typed and used rather than reimplemented client-side.

**User's call: insert all seven as new Milestones 8–14 (planning only), pushing full review & lock
to Milestone 15.** Renumbered old Milestones 8–12 up to 15–19 via `sed`, verified with a grep pass.
All stale cross-references (old "Milestone 9/10" pointing at Hall of Fame) found and corrected to
point at the new Milestone 17, across `ROADMAP.md`, `SKILL.md`, `README.md`.

---

## Entry 12 (2026-09-05, cont.) — Font system, manager-color lock-in, old-hub CSS extracted

**Fonts:** user uploaded 4 licensed font files (Segoe UI regular/bold, Segoe UI Black
regular/italic). Verified real name-table metadata via `fontTools` before use (not trusted from
filenames alone) — confirmed exactly Segoe UI 400/700 and a SEPARATE Segoe UI Black family at
900/900italic. Flagged (not blocked) a real licensing consideration: Segoe UI's standard Microsoft
license has historically restricted web-embedding specifically. User's type-pairing decision: Segoe
UI Black for all header-type items, Segoe UI for body/UI text. Built `fonts.css` (`@font-face`
declarations) + CSS variables (`--font-sans`, `--font-black`, `--font-mono`) in `index.css`. A real
mistake caught mid-build: a careless full rewrite of `index.css` accidentally deleted all of
Milestone 2's layout CSS along with the font addition — caught and restored properly merged.
Verified via `document.fonts.check()` that both families actually loaded, not just referenced.

**Manager colors:** user asked whether the old hub's per-manager color system (`meta.manager_colors`
+ `meta.reserve_colors`) was visible in the data — confirmed via grep across the old hub's actual
JS (14+ separate usage sites) plus the real data file. Then asked to use the EXACT same colors —
this was already de facto true across every chart; formally locked as a documented rule (verified
byte-exact via computed-style checks, e.g. Hanh `#FF9900`), with a clear line drawn between this
(per-manager identity color) and the separate, still-unresolved threshold colors (2024 score-badge
rule, drought two-color threshold, H2H dominance gradient).

**Old hub CSS:** user asked whether the old hub's CSS was still available — extracted from
`TNCFL_hub.html`'s single embedded `<style>` block (37,908 chars) into a standalone `old_hub.css`.
Cross-check revealed the old hub's own `.recap-title` used bold Segoe UI (800), NOT Segoe UI Black
— unlike what had just been built for `SeasonHero`'s headline. User's call, confirmed: keep it as
Black, a deliberate upgrade over the old hub, not a bug to fix.

---

## Entry 13 (2026-09-05, cont.) — Layout containment/width fixes; hero sparkline rebuilt three times

**User asked "what is the minimum width of the table"** — measured directly (not guessed): a hard
953px floor, tested across viewports from 400–2000px. Investigating this surfaced a REAL bug: below
~1049px viewport width, the whole PAGE scrolled horizontally instead of just the score table's own
`overflowX:auto` wrapper. Root cause: flex items default to `min-width: auto`, refusing to shrink
below content's intrinsic width. Fixed with `min-width: 0` on `.layout-content`. Separately, three
components (`RecapBody`, `DancingShoes`, `SeasonHero`'s subtitle) had leftover arbitrary `max-width`
values producing a "staircase" look the user flagged from a screenshot — removed all three so every
section shares one consistent width.

**Hero sparkline rebuilt three separate times as requirements refined:** (1) user asked for the
champion's real bump-chart line (rank-based `weekly_rank`, not cumulative points) in the site's
manager color, Segoe UI Black for the stat number — verified against real 2011 data, dips flat at
rank 6 through weeks 4-7/12 then climbs to rank 1 at weeks 16-17, matching the recap's own
narrative. (2) User asked it to fill the remaining row width — built `useElementWidth` (later
generalized to `useElementSize`), verified dots stay perfectly circular at both ~1075px and ~275px
measured widths (the naive alternative, CSS-stretching a fixed viewBox, would have turned them into
ellipses). (3) User asked to match the OLD HUB's real line weight/dot size — pulled exact numbers
from its actual `renderBump()` source (`stroke-width: 2.4`, `r: 3.4`, not eyeballed) via an inline
mockup comparison widget; then asked the sparkline to match the stat block's real height with
enough padding that dots never clip — added a computed `PADDING` constant and verified via headless
browser that zero of 17 dots clip on any edge, and the SVG height exactly matches the stat block's
live-measured height.

---

## Entry 14 (2026-09-05, cont.) — Sub-milestone numbering established; scroll fade/spacing fixes

**User established the `7a`/`7b`/`7c`... sub-milestone numbering convention** for incremental
fix/polish rounds that happen between numbered milestones. All of Entry 12–13's work retroactively
labeled `7a`.

**`7b`:** user reported "the scrolling reveal is not really happening" — two real causes: `useInView`
defaulted to `once: true` (can never fade back out), and even with `once: false`, the code animated
to `{}` on exit, giving Framer Motion no target so opacity just held at 1. Fixed both; verified via
headless browser a full reveal → hide → reveal-again cycle. Football-transition animations were
explored (5 candidate muted-grey designs proposed and discussed, including a real design correction
on the spiral pass — the first attempt was a TUMBLE, not a spiral, since it rotated the whole shape
instead of just the laces) but explicitly tabled by the user as "a want, not a need" — parked in
`ROADMAP.md`, not built.

**`7b`/`7c`/`7d` (section spacing iterations):** measured real gaps between sections (28–32px, one
effectively 0px) before touching anything; added a configurable `marginTop` prop to `RevealOnScroll`
(1000px default). **`7c`:** moved the "scroll for the full ledger" cue below the recap (was above
it), centered it, added a real Framer Motion bounce loop, and changed the default gap to 100px.
**`7d`:** user corrected this — only the cue-to-first-section gap should stay 1000px, the rest
should be 100px; fixed with a targeted `marginTop={1000}` override on just the first
`RevealOnScroll` instance.

---

## Entry 15 (2026-09-05, cont.) — Milestone 8 (site header) + transparent logos + sticky header/rail

**Milestone 8:** user provided a screenshot of the old hub's real header (owl logo + league name).
Confirmed `header_logo.png` was already a carried-over asset — no extraction needed. User's call on
placement (asked via tappable question, since the old header's horizontal shape doesn't fit the
confirmed vertical rail): full-width banner above both rail and content. Built `SiteHeader.tsx` from
the old hub's real `.site-brand` markup, with a deliberate change from the source: "Hub" swapped for
"Record Book" throughout, matching the actual project rename (the old markup literally said
"...League Hub").

**Transparent logos:** user uploaded `Logos.zip`. Verified via actual image-mode inspection (not
assumed) that the project's carried-over logo files were plain opaque RGB while the new uploads were
genuine RGBA with real alpha transparency. Swapped into both the active asset and the project's
master reference copies.

**`7e` (sticky header/rail):** built `.header`/`. timeline-rail` as `position: sticky`, the rail's
offset driven by a live-measured header height via `useElementSize`. **Two real bugs caught via
actual testing, not assumed correct from the code:** (1) the header initially didn't stick at all —
traced to the measuring ref being on a wrapping div sized exactly to the header's own height, which
gives `position: sticky` zero room to stick within; fixed by converting `SiteHeader` to `forwardRef`
and measuring the real `<header>` element directly. (2) The rail's offset was measured as 90px when
the header is actually 119px tall — traced to `useElementSize` reading `entry.contentRect` (excludes
padding) instead of the full border-box; fixed by reading `getBoundingClientRect()` instead, a
correctness fix to the shared hook itself, not just this one usage.

---

## Entry 16 (2026-09-05, cont.) — Dissolve-under-header effect (7e continuation)

User wanted the recap prose to visually dissolve as it scrolls under the sticky header, worked out
over several genuinely necessary clarifying rounds (the initial phrasing was internally
contradictory — "0% opacity at the top, 100% at the bottom" seemed to imply the element becomes
MORE visible after scrolling further, opposite of "should feel like disappearing"; resolved via a
screenshot showing a fixed 300px band right below the header where individual LINES of text dissolve
based on their current position in that band, not a single opacity value for the whole paragraph).

**Real technical fork surfaced before writing any code:** true per-line dissolve needs either a CSS
`mask-image` (requires restructuring the whole-page scroll model into an internally-scrollable pane)
or a color-matched gradient overlay illusion (no architecture change, works because this site's
background is a flat solid color). User chose the overlay illusion, scoped specifically to activate
once the recap's own top crosses the header's bottom edge, bidirectional.

Built `HeaderHeightContext` (shares the already-measured header height as a JS number),
`useCrossedLine` (a new hook answering "has this element's top passed a specific line," via a plain
scroll listener + rAF throttling rather than IntersectionObserver, since forcing a point-crossing
check onto a region-intersection API needs fragile `rootMargin` math), and `DissolveOverlay`. **A
real bug caught before calling it done:** the overlay was placed in the DOM after the long recap
text, so its own sticky engagement point was still far down the page when the trigger fired —
visibility check passed but nothing was visually happening. Fixed by moving it earlier in the DOM
(right after the hero, before the recap).

User then asked to confirm the overlay stays active for the ENTIRE rest of the page once triggered,
and that the same single overlay fades whatever content is later underneath it (not per-section).
Verified via headless browser at four scroll depths spanning from just-past-trigger to near the very
bottom — confirmed identical pinned position throughout, and a screenshot showed it correctly
dissolving the salary donuts' legend later in the page with zero changes to that component.

**Final polish this round:** user found the overlay's pop-in "very abrupt" — converted from
conditional mount/unmount to an always-mounted `motion.div` animating opacity (0.5s, respects
reduced motion), verified via 8 opacity samples across the transition showing a genuine gradual
climb, not an instant jump. Height changed from 300px to 400px, confirmed via direct measurement.

---

## Entry 17 (2026-09-05, cont.) — Stop protocol run

**Zip built:** `S003_2026-09-05_TNCFL_RecordBook.zip`. Contains everything from `S002` plus all work
from Entries 11–16: the 7 newly-planned Milestones (8–14) in `ROADMAP.md`, Milestone 8 (site header)
built, the font/color systems locked, layout containment fixed, the hero sparkline in its current
form, sub-milestones 7a–7e, transparent logos, sticky header/rail, and the dissolve-under-header
effect.

**Docs synced:** `SKILL.md`/`README.md` updated throughout this session's course to reflect the
sub-milestone numbering convention and current status; no further changes needed at this stop beyond
what's already current.

**Status at end of entry:** 🟡 Still within the `7e` sub-milestone thread (dissolve effect proof of
concept on the recap, confirmed working). Milestone 8 (site header) is built. Milestones 9–14 remain
unbuilt (planning only). Next steps: either continue extrapolating the dissolve pattern to other
elements, tune the 7e effects further, or move on to Milestone 9 (manager & week filters).

---

## Entry 18 (2026-09-05, cont.) — Milestone 7f: football transition artwork in the scroll gap

User supplied 2 line-art football images (`Football_1.zip`) — verified real alpha transparency
before use. Built `FootballTransition.tsx`: randomized (per mount) image choice, zoom level
150-400%, crop position, and horizontal placement, wrapped in the same bidirectional fade pattern
as `RevealOnScroll`. Styling judgment call flagged clearly: applied a grayscale/darken filter since
the source art is bright white and would otherwise glare against the dark theme.

**7f v2:** user flagged the hard rectangular edge from a screenshot. Fixed with three changes:
opacity 0.5→0.8; a genuine full-image-to-zoomed-crop animation (computed the equivalent of CSS
`background-size: contain` manually, since CSS can't animate FROM that keyword TO a percentage —
using the frame's real measured size via `useElementSize` and the images' real natural pixel
dimensions, tweened via Framer Motion's imperative `animate()`); and a radial `mask-image` so the
frame's edges fade into the background instead of showing a hard box.

**7f v3:** user reported randomization "not actually working" — a real bug, confirmed before
fixing: React Router reuses the same component instance across season navigation (`:year` param
changes don't remount by default), so `useMemo(() => {...}, [])`'s empty deps meant the random
values were only ever rolled once, at first mount, then frozen for every subsequent season. Fixed
with `<FootballTransition key={year} />` in `SeasonPage.tsx`. Verified rigorously: checked zoom and
position independently of which image was picked (to rule out "same image 3x by 25% coincidence"
as a false negative) — confirmed genuinely independent re-randomization every season.

---

## Entry 19 (2026-09-05, cont.) — Milestone 7g: stat tiles, score pills, spacing

Recap-to-first-section gap reduced from 1000px to 600px, then to 0 extra margin (image fills the
gap) per the user's explicit choice among three ways to redistribute the reduction.

`SeasonStatTiles` restyled: font switched from mono to Segoe UI (later to Segoe UI Black) — a
deliberate exception to the project's usual "data stays monospace" rule, scoped to just this
panel. "High week" and "hmotw leader" tiles now color their value with the real manager color and
show `"{score}; {manager} W{week}"` / `"{manager}; {tally} week(s)"` instead of a bare number —
verified against real 2015 and 2016 data matching the user's own screenshots exactly.

**Score-cell pill system implemented** (deferred since Milestone 4/7a): blue (`<100`), mustard
(`100-199.99` + won the week), red (`≥200`), and a red/mustard diagonal split (`≥200` AND won the
week) — colors verified against the old hub's real `.spill` CSS, not approximated. Two genuine
edge cases resolved with the user before writing code, both checked against real data first: a
score of exactly 200.0 (confirmed this has happened 5 times across 15 seasons, not theoretical;
user's call: counts as `≥200`) and the drop-shadow scope (old hub only applies it to the diagonal
pill; user's call: apply to all 4, a deliberate deviation). A genuine discrepancy against the old
hub's own screenshot (a sole ≥200 winner shown as solid red there, but diagonal under this new
rule) was investigated, not dismissed — confirmed not a tie, confirmed the diagonal case does
appear elsewhere in the same season — and resolved by treating the user's new stated rule as
authoritative over whatever the old hub's exact pixel logic happened to do. Later refinement:
mustard pills lost their drop-shadow specifically (kept on the other three).

---

## Entry 20 (2026-09-05, cont.) — Milestone 7h part 1: BumpChart rebuild + the F1 car design journey

`BumpChart` rebuilt to match the old hub's real `renderBump()` exactly: cubic bezier curves (not
straight segments), the rounded bordered card, week-number header row, and dual-side manager labels
(week-1 order left, final order right) — all pulled from the actual source, not the screenshot.
Title renamed to "Weekly Burnout." A 3-column checkered finish line added after the last week's
dots — needed two follow-up fixes when later changes shifted its position (each caught and
corrected, including once via the user's own screenshot).

**The F1 car:** user's first ask was to faithfully copy a detailed realistic reference photo —
declined honestly (freehand-tracing an organic illustrated shape into precise SVG paths isn't
reliable) and built a real collaborative HTML tool instead, with the reference photo as an
adjustable-opacity background layer. Pivoted to porting the old hub's ACTUAL `f1CarSVG()` geometry
rather than inventing new shape math, first rotated 90° for comparison (surfacing a genuine
quirk: the old hub's own "rear wing" element sits near the NOSE end of its coordinate space, a
mismatch in the source itself). User's call: keep the shape exactly as-is, unrotated (its real
racing orientation), change only the colors — tried a complementary-hue accent scheme first (user
didn't like it), landed on a single darkened-accent scheme, tuned from 50% to 65% darker. Number
badge (white circle + first-initial letter) built via its own iterative tool, locked to exact
values the user dialed in (circle diameter 1.8 at (13,5); letter size 3, rotation 270°, centered
via glyph metrics). Flagged clearly: first-initial-only produces real collisions in the roster
(D'lyn/Damian, Kevin/Kito, Ted/Tim/Tony) — user acknowledged and proceeded anyway.

Locked in as real code (`F1Car.tsx`, `f1CarColors.ts`), verified via an actual temporary React
render, not just re-reading the JSX. **Later correction:** user asked directly whether the car
matched the old hub's true size — checked rather than assumed, and it didn't: `f1CarSVG()` wraps
its coordinates in an additional `scale(1.5)` this port had missed, rendering at ~67% of the real
size. Fixed with a fixed `CAR_SCALE = 1.5` (matching the old hub's own non-adaptive approach), which
required also re-deriving `LEFT_MARGIN` (the car's larger rear-half extension would have
reintroduced an earlier clipping bug otherwise) — caught and fixed together, not sequentially.

---

## Entry 21 (2026-09-05, cont.) — Milestone 7h part 2: race math + intro sequence stages 1-3

**Race finish-time math** worked out against the user's own spreadsheet before any code was
written: the lowest-scoring manager always finishes at the full (randomized 8-15s) race duration;
everyone else finishes proportionally faster based on how much more they scored
(`finishTime = duration * (2 - total/lowestTotal)`). Confirmed column-by-column against the
spreadsheet's real 2011 numbers to the exact decimal. A real boundary case (this formula breaks if
any manager's ratio to the lowest scorer reaches 2.0) was checked against all 15 real seasons
before treating it as a non-issue — worst real case is 2014 at 1.39.

**Race intro built and verified in stages, each stage confirmed working before moving to the
next:**
- **Stage 1 (roll-up):** cars enter from off-screen left to their week-1 position, staggered,
  replaying with ~50% odds after the first view. Caught a real `key={year}` bug (same class as
  `FootballTransition`'s) before it shipped, and a real clipping bug (the car's rear half rendering
  outside the SVG's viewBox, fixed with a reserved `LEFT_MARGIN`).
- **Stage 2 (wait + countdown):** 500ms pause, then a fast zoom/fade countdown (user's explicit
  correction: 250ms per number, "visual candy," not a literal 5-second wait — later retuned to
  650ms, then 450ms, and the number size from 400px to 300px). A real race-condition bug was caught
  and fixed: `AnimatePresence mode="wait"` serialized exits on the same clock the index-advance
  timer used, silently skipping every other number (4 and 2 never appeared) — fixed by decoupling
  the two clocks.
- **Stage 3 (burnout smoke):** puffs at both rear wheels (identified from the car's own tire rect
  coordinates, not guessed), fired the instant the countdown finishes. First version was genuinely
  invisible — user caught this directly ("don't see any smoke") — investigated properly rather
  than re-asserting the same claim: confirmed via computed style that the capture had landed at
  frame 0 (ruling out a timing artifact) and that the real cause was sub-pixel rendering
  (~0.6px radius). Fixed by increasing the base radius, re-verified with both computed values and
  a screenshot.

---

## Entry 22 (2026-09-05, cont.) — Milestone 7i: race playback (stage 4) + replay button

**Replay button** matched to the old hub's real `.race-replay` spec (colors, label, placement in a
title row) — not invented. **Race playback** ported from the old hub's actual `playRace()`:
quadratic ease-in per car, position/rotation read via `getPointAtLength()` along a hidden
per-manager path (a lookahead point gives the tangent angle so cars bank into curves), a global
fade starting only once the last car crosses the line. Replay mechanism: a single `sequenceId`
counter now drives the whole roll-up→wait→countdown→smoke→race chain, replacing the earlier plain
boolean specifically so a replay can force a genuine restart.

**Two real bugs caught before/during testing, neither shipped blind:**
1. An architectural bug caught before ever testing: driving the race's fade via React state inside
   the `requestAnimationFrame` loop would trigger a full re-render every frame, resetting the car's
   imperatively-set transform back to its static position. Fixed by moving opacity to the same
   imperative ref-based update as the transform.
2. A units mismatch caught via actual testing (all cars appeared frozen at the finish line from
   frame one): `pickRaceDuration()` returned seconds while the race loop's elapsed time is in
   milliseconds, so `t/duration` hit ~34 within the first frame. Fixed at the source.

**Verified rigorously:** sampled all 6 cars' positions every 750ms across a full race (genuine
progressive movement confirmed), then tracked each car's exact finish frame by fill color and
cross-referenced against real 2011 totals — confirmed the finish order matches the real standings
exactly, and the predicted finish time for the top scorer matched the observed time to within 1ms.
Confirmed the Replay button genuinely resets all cars to the start position.

**Follow-up tuning, each verified:** race duration range changed from 8-15s to 5-8s; countdown from
650ms→450ms per number, number size 400px→300px; panel background and border both removed (chart
now blends fully into the page).

**This completes the full race sequence** first scoped in Milestone 7h.

---

## Entry 23 (2026-09-05, cont.) — Stop protocol run

Ran the standard stop protocol: SESSION_LEDGER.md updated, README.md and SKILL.md status sections
refreshed, S004 zip built.

---

## Entry 24 (2026-09-06) — Milestone 7j: sticky football + drought bars color/styling

Football transition image: opacity raised to 100%; made `position: sticky` so it holds in place for
a bounded scroll stretch after the zoom completes, then releases and resumes normal scrolling —
required reserving genuine "hold slack" (frame shorter than its 600px wrapper), the same lesson
already learned from the header/rail sticky bug. Verified via scroll-increment measurement: holds
for ~200px of scrolling, then correctly releases.

**DroughtBars color logic — a real bug found and fixed, not assumed correct.** User asked to check
the OLD HUB's actual bar-color rule rather than guess from a screenshot's red/mustard/green
pattern. Found the real rule in `renderThirst()`/`barColor()`: bar FILL color is threshold-based on
drought length itself (`>=15` red, `>=8` mustard, else green) — completely independent of manager
identity. Our version had been using each manager's OWN color for the fill, which was wrong; the
name label ALSO wasn't using manager color at all (a separate gap, fixed in the same pass). Verified
against real 2023 data (the exact season matching the user's screenshot) — all colors matched
exactly. Then the FULL panel styling (not just color) was matched to the old hub's real CSS:
`.thirst-card`/`.db-wrap`/`.db-name`/`.db-bg`/`.db-fill`/`.db-val`/`.db-val .wk`, including
splitting the value text into a number + smaller/dimmer unit span ("21 wks", not "21w").

**Nugget cards restyled + repositioned:** kept only the rounded left accent stripe (removed
background/plain border), and — a real correctness bug caught along the way — the accent color map
had been guessed back when first built; none of the 6 hex values matched the old hub's real CSS,
and 2 accent categories (`brand`, `orange`) were missing entirely. Fixed with real values. Moved
`NuggetGrid` to sit right after `DroughtBars`/`DancingShoes` per the user's request.

---

## Entry 25 (2026-09-06, cont.) — Milestone 7k: panel titles matched project-wide + title/subtitle split

Pulled the old hub's real `.module-title`/`.module-title-row`/`.despair-sub` CSS exactly (Segoe UI,
weight 550, `letter-spacing: 0.12em`, uppercase, `#777777`) and added as GLOBAL classes in
`index.css` (not a CSS module — this exact pattern repeats across many panels). Applied to every
current panel title (BumpChart, DroughtBars, both SalaryDonuts titles), explicitly NOT to
NuggetGrid's `.title` (a different UI role — individual card headings, not a panel header).
Verified via computed style across all 4 titles: identical match.

**DroughtBars adopted the old hub's real title/subtitle split**, per user confirmation: title
changed to "Thirsting for a W", with a new subtitle line using the `.module-subtitle` class (built
here, used later by SalaryDonuts too): "Weeks since each active manager's last HMOTW win, as of
season's end -- the curse, quantified" -- the old hub's exact real text.

---

## Entry 26 (2026-09-06, cont.) — Milestone 7l: the nugget-layout saga

The longest single thread this session. User showed old-hub screenshots revealing the nugget grid
had far more dead space than the reference, and walked through 4 confirmed rules for a proper
masonry layout: no 3 consecutive years with an identical arrangement; minimize dead space via
real content-length packing; an independently-randomized page-turn entrance animation per card
(axis, stagger, 1500-3000ms duration); no two adjacent placements repeating the same shape, AND
the whole grid must resolve to a perfect rectangle (confirmed via three real screenshots -- the
first one the user showed was mistakenly agreed as a "violation" without actually checking the
pixels first; corrected once the user drew a reference line proving it was fine).

**First build: character-count-based height estimation.** Worked initially, but "hand-holding" the
constants to avoid clipping vs. excessive dead space became exactly the same problem the user had
faced hand-placing cards in the old hub -- different knob, same root cause.

**Second build: real DOM measurement**, replacing the character-count guess entirely (two-pass
render: measure invisibly at real target width, then place using real heights). Took several real
rounds to get right: a StrictMode double-invocation bug (fixed via `key={year}` remount + a ref
guard), a recurring 12px CSS-gap miscalculation, and -- the least obvious -- a width/measurement
mismatch where the anti-repeat-shape logic could narrow a nugget's span AFTER its height was
already measured at a wider span, which a fixed safety margin could never fix since the shortfall
scales with the width change. All four fixed and verified across 3 real seasons (2011/2022/2025).

**User's final call: abandon computed layout entirely.** After all that, "this is not working" --
reverted to the OLD HUB's own AUTHORED per-nugget grid position (the `cells` field), which was
never actually the problem. `nuggetLayout.ts` deleted. This immediately surfaced a genuine,
separate bug: `parseGridCells.ts` had letter=column/number=row backwards from the old hub's real
semantics (letter=row/number=column, confirmed against its actual `ROWS={A:1,B:2,...}` mapping) --
every nugget had been rendering rotated 90 degrees from its true position the whole time, something
an earlier "matches the reference" claim had missed by judging a screenshot instead of checking the
actual computed CSS grid values. Fixed and re-verified properly this time.

**A new, separate item found and deliberately deferred, not fixed:** 2025's "All-Time Season
Totals" nugget is a structured ranked list, not prose -- the old hub reveals its rows dynamically
via `sumFitTopSeasons()`, matching a sibling card's height. Not a 2011 issue; cataloged for
Milestone 16 rather than built now, per the user's explicit "one season at a time" concern about
the exact kind of compounding-data problem this session's stress-testing had accidentally invited.

**Also:** sidebar temporarily restricted to show only 2011 (removing the temptation toward
premature cross-season testing) -- restore `data.meta.years_desc` once more seasons are actually
being built.

---

## Entry 27 (2026-09-06, cont.) — Milestone 7m: race fire-once + salary donuts rebuilt as canvas

Race no longer auto-replays on rescroll -- fires exactly once per navigation to a season (the first
scroll-into-view), replacing the earlier "~50% odds on later scroll-ins" behavior. Replay button is
now the only way to see it again. Verified: fired once, then 3 full scroll-away-and-back cycles
produced zero auto-replays, then the Replay button still worked correctly.

**Salary donuts rebuilt from scratch** as a faithful canvas port of the old hub's real
`sccDrawPie()`/`sccInitPie()` -- a genuinely sophisticated 3D-isometric-extruded engine (wall-
shading, exploded max slice, 22 degree tilt, leader-line label de-collision) that the earlier flat
SVG version didn't resemble at all. Ported into `drawExtrudedPie.ts` with the exact same constants.
Title/subtitle/sub-panel titles/rotation slider (0-359 degrees, defaults 20/90) all pulled from the
real source. A flawed slider-interaction test (directly setting a controlled input's `.value`)
wrongly suggested the slider was broken -- corrected with real keyboard interaction, confirming it
works. Follow-up: background/border removed from the panel boxes; leader lines extended so labels
clear the donut -- which surfaced two more real bugs (labels running off the FIXED canvas width, and
`radiusFraction` having been hardcoded inside the draw function instead of accepted as a real
parameter) -- both fixed and verified via direct pixel inspection at the canvas edges.

---

## Entry 28 (2026-09-06, cont.) — Milestone 7o: body text sizing

Dancing Shoes and nugget card body text both changed to 15px (were 13px/12px), matching the recap
prose's own size. Titles/eyebrows untouched. Verified via computed style.

---

## Entry 29 (2026-09-06, cont.) — Stop protocol run

---

## Entry 30 (2026-09-06, cont.) — Milestone 7p: score table sorting, nugget title font, content-column width cap

Originally logged as three separate lettered entries (7p/7q/7r) as each piece was built and
verified; consolidated into one combined **Milestone 7p** per the user's explicit request after
all three were done. Numbering conflict caught before any of this was built: the user's first
request in this round named itself "milestone 7o," but `7o` was already locked (Entry 28, body text
sizing) — flagged before writing code; user picked the next letter, then later chose to fold all
three pieces from this round under that one label instead of splitting them across three.

**Part 1 — ScoreTable click-to-sort + Total column reorder.**
Request: click-to-sort on every ScoreTable column header, default alphabetical; move `Total` to
sit right after `Manager` (was last). Design decisions confirmed one at a time (tappable, per the
standing rule) before building: default sort is alphabetical by manager name (A→Z); first click on
a Week or Total column sorts highest-first (descending), first click on Manager keeps A→Z; clicking
the same header again flips direction (desc↔asc) on any column; no sort-direction indicator glyph
(user declined one); switching seasons resets sort state back to alphabetical rather than carrying
it over. Built: `ScoreTable.tsx` holds `sortKey`/`sortDir` state (`'manager' | 'total' | <week
index>`), reset via a `useEffect` keyed on `season.year`; header `<th>`s got `onClick` handlers and
a new `.sortable` CSS class (cursor pointer + hover color only). Ties fall back to alphabetical
manager order for a stable sort — a reasonable default, not asked about since it has no visible
effect on real data. `Total` moved from last to immediately after `Manager` in header and body rows;
no change to which column is sticky (still just `Manager`). Verified for real: built the app
(`tsc -b && vite build`), served it, and drove it with a real headless-Chromium session (Puppeteer)
— confirmed default alphabetical order (Bao/Hanh/Kito/La/Lonny/Mikey) with the exact 2011 Total
values from the user's own screenshot; one click on `Total` sorts 1952→1755, a second reverses it;
one click on `W1` sorts by real scores (150/117/103/97/83/80), matching the screenshot's W1 column.
Screenshotted the sorted table (reduced-motion forced) to confirm pill colors/values intact after
the reorder/re-sort.

**Part 2 — nugget title font matched to the old hub exactly.**
Bug: the nugget card title (`NuggetGrid.module.css` `.title`) was rendering in `--font-black`
(Segoe UI Black, display weight) — the hub's real `.nugget h4` rule uses the inherited body font
(`'Segoe UI'`, regular family) at `font-weight: 600`, not a black display font; color was also off
(RB `#f2f2f0` vs. hub's `#e8e8e8`). Scope confirmed with the user first: title only — the nugget
body text's 15px size (locked in Entry 28/Milestone 7o, deliberately matched to recap prose rather
than the hub's original 13.5px) was left untouched. Fixed: `.title` now sets `font-family:
var(--font-sans)` (was `var(--font-black)`), `color: #e8e8e8` (was `#f2f2f0`); size/weight were
already correct. Verified for real: read back the ACTUAL computed style off a rendered nugget
title via headless Chromium — `fontFamily: '"Segoe UI", system-ui, -apple-system, Arial,
sans-serif'`, `fontWeight: '600'`, `fontSize: '13px'`, `color: 'rgb(232, 232, 232)'` — an exact
match to the hub's rule. Screenshotted the full grid (waited out the page-turn entrance animation
so cards were at settled opacity) for a visual check.

**Part 3 — content column capped to match the hub's 1250px.**
Context: user asked what the container width was in the hub vs. the RB. Checked the real CSS in
both: the hub's `.season-wrap`/`.site-header-inner` are `max-width:1250px; margin:0 auto;
padding:24px` — hard-capped and centered, extra space on wide screens. The RB's `.layout-content`
had no `max-width` at all (`flex:1; min-width:0; padding:40px 48px`) — fully fluid, growing without
limit next to the 160px timeline rail. Change made: `.layout-content` now matches the hub's rule
exactly — `max-width:1250px; margin:0 auto; padding:24px` (was `padding:40px 48px`, no cap, no
auto-margin). This caps/centers the content column within the space right of the rail; the rail
itself is unchanged (the hub has no rail at all, so there's no direct hub equivalent for that
part). Verified for real: flex-item `max-width` + `margin:0 auto` centering isn't always obvious in
theory, so measured actual rendered values at three viewport widths via headless Chromium — at
1920px the content column holds at exactly 1250px with 255px of empty space on each side; at
1440px still 1250px with 15px each side; at 1024px (where 1250px wouldn't fit) it correctly falls
back to filling all available space (864px) with no cropping. Screenshotted the 1920px case to
confirm the visible empty margin actually looks like the hub's behavior.

---

## Entry 33 (2026-09-06, cont.) — Resequencing: Milestone 9 deferred until after 14

**Decision:** after the Milestone 9 recap (manager/week filters), user chose to set it aside and
build Milestones 10–14 first, revisiting 9 only once 14 is done. Rationale not stated beyond the
choice itself. Practical consequence flagged in the recap and still true: several of the old hub's
real filter-reactive panels (Despair, Spread, H2H, Peak, the Salary ledger card, CSCC) are exactly
the panels 10–14 are about to build — so by the time Milestone 9 is picked back up, ALL of the
old hub's filter-reactive panels will exist in the RB, not just the three (ScoreTable, BumpChart,
DroughtBars) available today. Whatever shared filter state gets built then should account for all
of them from the start, rather than the narrower 3-panel scope the recap described.

---

## Entry 34 (2026-09-06, cont.) — Milestone 10: Salary Cap rules card + full ledger table

Verified against the old hub's real `renderSalary()` before building anything (not the roadmap's
one-paragraph summary) — confirmed the rules card and ledger table are NOT adjacent in the hub
(rules card sits near the top, right after the recap; the ledger sits much later, right before the
donut pies), and that all 16 ledger fields plus the rules card's fields already exist on
`PayoutRow`/`PayoutsEntry` with no type changes needed.

**Placement — a deliberate departure from the hub, per explicit user instruction:** both pieces go
together, directly below `NuggetGrid`: rules card first, ledger table right below it with matching
panel spacing. This differs from the hub's split top/bottom placement on purpose.

**Rules card (`SalaryRulesCard.tsx`):** Pools & Fees / Prizes two-column grid, sourced from
`PayoutsEntry`. Split labels are static (50/30/20% for `ring===0` seasons, 40/30/20/10% otherwise)
displayed next to the real `season_split` dollar amount — matches the hub's own hardcoded-label
approach exactly, not derived from the pot. Ring voucher, sidebet pool, playoff pool, and the
2015-only "NEW" badge are all conditionally rendered exactly as the hub does. Layout is the user's
explicit override of the hub: card first at 60% width (`flex:1`), logo second at 40%
(`flex:0 0 40%`) — reversed order and different proportions from the hub's logo-first/30%-logo
layout. No background/border box on the card, unlike the hub's real `.salary-rules` — kept
consistent with the RB's already-established borderless-panel convention (nugget cards,
SalaryDonuts) rather than reproducing the hub's boxed chrome; flagged to the user as a judgment call
rather than assumed silently.

**Ledger table (`SalaryLedgerTable.tsx`):** all 16 real columns, in the hub's real grouped order
(blank/Franchise Fee/Purse/Net), with the hub's real per-column pixel widths and the same
group-gap columns after Trade Fee and Season Purse. Money formatting is column-specific and
ported exactly: most columns show an em-dash instead of $0, `money()` drops decimals when whole;
Net and Season Purse always show 2 decimals (`money2()`), and Net is always shown (never dashed)
with green/red coloring by sign. `money()`/`money2()`/`ord()` were ported into a new
`lib/format.ts` — `ord()` was rewritten cleaner rather than copying the hub's cryptic bit-hack
verbatim, but only after confirming byte-for-byte identical output across ranks 1-130 in a real
test, not assumed equivalent from reading the formula.

**Two decisions confirmed with the user before building:**
- Sort-direction arrows (▲/▼): the hub shows them on this table but not on ScoreTable. Rather than
  leave the two tables inconsistent, the user chose to add arrows to BOTH — this reverses
  Milestone 7p's "no indicator" call for ScoreTable specifically for this reason. Both tables now
  show the arrow.
- The hub's manager-filter row-dimming style (`.faded`, opacity 0.2) has no filter to drive it yet
  since Milestone 9 is deferred — user chose to build the CSS class now, dormant, rather than wait
  until 9 actually exists to add it.

**Verified for real, not assumed:** built the app and drove a real headless-Chromium session against
2011's actual payout data — rules card values (buy-in $100, pot $747, HMOTW fee $170, trans/trade
$1/$5, 3-way 50/30/20 split at $447/$200/$100, no ring/sidebet/playoff/NEW-badge, all correctly
absent) match `payouts["2011"]` exactly. Ledger default sort (Net descending: Hanh 481 → Kito 91 →
Mikey -69 → Lonny -109 → La -168 → Bao -226) matches the real row data exactly; clicking Manager
re-sorts alphabetically and moves the arrow correctly; dash-vs-real-value formatting, group header
colors, and manager color dots all confirmed via actual rendered DOM and a screenshot, not just
reading the source back.

---

## Entry 35 (2026-09-06, cont.) — Milestone 11: Despair Differential + Scoring Spread Index

Verified both against the old hub's real `renderDespair()`/`renderSpread()` before building anything.
Corrected two roadmap assumptions in the process: `gap_behind` is already a precomputed, verified
field (spot-checked against real 2011 totals — Hanh, the leader, is 0 everywhere; every other
manager equals `1952 − their own total` exactly) — no deriving from `cum_points` needed. And Spread
needs no separate `weekly_low` field; the hub computes each week's high/low inline from `scores`,
which the RB already has typed.

**Real hub behavior found that the roadmap didn't mention:** Despair gives Money-Circle managers a
thicker line (2.6px vs 1.3px), larger dots (3.2px vs 2px), and a dashed cubic-polynomial trend line
(`polyfit3`, a real degree-3 least-squares fit) layered on top. Spread reads the week filter
(Milestone 9, deferred) the same way ScoreTable does.

**User's explicit simplification calls, in order:** (1) remove the trend line entirely — so
`polyfit3` never needed porting; (2) drop the Money-Circle line/dot distinction, standardizing
Despair to a uniform 2px line / 2.5px dots for every manager regardless of MC status; (3) match
Spread's dots to the same 2.5px for consistency (was the hub's uniform 3px); (4) recolor Spread's
league-average dashed line + its label from the hub's brand red to the RB's established mustard
(`#d9a521`, same hex as ScoreTable's mustard pill — not a new color).

**Hover interaction — a real decision, not a default:** every chart built so far (BumpChart,
DroughtBars) replaced the hub's per-chart custom tooltips with the shared `ManagerHoverCard` +
`HoveredManagerContext` alone. For these two specifically, the user chose to keep that shared
behavior AND add back a small per-dot tooltip (week + value) — both fire together, confirmed via a
real screenshot showing both the small tooltip ("La · Week 12 · 21.0 pts behind") and the full
`ManagerHoverCard` open at once. Built as a new shared `ChartTooltip` component (mouse-following,
viewport-edge-clamped, matching the hub's real positioning math) rather than duplicating the logic
in both charts.

**Placement:** both sit between BumpChart and DroughtBars, matching the hub's relative chart
ordering — but Spread was explicitly placed ABOVE Despair, reversing the hub's own order (hub has
Despair before Spread).

**Verified for real, not assumed:** built + served the app, drove a real headless-Chromium session
against 2011 data. Despair: gridlines computed as 0/50/100/150/200/250 (real max gap 197 [Lonny] ×
1.10 headroom, rounded up via the ported `niceStep()`) — confirmed via actual rendered `<text>`
elements, not just the formula; right-edge label order (Lonny/La/Bao/Mikey/Kito/Hanh, top to
bottom) matches real final-week gaps exactly; confirmed only ONE stroke-width (2) and ONE dot
radius (2.5) exist in the rendered SVG, not two. Spread: gridlines 80/120/160 and average 108.2
both match real computed values from every manager's every score; average line's rendered stroke
color confirmed as `#d9a521`; dot radius confirmed as 2.5 everywhere; module order confirmed via
the actual rendered `.module-title` sequence (Spread before Despair).

---

## Entry 36 (2026-09-06, cont.) — Milestone 11 fix: hover-dim wasn't wired into either new chart

**User caught a real gap by asking to confirm it, not assuming it worked:** neither
DespairDifferential nor ScoringSpreadIndex read `hovered` back from
`HoveredManagerContext` — both only ever called `setHovered()` on their own dots. That meant
hovering a manager elsewhere (ScoreTable, BumpChart, DroughtBars) correctly dimmed THOSE panels'
other managers, but hovering anywhere never dimmed anything within Despair/Spread themselves, and
hovering a Despair/Spread dot never dimmed the OTHER lines/dots in the same chart either. Confirmed
the bug for real before fixing it — a first test attempt wrongly suggested it was already broken
in a different way (a scroll/coordinate bug in the verification script itself, not the app), caught
and corrected before concluding anything.

**Fixed:** both components now destructure `hovered` (not just `setHovered`) and apply
`opacity: hovered !== null && hovered !== manager ? 0.25 : 1` to their own lines/dots/labels —
same 0.25 dim value BumpChart already uses. Despair's right-edge manager-name labels also gained
their own `onMouseEnter`/`onMouseLeave` (they only had opacity styling before, no hover handler at
all) — matching BumpChart's left/right edge labels, which are themselves hoverable, not just the
dots.

**Verified for real, three separate times as the fix landed:** (1) confirmed the ORIGINAL bug via
a real render — hovering ScoreTable's "Hanh" cell (after fixing a scroll-into-view bug in the test
script itself) showed all 6 Despair `<g>` groups and all Spread dots stuck at opacity 1. (2) after
the opacity fix, confirmed hovering a Hanh dot correctly dims the other 5 groups to 0.25 (screenshot
included) while the shared `ManagerHoverCard` also opens. (3) after adding label hover handlers,
confirmed hovering the "Hanh" TEXT LABEL directly (not a dot) now also dims correctly and opens
the hover card — the exact interaction that didn't exist before this entry.

---

## Entry 37 (2026-09-06, cont.) — Dancing Shoes/DroughtBars row + rebuild; two follow-up tweaks

**Request:** Dancing Shoes and DroughtBars ("Thirsting for a W") share one row, initially at 60/40
(Dancing Shoes 60%, DroughtBars 40%), later changed to an even 50/50 — see below; Dancing Shoes
rebuilt to match a reference screenshot.

**Real hub check before building:** Dancing Shoes is actually rendered through the SAME nugget-card
system as regular nugget cards in the old hub (`<div class="nugget purple"><h4>💃 You Need Your
Dancing Shoes</h4>...`), not a bespoke standalone card — confirmed via the real markup, not
approximated from the screenshot alone. That's where the purple accent stripe, the divider under
the manager name, and the pink uppercase "WEEKS DRY" badge (`#ffb3b3`) all come from.

**Decisions confirmed before building:** Dancing Shoes sits first, DroughtBars second — originally
60/40 (`flex:1` / `flex:0 0 40%`, same technique as `SalaryRulesCard`'s split), later changed to an
even 50/50 (both `flex:1`, confirmed via real rendered widths: 589px/589px exactly). Body text size
stays at the Milestone 7o-locked 15px (not the hub's real 13.5px) — user explicitly chose to keep
the lock; every other body-text property (color `#aaaaaa`, line-height 1.8, and a new `em` style
for italics) was matched to the hub exactly since only the size was locked.

**Built:** `DancingShoes.tsx` now takes a `meta` prop (colors the manager name), renders the title
with the real 💃 emoji + text, and restructures the victim row into name+badge with the hub's real
divider/badge styling. `SeasonPage.tsx` wraps DroughtBars+DancingShoes in a flex row.

**Two follow-up tweaks, same session:** (1) Dancing Shoes' card background (`#17171a`) and its
just-added purple left-border were both removed per explicit request — it now sits with no
background/border at all, a further departure from the hub's real boxed nugget style (and from
NuggetGrid's own convention, which kept its accent stripe — Dancing Shoes now has neither). (2)
`SalaryDonuts`' rotation-slider defaults changed from the hub's real 20°/90° to a uniform 80° for
both pies, per explicit request — noted in-code that the same 80° default should carry over to the
future CSCC cumulative donuts (Milestone 14) once built.

**Verified for real:** built + served the app, drove a real headless-Chromium session against 2011
data — confirmed the title renders the actual emoji+text, the border-left computed to
`rgb(136,84,208)` (#8854D0) before it was removed; row widths came out 697px/481px (≈59/41%,
matching the same flex-based tolerance as the rules card's split); after the two follow-up tweaks,
confirmed via computed style that the card's background is `rgba(0,0,0,0)` and border-left is
`0px none`, and both rotation `<input type="range">` elements report value `"80"`.

---

## Entry 38 (2026-09-06, cont.) — Milestone 12 (H2H matrix): CANCELLED after real verification

**Read the old hub's real `renderH2H()` before proposing anything**, per the established
methodology — confirmed the roadmap's "good news" was right: the matrix is fully derivable from
`season.scores` alone (compare every manager pair's score per visible week, tally wins; the
deferred top-level `h2h` field is career-scoped and never needed). Also found: a `h2h_logo.png`
image sits alongside the matrix at a real 60/40 split (matrix first at a hard 60%, logo second at
`flex:1` — matrix-first already matches the card-first pattern established for
`SalaryRulesCard`, so no reversal question was needed there); a red→yellow→green dominance color
scale with a specific (and slightly discontinuous) two-branch formula; and — unlike every other
chart built so far — the hub's own dimming here was driven ONLY by the deferred manager filter,
never by mouse hover.

**Raised as a real open decision, not assumed either way:** whether to add the RB's now-standard
hover-dim interaction (present on BumpChart, DroughtBars, Despair, Spread) even though the hub
itself never had that specific interaction on this component.

**User's answer went further than the question:** rather than choosing an interaction style, the
user rejected the feature outright — "it doesn't provide any meaningful context" — and confirmed
(when asked directly) that this means skipping the H2H matrix ENTIRELY, not just the hover
question. **This is a cancellation, not a deferral** (unlike Milestone 9): it will not be revisited
later. Milestone numbers are NOT renumbered — 13 onward keep their existing numbers; Milestone 12
simply has no deliverable. `ROADMAP.md` and `SKILL.md` updated to record this and strike the
now-moot build description rather than deleting it outright, so the verification work (and why it
was ultimately rejected) stays part of the record.

**Also rolled in per explicit instruction:** the Dancing Shoes left accent border (removed in
Entry 37) is back — `border-left: 3px solid #8854d0` — while the background stays transparent, per
the user's explicit "just the border, not the background" clarification. Verified via computed
style: `borderLeft: "3px solid"`, `background: "rgba(0, 0, 0, 0)"`. This fix is logged here (not a
separate Milestone 12 entry) per the user's own instruction to roll it into whichever milestone
comes next, once 12 turned out to have no deliverable of its own.

---

## Entry 39 (2026-09-06, cont.) — Milestone 13: Peak Performance Distribution (HMOTW pyramids)

**Read the old hub's real `drawPeakChart()`/`renderPeak()` in full before proposing anything** —
confirmed this is a genuinely cross-season feature (needs `meta.hmotw.season_tally`,
`status_by_year`, `all_players` — none typed until now), not something 2011 alone can show
meaningfully: two side-by-side 3D isometric pyramid charts (Active / Inactive managers), a `TOTAL`
(career) column plus one column per season, a 15-season window with an expand button, and TWO
INDEPENDENT height scales (TOTAL scales freely by career total; season columns are scaled so 10
season-wins = 80% of the tallest TOTAL pyramid) — meaning the same number can render at two
different heights depending which column it's in, confirmed as intentional hub behavior, not a
bug, before porting it.

**Flagged as a real scope mismatch before building:** 2011 is the first season ever, so there are
zero departed managers and the TOTAL column is numerically identical to the single season column
for every manager — porting the real feature today means an empty "Inactive Managers" panel and a
mostly-redundant two-column chart. The roadmap already anticipated this and said not to default to
the hub's exact approach without checking. Presented three options (simple bar chart, the real 3D
engine as-is, or skip like Milestone 9/12) — **user's call: build it exactly like the hub**, minus
the `peak-card`'s background/border (explicit, matching the RB's established borderless-panel
convention).

**Types added** (were `unknown` before, now verified against real data): `season_tally:
Record<string, Record<string, number>>`, `status_by_year: Record<string, Record<string, 'A'|'F'|
'I'|'D'>>` (all 4 codes confirmed present across the real dataset), `all_players: string[]` (18
names). `drought_start_snapshot`/`top5_streaks`/`atdr_snapshots` stay `unknown` — out of scope here.

**Built:** `lib/drawPeakChart.ts`, a faithful canvas-2D port of the hub's real isometric projection
math (floor/Y-axis gridlines, column labels, 4-face-shaded pyramids per cell, right-edge manager
name labels, hit-test circles for hover) — not re-derived, the same formulas (`peakShade`, the
two-scale height system, the 33° projection angle, brightness constants) ported line-for-line.
`PeakPerformance.tsx` wires it up: Active Managers canvas always renders; Inactive Managers renders
its own canvas only if any departed manager has HMOTW wins through the selected year, else the
hub's real empty-state text. Expand/collapse button only appears once total seasons exceeds 15
(currently hidden for 2011, forward-compatible for Milestone 16). Placed between Despair
Differential and the DroughtBars/DancingShoes row, matching the hub's relative module order.

**Verified for real, not assumed:** built + served the app, drove a real headless-Chromium session.
Confirmed only ONE canvas rendered (Active) and the real empty-state text present for Inactive,
exactly as expected for 2011's zero-departed-managers reality. Grid-scanned the canvas and logged
every distinct hover tooltip found: Hanh 6, Kito 3, Lonny 3, La 2, Mikey 2, Bao 1 — matching
`season_tally["2011"]` exactly, for BOTH the Career and 2011-season columns, with correct
singular/plural wording ("1 HMOTW win" vs "6 HMOTW wins"). Confirmed the two-scale system renders
visibly different heights for the same value (Hanh's Career apex ~54px higher on screen than his
2011-season apex) — not just present in the formula. Confirmed via computed style that the card's
background is `rgba(0,0,0,0)` and border is `0px none`, per the explicit instruction.

---

## Entry 40 (2026-09-06, cont.) — Milestone 14: Cumulative Competence Chart + follow-up fix

**Real naming trap caught before building:** the hub's code has a `CSCC` ("Cumulative Salary Cap
Contributions" — a career-spanning version of the Milestone 10 ledger + its own donut pies) that is
COMPLETELY UNRELATED to Milestone 14's actual target. The real "Cumulative Competence Chart" is a
small nugget-style card (`type:'competence'`) — a points-per-finish leaderboard with hand-drawn
medal icons, sourced from `summary[year].competence` (already engine-computed, never re-derived).
Flagged this explicitly before writing any code, since building the wrong "cumulative" feature
would have been a real, easy-to-make mistake.

**Also found while in here:** `summary[year].topweeks`/`.lowweeks` — 40-entry all-time
highest/lowest single-week score leaderboards, genuinely cross-season by nature (confirmed:
"only considers scores up to and including the selected year", per the user), just look
season-scoped right now since 2011 is all there is.

**Decisions confirmed before building:**
- Structure: Competence built as its own standalone component (matching Dancing Shoes'
  precedent), not folded into NuggetGrid's generic rendering loop.
- Scope: topweeks/lowweeks built now too, not deferred to Milestone 17.
- Layout: all three cards (Competence, Highest Week, Lowest Week) split evenly on one row
  (33/33/33), REVERSING the hub's real 50/25/25 grid-cell proportions (`F1:F2`/`F3:F3`/`F4:F4`).
- Row count for topweeks/lowweeks: the user chose to match the hub's own real behavior — dynamic
  height-matching against Competence's actual rendered height, not a fixed row count, EVEN AFTER
  being shown that this is the same category of problem (DOM-measurement-driven layout) that the
  Milestone 7l nugget saga fought hard with. The user's own reasoning: Competence's list will grow
  in later seasons as more managers accumulate history, and topweeks/lowweeks should keep pace
  with whatever that height becomes — a real, forward-looking reason, not just repeating the
  earlier mistake. Noted the distinction in code: this is a 1D "how many rows fit vertically"
  problem (one sibling's real height, revealed row-by-row), not 7l's 2D masonry-placement problem
  (multiple cards' possible grid positions computed ahead of measurement) — a different, more
  tractable shape of problem, which is why it was accepted here.

**Types added** (were `unknown`): `SeasonSummaryEntry.competence/topweeks/lowweeks`, each verified
against real 2011 data before typing (`CompetenceRow`, `WeekExtremeRow`).

**Built:** `MedalIcon.tsx` — the hub's real hand-drawn medal (ribbon + gradient-shaded disc +
number), ported faithfully, not simplified to a flat icon. `CompetenceChart.tsx` — rank/points/name/
medals list + the absolutely-positioned "points per finish" legend, `min-height:300px` (matches the
hub's real `:has(.cc-list)` rule) so the legend never overlaps a short list. `WeekExtremeCard.tsx` —
shared component for both Highest/Lowest (same real `tw-row` markup, different accent + title).
`SeasonExtremesRow.tsx` — the 33/33/33 flex row, owns the height-matching: measures Competence's
real rendered height, stretches both other cards to match exactly, then reveals each week-list's
rows one at a time (measuring real row heights, same as the hub's `sumFitTopWeeks()`) until the
next row would overflow, hiding the rest. Resets all rows visible before each pass so a resize
that makes more room available isn't corrupted by previously-hidden (0-height) rows.

**Follow-up, same session:** Dancing Shoes' left accent border (added back in the Milestone 12
entry) was missing the rounded corners the nugget cards have — added `border-radius: 8px` to
match exactly. Verified via computed style (`borderRadius: "8px"`) and a screenshot.

**Verified for real, not assumed:** built + served the app, drove a real headless-Chromium session.
Confirmed all three columns render at identical widths (385px each, real 33/33/33) and identical
heights (300px each — Competence's own forced minimum, with the other two stretched to match
exactly, not just visually close). Confirmed the row-fit algorithm actually trims: Competence shows
all 6 of its 6 rows, Highest/Lowest Week each show 11 of their real 40 rows — the cutoff working as
designed, not hardcoded. Cross-checked every visible number against real data: competence points
(Hanh 10/Kito 5/Mikey 2/Bao 1/La 0.9/Lonny 0.8) and both leaderboards (Kito 168.00 Wk14, Hanh 63.00
Wk4, etc.) all match `summary["2011"]` exactly. Medal icons render as real shaded discs, not
placeholder shapes.

---

## Entry 41 (2026-09-06, cont.) — Two more cards: All-Time Longest Drought + All-Time Season Totals

**Real data checked before building, for both cards.** All-Time Longest Drought (ATDR) —
`meta.hmotw.atdr_snapshots[year]` — matched the user's reference screenshot exactly (La 14wks
ongoing, Lonny/Kito 11wks ended, Mikey 9wks ended, Bao 8wks ongoing + 8wks ended, Hanh 6wks ended,
Mikey 5wks ongoing, including the drought-icon thresholds). Genuinely buildable for 2011 as-is.

All-Time Season Totals was NOT: checked 2011's real authored-nugget data and found zero entries —
the user's reference screenshot (years 2018-2025) matches a known already-flagged deferred item, a
one-off authored nugget that first appears around 2025, not a per-season engine feature. Flagged
this before building anything. **User's resolution:** redefine it as a genuinely dynamic
leaderboard — every manager-season's final point total across every season through the selected
year, ranked, always real for any year (for 2011 specifically: all 6 managers from that one
season). Checked `all_time_scores` and `cumulative` first — neither is this ranking, so it's a real
client-side derivation (`lib/computeSeasonTotals.ts`), not a re-implementation of something the
engine already computed.

**Built:** `AtdrCard.tsx` (rank-color gradient, drought-severity icons, `fmtWkLabel`'s real
no-space "WK04" format — confirmed distinct from `WeekExtremeCard`'s spaced "WK 04" format, both
ported exactly as the hub has them, not unified). `SeasonTotalsCard.tsx` — genuinely new, no hub
markup to port since it never existed as a standalone feature; visual style follows the user's
reference screenshot. Top-15 cap per explicit request (shows only 6 for 2011 — correctly not
padded with fake entries). Placed as their own 50/50 row, directly above the Dancing
Shoes/DroughtBars row — matching the hub's real relative order (ATDR sat right before Dancing
Shoes in its original grid position).

**Types added** (were `unknown`): `HmotwMeta.atdr_snapshots: Record<string, AtdrRow[]>`.

**Verified for real:** built + served the app, drove a real headless-Chromium session. Confirmed
both columns render at identical widths (589px each, real 50/50). ATDR's full text output matches
the reference screenshot row-for-row. Season Totals shows exactly 6 ranked entries (Hanh 1,952.00
→ Lonny 1,755.00, all year (2011)) matching a hand-computed expected ranking from real
`cum_points` finals — not just plausible-looking, actually recomputed independently and compared.

**Follow-up fix, same round:** the two cards' heights didn't match (ATDR 266px vs Season Totals
218px, since ATDR naturally has more rows for 2011). Fixed with `align-items: stretch` on the row
plus `height: 100%` on both cards, rather than a fixed value — so it keeps matching correctly as
ATDR's real row count changes in future seasons. Verified via computed height: both now exactly
266px.

---

## Entry 42 (2026-09-06, cont.) — Career Salary Cap Contributions (CSCC)

Built the "CSCC" feature flagged as unrelated during Milestone 14's grounding — a career-spanning
version of the Milestone 10 ledger (`data.cumulative[year]`, every dollar summed 2011 through the
selected season, includes every manager who's ever played) plus its own donut pies. Verified the
real `renderCSCC()`/`renderCSCCPies()` first: `renderCSCCPies` is literally the SAME engine as
Milestone 10's donuts (`sccInitPie`), just reading `cumulative` instead of `payouts` — so
`SalaryDonuts.tsx` was generalized (title/subtitle/winners-losers-titles now overridable props,
row type loosened to `{m,net}[]`) and reused directly rather than duplicating a second pie engine.
`SalaryLedgerTable.tsx` was similarly generalized to accept either `PayoutRow[]` or the new
`CumulativeRow[]` via a shared `LedgerRowLike` shape, plus a `seasonPurseLabel` prop ("Season" vs
"Career" — matches the hub's real per-table label swap) and `.departed` row styling (opacity-1,
desaturated text/net-color, ported from the hub's real `.ptbl tr.departed` rules) for managers no
longer active in the selected year — not visually exercised by 2011 (zero departed managers exist
yet) but built correctly for when it will be.

**Rename, per explicit request:** both "Cumulative Salary Cap Contributions" titles (the ledger
table AND the donut-pies section) renamed to "Career Salary Cap Contributions" — the pie-box
titles ("Cumulative Winners"/"Cumulative Losers") were NOT part of the rename and stay as-is.

**Types added** (was `unknown`): `cumulative: Record<string, CumulativeEntry>`, with a new
`CumulativeRow` interface verified against real data (same fields as `PayoutRow` minus `ring`/
`seas`, plus `active: boolean`).

**Placement:** last on the page, after all existing Salary content (Rules card, SCC ledger, SCC
donuts) — per explicit user choice, not matching any specific hub position (the hub's own layout
has CSCC there too, so this happens to align, but the choice was made independently).

**A real, verified (not "fixed") behavioral difference caught while checking the data:** CSCC's
"Finish" column ranks by cumulative NET MONEY (rank 1 = most earned through that year), while
SCC's "Finish" ranks by season standing — confirmed via real data (Lonny is 6th by season points
but 4th by career net) and matches the hub's own documented comment exactly. Left as-is, not
"corrected" to match SCC's ranking, since it's intentionally a different metric.

**A real bug caught and fixed during verification:** the donut-pies title used a `\u2014` escape
inside a bare JSX attribute (`title="...\u2014..."`), which JSX does NOT interpret as a unicode
escape (unlike a real JS string expression) — it rendered as the literal 6 characters `\u2014`
instead of an em-dash. Caught by reading the actual rendered title text back from the DOM, not by
inspecting the source. Fixed by using the literal em-dash character directly.

**Verified for real:** built + served the app, drove a real headless-Chromium session. Confirmed
both new titles render correctly (including the em-dash, post-fix). Confirmed the ledger's row
data matches `cumulative["2011"]` exactly (same values as the SCC table for 2011, since it's the
only season so far, but with the real cumulative-rank Finish column). Screenshot confirms visual
match to the user's reference image.

**Follow-up verification, same round:** user asked for confirmation that CSCC actually updates
year by year. Rather than just asserting it from the code (`data.cumulative[year]` is read fresh
per route param), navigated the real app directly to `/season/2015` — a route not linked anywhere
in the sidebar (still restricted to 2011-only) but backed by real data in `site_data.json` for all
15 seasons. Got a genuinely different, correct result: 13 managers (not 6), every net value
matching real `cumulative["2015"]` exactly, and — for the first time — the `.departed` dimming
actually fired for real (Lonny/Lam/Bao, confirmed both via className and visually in a screenshot),
since 2015 has real departed managers where 2011 had none. This is real proof of forward
compatibility, not just an assertion from reading the code.

---

## Entry 43 (2026-09-06, cont.) — Milestone 9 (simplified): click-to-pin + Money Circle toggle

**Resequencing honored:** per the original plan, Milestone 9 was revisited before Milestone 15,
now that every filter-reactive panel from the hub exists in the RB. Re-recapped against the real
hub filter code with the current, much larger panel set in mind (8 panels now need manager-filter
wiring, was 3 when first recapped) before building anything.

**Major scope simplification, per explicit user request:** the hub's real filter bar (All Managers/
Clear All/Money Circle/one pill per individual manager, plus a full Filter Weeks bar) is NOT what
got built. Instead: (1) a plain 2-state All Managers/Money Circle toggle only — no individual pills,
no Clear All, no week filter at all; (2) individual-manager selection is instead handled by a new
click-to-pin system layered onto the existing hover infrastructure, at the user's explicit request,
walked through in detail before building.

**Click-to-pin, built and verified first (a bigger, separate piece from the toggle itself):**
- `HoveredManagerContext` now tracks `hovered` (transient) + `pinned` (persistent) + `displayed`
  (hover overrides pin, falls back to pin on mouse-leave) — matches all the user's confirmed rules
  exactly: click pins; clicking a different manager switches immediately; only a background click
  (not the same manager again) clears the pin; hovering another manager while pinned temporarily
  overrides, reverting to the pin on mouse-leave.
- Retrofitted onto all 6 places that already had hover (`ScoreTable`, `BumpChart` — all 3 hover
  sites, `DespairDifferential`, `ScoringSpreadIndex`, `DroughtBars`, `ManagerHoverCard` — now reads
  `displayed` so it stays open while pinned).
- Found and added hover+click-to-pin to 5 components that had NEITHER before (a real gap surfaced
  by checking every file that color-codes a manager name): `AtdrCard`, `CompetenceChart`,
  `WeekExtremeCard`, `SalaryLedgerTable`, and `PeakPerformance` (canvas-based — needed click
  hit-testing added alongside its existing tooltip hit-testing, plus a new SEPARATE `hoverDisplayed`
  dim layer in `lib/drawPeakChart.ts`, independent from its `spotlit` filter-dim scaffolding since
  those are two different concepts that both happen to affect the same canvas).
- **Real bug caught and fixed:** the background-click-clears-pin handler was placed on
  `.season-page`, but the Milestone 7r content-width cap means the empty side margins on a wide
  screen are actually part of `.layout-body`'s own background, outside both `.season-page` and
  `.layout-content`. Caught via a real click-coordinate test (`elementFromPoint`) that showed the
  click landing on `.layout-body`, not `.season-page` — moved the handler up to `Layout.tsx`'s
  `.layout-body` div and re-verified with the exact coordinates that failed before.
- Verified the full sequence end-to-end via real headless-Chromium clicks (not assumed from the
  code): click Hanh → pin persists after mouse leaves; hover Kito → temporarily shows Kito; leave
  Kito → reverts to Hanh; click background → clears to nothing. Also verified cross-panel
  consistency with a screenshot: clicking La in ATDR correctly dims every other panel's rows/bars
  simultaneously and keeps `ManagerHoverCard` open.

**Money Circle toggle:** `ManagerFilterContext` (simple `'all' | 'moneyCircle'` state) +
`ManagerFilterToggle.tsx`, styled with the hub's real `.fpill.money`/`.fpill.money.active` rule
(both pills share that green treatment in the actual hub markup, confirmed before styling — Money
Circle isn't visually distinct from All Managers). Placed between the info tiles and the scoreboard,
per explicit instruction — NOT the hub's real position (between Hero and Recap), a deliberate
divergence confirmed with the user first.

**Wired into all 8 panels the hub's real filter code touches, verified against real 2011 data
(`money_circle: ['Hanh','Kito','Mikey']`) via real clicks on the live toggle:**
- `ScoreTable` — non-money-circle rows removed from the array entirely (hide, matching the hub).
  Verified: only Hanh/Kito/Mikey render.
- `BumpChart` — lines/dots/edge-labels dim (combined multiplicatively with the existing hover-dim).
  **Explicitly scoped out and flagged, not silently skipped:** the race-car sequence still includes
  every manager regardless of the filter — roll delays, finish times, and the animation frame loop
  are all keyed by `season.active_managers` across several hooks that took multiple sub-milestones
  (7h/7i/7m) to get right; restructuring that to filter which cars race was judged a real risk not
  worth taking for this pass. Verified dim via computed opacity: Bao/La/Lonny at 0.25, Hanh/Kito/
  Mikey at 1.
- `DespairDifferential` — dims lines/dots/labels; ALSO corrected the Y-axis scaling to only
  consider spotlit managers' gaps (matches the hub exactly — previously approximated as "everyone"
  since no filter existed). Verified: 3 SVG groups at opacity 0.25, 3 at 1.
- `ScoringSpreadIndex` — dims dots only; confirmed via the hub's real code that the axis range,
  average line, and weekly whisker are UNAFFECTED by the filter (computed from all managers
  regardless) — left those alone rather than assuming they should also filter.
- `DroughtBars` — dims rows (reuses its own established 0.5 dim value, not the 0.25 used
  elsewhere, kept internally consistent with its own hover-dim). Verified via computed opacity.
- `PeakPerformance` — swapped the placeholder `spotlit` set (already wired in from the Milestone 13
  build) for the real filter-derived set.
- `SalaryLedgerTable` (both the SCC and CSCC instances) — new `moneyCircle` prop, applies the
  dormant `.faded` class from Milestone 10 (now actually exercised for the first time). Verified via
  computed style on the actual `<td>` (0.2 opacity) for both tables identically.

**Not done in this pass, deliberately out of scope per the user's simplification:** the week
filter (Filter Weeks bar, Q1-Q4) — explicitly declined; ScoreTable's week-column-hiding and
Total-over-visible-weeks recompute, and Spread's week-limiting, were never built since there's no
week filter to drive them.

---

## Entry 44 (2026-09-06, cont.) — Milestone 15 review, in progress: FootballTransition zoom bug

**Milestone 15 (2011 full review & template lock) started.** Did a full top-to-bottom render of
the current 2011 page (7 sequential screenshots) for the user's review — everything checked out
clean except one screenshot that looked under-animated; confirmed via a longer-wait re-shoot that
this was the review script itself not waiting long enough for NuggetGrid's known page-turn
animation, not a real bug. Shared the full walkthrough and asked for the user's reaction — this is
explicitly a "get sign-off" milestone, not something completed unilaterally.

**Before continuing, the user asked a specific question:** what's the zoom range of
`FootballTransition`'s random background image? Answered from the code (150%-400% random target,
per the comment) — this prompted the user to also ask whether it could ever show 125% zoom, which
led to checking the OTHER zoom value in play (`fitZoom`, the "whole image visible" resting state)
for real, rather than just answering from the formula.

**Real bug #1, found while checking:** `fitZoom`'s ref (`setRefs`) was combined onto the OUTER
`.wrap` element, not the inner `.frame` element whose actual box the "contain" math needs — so
`frameWidth`/`frameHeight` were really measuring the wrong box entirely. First fix attempt: move
the `useElementSize` ref directly onto the `.frame` `motion.div`. This did NOT work — Framer
Motion's own ref-forwarding on `motion.div` never let the ResizeObserver fire, so the measurement
stayed stuck at the fallback default no matter what. Real fix: `.frame`'s size is entirely
CSS-derived (55% of `.wrap`'s width, fixed 300px height) — derive it analytically from `.wrap`'s
reliably-measured width (`frameWidth = wrapWidth * 0.55`) instead of trying to measure `.frame`
directly at all.

**Real bug #2, found while re-verifying bug #1's fix (a second, independent bug hiding behind the
first):** even after the derivation fix, the RENDERED CSS still showed stale, fallback-based zoom
values, while a debug instrumentation pass (temporarily exposing `fitZoom` via data-attributes)
showed the underlying value computing CORRECTLY. Root cause: `zoom` state was seeded once via
`useState(fitZoom)` at mount — capturing whatever `fitZoom` was AT THAT INSTANT, using the fallback
dimensions since the ResizeObserver hadn't reported real ones yet — and the `useEffect` meant to
keep it in sync only re-ran on `[isInView, reduceMotion]`, not when `fitZoom` itself later updated
to the real value. The old exhaustive-deps comment's claim that "fitZoom/targetZoom are stable
per-mount" was true for `targetZoom` (a real `useMemo` with empty deps) but false for `fitZoom`
(depends on the async-arriving real frame width) — fixed by adding `fitZoom` to that effect's
dependency array.

**A real false lead along the way, corrected before it caused wasted work:** midway through
debugging, a rebuild command appears to have been cut off before completing (confirmed via file
mtimes — the built JS was OLDER than the source edit it should have included), causing several
confusing "still broken" readings that were actually just a stale `dist/`. Caught this by comparing
timestamps rather than concluding the fix itself was wrong, and re-ran the build as two separate
commands (typecheck, then build) to confirm completion before re-testing.

**Rolled in per explicit request:** changed the random target zoom range from 150%-400% to
150%-250%.

**Verified for real, end to end:** hand-computed the expected "contain" fitZoom for both real
source images at several real measured frame widths, then confirmed the rendered inline style
matched to 4 decimal places (e.g. football-1 at frame width 661.1px -> 56.6125%, football-2 at
448.8px -> 66.8449%) — not just "it looks reasonable." Also confirmed the in-view target zoom lands
within the new 150%-250% range (sampled 210.096%) via a real screenshot, correctly cropped/zoomed
and positioned.

**Milestone 15 status:** still awaiting the user's reaction to the full page walkthrough before
locking the design-direction section, noting template-vs-2011-specific parts, and adding the
LOCKED badge.

---

## Entry 45 (2026-09-06, cont.) — Milestone 15 CONFIRMED DONE: LOCKED badge + template lock

**User confirmed the design** after reviewing the full 2011 page walkthrough and asked for 2011's
layout to be the template for subsequent years — this is the actual completion gate for Milestone
15 (a review/sign-off milestone, not something completable unilaterally).

**LOCKED badge built:** `lib/lockedYears.ts` — a plain `Set<number>` of years that have passed
their own review (currently just `[2011]`), NOT computed by the engine — this is an editorial
decision, added to as each subsequent season's own review passes during Milestone 16. Unlike the
hub's real badge (shown unconditionally on every season, since the hub is a finished site where
every season is already done), the RB's version is conditional on this list, since seasons are
being built and reviewed one at a time. Placed in `SeasonHero`'s eyebrow line (next to "2011 · 6
managers · 17 weeks") rather than a literal "season title" — the RB redesigned the hub's simple
title/sub header into this eyebrow+headline structure, and the eyebrow is the closest equivalent
to what the hub's badge sat next to (a systematic season-identifier, not the creative recap
headline "The Easel Pad Era"). Styled with the hub's real `.lock-badge` values (green pill,
`#4ec79e`, lock emoji), confirmed via the real hub CSS before building, not guessed from a
screenshot.

**Small gap found and fixed while in `SeasonHero.tsx`:** the champion name's hover handler only
destructured `onMouseEnter`/`onMouseLeave` from `useManagerHover`, missing the `onClick` the hook
now provides (added during the Milestone 9 click-to-pin work) — so the hero's champion name was
the one remaining place on the page where click-to-pin silently didn't work. Fixed by wiring
`onClick={championHover.onClick}` too.

**Template vs 2011-specific**, written into `SKILL.md`'s Design direction section: every component,
layout position, panel ordering, and sub-milestone visual/behavioral decision is template — reusable
as-is. NOT template: the recap's prose/title/subtitle, the Dancing Shoes roast body, every
NuggetGrid card's content/placement, and the LOCKED badge's inclusion itself (an editorial per-year
decision) — these come from that season's own real authored data every time, not from copying
2011's specific wording.

**Docs updated:** `SKILL.md` (Status line + Design direction section, replacing "not yet reached"),
`README.md` (Status + Next concrete step, now pointing at Milestone 16), `ROADMAP.md` (Milestone 15
section marked DONE with a note on each checklist item).

**Verified for real:** built + served the app, confirmed the badge renders correctly (green pill,
lock emoji, "LOCKED" text — `text-transform: uppercase` correctly overriding the eyebrow's inherited
`lowercase`) via a real screenshot.

---

## Entry 46 (2026-09-06, cont.) — Milestone 16 begins: 2012 + 2013 rolled out

**First batch of the locked-template rollout** (2-3 seasons per session, per the roadmap). Checked
real underlying data for genuine structural edge cases BEFORE touching any code, per the roadmap's
explicit "stop and ask" instruction for things like ties or partial seasons:
- No partial-season managers in 2012/2013 (every manager has all 17 weeks' real scores, no nulls).
- Real exact-score ties DO exist within several weeks of both seasons, including two genuine
  HMOTW ties (2012 Week 3: Damian/La at 165.0; Week 10: Douang/Mikey at 147.0). Checked
  `hmotw_tally` directly — confirmed the engine already splits HMOTW credit in half for a tie
  (fractional values like 5.5, 1.5, 3.5 appear directly in the real data) — not something the RB
  needs to compute itself.
- Checked `weekly_rank` specifically (the actual BumpChart/PeakPerformance data source, a
  STANDINGS rank, not a raw weekly-score rank) for duplicate values across every week of both
  seasons — none found, so no genuine line-crossing/overlap edge case for the bump chart from
  these two ties.

**Verified the template handles both real ties correctly with ZERO code changes**, by reading the
actual rendered DOM (not just re-reading the code): `ScoreTable`'s weekly-high pill correctly
applied to BOTH tied managers in both cases (confirmed via `pillMustard` class on both cells) —
works by construction, since the check is per-row against the week's max, not a single hardcoded
winner.

**A genuinely new visual state got exercised for the first time this rollout:** 2013 has two
scores that are both >=200 points AND that week's high (Bao's 204.0 in Week 9, Kevin's 256.0 in
Week 15) — the "diag" pill (a 45° red/gold split gradient, for a "double achievement" score) had
never rendered in either 2011 or 2012. Confirmed it renders correctly via a tight cropped
screenshot showing the real diagonal gradient, not a broken/flat color.

**Did a full top-to-bottom screenshot sweep of both 2012 (8 shots) and 2013 (9 shots, lighter pass
given how clean 2012 came back).** Extensive real cross-season confirmation, not just visual
plausibility:
- Peak Performance now shows 2-3 real season columns per manager, correctly sparse for managers
  who joined late (Damian: no 2011 bar) or departed (Lonny: only a 2011 bar in "Inactive," Lam:
  only a 2012 bar).
- ATDR shows genuinely separate entries for the same manager across the season boundary (Kito:
  one ended-2011 streak, one ongoing-2012 streak).
- Dancing Shoes' authored prose for 2012 correctly narrates Bao's real 25-week CROSS-SEASON
  drought (started 2011 W10, still running through all of 2012) — matches `drought_snapshot`
  exactly.
- Season Totals correctly mixes years for the same manager (Hanh appears twice: 1952 in 2011,
  1940 in 2012).
- Both Career (CSCC) ledger and donuts correctly extend to include Lonny (departed, dimmed) with
  his real carried-over career net.
- Competence Chart's medal counts correctly accumulate across multiple seasons (multiple medal
  icons per manager where warranted).
- One 2012 nugget's authored prose ("Twin 197s") independently confirms it was ALREADY written
  with the Week 5/Week 8 HMOTW tie in mind — the pre-existing recap/nugget content in
  `site_data.json` anticipated these edge cases correctly on its own.

**No code changes were needed for either season** — this really is "plug the data through the
locked template," exactly as the roadmap predicted.

**Rolled out:** `Layout.tsx`'s sidebar filter widened to `2011 <= y <= 2013` (was 2011-only).
`lib/lockedYears.ts` updated to `[2011, 2012, 2013]`. Verified via a real click through the sidebar
(not just the URL): years appear newest-first (2013/2012/2011), clicking 2013 navigates correctly
and shows its own LOCKED badge.

---

## Entry 47 (2026-09-06, cont.) — Milestone 16 batch 2: 2014, 2015, 2016 rolled out

**Second batch of the locked-template rollout.** Checked real underlying data for structural edge
cases BEFORE touching code, per the established discipline: no partial-season managers, no nulls,
identical 10-manager roster across all three years. Two more genuine 2-way HMOTW ties (2014 Wk13:
Mikey/Randy at 192.0; 2016 Wk17: Damian/Douang at 163.0), both already split correctly in
`hmotw_tally` — no 3+-way ties, no duplicate `weekly_rank` values.

**A real, already-shipped discrepancy surfaced and resolved before any code was touched.** Back in
Milestone 4, the score-cell ≥200 red/diag pill rule was explicitly flagged to gate to 2017+ only
— since it visually represents the engine's DHMOTW rule, which the `tncfl-hmotw-engine` skill
confirms does nothing pre-2017. That gate was never actually implemented when the pill system was
built for real in Milestone 7g, and went unnoticed through batch 1's 2013 rollout despite 2013
having 7 real ≥200 scores (Kevin 256.0, Douang 217.0, etc.) already rendering the ungated pill.
Surfaced this to the user via a tappable question before proceeding, since 2014-2016 have more of
the same (2/3/2 real ≥200 scores respectively) and it would compound the same way. **User's locked
call: keep it ungated — apply the ≥200 pill rule uniformly across every season, for visual
consistency, rather than retrofitting the gate.** This reverses the original Milestone 4 note
(corrected in `ROADMAP.md`); 2013's already-shipped pills are correct as-is and needed no rework.

**Verification method, flagged honestly rather than glossed over:** this session's sandbox had no
network access to download a headless-Chromium binary, so the literal screenshot/DOM checks batch
1 used (Entry 46) weren't possible here. Verified instead via direct data-level checks against
`site_data.json`, replicating each cross-season component's real logic in Python rather than in
the browser:
- Peak Performance's Active/Inactive split — confirmed real departed-manager HMOTW wins exist
  through each of 2014/2015/2016 (Bao, Lonny, Lam all have real pre-departure wins), so the
  Inactive panel renders real content for all three years, not an empty state.
- ATDR snapshot entries present and growing correctly (37 entries by 2014, 60 by 2016).
- Season Totals' derived top-N ranking recomputed independently in Python and cross-checked
  (Randy 2761.0 in 2014 leads through 2016 until Damian's 2624.0 in 2016 breaks into the top 3).
- Competence's per-year point growth confirmed as engine-computed (already-cumulative `pts` values
  climbing year over year for the same manager), not something the component derives itself.
- Dancing Shoes' authored victim cross-checked against real drought data SCOPED TO ACTIVE MANAGERS
  ONLY (matching `DroughtBars`'/`DancingShoes`' actual real behavior) — all three years matched
  exactly: 2014 Kito 45wks, 2015 Douang 38wks, 2016 Tony 23wks. (An unscoped top-drought check
  would have wrongly flagged a mismatch for 2015/2016, since Bao — long departed by then — has a
  higher raw drought number than any active manager; re-scoping to active-only resolved this.)
- Grepped the whole `tncfl-record-book/src` tree for any other hardcoded 2011-2013 year-range
  assumptions beyond the two known lines (`Layout.tsx`'s sidebar filter, `lockedYears.ts`) — none
  found.

**This confirms data correctness but not actual pixel rendering** — flagged explicitly in
`SKILL.md`/`README.md`/`ROADMAP.md` rather than silently treating this batch as being at the same
verification bar as batches with real browser screenshots. A real visual pass on 2014-2016 is
still worth doing whenever headless-browser access is available.

**No code changes were needed for any of the three seasons** beyond the pill-gate documentation
correction (which was a decision to leave code as-is, not a fix).

**Rolled out:** `Layout.tsx`'s sidebar filter widened to `2011 <= y <= 2016` (was `<= 2013`).
`lib/lockedYears.ts` updated to `[2011, 2012, 2013, 2014, 2015, 2016]`. Built clean (`tsc -b` +
`vite build`, zero errors).

**Flagged for next session:** batch 3 (e.g. 2017-2019) should specifically check for DHMOTW
actually activating for the first time (2017+), since that's a genuinely new engine behavior none
of batches 1-2 have exercised yet — not just reuse the same tie/partial-season edge-case list.

---

## Entry 48 (2026-09-06, cont.) — ATDR/Season Totals row-count fix

**User caught a real gap by asking directly** whether ATDR was capped at 20 entries. Checked the
actual code rather than assuming: it wasn't capped at all — `SeasonPage.tsx` passed
`meta.hmotw.atdr_snapshots[year]` straight through with no slice, so 2014-2016 were rendering 37,
48, and 60 rows unbounded. Also found the component's own in-code comment was simply wrong,
claiming "a top-10 all-time drought streak leaderboard... ported from the old hub's real
`atdrBody()`" — checked the real hub source to confirm, and it doesn't cap at any fixed number
either; it renders every row hidden and reveals only as many as fit the Dancing Shoes sibling
card's real measured height (`sumFitAtdr()`), the same "reveal rows to match a sibling's height"
pattern already built for `SeasonExtremesRow.tsx`'s Highest/Lowest Week leaderboards.

**User's decision, for both ATDR and Season Totals (ATST):** cap the underlying data at the top
50, but only show 15 rows visible at once with the rest reachable via scroll — a deliberate
departure from both the hub's real sibling-height-matching mechanism and from Season Totals'
previous flat top-15-with-no-more.

**Built:** `lib/useRowCapHeight.ts` — a small shared hook, real-measurement based (via
`useElementSize` on a ref attached to the first rendered row) rather than a guessed pixel constant,
consistent with the project's established discipline of measuring real DOM heights over hand-tuned
numbers. Returns `maxHeight = oneRowHeight * 15`, used by both cards to cap a `overflow-y: auto`
scroll wrapper around their list. `AtdrCard.tsx` and `SeasonTotalsCard.tsx` both updated to use it,
plus a themed thin scrollbar (`scrollbar-width: thin` + matching `::-webkit-scrollbar` rules) added
to each card's CSS module rather than leaving the browser's default scrollbar. `SeasonPage.tsx`:
`atdrRows` now `.slice(0, 50)` (was unbounded); `computeSeasonTotals`'s limit argument raised from
15 to 50 (component's own visible-window cap handles the 15-at-a-time display now, not the data
layer).

**Verified via direct data checks** (same network-sandbox caveat as batch 2 — no headless-browser
access this session either): 2016's ATDR (60 real entries) correctly slices to the top 50 (last
rank in slice: 50); 2011 (8 real entries, well under 50) passes through unchanged. Season Totals
through 2016 (56 real manager-season entries) correctly slices to the top 50 (rank 1: Randy 2761.0
in 2014; rank 50: Hanh 1940.0 in 2012). Build clean (`tsc -b` + `vite build`, zero errors). A real
visual/scroll-interaction check (does the 15-row window actually look and scroll right) is still
pending browser access, same flag as batch 2's entries.

---

## Entry 49 (2026-09-06, cont.) — Real bug from user's screenshot: ATST cap wasn't applying at all

**User caught this from a real screenshot**, not a report — 2013's page showed ATDR correctly
capped with a working scrollbar, but Season Totals (ATST) rendering all 26 real rows fully
visible, no scrollbar, no cap at all — a genuine asymmetry between two components built with
identical code moments earlier.

**Root cause, best diagnosis available without browser access this session (flagged honestly,
not overclaimed as certain):** both cards sit in one flex row with `align-items: stretch`. On
first paint, before either card's row-height ResizeObserver has fired, both render at full
natural (uncapped) height — and the row's cross-size locks to whichever is naturally taller.
`useRowCapHeight`'s previous `maxHeight: undefined` fallback (until measured) meant "no cap yet"
was indistinguishable from "genuinely uncapped" — if a card's measurement stalled or got
overridden by the stretch-driven layout pass, it could end up with no effective cap at all, which
matches exactly what the screenshot showed for ATST.

**Fixed two ways, not one, since the exact timing mechanism couldn't be confirmed without a real
browser:**
1. **Removed `align-items: stretch`** from the row wrapping `AtdrCard`/`SeasonTotalsCard` in
   `SeasonPage.tsx` (changed to `flex-start`) — removes the cross-card height coupling entirely.
   Neither card needs to match the other's height anymore now that each caps itself
   independently; this was only ever needed pre-cap, when row counts (and therefore natural
   heights) could differ a lot between the two.
2. **`useRowCapHeight` now takes a generous non-zero fallback row height (32px)** instead of 0 —
   guarantees a cap is ALWAYS active from the very first render, refined to the real measured
   value once it arrives, rather than "no cap until measured" ever being a reachable state.
   Deliberately generous: overestimating just shows a bit more than 15 rows briefly;
   underestimating is equally safe since `max-height` + `overflow` never clips text mid-row, it
   only changes how much is visible before scrolling starts.

Also removed the now-vestigial `height: 100%` from both cards' `.card` class (was only meaningful
alongside the removed `align-items: stretch`).

**Verified:** build clean (`tsc -b` + `vite build`, zero errors). **Not yet re-verified visually**
— this session still has no headless-browser access, so I can't confirm the fix actually resolves
the screenshot's exact symptom the way the earlier data-level checks could confirm correctness.
Flagged clearly: this needs the user's own visual confirmation next, same as batch 2 and the
original row-cap build.

---

## Entry 50 (2026-09-06, cont.) — 15px buffer between row content and the scrollbar

**Request:** the scrollbar sat flush against the row content's rightmost text (the date-range
span in ATDR, the year in Season Totals) with no breathing room.

**Fixed:** `padding-right: 15px` added to both cards' `.scrollWrap` — pushes the row content 15px
away from the scrollWrap's own right edge, where the scrollbar renders, without affecting the
maxHeight cap (padding only changes width, not the row-height measurement `useRowCapHeight`
depends on). Applied identically to both `AtdrCard.module.css` and `SeasonTotalsCard.module.css`.

**Verified:** build clean (`tsc -b` + `vite build`, zero errors). Same caveat as the last two
entries — no headless-browser access this session, so the actual visual spacing hasn't been
screenshot-confirmed on this end.

---

## Entry 51 (2026-09-06, cont.) — ATDR/ATST now share ONE height (ATDR's 15-entry height is the source)

**Request:** stop trying to make both cards independently cap to "15 rows visible" (which could
differ slightly since the two cards' rows aren't the same height) — instead, ATDR's own 15-entry
height becomes THE reference height, and Season Totals just uses that same height, showing
however many of its own rows happen to fit in it. Both still scroll internally to reach their
real top-50 data.

**Restructured the height ownership, not just the CSS:** `useRowCapHeight(15)` now lives in
`SeasonPage.tsx` (the shared parent), called once. `AtdrCard` no longer owns its own hook call —
it receives `rowRef` (to attach to its own first row, so the SOURCE measurement still comes from
its real content) and `maxHeight` as props. `SeasonTotalsCard` drops `useRowCapHeight` and its own
row-ref entirely — it now just takes `maxHeight` as a prop and applies it directly, with no
measurement of its own rows at all. Both `<AtdrCard>` and `<SeasonTotalsCard>` in `SeasonPage.tsx`
now receive the exact same `atdrMaxHeight` value.

This also fully resolves the class of bug from Entry 49 in a more robust way than the fallback-
height patch alone did — there's no longer two independent measurements that could drift or race
against each other; there's exactly one source of truth, consumed identically by both.

**Verified:** build clean (`tsc -b` + `vite build`, zero errors). Same standing caveat as the
previous several entries — no headless-browser access this session, so the real visual result
(does Season Totals genuinely end up the same height as ATDR, with a sensible row count showing)
hasn't been screenshot-confirmed on this end yet.

---

## Entry 52 (2026-09-06, cont.) — Real bug: DroughtBars scaling against departed managers, not active max

**User caught this from a real screenshot** of 2016's "Thirsting for a W" — Tony's bar (23 weeks,
the real max among active managers) rendered at roughly 39% width, when a lone highest bar should
reach close to 100%.

**Root cause, confirmed against the real hub source, not guessed:** `maxDrought` was computed as
`Math.max(...Object.values(snapshot), 1)` over the ENTIRE raw `drought_snapshot` object, which
includes every manager who has ever played — active or long departed — not just the active
managers actually rendered in this chart. For 2016, that snapshot includes Bao at 59 weeks (Bao
departed years earlier and isn't shown in this chart at all), so Tony's real active-max of 23 was
being scaled against 59 instead of 23 (23/59 ≈ 39%, matching the screenshot exactly).

Checked the real hub's actual `renderThirst()` to confirm the correct rule rather than guess one:
it filters to `status_by_year[year]==='A'` FIRST, then computes `maxD` only from that active-only
list (`Math.max(1, ...rows.map(r=>r.d))`) — our port had been computing the max over the wrong
(unfiltered) set the whole time.

**Checked whether this also affected already-shipped seasons, not just the one in the
screenshot:** ran the same active-vs-full-snapshot max comparison across 2011-2016 — 2011-2014
happened to be unaffected (the departed-manager max never exceeded the active max in those years,
pure coincidence), but **2015 was also genuinely bugged** (Bao's departed 42-week drought inflated
the scale against Douang's real active max of 38 — a less visually dramatic ~90%-not-100% error,
easy to miss without noticing). Both 2015 and 2016 needed this fix, not just 2016.

**Fixed:** `maxDrought` now computed from `sorted.map((m) => snapshot[m] ?? 0)` — the same
active-manager list already used to render the bars — instead of the raw snapshot object.

**Verified via direct data recomputation** (same sandbox caveat, no browser access): for 2016,
Tony now correctly scales to 100% (was ~39%), Kito to 83%, Hanh to 70%, down to Douang/Damian at
0%. For 2015, Douang now correctly scales to 100% (was ~90%). Build clean (`tsc -b` + `vite
build`, zero errors). Visual confirmation on the user's end still pending, same as recent entries.

---

## Entry 53 (2026-09-06, cont.) — Milestone 16 batch 3: 2017, 2018, 2019 rolled out

**Third batch of the locked-template rollout**, deliberately chosen (see Entry 47's note in
ROADMAP.md) to exercise DHMOTW — the 2.0 tally credit for a sole ≥200 winner — actually turning on
for the first time. 2017 itself has zero DHMOTW-eligible weeks, but 2018 has six; hand-verified
every one of them against `hmotw_tally`: Kito's ONLY win all season was a sole 210 at week 7, and
his tally is exactly 2.0, not 1.0 — the cleanest possible isolated case. Cross-checked every other
manager's full-season total by summing 1.0-per-normal-win + 2.0-per-DHMOTW-win — every one matches
(Kevin 1+2+1+1=5.0, Mikey 2+1+1+1=5.0, Randy 2+1+1=4.0, Damian 2+2=4.0). The engine's own DHMOTW
logic needed no fix at all.

**2019 introduced a genuinely new edge case: a returning manager.** Bao was active 2011-2013,
inactive 2014-2018, then active again in 2019 — the first comeback either batch 1 or 2 had seen
(prior batches only ever saw one-way departures or first-time joins). Before touching any code,
checked every cross-season, status-dependent component:
- **Peak Performance** — `statusByYear = meta.hmotw.status_by_year[String(year)]` is read fresh
  per season render; `active`/`departed` are recomputed from THAT year's status every time, with
  no caching. For 2019's page Bao's status is `'A'`, landing him in Active automatically; for
  2017/2018's pages he's still `'I'`, correctly Inactive. `drawPeakChart` itself is fully
  stateless — it only draws whatever `candidateManagers` array it's handed for the current render.
- **ATDR's departed-row dimming** and **Drought Bars** — same pattern, both derive "departed"
  purely from that year's `statusByYear`/`active_managers`.
- **Season Totals** — iterates each season independently; a gap year for a manager just means no
  entry pushed for those years, never a crash (guaranteed since it only reads
  `season.cum_points[m]` for years that manager IS in `season.active_managers`).
- **BumpChart / Salary Donuts** — fully single-season scoped, don't touch cross-season status.
- Confirmed `active_managers` and `status_by_year` agree exactly for all 9 years including 2019
  (no contradictory upstream data that could paper over a real bug).

**Proved it with a real build, not just code review:** temporarily widened
`lockedYears.ts`/`Layout.tsx` to include 2019 and ran `tsc -b` + `vite build` — clean, no errors —
before reverting and then committing to the actual rollout once the user gave the go-ahead.

2019 also has a brand-new manager (Ted, joining for the first time — same "no bars before their
join year" pattern Damian already exercised in batch 1) and one genuine 2-way tie (Wk10:
Hanh/Mikey at 162.0, already the established, already-correct tie-handling pattern).

**Full real-data sweep, same discipline as prior batches:** Dancing Shoes' authored victims
matched the real active-scoped top drought exactly for all three years (2017 Randy 26wks, 2018
Tony 30wks, 2019 Kevin 21wks); payouts balanced all three years; ATDR entries growing correctly
(71/79/88, consistent with the ongoing accumulation pattern).

**No code changes were needed for the rollout itself** — this batch was purely a verification
exercise (confirming DHMOTW and the returning-manager case both already work correctly) plus the
mechanical widening of `Layout.tsx`'s sidebar filter and `lib/lockedYears.ts` to
`[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]`. Build clean (`tsc -b` + `vite build`,
zero errors).

**Flagged for next session:** batch 4 (e.g. 2020-2022) — no specific new engine behavior is known
to activate in that range yet (unlike batch 3's DHMOTW), so start with the same edge-case sweep
(ties, partial seasons, DHMOTW cases, roster changes) rather than assuming a quiet batch. Still no
headless-browser access across this entire session — a real screenshot pass spanning 2014-2019 is
overdue whenever that's available.

---

## Entry 54 (2026-09-06, cont.) — Milestone 16 batch 4: 2020, 2021, 2022 rolled out

**Fourth batch.** Checked real underlying data for structural edge cases before touching code,
per the established discipline. No partial-season managers, no nulls. One genuine 2-way tie (2020
Wk4: Damian/Tony at 190.0), correctly split by the engine. `active_managers` and `status_by_year`
confirmed consistent across all 12 years now covered (2011-2022), no contradictory upstream data.

**Three genuinely new structural variations this batch exercises for the first time:**

1. **18-week seasons.** Every prior season (2011-2020) had exactly 17 weeks; 2021 and 2022 are the
   first at 18. Grepped the whole `src/` tree for any hardcoded week-count assumption — found none
   (the few literal "17"s that exist are an unrelated pixel margin constant, a drought-icon
   threshold, and a comment). Every component already reads `season.weeks` dynamically.

2. **A manager name with an apostrophe** — D'lyn, joining in 2020. Checked the raw JSON uses a
   plain ASCII apostrophe (not a smart-quote or escape sequence), confirmed she has a real
   `manager_colors` entry and appears correctly in `all_players`, and confirmed the codebase has no
   `dangerouslySetInnerHTML` usage keyed on manager names (the only three uses of it are for
   pre-authored recap/dance/nugget prose bodies, where D'lyn's name appears as ordinary literal
   text — not a code-level risk). React's JSX text interpolation elsewhere auto-escapes regardless.
   No fix needed, but worth a real look at 2020's actual rendered page given this is the first name
   with a special character.

3. **Decimal (non-integer) scores** — every season 2011-2020 had whole-number scores only; 2021
   and 2022 are the first with real decimals (e.g. Kito's 235.48 in 2021 Wk1). Checked every
   consumer of raw score values: `ScoreTable` already formats with `.toFixed(1)` (was already
   built that way, not new), Season Totals already uses `.toLocaleString` with fixed 2 decimals,
   weekly-high/pill comparisons are direct equality checks against the same pre-computed engine
   values (no client-side arithmetic to introduce float-precision drift). No fix needed — the
   existing formatting conventions already handle this correctly.

Also checked, out of general engine-interaction curiosity: no season 2011-2022 has ever had a tied
score that was ALSO ≥200 (which would test how DHMOTW interacts with a tie — the engine skill
specifies DHMOTW only applies to a "single outright winner," implying a tied ≥200 score should NOT
double-credit either side). This interaction remains genuinely untested by real data through 2022;
noted for whenever a future batch's data happens to include one, not something to build for
preemptively.

**Full real-data sweep, same discipline as prior batches:** Dancing Shoes' authored victims
matched the real active-scoped top drought exactly for all three years (2020 Randy 27wks, 2021 Tim
18wks, 2022 Tim 36wks); payouts balanced all three years; ATDR entries growing correctly
(98/110/117).

**Proved with a real build before committing:** widened `lockedYears.ts`/`Layout.tsx` to
2011-2022 and ran `tsc -b` + `vite build` — clean, no errors, no issues from the 18-week seasons,
the apostrophe name, or the decimal scores.

**No code changes were needed** — purely a verification batch plus the mechanical sidebar/
lockedYears widening, same shape as batch 3. `Layout.tsx` and `lib/lockedYears.ts` now cover
`[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]`.

**Flagged for next session:** batch 5 (e.g. 2023-2025, the final 3 seasons) — this would complete
Milestone 16 entirely. Watch for whatever 2025's original one-off Season Totals nugget mention (see
SeasonTotalsCard.tsx's header comment) actually looked like in context, and for any other
first-time edge case the same way every batch so far has surfaced one. Still no headless-browser
access this entire session — a real screenshot pass across 2014-2022 remains the single biggest
gap between this range's verification and 2011-2013's original bar.

---

## Entry 55 (2026-09-06, cont.) — Milestone 16 batch 5: 2023, 2024, 2025 rolled out — MILESTONE 16 COMPLETE

**Fifth and final batch.** All 15 seasons (2011-2025) are now live. Same edge-case-first
discipline as every prior batch: no partial-season managers, no nulls, no ties in any of the three
years. `active_managers`/`status_by_year` confirmed consistent across all 15 years now covered.

**A major, unplanned verification opportunity turned up while checking 2025's nuggets for the
"one-off Season Totals mention" flagged back in Entry 54.** It wasn't a one-off mention — it's the
ORIGINAL hub's real, complete "All-Time Season Totals" leaderboard: 146 real entries (every
manager-season 2011-2025), authored as a collapsed/hidden HTML block inside a 2025 nugget, never
meant to be read as prose. This is genuine ground truth from the real hub, not something we
derived ourselves. **Extracted all 146 entries and cross-checked them, rank by rank, name by name,
point-total by point-total, and year by year, against our own `computeSeasonTotals` client-side
derivation for the complete 2011-2025 range: zero mismatches across all 146 entries.** This is the
strongest verification Season Totals has had all session — not just internal consistency, but an
exact match against the real hub's own authored numbers. Also cross-checked two of the nugget's
own narrative claims against raw data directly: Aidan's 2025 HMOTW tally (nugget says 7.0 — raw
`hmotw_tally` says 7.0) and the "Wk15 flashpoint" (nugget says Kito 210.32 beat Hanh 209.00 by
1.32, sole DHMOTW — raw scores confirm exactly: Kito 210.32, Hanh 209.00, Damian 193.94, Kito the
sole winner).

Roster transitions this batch: Titi departs after 2023; Aidan joins for the first time in 2024
(same first-join pattern already exercised). DHMOTW counts: 6/9/5 across the three years,
consistent with the established pattern since batch 3. No tied-AND-≥200 case turned up in this
batch either — that interaction remains genuinely untested through the full 15-season range now
that Milestone 16 is complete; noted as a standing, low-priority gap rather than something to
chase.

**Full real-data sweep, same discipline as every batch:** Dancing Shoes' authored victims matched
the real active-scoped top drought exactly for all three years (2023 Tony 21wks, 2024 Kito 33wks,
2025 Ted 24wks); payouts balanced all three years; ATDR entries growing correctly (125/137/146 —
146 for 2025 is the full all-time count, confirming the top-50 cap/scroll will genuinely engage on
the final season's page).

**Proved with a real build before committing**, same as batches 3-4: widened
`lockedYears.ts`/`Layout.tsx` to the full 15 years and ran `tsc -b` + `vite build` — clean.

**Cleanup now that Milestone 16 is fully done:** `Layout.tsx`'s sidebar filter
(`data.meta.years_desc.filter((y) => y >= 2011 && y <= N)`) was only ever a temporary
rollout-staging mechanism — removed it entirely, now just renders `data.meta.years_desc` directly.
`lib/lockedYears.ts` keeps its full 15-year list as-is (that one drives SeasonHero's real
per-season "reviewed" badge via `LOCKED_YEARS.has(season.year)`, so it's correct and complete now,
not something to remove).

**MILESTONE 16 IS COMPLETE.** All 15 seasons render through the locked 2011 template, each
independently verified against the engine, zero code changes needed across the entire rollout
(every "fix" that happened this session — the pill-gate decision, the row-cap/scroll rebuild, the
Drought Bars scaling bug — was either a deliberate design decision or a bug caught from the user's
own screenshots, not something any individual season's rollout itself required). Full history
across Entries 46-55.

**Standing gap, unresolved this entire session:** no headless-browser access in this sandbox at
any point — every fix and every batch's verification since batch 1 has been data-level or
build-level only. A real screenshot-based visual pass across all of 2014-2025 (2011-2013 got the
original literal screenshot treatment in batch 1) is the single most valuable thing left to do
whenever that access is available. This should be the first item in any future session working on
this project, before starting new feature work.

---

## Entry 56 (2026-09-06, cont.) — 2025 nugget swap: removed All-Time Season Totals, added Tim's Wild Swing

**Request:** remove 2025's "🏅 All-Time Season Totals" nugget (now redundant — that data is fully
captured live by the dedicated `SeasonTotalsCard`, cross-verified against this exact nugget's own
146 real entries in Entry 55) and author a fresh, real nugget to fill the same grid slot. The
request said "analyze the 2026 season" — checked and there is no 2026 season anywhere in
`site_data.json` (`years_desc` tops out at 2025), so treated this as referring to 2025, the season
actually being edited; flagged this interpretation rather than guessing silently.

**New nugget, derived from real data, not invented:** checked `summary['2025'].topweeks/lowweeks`
for a genuinely fresh angle not already covered by the other six 2025 nuggets (Aidan's season,
the leadership race, DHMOTW weeks, transactions, the "scored 200 and still lost" list, Kito &
Mikey's droughts). Found: **Tim posted the 4th-highest single-week score all-time in Wk16 2025
(231.40) and the 4th-lowest single-week score all-time in Wk11 2025 (63.86) — same season, 5
weeks apart, a 167.54-pt swing — and still finished 10th (net -$364.00).** Verified directly
against `season.scores['Tim']` (index 10 = 63.86, index 15 = 231.40, matching `topweeks`/
`lowweeks` exactly) before writing anything. Title "🎢 Tim's Wild Swing", accent `purple` (the
one accent color unused elsewhere in this grid), same `A1:B1` cell slot as the nugget it replaces
— a direct swap, no layout risk.

**A real mistake happened mid-edit, corrected before it went anywhere:** the first attempt to
write `site_data.json` used a Python string with manual `\uXXXX` surrogate-pair escapes for an
emoji, which Python does NOT auto-combine into one codepoint (unlike JSON's own decoder) — this
produced lone surrogates that UTF-8 encoding rejected mid-write, and because the file had already
been truncated by opening it in `'w'` mode, this **corrupted `site_data.json` in place** (cut off
mid-object, no longer valid JSON). Caught immediately (`json.load` failed) rather than proceeding.
**Recovered by extracting a known-clean copy of `site_data.json` from the original uploaded zip**
(`S007_2026-09-06_TNCFL_RecordBook.zip`, still present in `/mnt/user-data/uploads/`), confirmed
zero other changes were ever made to `site_data.json` earlier in this session (every prior fix
this session touched only `.tsx`/`.ts`/`.css` files), verified the restored file's structure
matched expectations (all 15 seasons, all nugget years, `meta.hmotw` keys, an untouched 2024
nugget count), then redid the edit correctly — literal Unicode characters in the Python source
instead of manual surrogate escapes, `ensure_ascii=False` + explicit `encoding='utf-8'` on both
read and write, and reloaded the result to confirm it round-trips as valid JSON with exactly the
intended change before touching any code.

**Verified:** reloaded `site_data.json` shows exactly 7 nuggets for 2025 (was 7, net swap not
addition), the new nugget's `A1:B1` cell slot matches the removed one exactly, and every other
season's nugget count is untouched (spot-checked 2024: still 8). Grepped the codebase first to
confirm no CSS/JS depended on the removed nugget's specific markup (`.ts-list`/`.tst-row` were
only ever inline styles inside that one nugget's own HTML body, nothing external referenced them).
Build clean (`tsc -b` + `vite build`, zero errors). Same standing caveat as the rest of this
session — no headless-browser access, so the actual rendered grid position/spacing hasn't been
screenshot-confirmed.

---

## Entry 57 (2026-09-06, cont.) — Real bug: two copies of site_data.json, only one was updated

**User reported the new nugget didn't show up locally.** Root cause: this project keeps
`site_data.json` in two places — the project root (which every verification script this session
read from and which I edited for Entry 56's nugget swap) and
`tncfl-record-book/public/site_data.json` (the copy Vite actually serves at `/site_data.json`,
which `useRecordBookData.ts` fetches at runtime — confirmed by reading the fetch call directly).
I only updated the root copy; the public copy still had the old "All-Time Season Totals" nugget,
so the running app kept showing it regardless of the code being current.

**Checked whether this affected anything else this session, not just the nugget:** every other
fix this session (DroughtBars scaling, the row-cap/scroll rebuild, all five Milestone 16 batches)
only ever changed `.tsx`/`.ts`/`.css` files — code, not `site_data.json`'s actual content. Since
neither copy of `site_data.json` was ever touched before Entry 56, both copies were trivially in
sync the whole time up to that point. Entry 56's nugget swap was the FIRST time this session
`site_data.json` content itself changed, so this divergence — and its user-visible effect — is
scoped to that one edit alone, confirmed by diffing the two copies directly (identical except for
the 2025 nugget swap).

**Fixed:** copied the corrected root `site_data.json` over `tncfl-record-book/public/site_data.json`
directly, confirmed byte-for-byte identical afterward via a full JSON structural comparison (not
just the nugget field). Build clean (`tsc -b` + `vite build`).

**Flagged for future sessions on this project:** any edit to `site_data.json`'s actual content
(not just reading it for verification) must update BOTH copies, or the app will silently keep
serving stale data despite the "source of truth" copy being correct. Worth considering whether the
two-copy setup itself should be simplified (e.g. a build step that copies root → public
automatically) in a future session, rather than relying on remembering to sync manually every time
— flagging the idea, not doing the refactor unprompted here.

**Separately, on the npm install screenshot the user also shared:** the install itself succeeded
("up to date, audited 62 packages") — the "2 moderate severity vulnerabilities" and
"install-scripts" warnings are npm's standard informational output, not errors, and not related to
the nugget issue. One thing worth noting: `puppeteer` is listed as a devDependency in
`package.json` but its postinstall script (which downloads a real Chromium binary) was skipped by
npm's newer script-allowlist security feature, per the screenshot's own
`npm warn install-scripts` lines. Nothing in this project's docs currently explains what puppeteer
is for — no npm script, no verification script file found referencing it — so its intended use
wasn't confirmed, only flagged as present and currently inert. If it's meant to enable real local
screenshot verification (the standing gap flagged repeatedly this session), the user would need to
explicitly approve it (`npm install-scripts approve puppeteer`, per the warning's own suggested
command) for its Chromium download to actually run.

---

## Entry 58 (2026-09-06, cont.) — 2025 nugget grid re-laid-out: fixed the dead space around the swapped-in nugget

**Request:** column 1 was showing visible dead space below Tim's Wild Swing (added in Entry 56) —
because it originally kept the removed Season Totals nugget's `A1:B1` cell position, which spans
2 rows (letter=row, number=column in this grid's real parsing — confirmed against `parseGridCells.ts`'s
own verified-against-the-hub logic), and those 2 rows were sized tall by Aidan's much longer
neighboring card, leaving Tim's short text with a lot of empty space below it inside its own box.
User wanted column 1 reorganized into three stacked single-row cards (Tim's Wild Swing, Kito &
Mikey, 250 Moves) and column 4 reduced to one card (the WTF nugget) spanning the full height.

**Showed the proposed layout as an inline mockup before touching any data**, per the user's
explicit request, working out the exact cell values first: `A1` / `B1` / `C1` for the three
column-1 cards, `A2:B3` unchanged for Aidan, `C2` / `C3` for Leadership Race / Five DHMOTW Weeks,
`A4:C4` for the WTF card (spanning rows 1-3 in column 4). User confirmed the mockup before any
code or data changed.

**Implemented:** updated all 7 nuggets' `cells` field in `site_data.json` to the confirmed values.
**Learned from Entry 57's mistake — synced the change into
`tncfl-record-book/public/site_data.json` in the same pass**, verified byte-for-byte identical
afterward via full JSON comparison (not just spot-checking the changed field).

**Verified the grid math itself, not just that it builds:** replicated `parseGridCells`'s and
`gridDimensions`'s exact parsing logic in Python against the new cells — confirms a clean 4-column
× 3-row grid, exactly 12 occupied cells for 12 expected (4×3), zero overlaps, zero gaps. Build
clean (`tsc -b` + `vite build`, zero errors). Same standing caveat as the rest of this session — no
headless-browser access, so the actual rendered spacing/proportions haven't been screenshot-
confirmed, though the grid math itself is now verified correct at the data level.

---

## Entry 59 (2026-09-06, cont.) — Real code feature added: nugget "stack" grouping, plus 2025's grid rebuilt around it

**Long thread working toward this.** Started from a user screenshot showing dead space in the 2025
nugget grid, worked through why it happens (plain CSS grid `auto` rows are shared across every
column, so a column with much shorter content gets stretched to match whichever column needs the
most room), tried several interactive exploration tools to let the user hand-tune it (a cells-text
editor, then row/col-span sliders, then height/position pixel rails — the first two apparently
didn't render as interactive on the user's client; the rails did, or at least the user was able to
use them to arrive at specific pixel values), and the user landed on a target visual (two
screenshots: the actual desired 3-column layout, and their slider settings) that the *existing*
grid mechanism genuinely cannot produce without also breaking other seasons.

**Why this needed real code, not just a data edit:** checked 2011's and 2022's actual nugget
`cells` values before touching anything — both rely on cards in *different* columns sharing the
*same* row-tracks (e.g. 2022's `A3:B4`/`C3:C4`/`D3:D4` are three different cards in three
different columns all occupying rows 3-4 together, by design). The user's target layout needs one
column's three stacked cards (Aidan, Leadership Race, Five DHMOTW Weeks) to size *completely
independently* of the other two columns' very different content lengths — which plain CSS Grid
row-sharing cannot do, and forcing it globally would risk altering 2011's and 2022's already
locked-and-reviewed layouts.

**Added `stack?: string[]` to the `Nugget` type** — purely additive. A nugget listing other
nuggets' titles in `stack` renders as an independent flex-column inside its own single grid cell,
each stacked nugget sized purely to its own real content, no shared row-track with any other
column. A nugget with no `stack` renders exactly as before via plain grid placement — confirmed
2011 and 2022 compute identical grid dimensions and placement after this change (4×4 for both,
unchanged). This is deliberately NOT a return to the computed/estimated layout approaches reverted
in Milestone 7l — no character-count estimation, no DOM measurement pass, just plain CSS flexbox
sizing a column to its own children, the most basic browser behavior there is.

**`NuggetGrid.tsx` changes:** `gridDimensions()` now only considers nuggets that actually get
placed (excludes ones consumed by another nugget's `stack`, whose own `cells` value becomes
irrelevant). Card-rendering logic extracted into `renderCardContent()` so both top-level and
stacked-in nuggets render identically (same accent border, same page-turn flip animation). Flip
animations now keyed by nugget title instead of array index, so a stacked-in nugget still gets its
own independently-randomized animation rather than losing it.

**2025's data restructured around the new field:** Tim's Wild Swing (`A1`) now stacks Kito & Mikey
and 250 Moves beneath it; Aidan By the Numbers (`A2:A3`) now stacks The Leadership Race and Five
DHMOTW Weeks beneath it; WTF I Scored 200... simplified to `A4` (single row now, since the grid
itself is only 1 row tall — the three "columns" each size independently via their own internal
stack). Verified the grid now computes as 4 columns × 1 row for 2025 (was 4×3), with 3 top-level
placed nuggets and 4 consumed into stacks — while 2011 and 2022 both compute their prior 4×4
dimensions completely unchanged, confirming no regression to already-locked seasons.

Both copies of `site_data.json` updated together this time (root + `tncfl-record-book/public/`),
learning from Entry 57. Build clean (`tsc -b` + `vite build`, zero errors).

**Standing caveat, unchanged all session:** no headless-browser access, so this still hasn't been
visually confirmed — the height/position "rails" the user used to explore were built against
rough estimated heights (character-count math), not real measurement, so the actual rendered
result may differ somewhat from what those sliders showed. The real fix here is structural (each
column now genuinely sizes to its own content with no forced stretching), which should eliminate
the dead space regardless of the exact final pixel heights — but this needs the user's own visual
confirmation before treating it as done.

---

## Entry 60 (2026-09-06, cont.) — Corrected: Leadership Race/DHMOTW should sit side-by-side, not full-width stacked

**User caught a real misread on my part.** Entry 59's `stack` implementation made Leadership Race
and Five DHMOTW Weeks each full-width, stacked directly under Aidan. The user's actual target
(clarified via two screenshots) keeps Aidan spanning 2 columns on top with Leadership Race and
Five DHMOTW Weeks sitting SIDE-BY-SIDE beneath it (each half-width) — the original shape, not the
full-width-stacked one I'd built.

**This surfaced a real debugging back-and-forth first, worth recording honestly:** several rounds
of the user showing screenshots that turned out to be stale (pre-fix) or were actually my own
earlier Visualizer mockups rather than their real site, before we confirmed (by having the user
upload their actual working `tncfl-record-book.zip` directly) that Entry 59's fix WAS correctly
present and building cleanly in their environment — the mismatch was a genuine misunderstanding of
the target layout, not a stale build or a code bug in the `stack` mechanism itself.

**Extended the `stack` mechanism rather than reworking it:** added optional `stackWidth?: number`
to `Nugget` — consecutive stacked items sharing the same fractional width (e.g. two nuggets both
at 0.5) now render as one shared flex-row instead of each getting its own full-width row.
`NuggetGrid.tsx` gained `renderStackList()`, which groups a stack's items this way before
rendering. Tim's stack (Kito & Mikey, 250 Moves) is unaffected — neither sets `stackWidth`, so
both stay full-width, matching the layout the user never had a complaint about. Leadership Race
and Five DHMOTW Weeks both now set `stackWidth: 0.5`, producing exactly the target: Aidan full-
width on top, the other two split evenly below it.

**Verified:** re-ran the grid-dimensions check — 2011 and 2022 both still compute their original
4×4 dimensions unchanged (neither uses `stackWidth`, confirming zero regression), 2025 computes
4×1 with 3 top-level placed nuggets, matching intent. Traced the grouping logic by hand against
2025's real data to confirm the row-grouping produces exactly two groups: `[Aidan]` (own row) and
`[Leadership Race, Five DHMOTW Weeks]` (shared row). Both `site_data.json` copies updated together
this time. Build clean (`tsc -b` + `vite build`, zero errors).

**Standing caveat:** the underlying column-height mismatch the user flagged (col 3/WTF ending
noticeably shorter than columns 1-2) has not yet been addressed — this entry only fixes the
Aidan/Leadership Race/DHMOTW arrangement shape. Whether reverting Leadership Race/DHMOTW to
side-by-side (shorter total height for that column now) closes enough of that gap on its own is
unconfirmed without a real screenshot — still no headless-browser access this session.

---

## Entry 61 (2026-09-08) — Standalone nugget-panel sandbox tool built (exploration, not the live site)

**Context:** the column-height mismatch flagged at the end of Entry 60 (col 3/WTF ending
noticeably shorter than columns 1-2) needed real hands-on layout iteration to resolve well, and
doing that through the actual `npm run dev` loop (edit `cells`, rebuild, screenshot, repeat — with
no headless-browser access this session to close that loop quickly) was too slow. Built a
standalone, dependency-free HTML file (`nugget-panel/index.html`, no React/npm/server — open
directly in a browser) to let the user hand-tune layouts interactively and export the result,
rather than iterating blind through data edits.

**What the sandbox does, built up over many rounds this session:**
- All 15 years' real nugget data embedded, with a year-switcher sidebar.
- Three parallel sections per year: **Established** (mirrors the real site's current content),
  **New** (candidate nuggets — see Entry 62), and **Final Layout** (a staging canvas where the
  user actually builds the arrangement they want, pinned to the top of the page via `position:
  sticky` so it's visible while scrolling the other two sections).
- Full drag-and-drop: horizontal snapping to column boundaries (width always a whole number of
  columns), free vertical positioning, resize handles on all three edges (left/right resize width,
  bottom resizes height), all real-DOM-measured (no character-count estimation).
- No-overlap enforcement that required two real bug fixes to get right: (1) the original check only
  rejected literal overlap, allowing two cards to sit flush with zero gap — fixed by requiring the
  real 12px gap as the minimum clearance, not just non-overlap; (2) the "auto-stretch bottom-most
  panel to fill dead space" feature (ported from the real site's per-column stretch behavior) had a
  genuine algorithmic flaw for wide, multi-column-spanning cards — stretching was decided per grid
  *unit* in isolation, so a wide card could be judged "clear to stretch" based on units it shared
  with nothing, while a *different* card occupied one of its *other* units below — rewritten to
  check each panel against every other column-overlapping panel directly, capping the stretch at
  the nearest real blocker in *any* shared column, not just the one that happened to trigger the
  check.
- Later, the whole interaction model changed again at the user's request: dropping a card onto an
  occupied position no longer blocks the move — instead every affected card cascades downward to
  make room (two-phase resolution: anything touching the just-moved card is pushed below it
  unconditionally regardless of which one has the larger `top`, since the moved card can land with
  a *bigger* top than something it still overlaps; remaining conflicts among the rest cascade the
  ordinary way). The push is deferred to mouse-release, not applied live on every mousemove, after
  the user reported the live-push version made precise positioning impossible — the dragged card
  now flashes red while hovering a position that *will* push things on drop, without actually
  moving anything until release.
- Double-click (not drag — cross-section dragging was tried first and found unreliable, replaced)
  moves a card from Established/New into Final Layout, dimming the origin copy to 50% opacity to
  mark it "used"; double-clicking it back out of Final Layout restores full opacity. A neon-green
  1px alignment guide appears when a dragged card's top lines up with another's, snapping to it.
- Auto-save to `localStorage` per section per year on every real change, with a reconciliation
  step so nuggets added to the underlying data *after* a year was first visited still get merged in
  (append-only, never disturbs anything already positioned) — this was a real bug found and fixed
  after new nuggets from Entry 62 didn't appear for years already cached from an earlier visit.
  Export/Import to a JSON file for handing a finished layout back between sessions/back to Claude.

**Two real correctness bugs caught during a plain-click regression, unrelated to the drag logic
itself:** double-click stopped working entirely after an unrelated change — traced to the
same-section drag handler re-rendering (destroying and rebuilding the DOM) on every mouseup *even
when nothing moved*, which breaks the browser's native double-click detection between the two
clicks since the second click lands on a freshly-recreated element. Fixed by only re-rendering when
a real position/size change occurred. A second, similar bug appeared later when live-drag started
re-rendering on every mousemove (needed so the dragged card visually follows the cursor) — the
`el` DOM reference captured once at drag-start went stale after the first render, so a red
"will-push" flash class was being applied to an invisible, already-removed element; fixed by
re-querying the element fresh after each render.

**Status:** the sandbox is a separate authoring tool, not part of the shipped site — its own
`index.html` isn't part of this project's file set going forward, only its *output* (the exported
Final Layout JSON) matters, which fed Entry 63's rebuild.

---

## Entry 62 (2026-09-08, cont.) — Deep nugget content pass: every year gets a verified "By the Numbers" card, plus new fact-finds

**Two related content requests handled as one systematic pass across all 15 years,** using the
sandbox's New section as the staging area for candidates (none of this touched `site_data.json`
directly until Entry 63's rebuild folded the user's final, hand-arranged layout back in).

**"Chances of a Champion" — new nugget for every year, all 15.** A mathematical-clinch analysis:
using that season's own real scoring average as the ceiling for what a trailing manager could
plausibly post the rest of the way, checked week-by-week whether the leader's margin ever exceeded
what the remaining weeks could still swing. **5 of 15 champions were genuinely mathematically
locked before the season ended** — 2012 (Damian), 2014 (Randy), 2021 (Titi), 2023 (Tim), 2025
(Aidan) — all five with exactly 1 week to spare, never earlier (the threshold scales fast enough
that a full clinch with 2+ weeks left essentially can't happen at these point totals). The other 10
years get a fallback stat instead: the trailing manager's needed final-week score expressed as a
percentage of what the leader actually posted that week. Caught and fixed a real attribution error
before finalizing: the "season's largest lead" for several years (2011, 2013, 2018, 2019) was
actually held by a manager who did *not* go on to win — phrasing corrected to attribute it
accurately rather than implying it was the champion's own peak lead.

**"By the Numbers" card — ensured every year has one, matching a single consistent template.**
2012, 2023, 2024, 2025 already had one live (kept as-is); built matching cards for the other 11
years (2011, 2013–2022) from scratch, verified against `site_data.json` fact-by-fact: rank, margin,
weeks led, HMOTW tally (explicitly checked whether the champion's tally was actually league-high
before claiming so — it wasn't for 2015, 2018, 2019, 2022, phrased honestly instead of repeating an
overclaim), season average vs. league, season-high week with its real all-time rank, DHMOTW
breakdown for 2017+ years, and a full net-earnings breakdown (which required resolving a real
reconciliation puzzle: `earn` = `season_purse + hmotw_winnings + ring + sidebet_out + playoff_out`,
*not* `playoff_in` — found by testing combinations against three years' real payout rows until one
combination matched all three exactly, rather than guessing).

**Other verified fact-finds added across various years:** a full payout breakdown (net-positive vs.
negative managers) for 12 of 15 years (skipped 2024, which already states this itself); genuine
exact-score HMOTW ties not yet mentioned anywhere, found via a full scan of every week across all
15 years (2012 ×2, 2014, 2019, 2020); the single tightest non-tied HMOTW margin in the league's
entire history, found the same way — 2021 Week 9, 0.20 points, tighter than the well-known 2023
Week 13 four-way clump; "shutout" seasons (a manager who won zero HMOTW weeks all year) added only
where genuinely new context, not restating what an existing nugget already said — checked first and
skipped two cases (2017 Randy, already covered by his drought nugget; 2023 Tony and 2024 Kito,
already stated explicitly in their own existing nuggets) rather than duplicating.

**Every fact in this entry was checked against `site_data.json`/the engine's real numbers before
being written** — this was worked through as its own explicit discipline mid-session (the user's
words: "let's get this right the first time" after an initial lighter pass), not assumed from
memory or pattern-matched from adjacent years.

---

## Entry 63 (2026-09-08, cont.) — Nugget system rebuilt: `cells`/`stack`/`stackWidth` replaced entirely with authored pixel positions

**The user's explicit, permanent decision, confirmed directly before any code was touched:** the
row-letter CSS-grid system (`cells: "A1:B2"` strings, parsed by `parseGridCells.ts` into
`gridColumn`/`gridRow`, with `stack`/`stackWidth` letting nuggets escape shared row-track heights)
is retired for good, replaced by the same flat, per-card pixel-position model the Entry 61 sandbox
uses: every nugget authored with its own `colStart`, `colSpan`, `top`, and `ownHeight`, positioned
by absolute CSS positioning, no row/column string parsing, no nesting, no consumed/consumer
relationship between nuggets at all.

**Confirmed against the real source before writing anything** (the user uploaded the actual
`tncfl-record-book.zip` this session specifically so this wasn't guessed) — reading the real
`NuggetGrid.tsx` surfaced an important correction to an assumption made mid-session: its code
comments confirm `gridTemplateRows: repeat(rows, auto)` genuinely does share row-track height
across every column using the same row letter (the real reason `stack` was built in the first
place, per Entry 59's own comments) — an initial attempt to translate the sandbox's freeform
layout back into the old grid format via "cluster anything with overlapping columns into one
group" was built, tested, and then abandoned mid-session after re-deriving that the *original*
row-based translation attempt (new row letter only on a genuine column conflict) was actually
correct, once it was confirmed that same-row cells are allowed to have wildly different heights
without any forced alignment problem in practice.

**Three explicit decisions locked with the user before writing the replacement, each a real
tradeoff, not a silent choice:**
- **Fixed 1200px width** (matching the sandbox exactly), not the old fluid/responsive CSS-grid
  width — a real regression for non-1200px viewports, accepted knowingly.
- **No auto-stretch** — every card renders at exactly its authored height, dead space and all. The
  old system's per-column stretch-to-fill is gone; the user is now hand-positioning everything
  precisely enough that it isn't needed.
- **Fixed height, not `min-height`** — accepts a real risk (authored heights measured in the
  sandbox may not exactly match production font rendering, risking clipped text) in exchange for
  guaranteed pixel-exact positioning with no runtime surprises. Paired with `overflow: hidden` on
  each card so any mismatch clips cleanly rather than spilling out messily.

**What actually changed, confirmed file-by-file:**
- `types/data.ts` — `Nugget` interface: `cells`/`stack`/`stackWidth` removed; `colStart: number`,
  `colSpan: number`, `top: number`, `ownHeight: number` added.
- `NuggetGrid.tsx` — fully rewritten. No more `parseGridCells`/`gridDimensions` imports, no more
  stack-consuming/filtering, no more `renderStackList`. Same page-turn flip-animation system kept
  unchanged (still keyed by title). Container is `position: relative`, fixed 1200px wide, height
  computed as `max(top + ownHeight)` across all nuggets; each card is `position: absolute` at its
  own `left`/`top`/`width`/`height`.
- `NuggetGrid.module.css` — `.grid` switched from `display: grid` to `position: relative`; `.card`
  gained `box-sizing: border-box` (so the authored width includes padding/border, matching the
  sandbox's own box model) and `overflow: hidden`.
- **`parseGridCells.ts` deleted** — confirmed via a full-tree grep that nothing else imported it
  before removing it, not assumed.
- **`site_data.json`'s `nuggets` section fully replaced, both copies** (root + `public/`), sourced
  directly from the user's own hand-arranged Final Layout export from the Entry 61 sandbox — all 15
  years, 169 total nugget entries, every one verified to match the new schema exactly (no missing
  or extra fields) programmatically, not by eye. Confirmed via full-file diff that every *other*
  section of both `site_data.json` copies (`seasons`, `payouts`, `summary`, `meta`, `dance`,
  `recaps`, `career`, `h2h`, `all_time_scores`, `streaks_at_1`, `cumulative`) is byte-identical to
  what the user uploaded — only `nuggets` changed, nothing else touched.

**Build verification, stronger than prior entries in this session:** this is the first entry all
session with the *complete* real codebase (earlier verification passes only had the single
`NuggetGrid.tsx`/`data.ts`/`site_data.json` files, checked with `tsc --noEmit` against a partial
tree). With the full project, ran the actual production build end-to-end — `npm run build` (which
runs `tsc -b && vite build`) — **zero errors, 501 modules transformed, build succeeds clean.** This
is a stronger check than any nugget-related verification this session prior to this entry, since it
compiles and bundles the entire app, not just the files directly touched.

**Standing gap, unchanged from every prior entry this session and the one before it:** headless-
browser access was attempted again this session specifically to try to finally close this gap
(`npx puppeteer browsers install chrome`) — still blocked, this time confirmed as a network
restriction (403 from the Chrome-for-Testing download host) rather than assumed unavailable. The
new layout has been verified at the build and data-schema level only; a real rendered screenshot of
at least one full season page has still never happened this entire project and remains the single
most valuable next step whenever an environment with that access is available.

## Entry 64 (2026-09-08, cont.) — Auto-stretch ported into `NuggetGrid.tsx`, superseding the Milestone 20 "no auto-stretch" tradeoff

**Supersedes a same-day locked decision.** Milestone 20 (Entry 63, this same day) explicitly locked
"no auto-stretch (every card renders at exactly its authored height — dead space is now possible
and accepted)" as one of three confirmed tradeoffs of the new positioning model. This entry
reverses that specific tradeoff — confirmed with the user before applying, not inferred.

**What changed:** `NuggetGrid.tsx` gained a `computeLayout()` function, ported directly from the
`nugget-panel-sandbox` tool's own (already bug-fixed) version. A panel now stretches to fill dead
space below it only where it has genuinely clear space in EVERY column it spans, capped at
whichever other column-overlapping panel sits closest below it — never blindly stretched to the
full container height. The per-panel check (not per-column-in-isolation) was necessary because a
per-column version can misjudge a wide, multi-column panel as "clear to stretch" based on just one
of its columns while a different panel occupies one of its other columns below it.

**Why this surfaced now:** the sandbox tool had been applying this stretch behavior the whole time
the user was hand-arranging Final Layout in it — invisibly, since the exported layout data only
ever captured the unstretched authored heights. So the "no auto-stretch" tradeoff recorded in
Milestone 20 didn't actually match what the user had been looking at in the sandbox while authoring
every year's layout.

**Verification:** ran the full production build (`npm run build`) after the swap — zero errors, 501
modules transformed, same clean result as Milestone 20's own build check. No other file in the
project tree was touched; confirmed only `NuggetGrid.tsx` differs from the S022 zip via a full-file
diff before swapping.

**Standing gap, unchanged:** still no headless-browser/screenshot access this project. The
auto-stretch behavior is verified at the build level only — no visual confirmation that stretched
cards render as expected. This does not reduce the standing Milestone 20 visual-review need; if
anything it adds one more thing that review needs to check per season.

---
## Entry 65 (2026-09-08, cont.) — Headless-browser access resolved; Milestone 17 landing page (trophy cabinet) designed and built

**Headless-browser access is no longer a standing gap.** A real Chromium (`/opt/pw-browsers/chromium-1194`)
turned out to be available in this session's sandbox — first used to actually render the OLD hub
(`TNCFL_hub.html`, served locally since it fetches `/api/data`) and measure the real trophy-cabinet
section height (249px at 1280px viewport, 508px at 768px, 1285px at 390px — genuinely responsive,
not a fixed number), replacing what had been CSS-only guesses. Every prior entry's "no
headless-browser access" note describes a real limitation AT THE TIME it was written and is left
as-is; `SKILL.md` and `README.md`'s forward-looking "standing gap" declarations have been corrected
to point here instead.

**Milestone 17 (League/Hall of Fame) started.** Design decisions locked first, then built for real:

- **Trophy cabinet redesign** — replaces the old hub's `.hof-rings-grid` (one row of trophy icons
  per manager) entirely with a per-CHAMPIONSHIP-YEAR "album flow" (music-app-style swipeable
  carousel), most-recent-first. The "art" is the champion's career trophy pile as of that year —
  derived from `payouts` (`rk === 1` per year), NOT `summary.competence` rank 1 (a different,
  HMOTW-tally-based leaderboard that gives the wrong champion for the same years — checked before
  trusting `payouts`). Verified the year -> title-count mapping against the user's own three
  examples (2011/2017/2020 -> Hanh's 1st/2nd/3rd) before building anything. User supplied real
  `1LT.png`-`5LT.png` album art (confirmed genuine alpha transparency, not a baked-in white
  background — checked actual pixel alpha values, not assumed from a JPEG-flattened chat preview).
  Card locked at 400px total height (whole card: art + year/champion/purse caption + nav controls,
  confirmed which part before building). No tap-to-navigate. Caption shows year, champion, title
  ordinal, and season purse (both metadata options the user picked, not just one).
- **Nav locked**: one "LEAGUE" entry in the left rail, expanding to 4 sub-pages (Hall of Fame,
  Manager Profiles, Head-to-Head, How Our League Works) — confirmed against the old hub's actual
  `leagueTab()` sub-tab structure before assuming a shape.
- **Scope gap discovered**: `ROADMAP.md`'s Milestone 17 bullets only ever named Trophy
  Cabinet/Drought leaderboard/All-Time scores/Salary Cap/career H2H/Manager profiles. The old hub's
  real Hall of Fame landing has 5 stacked sections the roadmap never wrote down: the trophy cabinet,
  a 9-card animated "League Records" stat grid (seasons played, total managers, champions, money
  through league, all-time net leader, all-time HMOTW leader, season points record, single-week
  record, longest drought), a hand-written hero essay ("15 Years. 18 Men..."), a "Season by Season"
  timeline, and a two-column All-Time Top Scores / Longest Reigns at #1 list. `streaks_at_1` (still
  `unknown` in `data.ts`) is the data field behind that last one — also never named in the roadmap.

**What got built this session** (real code, not a preview):
- `src/lib/computeTrophyCabinet.ts` — derives the year/champion/title-count/purse list from
  `payouts`, most-recent-first.
- `src/components/TrophyCabinet.tsx` + `.module.css` — the real component. framer-motion coverflow
  (drag + spring transitions), keyboard arrow nav, reuses the existing `ord()`/`money()` from
  `lib/format.ts` rather than reinventing formatting. Styled to the app's REAL design tokens
  (hardcoded hex, `border-left` accent + no fill, matching `AtdrCard`/`NuggetGrid`/
  `SeasonTotalsCard`) — not the chat-preview's Visualizer theme variables, which don't exist in
  this codebase.
- `src/components/HallOfFame.tsx` — the League landing page. Mounts the trophy cabinet; the other
  4 sections are an explicit "not yet built, pending design" list, not fabricated placeholder
  content or copied-verbatim old-hub numbers (those numbers were computed against an earlier data
  snapshot and need re-verifying, not blind-ported).
- `src/components/LeagueComingSoon.tsx` — stub for Manager Profiles/Head-to-Head/How Our League
  Works, so the new LEAGUE nav has no dead links while those stay undesigned.
- `App.tsx` — added `/league/hof`, `/league/profiles`, `/league/h2h`, `/league/how-it-works` routes.
- `TimelineRail.tsx` — added the expandable LEAGUE entry (auto-expanded when already on a
  `/league/*` route).
- `public/trophies/1LT.png`–`5LT.png` — real, full-resolution, alpha-intact assets (the chat
  preview used downscaled/JPEG-flattened copies; the shipped app uses the originals).

**Verification, not just a build check:** `npm run build` clean (zero TS errors), AND actually
served the built app (`vite preview`) and rendered `/league/hof` with the real headless Chromium —
confirmed the card measures exactly 400px via `getBoundingClientRect()` (not just CSS math),
confirmed clicking "older year" twice from 2025 lands on 2023/Tim/1st title/$1,194 purse (matches
the locked data table exactly), and confirmed the LEAGUE nav expand/collapse and active-route
highlighting all work against the real router — screenshots taken at each step.

**Standing gap, updated:** the Milestone 20 nugget visual-review pass (2014-2025, new positioning
model) is still not done — no longer tooling-blocked, but still outstanding. Also new: Manager
Profiles, Head-to-Head (career), How Our League Works, League Records grid, hero essay, Season by
Season timeline, and All-Time Top Scores/Reigns at #1 all remain undesigned/unbuilt — Milestone 17
is genuinely only 1 of ~8 real sections in so far.

---
## Entry 66 (2026-09-08, cont.) — Trophy cabinet: centered, accent border removed, year/champion colored per-manager

Three refinements to `TrophyCabinet.tsx`/`.module.css` after the user flagged the page-width
question (real measurement showed the `.layout-content` container already matched season pages
exactly at 1250px/1202px usable — the visual mismatch was the 420px-wide card sitting left-aligned
in that column with nothing else built yet to fill the rest):
- Card now `margin: 0 auto` — centered across the full column instead of left-aligned. Confirmed via
  render: 391px/391px equal margins on both sides.
- Removed the `border-left: 3px solid #d9a521` accent entirely, per explicit request (confirmed
  `0px none` after the change, not just deleted-and-assumed).
- Year and champion name now colored with `meta.manager_colors[active.m] ?? '#888'` — the same
  fallback pattern already used everywhere else in this codebase (`AtdrCard`, `BumpChart`,
  `DespairDifferential`, etc.), not a new convention. Verified across two different champions
  (Aidan's yellow-green on 2025, Hanh's orange on 2020) — both the year and name switch color
  together as you step through years. `TrophyCabinet` now takes a `meta: Meta` prop.

Caught and fixed a bug in my OWN verification script mid-task, not the app: an early check queried
`[class*="year"]` unscoped, which matched `.timeline-rail-years` (the nav's year list) before
`TrophyCabinet`'s own `.year` div — gave a false read of white/gray instead of the manager color.
Re-scoped the query to inside `.layout-content` and got the correct (passing) result. Worth noting
in case a similar broad-substring selector bites a future verification script here.

---
## Entry 67 (2026-09-08, cont.) — League Sandbox tool created; trophy cabinet spacing/size/flare iteration

**New standalone dev tool: `league-sandbox.html`** (delivered separately, not part of this zip — same
precedent as `nugget-panel/index.html`: no React/npm/server, opens straight off `file://`, real data
embedded via base64/JSON literals so it has zero external dependencies). Mirrors the real
`TrophyCabinet`/`HallOfFame`/`LeagueComingSoon` components exactly; used for the rest of this
session's Milestone 17 visual iteration before porting each locked change back into the real
`.tsx`/`.module.css` files. Verified independently with the real headless Chromium after every
change, both here and in the sandbox.

**Trophy cabinet spacing/sizing, several rounds, all confirmed against real renders:**
- Coverflow offset: 80px → 300px → **175px** (immediate), then split into two independently-set
  steps — **225px focal→immediate, +150px more to far (375px total)** — no longer a single `d*step`
  formula once the two gaps stopped being proportional.
- Neighbor image scale: fixed 0.6× for both tiers → tiered **0.625× (250px) immediate / 0.25×
  (100px) far**, confirmed via `getBoundingClientRect()` at each step.
- Opacity: 0.45/0.18 → **0.25/0.1** (explicitly independent of the scale/spacing changes — user
  confirmed not to touch opacity when reducing spacing).
- Focal image itself: 190px → **400px** (this pushed total card height 400px → **561px**, confirmed
  — user chose to grow only the stage, not scale the whole card uniformly).

**Lens flare animation added** (new): fires on every year transition, one flare per trophy in the
newly-focused year (a 3rd-title year fires 3), random position AND random size. Cross-shaped
white/gold burst, scale+fade over 700ms, via a `--flare-size` CSS custom property so the crosshair
scales proportionally with each flare's own randomized size (16-38px). Position randomized as a
pixel offset from stage center (±150px), not a percentage of the full stage width — the first pass
used percentage-of-stage and scattered flares far from the actual trophy on the now-much-wider
stage; fixed to cluster near the art itself. Caught and fixed a real accumulation bug in the
sandbox's vanilla-JS mirror during this: rapid clicks left overlapping flares on screen because each
only cleaned itself up after its own 700ms timeout, unlike React's state-replacement semantics in
the real component; fixed by clearing any still-animating flares at the start of each new spawn.

**Caption format changed**: "Nth title · $purse" → "**N title(s): <every year that manager has won,
up to and including the focal year>**" (e.g. "3 titles: 2011, 2017, 2020"), purse dropped entirely.
`computeTrophyCabinet.ts` now also returns `titleYears: number[]` per entry alongside `titleNum`.

**Centering/border/color** (already locked before this entry, restated for completeness): card
centered full-width, no left-border accent, year/champion text colored via
`meta.manager_colors[m] ?? '#888'`.

---

## Entry 68 (2026-09-08, cont.) — Hall of Fame restructured: hero essay ported, Records split into its own sub-page, nav updated to 5 links

**Scope correction from the original 5-section HOF plan (Entry 65/66):** the user decided the Hall
of Fame page itself only ever needed the trophy cabinet + hero essay. The other 3 sections (League
Records stat grid, Season-by-Season timeline, All-Time Top Scores/Reigns at #1) — plus "a couple of
others" still undecided, confirmed to come from already-computed data, nothing built from scratch —
move to a new **RECORDS** sub-page instead, positioned in the nav right after Manager Profiles.

**Hero essay** (`HeroEssay.tsx`/`.module.css`, new): ported from the old hub's `.hof-hero` block.
Two real fixes made along the way, not silent:
- **"Eleven of fifteen defending champions"** → **"Ten of fourteen"**. Recounted from scratch: there
  are only 14 defending-champion transitions possible across 15 seasons (not 15), and of those, 10
  actually fell outside the top 3 the following year, not 11. User initially chose to keep the
  essay exactly as-authored despite this being wrong, then asked for the fix explicitly next turn —
  corrected in both the real component and the sandbox mirror.
- **`max-width: 860px` on the essay text** — this was never in the old hub's actual CSS
  (`.hof-hero-sub` there has no width constraint at all); an unrequested addition made during the
  port for readability. User flagged the essay "not using the full width" and it was removed,
  restoring the true source behavior — text now spans the full 1202px content column like every
  other page.

**`Records.tsx`** (new): honest stub page, not fabricated content — lists what's moving here
(League Records grid, Season-by-Season timeline, All-Time Top Scores/Reigns at #1, "+ a couple
more still being decided").

**Nav**: `TimelineRail.tsx`'s `LEAGUE_LINKS` now has 5 entries — Hall of Fame, Manager Profiles,
**Records** (new), Head-to-Head, How Our League Works — confirmed real via render (`nav links` array
checked directly against the DOM, not assumed from the array literal).

---

## Entry 69 (2026-09-08, cont.) — Manager Profiles page built: career/streaks typed, 18 bios drafted and confirmed, avatar generator ported, full profile card

**`career` and `streaks_at_1` typed** in `data.ts` (both were `unknown` since Milestone 1). Verified
the real data shape against the old hub's actual `leagueShowProfile()` usage before writing the
types — confirmed all 18 managers have every field present (`pts`/`tally`/`rank`/`net`/`status`/
`best_week`/`worst_week`/`trans`/`trades`/`rival`), no manager-specific gaps.

**18 manager bios drafted and confirmed with the user, 2 paragraphs each** (`managerBios.ts`, new)
— NOT a verbatim port of the old hub's 1-paragraph `ARCS` text (those were the starting reference
point only). Every specific number was checked against real `career`/`streaks_at_1`/`payouts` data
before the draft was shown, which caught 3 real errors before lock-in:
- Daniel's departure year — old arc said "after 2017," he actually played through 2018.
- Titi's rival record — old arc implied he led Tony; the real head-to-head has Tony leading 29-25,
  not Titi.
- Hanh's own bio originally claimed to be the ONLY manager to have played every season since 2011 —
  user caught that Kito also has a perfect 15-season attendance record; corrected to name both,
  while keeping the distinction that only Hanh has actually won it (3 times).

**`ManagerAvatar.tsx`** (new): ported the old hub's real `makeAvatar()` — same 7 per-manager shape
assignments (pentagon/hexagon/octagon/shield/diamond/squircle/circle), same dimming rule for
non-active managers, same crown badge for champions. Translated from string-built SVG to JSX, not
redesigned.

**`ManagerProfileCard.tsx`** (new): header (avatar/name/status pill), the 2-paragraph bio, a rings
row that reuses the trophy-cabinet art (`trophyImageSrc`) and the same "N title(s): years" caption
format already established there, 5 stat tiles (Seasons/Career Net/HMOTW Tally/Career Pts/Best
Season, using the existing `AnimatedNumber` component), a 5+ week #1-streaks list filtered from the
global `streaks_at_1`, best/worst week, transactions/trades, biggest rival, and the full
year-by-year table with champion rows highlighted. Styled to this app's real tokens
(`money()`/`AnimatedNumber` reused, not reinvented; positive/negative net colored consistently with
the rest of the app).

**`ManagerProfiles.tsx`** (new) + routes: **URL-driven manager selection**
(`/league/profiles/:manager`, e.g. `/league/profiles/hanh`) — confirmed with the user over the old
hub's in-page-only click state, matching this app's established "the URL IS the state" philosophy
(same principle `TimelineRail.tsx`'s own comment already documents). Pill bar built from
`meta.hmotw.all_players`, each pill a small `ManagerAvatar` + name, colored per manager. No manager
selected → "Select a manager above to view their career profile." placeholder, matching the old hub.

**Verified with the real headless Chromium**, not just a build check: zero console errors on the
placeholder page, a champion with streaks (Hanh — trophy image, 3 titles list, 17-week streak, all
stat tiles matching real numbers), and a non-champion/departed manager (Bao — dimmed avatar,
"Moved on from League" pill, "No championship" text, empty streaks state, negative net in red).

**Standing gap, new:** this entire Manager Profiles feature has NOT been mirrored into
`league-sandbox.html` — confirmed with the user this is fine for now, given the much larger scope
(18 bios + a 7-shape avatar generator + full profile card) versus the trophy cabinet's tighter loop.
The sandbox currently only covers Hall of Fame's trophy cabinet + hero essay, Records' stub, and the
LeagueComingSoon placeholders.

---
## Entry 70 (2026-09-08, cont.) — LEAGUE nav label simplified; Records page: 3x3 grid locked, Cumulative Competence + Highest/Lowest Score panels added (replacing the old Top Scores/Reigns list)

**Nav**: `TimelineRail.tsx`'s LEAGUE toggle button changed from "League −/+" to plain "LEAGUE" (all caps, no expand/collapse indicator character).

**League Records grid**: locked to a fixed 3×3 (`repeat(3, 1fr)`), replacing the earlier `auto-fit` layout that left 3 empty gray cells on the second row at typical widths.

**Three new Records panels**, all verified against a user-supplied reference screenshot before building, not guessed from the description:
- **Cumulative Competence Chart** — genuinely new all-time metric, NOT a sum of the existing per-season `summary.competence` field (checked first: summing that per manager across years gives totally different numbers, e.g. Hanh 363.3 vs. the reference's 42.1). The real derivation: each manager's season-ending rank (`career[m].rank[year]`) run through the same points-per-finish scale as the existing per-season `CompetenceChart.tsx` (10/5/2/1/0.9/0.8/0.7/0.6/0.5/0.4) summed across every season played. Verified an exact match, medal counts included, before writing any code.
- **All-Time Highest/Lowest Single Week Score** — Highest reuses `all_time_scores` (already used elsewhere), sliced to 21 instead of the earlier 17. Lowest has no premade field (checked `all_time_scores` first — that's top-end only); computed client-side from raw `seasons[year].scores`, filtered to real (non-bye) weeks. Verified both against the reference screenshot exactly, including a real tie-break detail: the list hard-cuts at 21 rows mid-tie at 75.00 (Ted/Tony/Damian shown, Lam/Mikey's own ties at 75.00 not) — confirms 21 is a deliberate cutoff, not a data limit.

**Old 2-column "Top Scores / Reigns at #1" section removed entirely** (`AllTimeScoreLists.tsx` deleted) — user's explicit call once the overlap with the new Highest-Score panel was flagged.

All of this was built in `league-sandbox.html` FIRST this time (per explicit user request, given these were undesigned), then ported to the real app once confirmed. Caught and fixed a real scoping bug while wiring the sandbox: two separate `<script>` IIFEs, with the second referencing a `REC` variable only the first one had in scope — merged into one script block.

---

## Entry 71 (2026-09-08, cont.) — All-Time Longest Drought + All-Time Season Totals added to Records (reusing existing components, not new builds)

Two more panels from the same reference screenshot round. Both turned out to be **the exact same components already shipped on every SeasonPage** — `AtdrCard.tsx` and `SeasonTotalsCard.tsx` — checked their source before assuming anything needed building. Wired onto the Records page using the most recent year's data (`atdr_snapshots[years_desc[0]]`, `computeSeasonTotals(..., years_desc[0], 200)`), which is already the full all-time picture since both are running cumulative snapshots. Only real difference from the SeasonPage usage: `statusByYear` doesn't make sense outside a specific season, so this uses each manager's actual current `career[m].status` instead. Verified against the reference screenshot exactly (same title text/emoji, same "ended"/"ongoing" pills, same 15-row scroll window).

---

## Entry 72 (2026-09-08, cont.) — Cumulative Competence Chart fixed to match the real per-season CompetenceChart exactly

User caught 3 real drift points in my first-pass build (Entry 70) versus the actual shipped `CompetenceChart.tsx`:
- Wrong emoji — I'd used 🥉 (bronze medal); the real component uses 🏅.
- Missing legend — the "POINTS PER FINISH" box was dropped entirely from my first version.
- Medal image fidelity — real app now uses the actual `MedalIcon` component (already correct there once checked); the sandbox mirror was still using flat placeholder dots.

Fixed: `CumulativeCompetenceChart.module.css` is now `CompetenceChart.module.css`'s rules verbatim (same row layout/column widths, same floating corner legend box) instead of ad-hoc styling. Sandbox got the real canvas-gradient medal-drawing logic ported in (not just the emoji/legend fix) — a `medalDataUrl()` function mirroring `MedalIcon.tsx`'s `sumDrawMedal()`, cached per type+size, embedded as data-URI `<img>` tags. Verified both with real renders — zero errors, legend confirmed present in both, medal images confirmed rendering (60 in the sandbox).

---

## Entry 73 (2026-09-08, cont.) — Head-to-Head and How Our League Works built; all 5 LEAGUE sub-pages now have real content

**`h2h` typed** in `data.ts` (was `unknown` since Milestone 1) — `Record<string, number>` keyed `"ManagerA|ManagerB"` -> A's career win count over B. Cross-checked several pairs against `career[m].rival` (itself derived from this same field) before trusting the key format — all matched exactly (Hanh|Kito 134/124, Randy|Kevin 108/100).

**Head-to-Head** (`HeadToHead.tsx`, new — the FIRST H2H component in this app; double-checked ROADMAP.md's claim that a season-scoped matrix already existed from Milestone 12 and found no such component anywhere in the codebase, so this isn't a career-scoped variant of something existing, it's the first one) — two sub-tabs matching the old hub's real `h2hTab()`:
- **All-vs-All Matrix** (`H2HMatrix.tsx`) — active managers only, sorted by career net descending, cell color by win-dominance (green ≥60%, red ≤40%). Ported from the old hub's real `matrixCell()`.
- **Duel Picker** (`H2HDuelPicker.tsx`) — two-manager comparison, win-% bar, shared-seasons table with the winner highlighted per year. Ported from the old hub's real `renderDuel()`. Fixed one real default-pairing bug before shipping: "first two managers alphabetically" (Aidan vs. Bao) has zero shared seasons and shows an empty result on first load; the old hub's actual default was `ALL_MGRS[0]` vs. `'Randy'` specifically — matched that instead.

**How Our League Works** (`HowLeagueWorks.tsx`, new) — 4-section accordion (HMOTW, DHMOTW, Drought System, Payout Structure), ported from the old hub's real `htw-*` content. Every concrete numeric claim verified against real data before porting, not assumed accurate from the source text: buy-in amounts by era ($100 in 2011-2014, $200 from 2015 on — confirmed against real `payouts[year].buyin`), and Randy's full 2024 earnings breakdown (season prize + ring + sidebet + HMOTW pool = exactly +$2,902 net, confirmed field-by-field against `payouts['2024']`).

**`LeagueComingSoon.tsx` deleted** — no longer referenced anywhere now that all 5 LEAGUE sub-pages (Hall of Fame, Manager Profiles, Records, Head-to-Head, How Our League Works) have real content instead of placeholders.

**Verified with the real headless Chromium**: zero console errors on the matrix, the duel picker (both the empty-result case and a real matchup), and the accordion (both collapsed and with an item expanded) — not just a clean build.

**Not mirrored into `league-sandbox.html`** — same call as Manager Profiles, given the scope (H2H alone is 2 components + a computation module; How League Works is a full 4-section content page). Offered to build that mirror; not yet requested.

---
## Entry 74 (2026-09-08, cont.) — League Records grid colors matched to the old hub; 3 more unrequested max-widths removed across LEAGUE sub-pages

**League Records grid colors.** User supplied a real screenshot of the old hub's rendered grid. Checked the actual `data-color` attributes in `recordsHTML` (TNCFL_hub.html) rather than guessing from the image, and found the component here had drifted in two ways:
- 4 of the 9 cards (Seasons Played, Total Managers, Champions, Money Through League) had never had any color applied — plain white. Fixed: Seasons Played/Money Through League use the site's brand red (`#c0252b`), Total Managers uses the site's lock green (`#4ec79e`), Champions uses the color of the MOST RECENT champion (not a fixed manager — added a new `mostRecentChampion` field to `computeLeagueRecords.ts`'s return shape for this).
- The other 5 cards (Net Leader, HMOTW Leader, Season Points/Single Week/Longest Drought records) had the record-holder's color on the wrong element — the small sub-line, not the big number. The old hub colors the number itself. Fixed in `LeagueRecordsGrid.tsx`.

Mirrored into `league-sandbox.html` too — same color fixes, plus added the missing `mostRecentChampion` field to the sandbox's embedded data.

**Container widths.** Checked all 5 LEAGUE sub-pages' outer container first — already identical everywhere (1250px max-width, same padding, all share `Layout.tsx`), confirmed by direct measurement, not assumed. The real problem was 3 more components with an unrequested inner `max-width`, same mistake pattern as the hero essay's `max-width: 860px` from Entry 68: `H2HDuelPicker.module.css`'s `.card` (640px), `ManagerProfileCard.module.css`'s `.bio` (900px), and `HowLeagueWorks.module.css`'s `.intro`/`.accordion` (800px each). Checked the old hub's actual CSS for all three (`.duel-card`, `.prof-arc`, `.htw-intro`/`.htw-accordion`) — none has a width constraint. Removed all 3 from this codebase; every LEAGUE sub-page's widest inner element now measures the same ~1192px.

**False alarm caught and ruled out during verification**, worth a note for future-me: an early screenshot of Hanh's profile showed 14 seasons/31.6 tally/34177 pts instead of the correct 15/33.5/36249 — traced to a timing artifact in my own batch verification script (rapid page navigation before a previous page's render settled), not a real app bug. Re-checked fresh against both the raw data and a careful re-render; the live app has always shown the correct numbers.

---
## Entry 75 (2026-09-08, cont.) — Records page: 40/30/30 panel split; Highest/Lowest Score converted from top-N to real thresholds, scrollable

**40/30/30 split** for the Competence/Highest/Lowest row (`Records.module.css`'s `.row3`, `grid-template-columns: 40fr 30fr 30fr`), replacing equal thirds. Verified via measured render: 40.0%/30.0%/30.0% exactly.

**All-Time Highest Single Week Score** — changed from a fixed top-21 (`all_time_scores.slice(0,21)`) to every real score >=200.00. Checked first whether the premade `all_time_scores` field covers this: it doesn't (only 25 entries, floor of 210.32) — 73 real weekly scores actually clear 200. New `computeHighScores.ts`, same derivation category as `computeLowestScores.ts` (raw `seasons[year].scores`, not a re-implementation of an engine field). Panel is now genuinely scrollable (`ScoreExtremesList` gained a `scrollable` prop, reusing the same thin-scrollbar `.scrollWrap` pattern `AtdrCard` already established) rather than a fixed short list.

**All-Time Lowest Single Week Score** — same treatment, threshold flipped to <=99.999. `computeLowestScores.ts`'s signature changed from a fixed `limit` to a `maxThreshold`, matching `computeHighScores.ts`'s shape. 199 real scores qualify. Also made scrollable.

Both mirrored into `league-sandbox.html` with the same real datasets (73 and 199 entries) embedded directly, verified independently.

---

## Entry 76 (2026-09-08, cont.) — All-Time Season Totals: manager-color names, applied site-wide (not just Records)

`SeasonTotalsCard.tsx` previously rendered every manager name in plain default text — no color at all, unlike every other manager-name display in this app. Since this component is shared between the Records page and every single Season page (not Records-only), the fix went into the component itself (new `meta: Meta` prop, `meta.manager_colors[m]` applied to the name span) rather than special-casing Records, and both call sites (`Records.tsx`, `SeasonPage.tsx`) were updated to pass `meta`. Verified identical, correct colors render on both a Season page and the Records page (Randy/Titi/Tony spot-checked against their real hex values). Mirrored into the sandbox.

---

## Entry 77 (2026-09-08, cont.) — Hanh's bio, first paragraph rewritten per explicit user dictation

User supplied new wording for the first paragraph of Hanh's `managerBios.ts` entry. One real ambiguity flagged before applying: the supplied text read "Hanh had done accomplished this across three separate eras" — an apparent merged-edit artifact. Confirmed with the user before touching anything; resolved to "Hanh accomplished this across three separate eras." New paragraph also reframes the "only manager to have worn the crown" claim to properly credit Randy as a fellow 3-time champion (already-verified fact from Entry 69), rather than singling out Hanh. Not mirrored into the sandbox — Manager Profiles was never built there (Entry 69's explicit scope call).

---

## Entry 78 (2026-09-08, cont.) — LEAGUE nav button: two real font-styling bugs fixed; "TNCFL Record Book" label removed

**Font bugs, found by direct measurement, not assumed:** the LEAGUE toggle button's computed style was 16px/400-weight while every year link (`.timeline-year` class, which the button also uses) is 18px/600-weight. Root cause: an inline `style={{ font: 'inherit' }}` on the button was overriding the class's `font-size`/`font-weight` entirely (inline styles beat CSS classes). Removed it, re-measured — sizes/weights matched, but `font-family` still diverged (`Arial` vs. the full `"Segoe UI", system-ui, -apple-system, Arial, sans-serif` stack) because `<button>` elements carry their own UA-default font-family that plain inheritance doesn't override the way it does for `<a>` tags. Added `fontFamily: 'inherit'` (font-family alone, not the full `font` shorthand that caused the first bug) to fix that too. Final state confirmed identical on all three properties (size/weight/family) via computed-style comparison.

**"TNCFL Record Book" label removed** from above the LEAGUE/year list in `TimelineRail.tsx`, per explicit request. Confirmed gone via a real render, zero console errors.

Neither fix touches `league-sandbox.html` — it uses its own separate tab bar, not `TimelineRail`.

---

## Entry 79 (2026-09-08, cont.) — Milestone 16 header corrected to DONE

`ROADMAP.md`'s Milestone 16 header still read "IN PROGRESS — batch 1 done, 2026-09-06" despite its own body explicitly stating "MILESTONE 16 IS COMPLETE" after batch 5 (all 15 seasons rolled out and verified) — a stale header, never updated after the milestone actually finished. Corrected to "DONE (2026-09-06, batches 1-5 all complete)" per explicit request. Noted in conversation but NOT fixed (out of scope for this request, flagged for whenever it's wanted): Milestones 9, 10, 11, 13, and 14 have no status marker in their headers at all, despite the components they describe (filters, salary ledger, Despair Differential, Peak Performance, Competence Chart) all being clearly already built and in production use.

---
## Entry 80 (2026-09-08, cont.) — Football transition: 3 new images added, target zoom range changed to 100-200%

**3 new football images added** to `FootballTransition.tsx`'s rotation (`public/football/football-3.png` through `football-5.png`), from a 5-image upload. Checked first, not assumed: 2 of the 5 uploaded images ("Football 1.png"/"Football 2.png") were byte-identical (confirmed via checksum) to the two already in the project — only the other 3 were genuinely new. `IMAGES` array updated with each new image's real pixel dimensions (all 1140x1140, read from the files). Verified with a real headless-Chromium sweep across repeated page loads that all 5 images now actually appear in the random rotation, zero 404s, zero console errors — not just a build check.

**Interactive walkthrough built** (chat-only, via the Visualizer — not part of the shipped app or `league-sandbox.html`) replicating the component's actual zoom/position/justify math with a real embedded image, so the logic could be discussed and adjusted live: fit-zoom (computed the same "contain" math the real component uses, since CSS `contain` itself isn't animatable), random target zoom/position/justify rolled once per "mount", and the same shared 0-1 progress-driven animation approach (not independent CSS transitions, which can't reliably keep `background-size`/`background-position` in sync).

**Target zoom range changed from 150%-250% to 100%-200%**, per explicit request surfaced during that walkthrough. Verified with a real 15-sample sweep of fresh page loads afterward — every sampled zoom value fell within the new 100-200 range, replacing the earlier verified 150-250 range.

Not mirrored into `league-sandbox.html` — this component has nothing to do with the LEAGUE section.

---
## Entry 81 (2026-09-08, cont.) — LEAGUE nav button: default browser border removed

Real bug, found from a user screenshot showing a visible rectangular border around "LEAGUE" that none of the year links below it have. Measured the computed style before touching anything: the browser's own UA-agent stylesheet for `<button>` was applying a `2px outset black` border on the top/right/bottom sides — never explicitly reset (unlike `background`, which the inline style already set to `none`). The `.timeline-year` class's own `border-left: 3px solid` (used for the active-route accent, per Entry 68's original nav work) only targets the left side, so it never touched the other three.

Fixed surgically, not with a blanket `border: 'none'` (which would have wiped out the class's `border-left` too, since inline styles win over classes): added explicit `borderTop`/`borderRight`/`borderBottom: 'none'` to the button's inline style, leaving `border-left` entirely to the CSS class. Verified via computed-style comparison — top/right/bottom now `0px none`, left still `3px solid` (transparent at rest, `#d9a521` on the active route), matching the year links' own resting state exactly.

---
