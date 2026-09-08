# TNCFL Record Book — Rebuild Roadmap

Milestone plan for the React/Vite rebuild, sequenced per the locked rule: template first, prove it
on 2011 only, then move forward one season at a time. Each milestone below is meant to be a single
working session's worth of scope — small enough to fully verify and lock before moving on.

Educational tips are marked 🎓 — called out because you're using this project to build real React/
Vite fluency, not just to get a site out the door. Where a concept **carries over from Wanderlog**,
that's flagged so you know what you already have muscle memory for vs. what's genuinely new.

---

## Type system — LOCKED (cross-cutting, applies to all milestones)

Two licensed font families, verified against real name-table metadata (not just filenames) before
use: **Segoe UI** (Regular 400, Bold 700) and **Segoe UI Black** (Regular 900, Italic 900 — a
separate family, not a weight variant of the first). User's decision on pairing: **Segoe UI Black
for all header-type items** (the season hero headline, section/card titles, card-level names like
the manager hover-card's name and Dancing Shoes' victim); **Segoe UI for body/UI text** everywhere
else. Small caption/eyebrow labels (chart section captions, stat-tile labels) were kept in Segoe UI
rather than Black — a judgment call since "header" is somewhat ambiguous for 13px gray captions;
worth a look and easy to adjust if it should go the other way. `--font-mono` (score tables, ledger
data) is unchanged — data typography was never part of this request.

CSS variables `--font-sans` / `--font-black` / `--font-mono` are defined once in `index.css`;
`@font-face` declarations live in `src/fonts.css`; the actual `.ttf` files are served from
`public/fonts/`. Verified via `document.fonts.check()` in a headless browser that both families
actually loaded (not silently falling back) before considering this done.

**Licensing flag, not a blocker:** Segoe UI's standard Microsoft license has historically been
restrictive about web-embedding specifically (vs. just installing it on Windows) — noted once since
this project deploys to a public GitHub Pages site eventually, on the user's confirmation these are
properly licensed for this use.

**Cross-checked against the old hub's actual CSS (extracted from `TNCFL_hub.html`'s embedded
`<style>` block) after building this:** the old hub used the same Segoe UI / Segoe UI Black split,
but reserved true Black for site-level chrome (`.site-title`, `.season-title`) and Hall-of-Fame
content (section headers, record values, profile names) — its own `.recap-title` was actually bold
Segoe UI at weight 800, NOT the separate Black family. `SeasonHero`'s headline was already built
using Black. **User's call, confirmed: keep it as Black — a deliberate upgrade over the old hub,
not an oversight to fix.** Don't "correct" this back to match old-hub precedent later.

The old hub's full color palette (`--bg:#111111`, `--brand-red:#C0252B`, `--lock-green:#4ec79e`,
etc.) was also extracted to `old_hub.css` — useful reference for the color-storytelling work still
ahead (the deferred score-cell colors, drought-bar thresholds, and the Superiority Beatdown Index's
red-to-green dominance gradient all likely want to pull from this same real palette rather than
inventing new colors).

---

## Color system — LOCKED (cross-cutting, applies to all milestones)

**Every manager's color, everywhere on the site, comes from `meta.manager_colors` — exact hex
values, never approximated, recreated, or reassigned.** Confirmed via computed-style checks in a
headless browser (not just visual inspection) that the rendered colors are byte-for-byte identical
to the real data (e.g. Hanh `#FF9900`, Kito `#E09E06`). This was already the de facto behavior
across `BumpChart`, `DroughtBars`, `SalaryDonuts`, and `ManagerHoverCard` since Milestones 5–6; the
user's ask here formalizes it as a locked rule rather than an incidental pattern, the same way the
type system got locked.

`meta.manager_colors` covers all 18 managers who have ever played (not just a given season's
active roster) — confirmed by cross-referencing against the old hub's own code, which pulls from
this exact same field in 14+ separate places (every chart type). `meta.reserve_colors` (12 spare
hex values) exists in the data but is genuinely unused by the old hub's front-end — it looks like
pipeline/engine-level capacity for assigning a new manager's color when they first join, not
something either site's display layer picks from directly. `reserve_colors` was already typed
(Milestone 1) for completeness, even with nothing consuming it — that's consistent with the old
hub, not a gap to fill.

**Do not confuse this with the separate, still-unresolved threshold colors** (the deferred
score-cell blue/gold/red/split rule, the drought-bar two-color threshold, the H2H matrix's
red-to-green dominance gradient) — those are UI-state colors keyed to a VALUE (a score, a drought
length, a dominance ratio), not per-manager identity colors. The two systems can share a palette
family but should never be implemented as the same lookup.

---

## Layout containment & consistent widths — FIXED (cross-cutting)

Found via direct measurement (not just visual inspection) that the score table has a hard floor of
953px — tested viewports from 400px to 2000px; it refuses to shrink below that width no matter how
narrow the window gets, but happily grows past it when more room is available (1044px at 1300px
viewport, 1744px at 2000px). Below ~1049px viewport width, that floor was wider than the space left
after the sidebar, and the overflow was leaking to the WHOLE PAGE instead of staying contained in
the table's own scrollable wrapper — a real bug, not a design choice.

**Root cause and fix:** flex items default to `min-width: auto`, which refuses to let them shrink
below their content's intrinsic width — that's why `.layout-content`'s child (the table wrapper)
was forcing the whole page to overflow instead of scrolling internally. Added `min-width: 0` to
`.layout-content`; confirmed via the same viewport sweep that the page itself no longer overflows
at 600–2000px and the table's `overflowX:'auto'` wrapper now correctly contains its own scroll.

**Separately, a real width-inconsistency bug:** three components (`RecapBody`, `DancingShoes`,
`SeasonHero`'s subtitle) had leftover arbitrary `max-width` values (640px, 640px, 520px) from early
prose-styling choices, while every other section spanned the full container — producing the
"staircase" look the user flagged from a screenshot. Removed all three so every section on the page
now shares one consistent width.

**New gap found while testing, NOT fixed yet — deferred to Milestone 19 (mobile QA):** at true
small-phone widths (~400px), `SalaryDonuts` (two donuts each with a fixed `min-width: 220px`) and
`NuggetGrid` (a fixed 4-column grid) don't collapse gracefully and still cause page overflow. This
is a distinct issue from the flex-containment bug just fixed — it's genuine narrow-viewport
responsive design, squarely Milestone 19's planned scope, not scope-creeped in here.

---

## Milestone 0 — React/Vite warm-up (no RB code yet)

Before touching real data, a tiny throwaway exercise: scaffold a blank Vite+React+TypeScript
project, build one component that takes props and renders them, and run it with hot-reload.

- 🎓 **What Vite actually does:** it's a dev server with instant hot-module-reload (change a file,
  see it update without a page refresh) plus a production bundler. Wanderlog already used it —
  this milestone is just about noticing the parts of `vite.config.ts` and `package.json` scripts
  you'll reuse verbatim.
- 🎓 **Components are functions that return JSX.** `props` are just the function's arguments.
  This is the one idea everything else builds on.
- **Carries over from Wanderlog:** the whole toolchain (`npm create vite`, `tsc -b && vite build`,
  `.gitignore`, TypeScript config) — you're not learning new tooling here, just refreshing it.

**Done when:** a scratch component renders on screen with props you pass it, and you can explain
in your own words what "hot reload" is doing.

---

## Milestone 1 — Project scaffold + typed data layer ✅ DONE — verified against old hub 2011 data

Real Vite+TS project for the Record Book. Folder structure (`components/`, `pages/` or
`seasons/`, `lib/`, `types/`), and TypeScript interfaces describing the season/manager/week shapes
that come out of `site_data.json`.

**What was actually built this session:** a real `tncfl-record-book` project (separate from the
Milestone 0 throwaway) with `src/types/data.ts` (typed against the REAL `site_data.json` — its
shape was inspected directly, not guessed: `seasons[year]` has `scores`, `cum_points`,
`weekly_rank`, `gap_behind`, `hmotw_tally`, `active_managers`, `money_circle`, etc., each keyed by
manager name), `src/lib/useRecordBookData.ts` (the fetch hook), and `src/components/
DataVerification.tsx` (a deliberately raw, throwaway verification view — not the real 2011
chapter, that's Milestone 3 — that renders real 2011 numbers so they can be eyeballed against the
old hub). Builds clean, zero `any` types, `tsc -b` passes.

**Deliberate scope cut, stated rather than silently done:** only `seasons`, `summary` (partially —
its inner shape wasn't fully inspected), `recaps`, `nuggets`, `dance`, and `meta`'s manager-color
palette are typed. `career`, `h2h`, `all_time_scores`, `streaks_at_1`, `payouts`, and `cumulative`
are left as `unknown` placeholders — real sections of the data, just not needed until the
League/Hall of Fame work in Milestone 17, so typing them now would be guessing at a shape before
there's a component to check it against.

- 🎓 **TypeScript interfaces as a safety net:** Wanderlog's `types/index.ts` did this for
  trips/pins/stops. Same idea here — write `interface Season { year: number; managers: Manager[];
  ... }` once, and TypeScript stops you from ever misspelling a field or forgetting one.
- 🎓 **`useEffect` + `useState` data fetching** — the exact pattern Wanderlog used to load trips
  from Supabase, just pointed at `site_data.json` instead of a database call.
- 🎓 **First custom hook** (`useRecordBookData`) — the rule of thumb for when to extract one:
  once two-or-more components would need the same fetch+loading+error logic, pull it out rather
  than copy-pasting the useState/useEffect pair.
- **Confirmed, not assumed:** the real `site_data.json` schema was inspected directly (Python,
  reading the actual file) before any interface was written — per the "derive, don't editorialize"
  rule, nothing here is typed from memory of the old hub's JS code.

**Verified:** ran locally, checked the rendered numbers (Bao's week-by-week scores, cumulative
points, and every manager's HMOTW tally) against the old hub's 2011 section — confirmed matching.
The fetch-typed-data-render pipeline is proven correct. Milestone 1 is complete.

---

## Milestone 2 — Timeline rail shell (navigation only, no season content yet) ✅ DONE, verified

Build the persistent year-timeline component and wire up routing so `/season/2011`, `/season/2012`,
etc. resolve to an (empty) season-chapter shell.

**What was built and verified this session:** `react-router-dom@^6.26.0` installed (same major
version as Wanderlog). `TimelineRail.tsx` renders all 15 years from `meta.years_desc` as
`NavLink`s — active-year highlighting comes from React Router's own URL-matching, not a hand-rolled
`useState`. `Layout.tsx` holds the persistent rail + an `<Outlet context={data} />` for nested
route content. `SeasonPage.tsx` reads the year via `useParams()` and the lifted data via
`useOutletContext()`, and renders a placeholder shell showing that season's real
`manager_count`/`weeks` — proving the routing→data lookup works without any real content yet.
`App.tsx` now fetches data ONCE at the top (lifted state) and sets up `BrowserRouter` with
`/` redirecting to the most recent season (`meta.years_desc[0]` — real data, not hardcoded) and
`/season/:year` as the season route. The throwaway `DataVerification.tsx` from Milestone 1 was
removed — its job is done, real routing replaced it.

**Verified via headless browser, not just "it builds":** (1) visiting `/` redirects to
`/season/2025` and 2025's rail entry is highlighted; (2) clicking "2011" in the rail navigates to
`/season/2011`, active state moves correctly, and the shell shows 2011's real 6 managers/17 weeks
(matching what was cross-checked against the old hub in Milestone 1); (3) directly loading
`/season/2017` (a deep link, not a click) resolves correctly with 2017 active — confirming a
bookmarked/shared season URL will work once real content exists.

- 🎓 **`react-router-dom` route params** — `useParams()` to read the year out of the URL. Direct
  reuse of the pattern Wanderlog used for `/trip/:tripId`.
- 🎓 **Lifting state up, for real this time:** `data` is fetched once in `App.tsx` and flows down
  to both `TimelineRail` (as a prop) and `SeasonPage` (via `Outlet` context) — neither fetches or
  duplicates it. This is the concrete shape "lift state to the common parent" takes in practice.
- 🎓 **New API beyond Wanderlog:** nested routes (`<Route>` inside `<Route>`) and `<Outlet
  context={...}/>` + `useOutletContext()` — Wanderlog's routes were all flat/top-level and passed
  data via `AuthContext`, not `Outlet` context. Two different tools for a similar problem, worth
  noticing the distinction.

---

## Milestone 3 — 2011 season chapter: functional parity, no motion yet ✅ DONE — verified against old hub

Get real 2011 data rendering — hero stat, score table — with zero animation. The goal here is
correctness, not polish: does the right data show up in the right shape.

**What was built this session:** `useSeasonSummary.ts` — the first computing (not fetching) custom
hook, using `useMemo` to derive the season champion (highest final `cum_points`) and the highest
single-week score+manager+week, from real per-week engine data, never hand-typed. Cross-checked
both values against an independent field in the same data file (`career['Hanh'].pts['2011']`)
before writing any component around them. `ScoreTable.tsx` + `ScoreTable.module.css` — a real
week-by-week grid, rows sorted by final standing (`weekly_rank`'s last entry — verified it agrees
with the `cum_points` ordering before trusting it for sorting), weekly-high cells bolded gold using
the engine's own `weekly_high` field (not recomputed). `SeasonHero.tsx` + `.module.css` — the
hero-stat-first moment: year, champion + their total, highest single week, manager/week counts.
`SeasonPage.tsx` rewritten to render both instead of Milestone 2's placeholder text.

**Verified via headless browser against 2011 specifically:** champion shows as Hanh at 1952.0
points, highest single week shows as Kito at 168.0 in Week 14, and the full standings table
(Hanh/Kito/Mikey/Bao/La/Lonny in that order, matching each manager's real final total) all render
correctly — matching the values independently computed and cross-checked before any UI was built.

- 🎓 **Custom hooks:** once you're deriving the same computed value (say, "who won the season") in
  two components, that's the signal to extract a `useSeasonSummary(year)` hook. This is a new
  concept beyond Wanderlog — nothing there needed a custom hook.
- 🎓 **`useMemo` for real, not just as a concept** — re-runs only when its dependency (`season`)
  changes, rather than on every re-render. Not a performance necessity yet at this data size, but
  the habit is worth building before a chart with real per-frame animation makes it matter.
- 🎓 **CSS Modules** — direct reuse from Wanderlog (`*.module.css` pattern is already how you scope
  styles per-component).
- 🎓 **Rules of Hooks in practice:** `SeasonPage.tsx` calls `useSeasonSummary` unconditionally on
  every render (with a fallback season when the real one is missing), rather than putting the hook
  call inside an `if` — hooks can't be called conditionally, and this is what working around that
  actually looks like in real code, not just as a rule you're told about.

**Verified:** spot check completed against the old hub's 2011 section — the score table and hero
stats match. Milestone 3 is complete.

**Note (decided, not a bug):** because `SeasonPage.tsx` has no year-specific logic and
`site_data.json` already contains all 15 seasons, every year 2011–2025 already renders through this
same component as a side effect — not a deliberate build-ahead. User's call: leave this as-is (a
good sign the component genuinely generalizes, not hardcoded to 2011's shape), but **only 2011 is
considered reviewed/verified** right now. The other 14 seasons' rendered output has NOT been
checked against the old hub yet — don't treat them as confirmed correct just because they render
without error. Milestone 8 is still where each of those actually gets reviewed, one at a time.

---

## Milestone 4 — Motion & scroll pass on 2011 ✅ built, pending your verification

Layer in the "reveal as you scroll" behavior and animated counters on the now-correct 2011 page.

**Design direction confirmed first, per the sequencing rule:** before writing code, an inline mockup
(538-style storytelling hero + Baseball-Savant-style dense data layer, live scroll-reveal demo) was
built and reacted to — user called it a good foundation. What got built below is that mockup made
real, using actual 2011 data throughout.

**What was built this session:** `useInView.ts` — a real `IntersectionObserver` custom hook
(threshold 0.15, fires once). `RevealOnScroll.tsx` — combines `useInView` with Framer Motion's
`<motion.div>`, and checks `useReducedMotion()` first: if the OS-level reduced-motion setting is on,
it skips animation entirely and renders content immediately, rather than retrofitting that check
later. `AnimatedNumber.tsx` — uses Framer Motion's imperative `animate()` to count up a number over
1.2s, same reduced-motion check. `SeasonHero.tsx` rewritten to match the confirmed mockup: serif
headline pulled from the real hand-written recap (never derived), the champion's total as an
animated count-up, and a real SVG sparkline plotted from that manager's actual `cum_points` array
(plain math, no charting library). **UPDATE, post-font/color-system work: the champion stat number
is now Segoe UI Black colored with the champion's own `meta.manager_colors` entry (not a fixed
gold), and the sparkline was changed from a cum_points line to the champion's ACTUAL bump-chart
line — their real `weekly_rank` array, same rank-to-y scaling `BumpChart` uses — with a dot marking
each week. Verified against real 2011 data: Hanh's line correctly dips flat at rank 6 through weeks
4–7 and 12, then climbs to rank 1 at weeks 16–17, matching her real `weekly_rank` array and the
recap's own narrative exactly. **Further update: the sparkline now stretches to fill the row's
remaining width** rather than a fixed 130px box — a new `useElementWidth` hook (using
`ResizeObserver`, a different browser API than `IntersectionObserver` — reports SIZE changes, not
visibility) measures the actual rendered width of a wrapping div, and that measured value drives
both the SVG's `viewBox` and the line's coordinate math directly, so 1 SVG unit = 1 real pixel at
any width. This matters specifically because the alternative (just stretching a fixed-viewBox SVG
via CSS/`preserveAspectRatio="none"`) would have scaled x and y independently and turned the
circular week-dots into ellipses — confirmed via computed-style checks that dot radius stays
exactly `2` at both a ~1075px and a ~275px measured width, with the line's shape correctly
compressing/expanding to match.** **Further update: `useElementWidth` generalized into
`useElementSize`** (one `ResizeObserver`, both dimensions) — one instance now measures the
stat-number block's real rendered height, a second measures the sparkline wrapper's width. Line
weight and dot size updated to match the old hub's actual spec, confirmed from its `renderBump()`
source rather than eyeballed: `stroke-width: 2.4`, dot `r: 3.4` (previously 2/2). **A real clipping
bug was caught from a screenshot the user annotated with a box:** with zero inset padding, a dot
plotted exactly at rank 1 (y=0) or the first/last week (x=0 or x=width) had half its circle cut by
the SVG's own edge. Fixed with a computed `PADDING` constant (the dot radius plus a small margin —
radius is the larger of "radius" vs. "half the line's round stroke-linecap" at this weight)
insetting both axes. Verified via headless browser: the SVG's rendered height now matches the stat
block's height to the pixel (both are live `ResizeObserver` measurements, neither hardcoded), and
checking all four edges of all 17 dots confirms zero clipping. `SeasonStatTiles.tsx` (new) — the dense stat-tile grid from the
mockup. `ScoreTable.module.css` restyled denser/monospace to match. `useSeasonSummary.ts` gained
`hmotwLeader` (whoever has the season's highest `hmotw_tally` — engine data, not recomputed).
`SeasonPage.tsx` now wraps the stat-tiles + score table in `<RevealOnScroll>`; the hero renders
immediately (nothing to reveal — it's the first thing on the page).

**Verified via headless browser, not just "it builds":** the champion counter genuinely starts at
0.0 and animates up to the real total (1952.0) over ~1.2s. At a normal viewport, the dense section
sits close enough to the fold that it's already visible on load — expected `IntersectionObserver`
behavior for this season's short content length, not a bug. Forced a short viewport (340px tall) to
confirm the actual mechanism: the dense section is genuinely hidden pre-scroll and animates in
correctly once scrolled to, with all Milestone 3 styling (gold weekly-highs, champion row) intact
afterward.

- 🎓 **This is the genuinely new territory** — nothing in Wanderlog touched scroll-driven
  animation. Two building blocks: an `IntersectionObserver`-based custom hook (`useInView`) that
  tells a component "you're now on screen," and a motion library (Framer Motion) to animate the
  transition once that hook fires.
  Framer Motion's building blocks used here: `motion.div` + `initial`/`animate` for the two-state
  reveal transition, and the separate imperative `animate()` function for tweening the counter's
  plain number — two different corners of the same library for two different jobs.
- 🎓 **Accessibility built in from the start, not retrofitted:** `useReducedMotion()` is checked in
  both `RevealOnScroll` and `AnimatedNumber` — exactly the roadmap's note about doing this now
  rather than across 15 seasons of chapters later.

**Your turn:** run it, open `/season/2011`, and watch the counter animate + scroll to see the
reveal. Try shrinking the browser window short and reloading to see the pre-scroll hidden state more
clearly (a normal-height window reveals it almost immediately, as noted above).

**Deferred item (fully derived, ready whenever): score-cell color coding.** From a 2024 old-hub
screenshot, verified against real 2024 data cell-by-cell: blue = score < 100; gold (solid) = that
week's outright weekly high AND under 200; red/gold split = that week's outright weekly high AND
≥200 (the engine's DHMOTW double-tally rule, made visible); red (solid) = ≥200 but not that week's
high. **Originally flagged to gate the 200-threshold styling to 2017+ only** (since the engine's
DHMOTW double-tally rule the pill visually represents does nothing pre-2017) — this gate was
never actually implemented when the pill system was built in Milestone 7g, and went unnoticed
through 2013's Milestone 16 rollout (which has 7 real ≥200 scores). **Surfaced to the user during
Milestone 16 batch 2 (2014-2016) prep; user's locked call: keep it ungated, applying the ≥200
pill rule uniformly across every season regardless of year, for visual consistency.** This
supersedes the gate note above — `getPillType()` in `ScoreTable.tsx` intentionally takes no year
parameter and this is correct as-is, not a bug to fix. 2013's already-shipped ≥200 pills (Kevin's
256.0, Douang's 217.0, etc.) are correct and need no rework.

**UPDATE (from 2011 old-hub screenshots): the "blue = <100" rule above does NOT hold for pre-2017
seasons.** 2011's score table shows blue badges on scores like 130.0, 90.0, 89.0 — nowhere near
under 100. Tested the next-best hypothesis (blue = below that week's average score across active
managers) against real 2011 data and it ALSO doesn't hold cleanly (a couple of below-average scores
in the real data aren't blue in the screenshot). **Blue's actual pre-2017 meaning is genuinely
unresolved** — needs a cleaner, pixel-exact source (not a compressed screenshot read) before it can
be derived correctly. Handle together with the already-deferred 2024 rule in the same polish pass,
not separately.

**Also found: `DroughtBars` uses a single color per manager; the old hub uses a two-color
THRESHOLD** (gold for high/urgent drought, teal for low/recently-active) rather than one color per
manager throughout. Fold this into the same polish pass — the exact threshold cutoff isn't derived
yet and should be checked against real drought numbers before implementing, same discipline as the
other two color rules above.

---

## Milestone 5 — Chart components (2011 only) ✅ built, pending your verification

Rebuild 2011's specific charts (score bump chart, drought bars, salary donuts) as real components.

**Scope conflict surfaced and resolved before building:** this milestone needs `payouts` and part of
`meta.hmotw`, both deliberately left `unknown` in Milestone 1 pending Milestone 17. Resolved by typing
only the 2011-relevant slices these charts actually consume — `PayoutRow`/`PayoutsEntry` (full real
shape) and `HmotwMeta.drought_snapshot` — while leaving the rest of `meta.hmotw` (season_tally,
status_by_year, top5_streaks, all_players, atdr_snapshots — genuine cross-season/ATDR data) still
`unknown` until Milestone 17 as originally planned.

**What was built:** `BumpChart.tsx` — hand-rolled SVG rank-progression lines from the already-typed
`weekly_rank`, colored via `meta.manager_colors`. `DroughtBars.tsx` — horizontal bars from the newly
typed `drought_snapshot`. `SalaryDonuts.tsx` — two hand-rolled SVG donut charts (winners/losers, split
by sign of `net`), using plain trigonometry for the arc paths. **Chose hand-rolled SVG over D3 for
all three** — the roadmap flagged this exact decision point, and none of these three charts need D3's
scale/shape helpers; plain arithmetic was enough, which sidesteps the React-vs-D3 DOM-ownership
tension entirely rather than resolving it. Would reconsider D3 for a future chart with genuinely
complex geometry. Each chart sits in its own `<RevealOnScroll>` so they animate in independently as
you scroll to each, rather than all firing with the score table above.

**Verified against independently-checkable facts, not just "it renders":** the bump chart's final
rank order (Hanh→Kito→Mikey→Bao→La→Lonny) matches Milestone 3's score table. The drought bars show
La at 14 weeks — matching the old hub's actual 2011 "Dancing Shoes" recap text word-for-word
("fourteen straight weeks"). The donuts balance exactly: winners ($481+$91=$572) offsets losers
($226+$168+$109+$69=$572), consistent with `payouts['2011'].balanced: true` in the real data.

- 🎓 **The chart-library decision, made explicitly rather than defaulted:** D3 vs. hand-rolled SVG
  vs. a higher-level library like Recharts is a per-chart call, not a one-time project-wide choice.
  This milestone's charts were simple enough that hand-rolled SVG won on all three.
- 🎓 **Typing data "just enough for what you're building now"** — the scope-conflict resolution
  above is the concrete version of a habit worth keeping: when a milestone needs more data than was
  typed earlier, type exactly what it consumes, not the whole remaining schema at once.

**Your turn:** run it, open `/season/2011`, scroll through all three new charts, and spot-check
whatever part of this you can most easily verify against your own memory of the old hub's 2011
section.

---

## Milestone 6 — Reusable manager hover-card ✅ built, pending your verification

Build the "hover any manager name anywhere" component and the shared state it needs to know which
manager is currently hovered, from wherever on the page that hover happened.

**Scope note (same pattern as Milestones 1 and 5):** the hover card shows 2011-SEASON-scoped stats
only (final rank, season points, HMOTW tally, drought, season net) — a real "vs the field" career
comparison needs `career`/`h2h`, still deliberately untyped until Milestone 17. Not a placeholder,
just scoped to what's typed right now; the card gets richer once that data exists.

**What was built:** `HoveredManagerContext.tsx` — same shape as Wanderlog's `AuthContext`
(`createContext` + Provider + a hook that throws if used outside the Provider), wrapping the ENTIRE
app in `App.tsx` (outside the router) since hovered-manager state needs to survive route changes and
reach any component anywhere. `useManagerHover.ts` — a small hook any single-manager component
(`SeasonHero`, `SeasonStatTiles`) calls directly. `ManagerHoverCard.tsx` — the fixed-position card
itself, using Framer Motion's `AnimatePresence` for the first time (needed specifically because
normal React can't animate an element OUT — the moment you stop rendering it it's just gone;
`AnimatePresence` keeps it mounted just long enough to finish an exit animation).

**A real bug caught and fixed before it shipped:** the first pass called `useManagerHover()` INSIDE
a `.map()` in `ScoreTable` — a genuine Rules-of-Hooks violation (hooks must run the same number of
times, in the same order, every render; a hook inside a loop breaks that the moment the list's
length changes). Fixed by reading `useHoveredManagerContext()` ONCE at the top of `ScoreTable`,
`BumpChart`, `DroughtBars`, and `SalaryDonuts` (all four map over manager lists) and building each
item's handlers as plain functions instead — this is the real, load-bearing version of the Rules of
Hooks lesson from Milestone 3, not just the toy case of an early return.

**Bonus wiring beyond the minimum ask:** hovering in ANY of the five components (score table, hero,
stat tiles, bump chart, drought bars, salary donuts) dims every OTHER manager in the other
components too, not just in the one you're pointing at.

**Verified via headless browser, not just "it compiles":** hovering "Kito" in the score table
simultaneously highlighted Kito's line in the bump chart, bolded the Kito row in drought bars while
dimming the rest, dimmed the other slice in the donut, and showed the correct real card (#2, 1924.0
points, 3 tally, 3w drought, +91 net — matching every number already verified in earlier
milestones). Repeated the same hover starting from the bump chart's own label instead, confirming
the shared state works bidirectionally, not just one way.

**Your turn:** run it, hover manager names in different components, and confirm the card + cross-
highlighting feels right.

---

## Milestone 7 — Recap prose, nuggets, and Dancing Shoes ✅ built, pending your verification

Render the three hand-written narrative pieces that were typed all the way back in Milestone 1 but
never actually built into a component: the full recap body (only `title`/`subtitle` are shown so
far, in `SeasonHero`), the nugget cards (`data.nuggets[year]` — typed, but nothing reads it yet),
and the "Dancing Shoes" longest-drought roast card (`data.dance[year]` — same situation). This gap
was caught by the user asking directly whether a milestone covered these; it didn't, so this one
was inserted here rather than letting Milestone 8's "full review and lock" declare 2011 complete
while three real content pieces were still missing.

**What was built:** `RecapBody.tsx` — renders `recap.body` (an array of hand-written paragraphs)
directly under the hero, still part of the immediate story read (not gated behind a scroll-reveal,
same as the hero itself). `parseGridCells.ts` — converts the nuggets' spreadsheet-style position
strings (`"A1:A4"`, `"D2:D3"`, a bare `"D1"`) into real CSS `grid-column`/`grid-row` values, and
computes the grid's overall column/row count from whatever the actual data uses rather than
hardcoding 2011's 4-column shape. `NuggetGrid.tsx` — renders the season's nugget cards at their
real positions, with an accent-color map for the six color words seen so far (`purple`, `gold`,
`teal`, `red`, `blue`, `green`) plus a gray fallback for any future season's unrecognized accent
word rather than letting it render invisibly. `DancingShoes.tsx` — the drought-roast card, with the
victim's name wired into the shared hover context from Milestone 6. All three render their body
text via `dangerouslySetInnerHTML`, since the recap/nugget/dance strings contain real hand-authored
inline HTML (`<b>`, `<em>`, `<br>`) — explained in-code why that's safe here (trusted project data,
never user input) and where it would NOT be safe (anything from an actual visitor).
`DroughtBars`/`DancingShoes` are grouped in the same reveal section since they tell the same
drought story two ways — already cross-checked against each other back in Milestone 5.

**Verified via headless browser against real 2011 content:** the recap's six paragraphs render with
their bold emphasis intact. The nugget grid's layout matches the real data's cell positions exactly
(a tall card spanning the full column height, two stacked mid-column, three stacked in the last
column). The Dancing Shoes card shows La at 14 weeks, consistent with the drought bars right next
to it. A genuine test-methodology catch along the way: an initial "jump straight to the bottom"
screenshot showed several sections missing entirely — traced to `IntersectionObserver` never
getting an intermediate frame during an instant `scrollTo` jump, not a real bug. Re-verified with
gradual, incremental scrolling (simulating how a real mouse wheel/trackpad actually moves) and
every section revealed correctly. Worth knowing this as a real (if rare) edge case — an instant
"jump to bottom" shortcut could theoretically skip a reveal — but not something normal scrolling
ever triggers.

**Your turn:** run it, read through 2011's full recap, scroll to the nugget grid and Dancing Shoes
card, and confirm the prose and layout feel right.

---

## Milestone 7a — Post-Milestone-7 polish pass (sub-milestone numbering starts here)

**Numbering convention, established this session:** incremental fix/polish rounds that happen
between two numbered milestones (rather than being their own planned milestone) get lettered
sub-numbers — `7a`, `7b`, `7c`, etc. — off the milestone they follow. Milestone 8 doesn't formally
start until the current run of fixes is done and confirmed.

**What happened in 7a, in order:**
1. Licensed fonts (Segoe UI, Segoe UI Black) integrated — full detail in the **Type system**
   section near the top of this file.
2. Manager color system formally locked as a rule (was already de facto behavior; now
   documented and verified byte-exact) — full detail in the **Color system** section near the top.
3. A real flex-containment bug (page-level horizontal scroll instead of contained table scroll)
   and a width-inconsistency bug (three components had leftover arbitrary `max-width` values,
   producing a "staircase" look) — both fixed, full detail in the **Layout containment & consistent
   widths** section near the top.
4. `SeasonHero`'s sparkline rebuilt three times over as requirements got refined: first to plot the
   champion's real bump-chart line (rank-based, not cumulative points) instead of the original
   Milestone 4 version; then to stretch to fill the row's remaining width via a measured
   `ResizeObserver` hook; then to match the old hub's actual line-weight/dot-size spec
   (`stroke-width: 2.4`, `r: 3.4`, confirmed from its real `renderBump()` source) and to match the
   stat block's real height with anti-clipping padding, catching a real dot-clipping bug along the
   way. Full detail folded into the **Milestone 4** write-up above, since that's where
   `SeasonHero` itself was originally built.

**Status: 7a's items above are done.** (Note: Milestone 8 was actually built before this status
line got updated — the user resumed with 7b-labeled work afterward rather than waiting for an
explicit "7a confirmed done" checkpoint. Sub-milestone numbering tracks WHAT got fixed and in what
order, not a strict gate before later milestones can proceed.)

---

## Milestone 7b — Scroll fade in/out fix (+ tabled: football transition animations)

**Bug reported:** "the scrolling reveal is not really happening." Two real, distinct causes, not
one:
1. `useInView` defaulted to `once: true` — the observer disconnects after the first reveal, so a
   section can literally never fade back out once shown.
2. Even with `once: false`, the code animated to `{}` (an empty object) when scrolling OUT of
   view — Framer Motion has no target for `opacity`/`y` in an empty object, so it just holds
   whatever value they last had (stuck at `opacity: 1`) instead of animating back down.

**Fixed:** `RevealOnScroll` now calls `useInView({ once: false })`, and animates to an explicit
`{ opacity: 0, y: 16 }` (matching `initial`) when out of view, instead of `{}`.

**Verified via headless browser, not just a build check** — and a real test-methodology catch along
the way: an early verification attempt guessed a scroll distance (600px) that never actually
reached the target section, because the page is taller now (site header + hero added since this
component was first built) — the section actually sits ~1217px down at the tested viewport. Found
the section's real position via `getBoundingClientRect()` instead of guessing, then confirmed the
full cycle: scroll down reveals it (`opacity: 1`), scroll back up hides it (`opacity: 0`), scroll
down again re-reveals it (`opacity: 1`) — genuinely bidirectional, not a one-time animation.

**Football transition animations — explored via inline preview, then explicitly tabled by the
user** ("this is a want, not a need at the moment"). Design work done so far, preserved here in
case this gets picked back up: 5 candidate muted-grey (`#6b6b68`/`#8a8a87`) animations were
proposed (spiral pass, field goal, coin toss, first-down marker slide, referee flag throw); user
chose 4-5 variants picked randomly, playing on roughly half of section transitions (not every one).
The spiral pass went through a real design correction worth remembering if this resumes: the first
attempt used CSS `rotate()` on the whole football shape, which depicts a TUMBLE (rotation around
the axis pointing at the viewer) — a real spiral spins around the ball's own long axis, which
points along the direction of flight, so the oval silhouette shouldn't visibly rotate at all from
the side; only the laces sweep in and out of view. Fixed by keeping the football body static and
animating only a laces mark's `scaleX` (full width down to a sliver and back), with the whole
group riding an `offset-path` arc using `offset-rotate: auto` so the nose naturally tracks the
flight-path tangent. Not implemented in the real app — parked here, not built.

**Update: section spacing increased for real breathing room.** Measured the actual gaps between
top-level sections before touching anything — they were 28px, 32px, 0px, 24px, 24px, 24px (one
pair had effectively zero gap), which is why the fade barely read as a transition even after the
bidirectional fix above: there was no scroll distance for one section to finish fading out before
the next started fading in. Added a `marginTop` prop to `RevealOnScroll` (default `1000`, not
hardcoded inline, since 1000 was given as a starting point to tune rather than a final value) —
confirmed via measurement that all five `RevealOnScroll`-wrapped gaps are now exactly 1000px each
(the one unchanged 28px gap is between the hero and recap prose, which was never part of the fade
system). Total page height grew from ~3159px to ~8055px. **A real test-speed artifact caught along
the way:** an initial verification scrolled synthetically fast (~3000px/sec) and found sections
topping out around 78–89% opacity, never fully reaching 1 — looked like a bug, but retesting at a
realistic scroll speed showed every section correctly reaching full opacity. The fade transition
duration (0.5s) just can't outrun an artificially fast scroll; a real user scrolling normally
doesn't hit this.

---

## Milestone 7c — Scroll cue moved, animated, and spacing retuned

**Moved** the "↓ scroll for the full ledger" cue out of `SeasonHero` (where it sat above the recap)
to a new standalone `ScrollCue.tsx`, positioned below the recap instead. **Centered** horizontally
and set **50px** below the recap — confirmed via measurement, not eyeballed: the cue's horizontal
center (730px) exactly matches `.layout-content`'s own center (730px), and the gap from the recap's
bottom to the cue's top is exactly 50px. **Added a real bounce**: Framer Motion's `animate` array
shorthand (`{ y: [0, 8, 0] }`) looped with `transition={{ repeat: Infinity }}` — a different pattern
than `RevealOnScroll`'s one-shot transitions, since `repeat` is what turns a transition into a loop
rather than a single play. Respects reduced motion (skips the loop, shows static text). Confirmed
the element's actual position differs between two captured frames 500ms apart — genuine motion, not
a static element with an unused animation prop.

**`RevealOnScroll`'s default `marginTop` changed from 1000 to 100** — confirmed via measurement
that all five gaps are now exactly 100px each, down from the 1000px set in 7b. (7b's 1000px was
explicitly a "starting point to tune, not a final value" — this is that tuning.)

---

## Milestone 7d — Cue-to-first-section gap corrected back to 1000px

7c's blanket change of `RevealOnScroll`'s default from 1000 to 100 was too broad — the user's
actual intent was that ONLY the gap between the scroll cue and the FIRST reveal section should
stay at 1000px; every gap AFTER that should be 100. Fixed with a targeted override:
`<RevealOnScroll marginTop={1000}>` on just the first instance (stat tiles + score table),
leaving the other four using the new default (100). Confirmed via measurement: cue→first-section
is exactly 1000px, every subsequent gap is exactly 100px.

---

## Milestone 7e — Sticky header and rail

**Ask:** scrolling should not move the top header or the left navigational rail — only the season
content underneath should scroll.

**What was built:** `SiteHeader`'s `.header` set to `position: sticky; top: 0`. `.timeline-rail`
set to `position: sticky; top: var(--header-height); height: calc(100vh - var(--header-height));
overflow-y: auto` — the rail sticks just below the header rather than overlapping it, and gets its
own internal scroll if its content ever exceeds the available height. The header's real height is
measured live via `useElementSize` (not a guessed constant) and fed to the rail through a
`--header-height` CSS custom property set on `.layout-body`.

**Two real bugs caught and fixed via actual testing, not assumed correct from the code alone:**

1. **The header initially didn't stick at all** — it scrolled away with the page immediately.
   Root cause: `useElementSize`'s ref was on a wrapping `<div>` around `SiteHeader`, sized exactly
   to the header's own height. `position: sticky` needs room within its PARENT's height to have
   somewhere to stick — a parent that's the exact same height as the sticky child gives it zero
   room, so it scrolls away as soon as you pass it. Fixed by converting `SiteHeader` to
   `forwardRef` and attaching the ref directly to the `<header>` element itself, so its real
   sticky-positioning parent is `.layout` (which spans the whole page), not a same-height wrapper.
2. **The rail's offset was measured as 90px when the header is actually 119px tall.** Root cause:
   `useElementSize` read `entry.contentRect`, which is the CSS content box only — it excludes
   padding and border. `SiteHeader` has `padding: 14px 24px` (28px of vertical padding), and
   90 + 28 ≈ 119 confirms that's exactly where the missing pixels went. Fixed by reading
   `entry.target.getBoundingClientRect()` instead, which gives the full border-box size. This was
   a bug in the shared hook itself, not just this one usage — it happened to not matter for the
   hero's stat-block/sparkline-wrapper measurements only because those specific elements have no
   padding, not because the old code was actually correct.

**Verified via headless browser:** the CSS variable now exactly matches the header's real measured
height (119px = 119px, no mismatch); both the header and rail stay at the identical viewport
position across four different scroll depths (0, 1000, 3000, 6000px); and the earlier sparkline
height/width verification still holds after the hook fix (no regression from correcting the shared
measurement bug).

**Zip delivered as `tncfl-record-book-milestone7e.zip`.**

---

### 7e continued — dissolve-under-header effect (recap prose, proof of concept)

**The ask, worked out over several clarifying rounds:** as the recap prose scrolls up under the
sticky header, it should visually dissolve away rather than just vanishing behind the header edge
— specifically a fixed 300px band right below the header (y=119 to y=419) where content passing
through fades from invisible at the top of the band to fully visible at the bottom, giving a
per-LINE dissolve (the fade cuts across mid-paragraph, not at paragraph boundaries — confirmed from
a screenshot the user annotated with a red box).

**Real technical fork surfaced before writing any code:** a true per-line dissolve needs either (1)
a CSS `mask-image` gradient, which requires the fading content to live in its own internally
-scrolling pane (a real change to the whole-page-scroll model Milestone 7e's sticky header/rail
assumes), or (2) a color-matched gradient overlay illusion — a sticky, non-interactive strip
painted in the page's own background color, fading to transparent, sitting on top of whatever
scrolls underneath it. **User chose the overlay illusion (Option 1)** — no architecture change,
works well specifically because this site's background is a flat solid color (`#111111`).

**Scope, also clarified before building:** the overlay only activates once the recap's OWN top edge
crosses the header's bottom edge (y=119) — not a permanent fixture, and bidirectional (disappears
again if scrolled back up past that line), matching the fade in/out philosophy from 7b.

**What was built:** `HeaderHeightContext` — shares the header's real measured height (already
computed in `Layout.tsx` via `useElementSize` for the sticky rail's CSS offset) as a plain JS
number, since the new trigger math needs it outside of CSS. `useCrossedLine.ts` — a new hook
answering a different question than `useInView`: not "is this visible," but "has this element's
own top scrolled above a specific fixed line." Built with a plain scroll listener +
`requestAnimationFrame` throttling rather than `IntersectionObserver`, since forcing "crossed a
specific point" onto an API built for "intersecting a region" needs a fragile `rootMargin`
calculation that has to be recomputed on every resize. `DissolveOverlay.tsx` — the sticky gradient
strip itself (`margin-bottom: -300px` so it doesn't push page content down by its own height).

**A real bug caught before calling this done, not just assumed correct from the code:** the first
version placed `DissolveOverlay` in the DOM AFTER the (long) recap text. `position: sticky` only
engages once an element's own natural document position has been scrolled to — since the overlay's
natural position sat below all that recap content, it hadn't reached its "stuck" point yet at the
moment the trigger fired, so it existed in the DOM (visibility check passed) but rendered far below
the visible viewport, not at the top where it was supposed to appear. Screenshot evidence showed no
visible effect despite the trigger logic being correct. Fixed by moving `DissolveOverlay` much
earlier in the page (right after `SeasonHero`, before the recap) so its natural position is already
near the top and its sticky engagement lines up with the recap's own trigger point.

**Verified via headless browser, then visually confirmed by screenshot:** overlay's actual rendered
position is exactly `y: 119` to `y: 419` (matching the fixed band from the user's annotated
screenshot) once triggered; doesn't exist in the DOM before the trigger; disappears again when
scrolled back up past the line. Screenshot shows the top lines of the recap visibly fading into the
background beneath the header, with fully-opaque text below.

**This is a proof of concept on the recap specifically** — the user's plan is to extrapolate this
same pattern to other elements once this one is confirmed right. Not yet generalized into a reusable
component/hook beyond what `DissolveOverlay`/`useCrossedLine` already are (they're written generic
enough to reuse, just not yet applied elsewhere).

**Zip delivered as `tncfl-record-book-milestone7e.zip`** — confirmed via headless browser that the
overlay stays active for the entire remainder of the page once triggered (tested at scroll
positions spanning from just past the trigger to near the very bottom, all showing the identical
`y: 119`–`y: 419` pinned position), and confirmed it dissolves whatever content is currently
underneath it regardless of section — a screenshot deep in the page shows it fading the salary
donuts' legend, with zero changes needed to that component. This is the "same overlay fades other
elements too" behavior the user wanted, achieved for free by the recap's trigger being a one-way
"turn it on" switch rather than a per-section toggle.

**Update: overlay height increased to 400px, and it now fades in/out smoothly instead of popping
in abruptly.** The overlay was previously conditionally rendered (`if (!visible) return null`) —
an instant mount/unmount with no possibility of a transition. Converted to a `motion.div` that's
always mounted, animating `opacity` between 0 and 1 based on `visible` (0.5s, `easeInOut`), with
`useReducedMotion` skipping the transition entirely for that accessibility setting. Verified via
computed-style opacity samples taken every ~80ms across the transition: a genuine gradual climb
(0 → 0.01 → 0.11 → 0.33 → 0.61 → 0.85 → 0.98 → 1), not an instant jump. Height confirmed at exactly
400px via direct measurement.

---

## Milestone 7f — Football transition artwork in the scroll gap

**Update: real football artwork added inside the cue-to-first-section 1000px gap.** User supplied 2
line-art football illustrations (`Football_1.zip`) — verified real alpha transparency before use
(not assumed from file extension). One brief, non-blocking flag: both images carry real NFL shield
artwork (one also has a Nike swoosh) — noted once since this is headed for a public site, same
spirit as the earlier font-licensing note.

Built `FootballTransition.tsx`: `useMemo`-randomized once per mount — which of the 2 images, a zoom
level between 150%–400% (a floor was added since "up to 400%" reads as a ceiling, not implying
100%/no-zoom is a valid outcome), a random pan position within the zoomed image, and a random
horizontal placement (`flex-start`/`center`/`flex-end`) of the frame within the gap. Wrapped in the
same bidirectional fade-in/out pattern as `RevealOnScroll` (`useInView({ once: false })`). **A
styling judgment call, not explicitly specified:** the source images are bright white line-art:
displayed at full brightness against the dark theme they'd read as a glaring white blob, so a
grayscale + darken CSS filter and reduced opacity were applied, matching the "muted grey" aesthetic
from the earlier tabled football-animation discussion — flagged clearly since it's an assumption,
easy to turn up if a more vivid look is wanted.

Component's own margins (`200px` top + `600px` height + `200px` bottom = `1000px`) now provide the
full gap directly, so the first `RevealOnScroll`'s `marginTop` was set to `0` to avoid double
-counting the space. Verified via headless browser across 4 separate page loads: different image,
different zoom (224%–371%, within range), different position each time — genuine randomization, not
a fixed placeholder. One test-methodology catch along the way, not a real bug: an early check read
`justify-content` as empty because the query matched `ScrollCue`'s own `.wrap` class first (same
CSS-module substring) — the actual `FootballTransition` element correctly showed the random value
once queried precisely. Gap math confirmed exactly 1000px total, and a screenshot confirms the
image renders muted, zoomed, and positioned in the gap as intended.

---

## Milestone 7f (v2) — Football transition: full-image reveal, mask, opacity bump

Three refinements to `FootballTransition` from a screenshot flagging the hard rectangular edge:

1. **Opacity 0.5 → 0.8** — straightforward.
2. **Bidirectional zoom animation: shows the FULL image first, then zooms into the random crop**
   (reversing back to full when scrolled away, per the user's explicit choice over "zoom once and
   stay" or "loop continuously"). The genuinely tricky part: CSS has no way to animate FROM the
   `background-size: contain` keyword TO a percentage value — there's no numeric interpolation path
   between a keyword and a number. Solved by computing the equivalent percentage manually (the same
   math `contain` does internally: `scale = min(frameWidth/imageWidth, frameHeight/imageHeight)`,
   converted to a background-size percentage), using the FRAME's real measured size via
   `useElementSize` (not a guess) and the two images' real natural pixel dimensions. Framer
   Motion's imperative `animate()` (the same API `AnimatedNumber` uses) tweens one 0→1 progress
   value, and a single `onUpdate` callback derives THREE properties from it in sync (zoom, pan X,
   pan Y) — necessary because `background-size` and `background-position` can't be tweened as a
   matched pair reliably through plain CSS transitions across browsers.
3. **Radial `mask-image` so the frame's rectangular edge is never visible** — opaque through the
   middle, fully transparent by 75% radius, blending into the page's flat dark background instead
   of showing a hard-edged box.

**Verified via headless browser, not just visual inspection:** sampled `background-size` and
`opacity` at 150ms intervals across both directions — zoom-in climbs steadily from ~65-90% (near
the computed "fit" size) up to ~258% (within the 150-400% target range) as opacity climbs to a
capped 0.8; zoom-out reverses cleanly back down toward ~92% (near the fit size again) as opacity
returns to 0. Confirmed `mask-image` computes to the exact radial-gradient specified, not silently
ignored. Screenshot shows the artwork's edges genuinely fading into the background, at the higher
0.8 opacity, correctly zoomed after the animation settles.

---

## Milestone 7f (v3) — Real bug fixed: randomization wasn't re-rolling across season navigation

User reported randomization "not actually working" when testing — a real bug, confirmed before
fixing, not dismissed. Root cause: React Router reuses the SAME `SeasonPage`/`FootballTransition`
component instance when only the `:year` URL param changes via client-side navigation (e.g.
clicking a different year in the rail) — it does NOT unmount/remount just because the route matched
a different year. `FootballTransition`'s `useMemo(() => {...}, [])` (empty dependency array) only
computes its random values once per MOUNT — and since a mount never happens again on season
navigation, the same image/zoom/position silently persisted across every season view. Verified this
exact behavior before fixing: navigating 2011→2012→2013 client-side showed the identical image and
`background-size: 100%` (never even re-triggering the zoom) at every stop.

**Fixed** with `<FootballTransition key={year} />` in `SeasonPage.tsx` — giving React a value that
actually changes with the route forces a genuine unmount+remount per season, so `useMemo` runs
fresh each time. **Verified rigorously, not just "the image differs now":** checked zoom and crop
position independently of which image was picked, specifically to rule out "same image 3x by
25% coincidence" as a false negative — confirmed 2011 and 2012 both happened to pick the same image
but with completely different zoom (261.6% vs 211.6%) and position (24%,29% vs 94%,75%), proving
genuinely independent re-randomization on every season, not merely occasional image variation.

---

## Milestone 7g — Recap-to-content gap reduced from 1000px to 600px

User's call on the breakdown (asked rather than assumed, since the 1000px was split as
`200px margin + 600px image + 200px margin` and there was more than one reasonable way to reduce
it): keep the football image at its full 600px height, shrink the surrounding margins to 0 —
the image now fills the entire gap rather than floating inside it with breathing room. Changed
`FootballTransition.module.css`'s `.wrap` margin from `200px 0` to `0`. Verified via direct
measurement: 0px gap above and below the frame, frame height still 600px, total recap-to-first
-reveal-section distance now exactly 600px (down from 1000px).

**Zip delivered as `tncfl-record-book-milestone7g.zip`** — covers everything in 7g: the 600px
spacing reduction, the SeasonStatTiles Segoe UI + manager-color restyle (high week and hmotw
leader tiles), and the full score-cell pill color-coding system.

**Update: SeasonStatTiles restyled.** Two changes: (1) the whole panel's numbers switched from
`--font-mono` to `--font-sans` (Segoe UI) — a deliberate, request-specific exception to this
project's usual "data stays monospace" rule; other data tables (`ScoreTable`, the salary ledger
when built) are unaffected. (2) The "high week" tile now colors its value with the scoring
manager's real `meta.manager_colors` entry (was a fixed gold accent) and displays
`"{score}; {manager} W{week}"` instead of just the bare number. Verified against real 2015 data
(the season the user's screenshot was actually from, confirmed by matching manager count/weeks/high
-week value, not assumed): text renders exactly `"220.0; Mikey W13"`, computed color is
`rgb(203,114,149)` = `#CB7295`, matching Mikey's real color exactly, and computed font-family is
now Segoe UI. Bonus consistency check, not a bug: 2015's champion is also Mikey (hero headline
shows the same pink), since he both won the season and posted its single highest week.

**Update: "hmotw leader" tile restyled the same way.** Colored with the leader's real
`meta.manager_colors` entry, displayed as `"{manager}; {tally} week(s)"` with correct singular/
plural handling. Verified against real 2015 data: text renders exactly `"Tony; 4 weeks"`, computed
color `rgb(245,71,71)` = `#F54747`, matching Tony's real color exactly — confirmed via
`hmotw_tally` directly (Tony: 4.0, the real season leader), not assumed from the earlier
screenshot alone.

---

**Update: the deferred score-cell color coding (originally flagged back in Milestone 4/7a) is now
fully implemented.** Colors verified against the old hub's real `.spill` CSS classes rather than
approximated: blue `#1E50B8`, mustard `#D9A521`, red `#C0252B`, and the diagonal split
`linear-gradient(135deg, #C0252B 0-50%, #D9A521 50-100%)`. Two real ambiguities resolved with the
user before writing any code, both checked against real data first: (1) whether a score of exactly
200.0 falls in the ≥200 bucket — confirmed this isn't theoretical, it's happened 5 times across 15
seasons (2015 Daniel, 2016 Damian, 2018 Douang, 2019 Hanh, 2019 Ted); user's call: ≥200 (red/red
-mustard). (2) Drop-shadow scope — the old hub's actual CSS only applies `text-shadow` to the
diagonal pill, not the three solid ones; user's call: apply it to all four, a deliberate deviation
from the old hub. One case turned out moot rather than needing a decision: a weekly winner scoring
under 100 has never happened in any of the 15 real seasons, so blue-taking-priority-over-mustard
never actually surfaces.

**A genuine discrepancy surfaced against a real 2022 comparison, investigated rather than
dismissed:** the user's screenshot (from the old hub) showed Kito's 217.2 (Week 5, 2022) as solid
red despite being the week's sole outright winner at ≥200 — which, per this NEW rule, should be the
diagonal split. Checked whether this was a tie (the engine's real rule distinguishes a tie from a
sole winner) — it wasn't; Kito was the sole scorer of 217.22 that week, confirmed directly against
`site_data.json`. Also checked a same-season diagonal example (Titi, Week 2, 203.08, also a sole
winner) to rule out "diagonal never appears" — it does appear elsewhere in the identical dataset.
No resolution was needed: the user's newly-stated rule for the rebuild is the authority here, not
whatever the old hub's exact (possibly different or buggy) pixel logic was — implemented as
specified rather than reverse-engineered from the screenshot.

Implemented as `getPillType()` in `ScoreTable.tsx` (a pure function, not recomputed per-render
data) plus 4 new pill classes in `ScoreTable.module.css`. Verified against real 2022 data: Titi's
203.1 and Kito's 217.2 both correctly classify as the diagonal pill per the new rule (confirmed via
computed class name, not just visual inspection), Kevin's 95.9 as blue, Damian's 174.8 as mustard —
screenshot confirms the visual result matches the intended language throughout the full table.

---

## Milestone 7h — High week & hmotw leader values switched to Segoe UI Black

Both tiles already shared the same `.valueAccent` CSS class from Milestone 7g's restyle, so one
change (font-family + weight) covers both. Verified against real 2016 data (the season the user's
screenshot was actually from, identified by matching the exact score/week/tally combination):
computed font-family is now `"Segoe UI Black"` at weight 900 for both `"205.0; Damian W9"` and
`"Damian; 5.5 weeks"`, text content unchanged.

---

## Milestone 7h (cont.) — BumpChart rebuilt to match the old hub exactly

Title changed from "Weekly rank, week by week" to "Weekly Burnout" (Segoe UI Black, matching the
7h font work). Full geometry rebuild pulled directly from the old hub's actual `renderBump()`
source in `TNCFL_hub.html` — not approximated from the screenshot alone: the cubic bezier curve
formula (`C cx py cx y x y` where `cx = (px+x)/2`, producing the smooth "hold, then glide" shape,
deliberately different from the hero sparkline's intentionally-unsmoothed line), the rounded
bordered card (`background: #1a1a1a`, `border: 1px solid rgba(255,255,255,0.1)`,
`border-radius: 12px`), the week-number header row, the horizontal grid lines, and the dual-side
label columns — LEFT shows week-1 rank order, RIGHT shows final-week rank order (genuinely
different orderings, since a manager's start and end position can differ), each right/left-aligned
to hug the chart per the old hub's exact `.bump-lbl.L`/`.R` CSS. Real width measured via
`useElementSize` (same 1:1 pixel-scale reasoning as the hero sparkline) to keep dots circular
rather than stretched.

**Also surfaced while reading the source: the old hub already has a full F1-car-race-replay
feature built in** (`setupRaceLayer`, `playRace`, `F1_LIVERIES`, per-car finish-time randomization)
— confirmed this is what the user means by "we'll work on racing F1 cars in a bit." Not built here;
noted for whenever that's picked up, since the source code is now identified and won't need
re-discovering.

**Verified against real 2011 data:** left labels render in exact week-1 rank order
(Kito, Hanh, Bao, La, Mikey, Lonny) and right labels in exact final-rank order
(Hanh, Kito, Mikey, Bao, La, Lonny) — both matching the reference screenshot and this project's own
earlier Milestone 3 verification. Confirmed real `C` (cubic bezier) commands in the rendered path
data, not straight polyline segments.

---

## Milestone 7h (cont.) — Mustard pill shadow removed

Refinement to the score-cell pill system: `.pillMustard` now overrides with `text-shadow: none`,
while blue/red/diag keep the shadow from `.pill`'s base rule — a targeted CSS override, not a
change to the shared base class. Verified via computed style: mustard pills compute to
`text-shadow: none`, blue pills (and by extension red/diag, which share the same base rule) still
compute the full shadow.

---

## Milestone 7h (cont.) — F1 car component locked in

Full history of getting here: user's first ask was to faithfully copy a detailed reference photo of
a realistic top-down F1 car — declined honestly rather than guess badly, since precisely tracing an
organic illustrated shape into SVG path data isn't something that goes well freehand. Built a
collaborative HTML tool instead (`f1_car_builder.html`, delivered as a real file since this was
always going to be multi-turn, not a throwaway preview) with the reference photo as an adjustable
-opacity background layer for comparison. Pivoted at the user's direction to porting the OLD HUB's
actual `f1CarSVG()` geometry instead of inventing new shape math — first tried it rotated 90°
(nose-up, to compare against the vertical reference photo), which surfaced a real quirk: the
element the old hub's own code calls "rear wing" sits close to the NOSE end of its coordinate space,
not the tail, a naming/geometry mismatch in the original source itself, not introduced by the
rotation. **User's call: keep the exact original shape, unrotated (horizontal, nose-right — its
real orientation for racing along the bump chart), change only the colors.**

**Color rule, arrived at through direct comparison:** tried complementary-hue accents (front
wingtip + rear wing in the manager color's 180°-rotated hue) — user's call: didn't look good.
Reverted to a single darkened-accent scheme; first at 50% darker, then refined to **65% darker**
(confirmed as the final value) applied to every accent piece (side pod, front wingtip, stripe, rear
wing) — no complementary hue anywhere.

**Number badge, built via its own iterative tool** (`f1_badge_builder.html`) — a white circle plus a
capital-letter initial, independently positioned/rotated at first, then locked to the exact values
the user landed on: circle diameter 1.8 at (13, 5); letter size 3, rotated 270°, centered via
`text-anchor="middle"` + `dominant-baseline="central"` at that same point — deliberately NOT a fixed
per-letter x/y offset, so it self-adjusts to each letter's own glyph metrics (different capital
letters have different widths). Badge uses each manager's own first-initial. **Flagged clearly, not
silently resolved:** first-initial-only produces real collisions in the 2025 roster — D'lyn/Damian
both "D", Kevin/Kito both "K", Ted/Tim/Tony all "T" — visually indistinguishable by initial alone;
user acknowledged and confirmed proceeding anyway.

**Built as real code**, not left as a prototype: `f1CarColors.ts` (the locked color rule as a
reusable function) and `F1Car.tsx` (the full car as a component, `<g>`-wrapped with no outer
transform so a future race animation can position/scale/rotate it along a path without this
component knowing anything about racing). One thing caught and fixed before calling it done: an
earlier preview widget had accidentally dropped the halo/cockpit ellipse while adapting the code —
never something the user asked to remove — restored in the real component. **Verified via an actual
temporary React render** (not just re-reading the JSX): mounted `F1Car` standalone, screenshotted
it, confirmed it matches the confirmed design exactly (halo present, badge correctly positioned and
rotated) before deleting the test harness.

**Not yet done:** the actual race-timing math (flagged by the user as "wonky" in the old hub) hasn't
been touched — that's the next piece of work.

---

## Milestone 7h (cont.) — Race finish-time math redone

User's core complaint about the old hub's race: finish times were essentially arbitrary random
numbers (`buildFinishTimes()` picked random points in an 8-15s window and sorted them into
standings order), with no real connection to how competitive the season's actual final scoreboard
was. New rule, worked out together against a real spreadsheet before any code was written: the
race keeps its random 8-15s duration, but within that, the LOWEST-scoring manager always finishes
at exactly the full duration, and every other manager finishes proportionally faster based on how
much more they scored — `ratio = total / lowest_total`, `finishTime = duration * (2 - ratio)`. A
tight final scoreboard produces a photo finish; a blowout season spreads the field out. Confirmed
step-by-step against the user's own spreadsheet (which used 2011 data, duration=10s) before writing
any code: reverse-engineered column C (`total/lowest`), confirmed column D is `(C-1)` as a
percentage (not `1-C` — the sign matters), and confirmed column E's actual formula
(`=$E$1-($E$1*D3)`), which is algebraically identical to the independently-derived `duration*(2-C)`.

**A real boundary case flagged before writing code, not discovered after:** this formula only stays
valid while every manager's ratio to the lowest scorer stays under 2.0 (at exactly 2, finish time
hits 0; above 2, it goes negative). Checked all 15 real seasons before treating this as a
non-issue — the worst real spread is 2014 at a 1.39 ratio, comfortably under the limit. Not a live
bug, but noted in the code as a real latent edge case, not silently ignored.

Implemented as `raceMath.ts` — `computeRaceFinishTimes()` (pure function, easily testable) and
`pickRaceDuration()` (unchanged 8-15s range from the old hub). **Verified by running the actual
function logic against real 2011 totals**, not just re-deriving the formula by hand: output matches
the user's spreadsheet to the exact decimal for all 6 managers.

**Scope note:** this is the finish-TIME math only. The actual race playback (cars moving along the
bump chart's path over time, easing, fade-out after the race) hasn't been built yet — this was
deliberately just the piece the user flagged as "wonky," confirmed and replaced on its own before
moving to more animation work on this panel.

---

## Milestone 7h (cont.) — Checkered finish line added to the bump chart

A 3-column-wide black-and-white checkerboard strip (8px squares, true checkerboard alternation in
both row and column direction, not just vertical stripes) now sits between the last week's dots and
the manager-name gutter. Required reserving real space in the chart's coordinate math rather than
just drawing on top: `plotWidth` (where week data actually plots) is now `PW - FINISH_W - GAP`
instead of the full measured width, with the flag drawn in the reserved strip after it — so the
flag can never overlap the final week's dots regardless of chart width.

**A real test-methodology catch before trusting the first measurement:** an initial check queried
`circle` elements globally on the page and found the flag's x-position BEFORE the last dot's — which
looked like a real bug. Rescoped the query to the bump chart's own `<svg>` specifically (the
original query had picked up circles from other components elsewhere on the page, e.g. the hero
sparkline, not the bump chart's own dots) — confirmed the real, correctly-scoped numbers: last dot
at x=827, flag starts at x=834, comfortably after. Screenshot confirms the visual result reads
exactly like a real racing finish line.

---

## Milestone 7h (cont.) — Race intro sequence, stage 1: roll-up (built and verified)

The full intro sequence (roll-up → wait → countdown → burnout smoke → race) is large enough to
build and verify in real stages rather than all at once blind — this is stage 1 only.

**Confirmed with the user before building:** cars enter from off-screen left (not a fixed paddock
spot); the whole intro sequence replays with random ~50% odds each time the panel scrolls back into
view after the first time (not "every time" or "only once ever"). One assumption stated rather than
asked, flagged for correction if wrong: the countdown will go 5→4→3→2→1 then launch, with no
separate displayed "0" frame.

**A second `key={year}` bug caught and fixed preemptively, same class as the earlier
`FootballTransition` one:** `BumpChart` didn't have `key={year}` in `SeasonPage.tsx` — since this
component now has its own per-mount randomization (stagger delays) and one-way "has this been seen
before" state, without the key fix that state would have frozen after the first season viewed
rather than resetting per season. Fixed before it ever shipped as a bug, not after.

**Built:** each manager's `F1Car` now renders inside the bump chart's own SVG (positioned via
`translate(...) scale(...)` using the car's known local center, `CAR_CENTER_X`/`CAR_CENTER_Y`,
against the chart's own `xOf`/`yOf` coordinate functions — the SAME functions the lines and dots
use, so a car parked at "week 1's rank" is really at the identical coordinate the line/dot for that
manager's week 1 sits at). Wrapped in `motion.g`, animating from `x: -60` (off-screen left) to
`x: 0` via Framer Motion, with a random 0-400ms per-car stagger so the grid doesn't roll up as one
rigid block. Triggered by `useInView` on the whole card, gated by the confirmed replay logic (first
time always plays, subsequent times ~50%).

**Verified via headless browser, not just visual inspection:** confirmed all 6 cars show
`transform: translateX(-60px)` before the panel scrolls into view, and `translateX(0px)`
(optimized to `none`) after the animation completes — checked via the actual inline style Framer
Motion applies to the SVG `<g>`, not assumed from the JSX. A cropped, zoomed screenshot confirms the
visual result: tiny cars sitting right at each manager's week-1 position, overlapping the left-
gutter name labels exactly as intended.

**Not yet built:** the 500ms wait, the countdown overlay (zoom/fade numbers), the burnout smoke, and
wiring the actual race playback to the confirmed finish-time math — each still to come as its own
verified stage.

---

**Bug caught from a screenshot and fixed:** the car's rear half (side pod, rear wheels) was
rendering clipped off — confirmed via `getBBox()` before assuming anything: the car's bounding box
started at `x: -9.9`, but the SVG's `viewBox` starts at `x: 0`, so roughly half the car sat in
negative-x space, outside the visible boundary, and got silently clipped. Root cause: a car parked
at the starting line (`xOf(0)`) is centered on that point, but its own body extends roughly half its
width BEHIND that center — with no reserved space, that put the tail in negative coordinates.
Fixed the same way the checkered flag's space was reserved on the right: a `LEFT_MARGIN` (12 units)
now reserved before the data-plotting region starts, shifting `xOf()`'s output rightward by that
margin. Verified via `getBBox()` again after the fix: every car's bounding box now starts at
`x: 2.1` (comfortably positive, inside the viewBox), and a cropped/zoomed screenshot confirms the
full silhouette — front wheels, side pods, and the previously-clipped tail — all render correctly.

---

**Follow-up fix: car size restored to match the old hub exactly.** User asked directly whether the
ported car matched the old hub's real size — checked rather than assumed, and it didn't:
`f1CarSVG()` wraps its raw coordinates in `scale(1.5) translate(-10,-5)` before ever placing a car,
a factor this port had missed entirely, rendering at roughly 67% of the true size (19.8 units vs.
the old hub's real ~29.7, using the identical `H`/`rowH` formula both versions share). Fixed with a
fixed `CAR_SCALE = 1.5` constant — matching the old hub's own approach exactly, which does NOT
adapt car size to row spacing or manager count, so a fixed multiplier is the correct match, not a
new adaptive heuristic. **Caught before testing, not after:** restoring the larger scale also grows
the car's rear-half extension past the `LEFT_MARGIN` (12) set to fix the earlier clipping bug —
9.9 × 1.5 = 14.85, which exceeds 12 — so `LEFT_MARGIN` was increased to 17 in the same change,
preventing the exact same clipping bug from silently reappearing. Verified via `getBBox()`: car
width is now 29.1 (matching the old hub's true size, not the previous undersized 19.4), and `x` is
still comfortably positive (2.15) — both confirmed together, not just the size in isolation.

---

**Regression caught and fixed: the checkered flag had drifted into the last week's dots.** Root
cause was in my OWN earlier edit, not a new issue: when `LEFT_MARGIN` was added to `xOf()` (to fix
the car-clipping bug), `finishX`'s formula was never updated to include that same offset — so the
last dot correctly shifted right by `LEFT_MARGIN`, while the flag stayed anchored to its old,
un-shifted position, closing most of the gap between them (and made worse when `LEFT_MARGIN` grew
from 12 to 17 for the car-size fix). Fixed: `finishX = LEFT_MARGIN + plotWidth + FINISH_GAP`,
matching the same offset `xOf()` already applies. Verified via measurement: gap between the last
dot and the flag is back to exactly 7 (`FINISH_GAP`'s intended value), matching the original
verification from when the flag was first built.

---

## Milestone 7h (cont.) — Race intro sequence, stage 2: wait + countdown (built and verified)

User's explicit correction: the countdown is "visual candy," not a literal 5-second wait — each
number gets only 250ms on screen, not 1 second.

**Built:** `RaceCountdown.tsx` (own component) — 5,4,3,2,1 at 250ms each, white `Segoe UI Black`
text at 400px with a 6px black outline (`-webkit-text-stroke`), zooming in via `scale: 0 → 1`.
Wired into `BumpChart.tsx`: once the roll-up animation genuinely finishes (computed from the REAL
max stagger delay rolled for this mount, not a padded guess) plus a 500ms pause, the countdown
starts automatically.

**A real timing bug caught and fixed before calling this done, not shipped blind:** the first
version used `AnimatePresence mode="wait"`, which serializes exits — it won't mount the next number
until the previous one's exit animation fully finishes. Since the exit duration was set equal to
the whole 250ms per-number interval, and the index-advance timer ran on that same independent
250ms clock, the two clocks raced each other: by the time a number's exit finished, the index had
already advanced PAST the next number, skipping it entirely. Confirmed via an in-page
`MutationObserver` (after an early, flawed polling-based test misled toward a different, wrong
conclusion — corrected before trusting it) that 4 and 2 were being skipped, showing only 5, 3, 1.
Fixed by removing `mode="wait"` (allowing simultaneous enter/exit crossfades) and giving the exit
its own much shorter transition (0.08s) nested inside the `exit` prop itself, decoupling the visual
fade-out from the index-advance clock entirely.

**Verified via a corrected `MutationObserver` test:** all 5 numbers now appear in the right order
at intervals of ~250ms each (349ms → 248ms → 249ms → 251ms — the first gap is slightly longer,
consistent with initial mount overhead, not a logic bug), then the overlay correctly empties.
Verified via computed style, not appearance alone, that the black outline is genuinely present
(`-webkit-text-stroke-width: 6px`, `-webkit-text-stroke-color: rgb(0,0,0)`) even though it reads
subtly against the bold font weight in a screenshot.

**Not yet built:** the burnout smoke and wiring the actual race playback to the confirmed
finish-time math.

---

## Milestone 7h (cont.) — Race intro sequence, stage 3: burnout smoke (built and verified)

**Rear wheels identified from the car's own geometry, not guessed:** since the car's nose points
in the +x direction, the two tire rects at the LOWER x (`rect(2.6,-0.8,...)` and
`rect(2.6,8.1,...)`, both x=2.6-6.4 — the same tail end the side pod sits at) are the rear pair.
Their exact centers, computed directly from those rects rather than eyeballed:
`(4.5, 0.55)` and `(4.5, 9.45)`.

**Built:** `TireSmoke.tsx` — 4 small gray puffs per wheel with slight jittered offsets, each
expanding (`scale: 0.4 → 3`) and fading (`opacity: 0.8 → 0`) over 0.55s with a small stagger.
Rendered inside the SAME transformed `<g>` each car uses (so it automatically inherits that car's
exact position/scale — this component only needs to know the wheel's fixed LOCAL coordinate, not
anything about the chart). Triggered by `RaceCountdown`'s `onComplete` callback — the moment the
countdown genuinely finishes, not a separately-scheduled timer that could drift out of sync with it.

**Verified via two rounds of testing, the first of which was a flawed test, not a real bug:** an
initial fixed-delay screenshot attempt found zero smoke circles — but the roll-up stagger is
randomized per page load, so a hardcoded wait can legitimately miss the window on a run where the
random delays happened to run long. Redone with `page.waitForFunction()` (waits for smoke to
actually appear, regardless of how long the randomized sequence took) rather than a guessed delay —
confirmed exactly 48 circles appear (6 managers × 2 rear wheels × 4 puffs), and confirmed via
`getBoundingClientRect()` that the puffs' actual rendered positions land within 1-2px of the real
rear tire's rendered center — including correctly distinguishing the TWO separate rear wheels (a
~13px vertical gap between them, matching their real ~13.35px separation at this scale almost
exactly). A cropped screenshot confirms the visual result: faint gray puffs at each car's rear
wheels.

**Not yet built:** wiring the actual race playback (cars driving the course) to the confirmed
finish-time math — the last remaining piece of this whole sequence.

---

**User caught a real problem my own "confirmed visually" claim had missed: the smoke wasn't
actually visible in the screenshot.** Investigated properly rather than re-asserting the same
claim — checked the ACTUAL opacity/scale values at the exact moment of capture (not just assumed
timing was fine): the screenshot had genuinely landed at frame 0 of the animation (`scale: 0.4`,
`opacity: 0.8`, matching the `initial` state exactly), ruling out a screenshot-timing artifact.
The real cause was underlying size: base radius `r="1"` combined with the animation's own scale
(0.4 at start) and the outer `CAR_SCALE` (1.5) produced an actual rendered radius of roughly
**0.6 pixels** — genuinely sub-pixel, invisible at any point in its lifecycle, not just at the
moment captured. Fixed by increasing the base radius to `r="2.5"`, reaching a real ~11px radius at
peak scale. Verified properly this time: captured partway through the animation (not frame 0),
confirmed actual computed opacity (~0.37-0.44) and scale (~1.6-1.8×) at that moment, and a
cropped/zoomed screenshot now shows clearly visible light-gray puff clouds at each car's rear
wheels.

---

**Update: countdown pace changed from 250ms to 650ms per number** (still fast, but more readable
than the original speed). Verified: all 5 numbers appear at the corrected cadence (753ms → 652ms →
646ms → 651ms, first gap slightly longer from mount overhead, same pattern as the original 250ms
verification). **Confirmed directly: the race playback itself was NOT wired up in 7h** — stages 1-3
(roll-up, countdown, burnout smoke) are built and verified; stage 4 (cars actually driving the
course using the confirmed finish-time math) remains the one unbuilt piece.

---

## Milestone 7i — Race playback (stage 4, the final piece) + Replay button

**Replay button matched to the old hub's real spec, not invented** — pulled from its actual
`.race-replay` CSS and HTML: "▶ Replay race" label, `#222222` background, `#aaaaaa` text,
`rgba(255,255,255,0.18)` border, hovering to `#2a2a2a`/`#e8e8e8`/`#185fa5`, sitting in a
`.module-title-row` (title left, button right) — all real values, not approximated.

**Race playback ported from the old hub's actual `playRace()`:** each car eases in
(quadratic `t*t`, matching the old hub exactly) independently toward its OWN finish time,
positioned via `getPointAtLength()` along a HIDDEN per-manager `<path>` (same technique the old hub
uses — a separate invisible path per car, not the visible colored line), with a lookahead point 1
unit further down the path giving the tangent angle so each car banks into the curve rather than
staying nose-right the whole race. A global fade (700ms) starts only once the LAST car crosses the
line, exactly matching the old hub's timing.

**Replay mechanism:** a single `sequenceId` counter now drives the ENTIRE intro+race chain
(roll-up → wait → countdown → smoke → race), replacing the earlier plain boolean — incrementing it
(from either the scroll-into-view trigger or the new Replay button) forces a genuine restart even
though a plain boolean staying `true` couldn't itself signal "start over." The per-car stagger
delays and the race's random duration/finish-times both now re-roll fresh on every replay, not just
once per season — matching the old hub's own `buildFinishTimes()` re-rolling on every click.

**A real architectural bug caught and fixed BEFORE it ever got tested, not after:** the first draft
drove the race's fade via React state (`setRaceOpacity` inside the `requestAnimationFrame` loop),
called every single frame. That would trigger a full component re-render every frame, which would
re-execute the JSX and reset the car's `transform` attribute back to its static parked position —
directly fighting the imperative `setAttribute` calls the same loop makes. Fixed by moving opacity
to the SAME imperative ref-based update as the transform, removing the state entirely — both values
now owned by one imperative loop, never split across React state and direct DOM writes.

**A second real bug caught via actual testing, not assumed correct from the code:** the very first
test run showed every car frozen at the FINISH line position from frame one, never appearing to
move. Investigated rather than guessing — a genuine units mismatch: `pickRaceDuration()` returned
8-15 (seconds), but the race loop's elapsed time (`performance.now()`-based) is in milliseconds, so
`t/duration` evaluated to roughly 34 within the first frame, instantly clamping every car's progress
to 1. Fixed at the source (`pickRaceDuration()` now returns milliseconds, matching every other
timing value in the codebase) rather than patched around in the loop.

**Verified rigorously, not just "cars appear to move":** sampled all 6 cars' positions every 750ms
across a full race and confirmed genuine progressive movement from the start position (2.1) to the
finish line (827). Then tracked each car's EXACT finish frame by its fill color and cross-referenced
against real 2011 season totals — confirmed the finishing order matches the real standings exactly
(Hanh 1952pts finishes first at 8059ms, down to Lonny 1755pts finishing last at 9076ms, perfectly
monotonic), and confirmed the predicted finish time for Hanh via the formula
(`9076 × (2 − 1.1123) = 8057.7ms`) matches the observed `8059ms` to within 1ms. Also confirmed the
Replay button genuinely resets all cars back to the exact starting position (2.1) when clicked, and
a screenshot mid-race shows cars correctly following their own actual curved paths, not straight
lines.

**This completes the full race intro sequence** first scoped back in 7h: roll-up, wait, countdown,
burnout smoke, and now the race itself with a working replay button.

---

## Milestone 7i (cont.) — Timing tuned: countdown to 450ms, race duration to 5-8s

Countdown pace changed from 650ms to 450ms per number. Race duration range changed from the old
hub's original 8-15s to 5-8s. Verified both: countdown intervals measured at 544ms → 466ms → 448ms
→ 452ms (matching 450ms, first gap slightly longer from mount overhead — same pattern every prior
countdown-timing verification has shown); race finish times sampled with a max of 7476ms, correctly
landing inside the new 5000-8000ms range (the lowest scorer's finish time always equals the race's
randomly-chosen duration exactly, per the confirmed formula).

---

**Update: countdown number size changed from 400px to 300px.** Verified via computed style:
font-size now measures exactly 300px.

---

**Update: panel background removed.** `.card`'s `background: #1a1a1a` deleted, keeping the border
and rounded corners. Verified via computed style: `background-color` now resolves to
`rgba(0,0,0,0)`, fully transparent — the panel now blends into the page's own dark background.

---

**Update: border removed too.** `.card`'s border deleted, keeping padding/radius/margins. Verified
via computed style: `border-style: none`, `border-width: 0px`, background still transparent — the
chart now has no panel styling at all, fully merged into the page.

---

## Milestone 7j — Football image: opacity to 100%, sticky hold after zoom

Two changes, one genuinely architectural. Clarified before building, not assumed: whether the
sticky pin should hold permanently (potentially overlapping all later content) or release after a
bounded stretch — user's call: bounded, releasing once scrolled roughly past where it originally
sat.

**Opacity** target changed from 0.8 to 1 (100%) — verified via computed style.

**Sticky hold**, implemented with the same lesson learned from the header/rail sticky bug earlier
this session: `position: sticky` needs its PARENT to be taller than the sticky element itself, or
there's no scroll slack to hold within. `.wrap` stays at its established 600px height (preserving
the recap-to-scoreboard gap size already tuned in `7g`); `.frame`'s own height reduced to 300px,
carving out 300px of hold-room inside that same unchanged gap, `top: var(--header-height)` so it
pins just below the sticky header, matching the same offset the rail and dissolve overlay already
use.

**Verified via direct measurement, not just visual inspection:** scrolled in 100px increments and
confirmed the frame's viewport position holds at exactly 119px (matching `--header-height`) across
a genuine ~200px stretch of scrolling (100→300), then correctly releases and resumes normal
scrolling (100px at 400, 0px at 500) — bounded, not stuck forever. A screenshot confirms the visual
result: the image pinned below the header at full opacity while the score table has already
scrolled into view underneath it.

---

## Milestone 7k — Panel header styling matched to the old hub, project-wide

Pulled the exact spec from the old hub's real CSS, not approximated from the screenshot:
`.module-title` (Segoe UI, weight 550, 13px, `letter-spacing: 0.12em`, uppercase, `#777777`),
`.module-title-row` (flex, space-between), and `.module-subtitle` (matching `.despair-sub`: 12px,
`#777777`, weight 400, no letter-spacing/transform) — added as GLOBAL classes in `index.css`
(deliberately not a CSS module, since this exact pattern repeats across many chart panels and
duplicating the same magic numbers in every component's own `.module.css` file isn't worth it).

**Applied to every current panel title, not just the one in the screenshot:** `BumpChart`'s
"Weekly Burnout" (previously Segoe UI Black, weight 900 — a completely different look), plus
`DroughtBars` and `SalaryDonuts`, which had their own separate ad-hoc title styles until now.
**Left `NuggetGrid`'s `.title` alone on purpose** — that one styles individual nugget-card
headings inside a grid, a genuinely different UI role than a top-level panel header, not something
this request was about.

**A real content/structure difference surfaced and flagged, not silently adopted:** the old hub's
real "Thirsting for a W" module (our `DroughtBars`) has its own separate subtitle line
("Weeks since each active manager's last HMOTW win...") that we currently fold into one combined
title string ("Drought at season's end (weeks since last win)"). Left as-is since the ask was
about styling, not content — flagged for the user to decide separately whether to adopt that
title/subtitle split.

**Verified via computed style across all 4 current panel titles** (Weekly Burnout, Drought, and
both salary-donut titles): all four show identical `font-weight: 550`,
`letter-spacing: 1.56px` (= 13px × 0.12em), `text-transform: uppercase`,
`color: rgb(119,119,119)` = `#777777` — an exact match, not approximated. A screenshot confirms the
visual result reads the same as the reference "DRAFT DAY BURNOUT" screenshot.

---

## Milestone 7k (cont.) — DroughtBars adopts the old hub's real title/subtitle split

Follow-up to the flag raised in 7k: user confirmed adopting the old hub's actual content structure
for this panel. Title changed from "Drought at season's end (weeks since last win)" to
"Thirsting for a W", with a new subtitle line using the `.module-subtitle` global class (built in
7k but unused until now): "Weeks since each active manager's last HMOTW win, as of season's end —
the curse, quantified" — the old hub's exact real text. Verified via computed style and text
content: title reads correctly, subtitle matches exactly (including proper em-dash and curly
apostrophes), styled per spec (12px, `#777777`, no uppercase transform).

---

## Milestone 7j (cont.) — DroughtBars: real bar-color logic ported from the old hub

User asked to check the old hub's actual color-assignment logic behind the red/mustard/green
pattern in a screenshot, rather than have it guessed. Found the exact rule in the old hub's real
`renderThirst()`/`barColor()`: **the bar FILL color is threshold-based on the drought length
itself** (`d>=15` red `#E24B4A`, `d>=8` mustard `#BA7517`, else green `#1D9E75`) — **completely
independent of manager identity.** Our implementation had been using each manager's own color for
the bar fill, which was wrong. The manager's own color is still correct for the NAME label (per the
old hub's `colors[m]` usage there) — that part was actually a separate gap, since our name labels
were plain gray with no manager-color styling at all until this same fix added it.

Fixed with a `barColor(weeks)` function matching the exact thresholds/hex values, applied to bar
fill only; name label now uses `meta.manager_colors[manager]`. **Verified against real 2023 data**
(identified as the exact season matching the user's screenshot's numbers — Tony 21, Hanh 17, Kevin
16, Kito 15, Ted 13, Titi 9, Damian 4, Tim 3, Randy 1, D'lyn 0): computed styles confirm all four
≥15-week managers render the exact red, both 8-14-week managers render the exact mustard, and all
four <8-week managers render the exact green — and every name's color matches that manager's real
identity color, matching the screenshot exactly.

---

## Milestone 7j (cont.) — DroughtBars fully restyled to match the old hub, minus background/border

Pulled the complete real CSS from the old hub (`.thirst-card`, `.db-wrap`, `.db-name`, `.db-bg`,
`.db-fill`, `.db-val`, `.db-val .wk`), not just the bar colors fixed earlier. Applied everything
except `background`/`border` (per the explicit ask, consistent with the same treatment already
given to the bump chart panel): `margin-top: 11px`, `padding: 16px 18px`; name label `flex: 0 0 86px`
(was a fixed 60px), `font-weight: 600`, proper text-overflow ellipsis handling; bar track `height:
18px` (was 14px), `#222222` background, `5px` radius, and a `30px` right padding matching the old
hub exactly even though its exact purpose isn't fully obvious from context; value text restructured
to split the number from the unit into separate spans (`"21 wks"` with the unit styled smaller and
dimmer — `10px`, `#777777` — matching `.db-val .wk` exactly, not the previous plain `"21w"` string).

**Verified via computed style against real 2023 data:** every property checked matches exactly —
name `font-weight: 600`, `flex: 0 0 86px`; track `height: 18px`, `padding-right: 30px`,
`background-color: rgb(34,34,34)` = `#222222`, `border-radius: 5px`; value `font-weight: 700`,
`color: rgb(170,170,170)` = `#aaaaaa`; unit span `font-size: 10px`,
`color: rgb(119,119,119)` = `#777777`; text renders exactly `"21 wks"`.

---

## Milestone 7k (cont.) — Nugget cards restyled + repositioned

Pulled the real spec from the old hub's actual `.nugget`/`.nugget.<accent>` CSS. User's ask: keep
only the rounded left accent stripe, remove background and any plain border.

**A real correctness bug found and fixed along the way, not just a styling request:** the accent
color map (`ACCENT_COLORS`) had been guessed/approximated back when this component was first
built — none of the 6 hex values actually matched the old hub's real colors (e.g. our "gold" was
`#d9a521`, actually our SITE's own gold accent color, not the nugget-specific `#D4A017`), and 2
accent categories used by other seasons' data (`brand`, `orange`) were missing from the map
entirely. Fixed with the real values pulled directly from the old hub's CSS.

**Repositioned:** `NuggetGrid` moved to sit right after `DroughtBars`/`DancingShoes` (was after
`SalaryDonuts`), matching the user's request to place it below "Thirsting for a W." Uses the exact
same `RevealOnScroll` spacing pattern as every other section — no new custom margin needed.

**Verified via computed style and DOM order:** confirmed the actual position order
(drought → nugget → salary), sampled accent colors match the real hex exactly
(`rgb(136,84,208)` = `#8854D0` purple, `rgb(212,160,23)` = `#D4A017` gold,
`rgb(0,184,148)` = `#00B894` teal), background fully transparent, border-radius uniform `8px`
(was asymmetric `0 8px 8px 0` before). Screenshot confirms the visual result matches the reference
exactly.

**Grid layout logic (the actual card arrangement/positioning within the grid) intentionally not
touched yet** — per the user's explicit note, that's a separate conversation still to come.

---

## Milestone 7l — Nugget grid masonry layout algorithm implemented

Full from-scratch Pinterest-style masonry packer (`nuggetLayout.ts`), replacing the old hub's
manually-authored per-nugget grid position (`cells` field) entirely. Built after several rounds of
back-and-forth confirming the exact rules (see prior conversation): height estimated from each
nugget's real body-text character count; nuggets packed into a 4-column masonry where the longest
nugget in a cluster gets the widest slot (extra width compensates for extra text, keeping heights
similar); no two adjacent placements repeat the identical shape; the overall grid resolves to a
perfect rectangle (confirmed acceptable via a small amount of internally-absorbed dead space, not
an exact combinatorial solve).

**Two real bugs caught via actual testing, both non-trivial, neither shipped blind:**

1. **A genuine overlap bug**, found by measuring real rendered card positions against 2011 data
   (not assumed correct from the algorithm's logic). Root cause: the original "rectangle
   correction" step stretched an EXISTING multi-column-spanning card (Kito's, which spans 3
   columns) to absorb one column's shortfall — but that same card was already the tail end of one
   column while something else (Founding Economics) was already stacked after it in its OTHER
   columns, so stretching it pushed it straight into that other card. Confirmed via a standalone
   ground-truth run of the exact algorithm logic (not the rendered DOM) before concluding where the
   bug actually was. Fixed by never stretching an existing card — each column's shortfall now gets
   its own dedicated invisible spacer instead, which by construction can only ever touch the one
   column it was created for.

2. **A text-clipping bug**, found by comparing each card's real natural (unclipped) content height
   against its allocated box height. The very first measurement pass looked contradictory — two
   cards with nearly identical CSS `grid-row` values measured very differently — investigated
   rather than assumed: the culprit was mid-flight page-turn animations (each with an independently
   randomized 1500-3000ms duration) still in progress at the 1500ms mark the first check waited,
   and a partially-rotated 3D transform genuinely shrinks a measured bounding box. Re-measured after
   a full 4500ms (covering the worst-case delay+duration) to rule that out, and the real problem
   was confirmed: EVERY 2011 card was clipping text. Two real causes, both fixed at once: the
   card's own CSS reserves 12px of its allocated height as a visual gap (`height: calc(100% -
   12px)`), which the original estimate never accounted for; and the chars-per-line assumption
   (a flat 46 × span) didn't match reality — real measured chars/line by span (34 at 1-wide, 85-91
   at 2-wide, 114-128 at 3-wide) don't scale as a flat multiple, since wider spans also pick up
   their connecting gaps as bonus width. Fixed with a real per-span lookup table, rounded down for
   safety margin.

**Verified rigorously after both fixes, with a proper wait for animations to settle:** zero
overlaps across all 6 real 2011 nuggets; zero clipped cards (every card's natural content height
now fits inside its allocated box, with comfortable margin, not a tight fit); the rectangle
property confirmed intact (both invisible spacers align exactly with the grid's own bottom edge).

**What this does NOT yet implement, flagged rather than silently assumed done:**
- **Rule 1** (no 3 consecutive YEARS with the identical exact arrangement) is not implemented at
  all yet — it requires comparing against adjacent years' arrangements, which isn't meaningfully
  testable with only 2011 built (no "3 consecutive years" exist yet). Worth revisiting once more
  seasons are built.
- The original "never a literal 1+1+1+1 row" rule doesn't have an explicit guard in this masonry
  model — the shift away from strict rows mostly makes that pattern naturally rare, but no active
  check prevents the edge case if it ever coincidentally occurs.

---

## Milestone 7l (cont.) — Replaced char-count estimation with real DOM measurement

User's framing, worth recording verbatim: hand-tuning constants to predict rendered height is the
same underlying problem as hand-placing cards in the old hub — different knob, same root cause of
needing to constantly babysit an estimate instead of just knowing the real answer. Rebuilt the
height source entirely: a two-pass render. Pass 1 mounts every nugget invisibly at its real
target span-width (off-visibility, not `display:none`, which would report 0 height) so the browser
lays out its actual wrapped text; each one's real height is read via `getBoundingClientRect()`.
Pass 2 runs the same masonry-packing algorithm using those real measured heights, then renders the
final visible grid. `naturalSpan()` (deciding width from length) is unchanged — that heuristic was
never actually the source of the bugs; only the height-for-a-given-width estimate was.

**This took several real rounds of debugging to get right, honestly recorded rather than
smoothed over:**

1. **A user-caught methodology failure, not a code bug.** Walked through three real screenshots of
   the old hub confirming the "perfect rectangle" rule (every column, regardless of card count,
   must reach the identical bottom edge). On the first screenshot, agreed with the user's framing
   that it showed a violation — without actually verifying the claim against the pixels first. The
   user pushed back with a drawn reference line proving the bottoms actually DID align. Correcting
   this openly rather than letting a wrong premise stand: all three screenshots demonstrated the
   rule working correctly; there was no violation in the reference material at all.

2. **A StrictMode double-invocation bug**, caught via a catastrophic-looking regression (28px
   boxes, 10 overlaps) after the first measurement-based build. Diagnosed step by step rather than
   guessing: confirmed the measurement effect fires twice under React StrictMode, and the second
   invocation was reading refs from an already-unmounted hidden measurement pass (since the first
   invocation had already set `placements`, unmounting the hidden divs) — reading null refs as
   zero height and overwriting the correct first result with garbage. Fixed properly, not
   patched around: added `key={year}` on `NuggetGrid` at the parent (the same fix class already
   needed twice before this session, for `FootballTransition` and `BumpChart`), removing the need
   for fragile internal reset logic entirely — a full remount per season, one clean measurement
   pass per mount.

3. **A real 12px miscalculation** — the exact same class of bug as the very first version of this
   component: the final card's CSS still reserves 12px of its grid allocation as a visual gap, and
   the first pass at real-measurement-based row-units forgot to account for it again, reproducing
   clipping despite now measuring "real" heights.

4. **A width/measurement mismatch, the least obvious of the four.** After adding a fixed safety
   margin fixed 2011 cleanly, the exact same two nuggets kept clipping on 2022's data no matter how
   large the margin grew (16px, then 40px) — the tell that this was never a margin-size problem.
   Root cause: `layoutNuggets`'s Rule 4 anti-repeat logic can shrink a nugget's span AFTER its
   height was already measured at the wider "natural" span, and a narrower column needs
   proportionally MORE height for the same text — a fixed pixel buffer can't track a change that
   scales with width. Fixed by scaling `rowUnits` proportionally
   (`measured × naturalSpan / actualSpan`) whenever the placed span ends up narrower than what was
   actually measured.

**Verified across three real seasons** (2011, 2022, 2025 — different nugget counts, different
content lengths, not just the one season already tuned against): zero overlaps and zero clipped
cards on all three, confirmed via real natural-content-height comparison, not assumed from the
algorithm's logic. Rectangle alignment: perfect on 2025, within ~12px on 2011/2022 — comfortably
inside the "small amount of dead space is acceptable" standard already agreed with the user.
Visually confirmed too: the specific card that had been clipping on 2022 ("Kito's Monday-Night
Miracle") now renders with fully visible text.

---

## Milestone 7l (cont.) — Reverted to the old hub's authored nugget layout; new item cataloged

**Reverted the whole computed-layout approach.** After two full rounds of trying to derive the
grid arrangement algorithmically (first from estimated character-count height, then from real DOM
measurement) — both surfaced genuine, hard-to-fully-close bugs on real data beyond the one season
tuned against each time — the user's call: stop computing it, just reuse the old hub's own
AUTHORED per-nugget grid position (the `cells` field, e.g. `"B1:C2"`), which was never the problem
in the first place. `NuggetGrid.tsx` now uses the original `parseGridCells`/`gridDimensions`
utilities (still intact from before the whole masonry detour) with plain CSS grid auto-row-sizing
— no estimation, no measurement, no possibility of the clipping/overlap bugs the computed versions
kept producing, since the browser just sizes each row to whatever its content naturally needs.
`nuggetLayout.ts` deleted as dead code. Verified across 2011, 2022, and 2025: zero clipping, zero
overlaps, matches the original reference screenshots exactly.

**A new, genuinely separate item found and cataloged, not fixed in the moment (deliberately, per
the "one season at a time" plan):** while verifying the revert against 2022/2025 (not itself a
plan to start building those seasons — this was purely stress-testing the layout fix, which needed
more than one season's data to trust), 2025's "All-Time Season Totals" nugget rendered completely
blank. Root cause has nothing to do with grid layout: this nugget's body isn't plain prose — it's a
structured ranked list (`.ts-list`/`.tst-row`) where every row carries an inline
`style="display:none"`. The old hub has a dedicated function, `sumFitTopSeasons()`, that measures
this card's SIBLING nugget's real rendered height, then reveals list rows one at a time until
adding the next one would overflow that height — a dynamic "show as many ranks as fit" behavior,
matching the sibling's height rather than a fixed row count. Our React app has no equivalent yet,
so every row stays hidden exactly as authored.

**Not a 2011 issue** — 2011's own 6 nuggets are all plain prose+bold, no ranked-list card among
them; its layout is genuinely complete and correct. **Deferred deliberately**, matching the
project's actual "lock 2011, then roll out one season at a time" plan: this becomes real work only
once 2025's own turn comes around (Milestone 16), not now. Whoever picks this up then needs to
build the equivalent of `sumFitTopSeasons()`: find the sibling nugget sharing the same grid-row,
measure its real height, and progressively reveal this card's list rows until they'd overflow that
measured height.

---

## Milestone 7l (cont.) — Row/column transposition bug found and fixed

User asked directly whether 2011's nugget layout genuinely matched the old hub — a fair challenge,
since the earlier claim ("matches the original reference exactly") had been made from a visual
glance at a screenshot, not from checking the actual computed CSS values. Checking properly this
time surfaced a real bug: `parseGridCells.ts` had letter=column, number=row, but the old hub's own
real parsing logic (its `parse()` function plus its `ROWS = {A:1,B:2,C:3,D:4,E:5,F:6}` mapping,
both confirmed directly in its source) is the opposite — **letter=row, number=column**. Every
nugget had been rendering rotated 90° from its true position: "Five Kings, One Crown" (cells
`"A1:A4"`) was rendering as a tall narrow card confined to column 1, when it should be — and now
is — a wide, short bar spanning the full width of row 1.

Fixed in `parseGridCells.ts`, both `parseGridCells()` and `gridDimensions()`. **Verified precisely
this time, not just visually:** checked the actual rendered `gridColumn`/`gridRow` CSS values for
all 6 of 2011's nuggets against what the old hub's real semantics dictate — Five Kings now
`gridColumn: "1/5"` (full width) `gridRow: "1/2"` (single row), and the remaining five nuggets fall
into the correct two-then-three arrangement below it, matching the original reference screenshot
exactly. A fresh screenshot confirms the visual result.

---

## Milestone 7m (cont.) — Race fires once per year-navigation, never on rescroll

Replaced the earlier "first time always plays, subsequent scroll-ins have ~50% odds" behavior
(from 7i) with a hard rule: the race fires exactly once, the first time it scrolls into view after
navigating to that season, and never automatically again from any later scroll — up, down, away,
back — regardless of how many times the panel re-enters the viewport. The only other way to see it
again is the Replay race button. This falls out of two things working together: `key={year}`
(already applied to `BumpChart` since 7h) gives it a genuinely fresh mount — and therefore a fresh
"have I fired yet" guard — every time a different year's link is clicked, and the guard itself
changed from a probabilistic coin-flip to a hard boolean check that can never fire a second time on
its own.

**Verified, not just assumed from removing the random branch:** confirmed the race fires on the
first scroll-into-view; then cycled scrolling away and back into view 3 times and confirmed no
smoke (or any other stage of the sequence) fired again automatically; then confirmed the Replay
button still triggers the full sequence correctly when clicked explicitly.

---

## Milestone 7 (cont.) — Salary donuts rebuilt as a faithful canvas port of the old hub

The earlier flat 2D SVG donut didn't match the old hub's real look at all — the old hub's actual
version (`sccDrawPie()`/`sccInitPie()`) is a genuinely sophisticated 3D-isometric-extruded canvas
engine: wall-shading between the top and bottom ellipse edges to fake depth, the largest slice
"exploded" outward slightly, a 22° tilt with vertical squash, and leader-line labels with a
de-collision pass so adjacent labels never overlap. Ported this faithfully into
`drawExtrudedPie.ts` — same geometry constants (`TILT=22`, `VSQUASH=0.75`, the exact wall-shade
multipliers, `HOLE=R*0.45`, `DEPTH=R*0.35`, `EXPL=R*0.25`), same canvas-based technique (matching
the old hub's own choice rather than attempting an SVG approximation of the same 3D-look effect).

**Title/subtitle/sub-panel text and the rotation slider all pulled from the real source, not the
screenshot alone:** "Salary Cap Contributions — Winners & Losers" / "This season's net gains and
losses, shown as a share of the money won and the money lost" / "Season Winners" / "Season Losers",
`.pie-box` styling (`#222222` background, real border, `12px` radius), and the slider itself
(0-359° range, `↺` reset glyph, red accent color, default rotation 20° for winners / 90° for
losers) — all confirmed against the old hub's actual HTML/CSS/JS, not transcribed from the image.

**Verified properly, including catching a flawed test before trusting it:** confirmed the canvas
has substantial real drawn content (30-40KB data URLs, not a blank canvas). A first slider-interaction
test showed no change and looked like a real bug — investigated rather than assumed: directly
setting a controlled `<input>`'s `.value` via JS and dispatching a plain event doesn't reliably
trigger React's own value-tracking, a known testing gotcha, not a component bug. Redone with real
keyboard interaction (focus + arrow keys): confirmed the canvas visibly redraws, the degree label
updates correctly, and — critically — each panel's slider only affects its own chart (rotating
winners to 50° left losers correctly fixed at 90°). A screenshot confirms the visual result matches
the reference exactly: visible 3D depth, the exploded max slice, and leader lines with name/value/
percentage extending outside the donut on both sides.

---

**Update: background/border removed, leader lines extended.** `.pieBox` background and border
deleted. Leader-line distance increased from `R*0.24` to `R*0.5` so labels no longer touch the
donut. **Caught two real issues while making this change, not just applied it blind:** first, a
naive increase pushed labels off the FIXED canvas width entirely (confirmed via screenshot —
"Mikey -$69.00" was visibly cut off at the edge), since the canvas width is set by its wrapper's
layout width, not something that grows to fit a larger leader-line distance. Second, and separately,
`radiusFraction` had been hardcoded inside `drawExtrudedPie()` itself rather than accepted as a
parameter — meaning adjusting it in the component wouldn't have actually changed the drawn radius,
only the height calculation, silently diverging from what was on screen. Fixed both together:
`radiusFraction` is now a real parameter, shrunk from 0.3 to 0.22 to free up room within the same
fixed canvas width for the longer leader lines. Verified by directly inspecting pixel data at each
canvas's left/right edges (not just eyeballing a screenshot): confirmed zero non-transparent
content touches either edge on both donuts, meaning nothing is being clipped.

---

## Milestone 7o — Dancing Shoes and nugget card body text sized to match recap prose

Body text font-size changed to 15px for both `DancingShoes` (was 13px) and `NuggetGrid` (was 12px),
matching the recap prose's own 15px. Titles/eyebrows/labels in both left untouched. Verified via
computed style: both now measure exactly 15px.

---

## Milestone 8 — Site branding header ✅ built, pending your verification

The old hub's owl-logo + league-name header, plus its horizontal year-tab nav, revealed a real gap:
nothing currently carries the league's actual brand identity (logo, name, "EST. 2011 · 15 seasons").

**Important scope note — this does NOT mean reverting the confirmed nav design.** The old hub's
horizontal tab bar is a different navigation pattern than the vertical `TimelineRail` this project
already confirmed and built (Milestone 2) as part of the locked scrollytelling direction. This
milestone is about adding the brand mark/logo and league name into the existing `Layout`, not
replacing the rail with horizontal tabs — check with the user before assuming otherwise if this
feels ambiguous when it's time to build.

**What was built:** `SiteHeader.tsx` + `.module.css`, structure lifted directly from the old hub's
real `.site-brand` markup (logo + two-line title + subtitle) — read from `TNCFL_hub.html` itself,
not guessed. **Deliberate change from the source: "Hub" swapped for "Record Book"** throughout,
matching this project's actual rename (the old markup literally says "...League Hub"; using that
verbatim would have contradicted the rename this whole project exists for). User's call on
placement, confirmed via tappable question: a full-width horizontal banner above BOTH the rail and
content — not squeezed into the narrow 160px rail, which the old header's wide horizontal shape
wouldn't fit anyway. `Layout.tsx` restructured: `.layout` is now a column (header on top), with a
new `.layout-body` wrapper holding the rail+content row that used to be `.layout` itself directly.

**Verified via headless browser:** logo file serves correctly (200), header renders with the real
asset and real brand-red accent color, and — checked specifically since `.layout`'s flex direction
changed — the Milestone 7a containment fix still holds (no page-level horizontal overflow at
900px) after this restructure.

**Your turn:** run it and confirm the header looks and sits right.

**Update: transparent logo assets swapped in.** The project's carried-over `header_logo.png`/
`h2h_logo.png`/`salary_logo.png` were plain RGB with a baked-in opaque background (confirmed via
actual image mode inspection, not assumed). User supplied real RGBA versions with genuine alpha
transparency (checked the actual alpha channel data varies 0–255, not just the file extension) —
swapped into both `public/header_logo.png` (the active asset `SiteHeader` uses) and the project's
master reference copies, so any future use of `h2h_logo.png`/`salary_logo.png` (e.g. a
Milestone 17 H2H section) starts from the transparent version too. Verified via screenshot: the owl
now sits directly on the header's dark background with no white box behind it.

---

## Milestone 9 — Manager & week filters

The old hub's "Filter Managers" (All/Clear/Money Circle/individual manager toggle pills) and
"Filter Weeks" (All/Clear/Q1–Q4) bars — genuinely interactive filtering, not yet built at all.

- Manager filter: toggle which managers' data shows across the score table and charts
  simultaneously — likely needs its own shared state (a candidate for Context, similar to
  Milestone 6's hovered-manager state, since multiple components need to react to the same
  filter selection).
- Week filter: same idea, scoped to a subset of weeks (or quarters) instead of managers.
- Decide interaction model before building: does filtering HIDE non-matching data, or DIM it (same
  visual language Milestone 6's hover-dimming already established)? Worth explicitly deciding
  rather than defaulting to one.

**Done when:** toggling a manager or week filter visibly changes the score table and at least the
charts built so far.

---

## Milestone 10 — Salary Cap rules card + full ledger table

Milestone 5 built only the donut summary (winners/losers). Two real pieces are still missing: the
rules-explainer card (buy-in, HMOTW fee, trans/trade fee, prize split — `payouts[year]`'s top-level
fields, already typed since Milestone 5) and the full 16-column itemized ledger table (per-manager
row: finish, HMOTW, trans, trades, buy-in, sidebet, playoff, HMOTW fee, trans fee, trade fee, HMOTW
purse, sidebet purse, playoff purse, season purse, net — all real fields on the already-typed
`PayoutRow`, most simply not rendered anywhere yet).

**Done when:** 2011's page shows the season's actual fee/prize rules and the full per-manager ledger
table, not just the donut summary.

---

## Milestone 11 — Despair Differential + Scoring Spread Index

Two more per-week analytical charts, bundled together since both are pure functions of already-typed
`season.scores` — no new data needed.

- **Despair Differential:** cumulative points behind the season leader, week by week, per manager
  (a running "how far back are you" line chart) — derivable from `cum_points` directly (leader's
  cum_points minus each manager's, per week).
- **Scoring Spread Index:** each week's high-to-low scoring range, plotted as a per-manager marker
  against a league-average reference line — derivable from `scores` and `weekly_high`/`weekly_low`
  (check whether a `weekly_low` field exists in the real data or needs deriving before assuming).

**Done when:** both charts render real 2011 data and their shapes match the old hub's visual story
(a widening gap for the despair chart, real high/low spread per week for the spread index).

---

## Milestone 12 — Superiority Beatdown Index (H2H matrix) — **CANCELLED, will not be built**

~~A season-scoped head-to-head win matrix (every manager vs every other manager, how many weeks each
outscored the other). Good news found while surveying the old hub: this does NOT need the
deferred top-level `h2h` field (which looks like career/all-time data) — it's fully derivable from
`season.scores` alone (compare every manager pair's score, every week, tally wins). Color-graded
red-to-green by dominance in the old hub — a real color rule to derive from data before building,
not guess.~~

**User's call, after the real hub code was read and a design question raised:** this feature
"doesn't provide any meaningful context" and should not be part of the Record Book at all. Not
deferred like Milestone 9 — permanently out of scope. Milestone numbers are NOT renumbered (13
onward keep their existing numbers) to avoid cascading renumbering churn; this milestone simply
has no deliverable.

---

## Milestone 13 — Peak Performance Distribution (HMOTW pyramids)

HMOTW wins visualized per manager. For 2011 specifically this needs nothing beyond the already-typed
`season.hmotw_tally` — buildable now. **Scope note:** the old hub's version is framed as "wins by
season," implying a genuine cross-season growth visualization once more seasons exist — that fuller
version needs `meta.hmotw.season_tally` (still deferred to Milestone 17). Build the single-season
form now; treat the cross-season growth version as part of Milestone 17's work, not a redo of this
milestone.

**Done when:** 2011's HMOTW tally per manager renders as its own distinct visual (pyramids or
another shape — decide the visual treatment before building, don't default to copying the old hub's
3D canvas approach without checking it's still wanted).

---

## Milestone 14 — Cumulative Competence Chart

A points-per-finish leaderboard (1st=10, 2nd=5, 3rd=2, 4th=1, 5th=0.9, 6th=0.8 — confirmed against
the old hub's own displayed legend). **Data note:** `summary[year].competence` already exists as a
named field in the real data (declared but left `unknown` since Milestone 1 — "its inner shape
wasn't fully inspected"). Type it properly here rather than reinventing the points-per-finish
transform client-side — the engine has almost certainly already computed this, and re-deriving it
ourselves risks quietly drifting from the real rule if the points-per-finish table isn't exactly
what's shown above. Check `summary[year].topweeks`/`.lowweeks` (same parent field, same
`unknown` status) while in here — they may feed part of the All-Time High/Low leaderboards
(Milestone 17) or may be season-scoped versions worth their own display; confirm which before
assuming.

**Done when:** 2011's competence ranking renders from real (properly typed) engine data, not a
client-side reimplementation of the points-per-finish rule.

---

## Milestone 15 — 2011 full review & template lock — DONE (2026-09-06)

Present the complete, real, animated 2011 chapter. This is the actual template-lock moment — once
this is confirmed, its structure becomes the pattern every later season follows, so this is the
point to be most demanding about getting it right.

- Verify every number against the engine one more time, now that motion/charts are real. DONE —
  full top-to-bottom render (7 sequential screenshots) reviewed; also caught and fixed a real,
  independent bug found along the way in `FootballTransition.tsx` (the "contain" zoom was measuring
  the wrong element, then a second bug where the resting zoom never re-synced once the real
  measurement arrived) — see SESSION_LEDGER Entry 44.
- Lock the final template spec into `SKILL.md`, replacing the "pending" design-direction section.
  DONE.
- Note in the session ledger which parts of 2011 are truly "template" (reusable for every season)
  vs. "2011-specific" (e.g., a particular nugget's wording) so 2012 doesn't accidentally copy things
  that shouldn't generalize. DONE — see `SKILL.md`'s Design direction section for the summary.
- **Small addition found while surveying the old hub:** a "LOCKED" badge next to a formally-reviewed
  season's title — a literal signal that a season passed its own review, distinct from the
  template-lock this milestone represents. DONE — `lib/lockedYears.ts` + a badge in `SeasonHero`'s
  eyebrow line, currently just 2011.

**Done when:** you've reacted to the full rendered 2011 chapter and confirmed it as the locked
template. DONE — user confirmed "the design looks solid" and asked for 2011's layout to be the
template for subsequent years.

---

## Milestone 16 — Roll out 2012–2025 — DONE (2026-09-06, batches 1-5 all complete)

Now that the template is proven, this should move faster than Milestones 1–7 combined — it's
mostly "plug this season's data through the locked components," not new engineering. Batch a few
seasons per session (2–3 at a time is reasonable) rather than attempting all 14 remaining seasons
in one sitting, and watch for real edge cases the template didn't anticipate (a season with a tie,
a manager who only played part of a season, etc.) — these are exactly the kind of thing to stop and
ask about rather than silently handling however seems reasonable.

**Batch 1 (2012, 2013) — DONE, zero code changes needed.** Checked real data for edge cases first:
no partial-season managers; genuine exact-score HMOTW ties in both years (engine already splits
credit in half — `hmotw_tally` has real fractional values; `ScoreTable`'s per-row weekly-high check
already highlights both tied managers correctly by construction). A new visual state (the "diag"
pill, for a score that's both 200+ and that week's high) got exercised for the first time and
rendered correctly. Full screenshot sweeps of both seasons confirmed every cross-season panel
(Peak Performance, ATDR, Dancing Shoes prose, Season Totals, the Career ledger/donuts, Competence
medals) correctly handles a growing/changing roster. See SESSION_LEDGER Entry 46. `Layout.tsx` and
`lib/lockedYears.ts` now cover `[2011, 2012, 2013]`.

**Batch 2 (2014, 2015, 2016) — DONE, zero code changes needed.** Checked real data for edge cases
first: no partial-season managers, no nulls, identical 10-manager roster all 3 years. Two more
genuine 2-way HMOTW ties (2014 Wk13: Mikey/Randy at 192.0; 2016 Wk17: Damian/Douang at 163.0),
both already split correctly in `hmotw_tally`. No 3+-way ties, no duplicate `weekly_rank` values.

**A real, already-shipped discrepancy surfaced and resolved during this batch's prep:** the score-
cell ≥200 red/diag pill rule (`getPillType()` in `ScoreTable.tsx`) was flagged back in Milestone 4
to be gated to 2017+ only (since it visually represents the engine's DHMOTW rule, which does
nothing pre-2017) — that gate was never actually implemented when the pill system was built in
7g, and went unnoticed through batch 1 despite 2013 having 7 real ≥200 scores. **User's locked
call: keep it ungated, applying the pill rule uniformly across every season for visual
consistency** — see the corrected note in Milestone 4's write-up above. Not a bug; 2013's
already-shipped pills are correct as-is, and 2014-2016 (2/3/2 real ≥200 scores respectively) render
the same way.

**Verification method note for this batch:** the sandboxed environment used for this session
couldn't download a headless-Chromium binary (network-restricted), so the literal screenshot/DOM
checks batch 1 used weren't possible. Verified instead via direct data-level checks against
`site_data.json`, replicating each cross-season component's real logic in Python: Peak
Performance's Active/Inactive split (confirmed real departed-manager HMOTW wins exist through
each year, so Inactive renders real content, not the empty state), ATDR snapshot counts and top
entries, Season Totals' derived ranking, Competence's per-year point growth (confirmed
engine-computed, not client-derived), and — same discipline as batch 1 — cross-checked each
year's authored Dancing Shoes victim against the real drought data scoped to active managers only
(all 3 years matched exactly: 2014 Kito 45wks, 2015 Douang 38wks, 2016 Tony 23wks). Also grepped
the codebase for any other hardcoded year-range assumptions beyond the two sidebar/lockedYears
lines — none found. This confirms data correctness but not actual pixel rendering; a real
browser-based visual confirmation is still worth doing next session if that environment has
network access, before treating 2014-2016 as being at the exact same verification bar as 2011-2013.

`Layout.tsx` and `lib/lockedYears.ts` now cover `[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
2019]`.

**Batch 3 (2017, 2018, 2019) — DONE, zero code changes needed.** This batch was specifically
chosen to exercise DHMOTW (2.0 tally credit for a sole ≥200 winner) actually activating for the
first time — none of batches 1-2 had. 2017 itself has no DHMOTW-eligible weeks, but 2018 has six;
hand-verified every one of them against `hmotw_tally` (e.g. Kito's only win all season, a sole 210
at week 7, shows exactly 2.0 not 1.0 — and every manager's full-season total checks out summing
1.0/2.0 per win correctly). The engine's own DHMOTW logic needed no fix.

This batch also introduced 2019's returning-manager case: Bao, active 2011-2013, inactive
2014-2018, active again in 2019 — the first comeback either batch 1 or 2 had seen (prior batches
only saw one-way departures or first-time joins). Checked every cross-season, status-dependent
component (Peak Performance's Active/Inactive split, ATDR's departed-row dimming, Drought Bars)
and confirmed each recomputes its active/departed split fresh from that year's
`status_by_year`/`active_managers` on every render — none of them cache or permanently flag a
manager, so a comeback isn't a special case any of them need to handle, it falls out of the
existing per-year logic. Proved this with a real build, not just review: temporarily widened
`lockedYears.ts`/`Layout.tsx` to include 2019 and ran `tsc -b` + `vite build` clean before
committing to the actual rollout. 2019 also has a brand-new manager (Ted, joining for the first
time) and one genuine 2-way tie (Wk10: Hanh/Mikey at 162.0), both handled the same way prior
batches' equivalents were.

Full real-data sweep, same as prior batches: Dancing Shoes victims matched the real active-scoped
top drought exactly for all three years (2017 Randy 26wks, 2018 Tony 30wks, 2019 Kevin 21wks);
payouts balanced all three years; ATDR entries growing correctly (71/79/88).

**Batch 4 (2020, 2021, 2022) — DONE, zero code changes needed.** Same edge-case-first discipline:
one genuine 2-way tie (2020 Wk4, correctly split), no partial seasons, no nulls. Three genuinely
new structural variations exercised for the first time: 18-week seasons (2021/2022, vs 17 for
every prior year — confirmed no component hardcodes the week count, all read `season.weeks`
dynamically); a manager name with an apostrophe (D'lyn, joining 2020 — confirmed plain ASCII
apostrophe, no `dangerouslySetInnerHTML` risk since that's only used for pre-authored prose
bodies); and decimal (non-integer) scores for the first time (2021/2022 — confirmed every score
consumer already formats/compares correctly, no client-side float arithmetic that could drift).
Also noted: no season through 2022 has ever had a tied score that's also ≥200, so the
DHMOTW-during-a-tie interaction remains genuinely untested by real data — not a blocker, just
flagged for whenever it eventually comes up. Full sweep: Dancing Shoes victims matched real
active-scoped drought exactly for all three years; payouts balanced; ATDR entries growing
correctly (98/110/117). Proved with a real `tsc -b` + `vite build` test before committing.
`Layout.tsx` and `lib/lockedYears.ts` now cover
`[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]`.

**Batch 5 (2023, 2024, 2025) — DONE, zero code changes needed. MILESTONE 16 IS COMPLETE.** Same
edge-case-first check: no partial seasons, no nulls, no ties. Roster: Titi departs after 2023,
Aidan joins fresh in 2024. DHMOTW counts 6/9/5 across the three years.

**A major unplanned verification opportunity:** 2025's nuggets turned out to contain the real
hub's own complete "All-Time Season Totals" leaderboard — 146 real entries (every manager-season
2011-2025), authored as a collapsed HTML block, ground truth from the real hub itself. Extracted
and cross-checked all 146 entries against `computeSeasonTotals`'s own client-side derivation for
the full 15-season range: **zero mismatches.** Also cross-checked two of the nugget's narrative
claims directly against raw data (Aidan's 2025 tally of 7.0; the Wk15 Kito-210.32-over-Hanh-209.00
flashpoint) — both confirmed exact.

Full sweep: Dancing Shoes victims matched real active-scoped drought exactly (2023 Tony 21wks,
2024 Kito 33wks, 2025 Ted 24wks); payouts balanced; ATDR entries growing correctly (125/137/146 —
146 confirms the top-50 cap/scroll genuinely engages on the final season). Proved with a real
`tsc -b` + `vite build` test before committing, same as batches 3-4.

**Cleanup now that the rollout is done:** `Layout.tsx`'s sidebar filter was only ever a temporary
staging mechanism during the rollout — removed, now renders `data.meta.years_desc` directly.
`lib/lockedYears.ts` keeps its full 15-year list (drives SeasonHero's real per-season "reviewed"
badge, so it's correct and complete as-is).

`Layout.tsx` and `lib/lockedYears.ts` now cover all 15 seasons,
`[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]`.

**Standing gap, unresolved this entire session:** no headless-browser access at any point — every
fix and every batch's verification since batch 1 (2012/2013 excepted, which got a real screenshot
sweep) has been data-level or build-level only. A real screenshot-based visual pass across all of
2014-2025 is the single most valuable next step whenever browser access is available — should be
the first thing done in any future session on this project, before new feature work.

**Done — all 15 seasons (2011–2025) render through the locked template, each independently
verified against the engine.**

---

## Milestone 17 — League / Hall of Fame section — DONE (2026-09-08)

Ported the trophy cabinet, all-time records, H2H, and manager profiles into their own routes under
a "LEAGUE" nav entry. The original scoping bullets (below, kept for history) were incomplete in two
real ways found during the build: the old hub's actual Hall of Fame page has 5 sections, not all
named here (League Records grid, hero essay, Season-by-Season timeline, All-Time Top Scores/Reigns
at #1 were missing); and the eventual page split moved several of those off the Hall of Fame page
entirely into a new **Records** sub-page. See SESSION_LEDGER.md Entries 65-73 for the full build
history, including every real data-verification catch along the way (a stale hero-essay stat, 3
factual errors caught while drafting manager bios, a wrong all-time metric derivation caught before
it shipped, and more).

**Original scoping bullets, for history — superseded by what actually got built below:**
- All-Time Longest Drought leaderboard — needs `meta.hmotw.atdr_snapshots`.
- All-Time Highest/Lowest Single Week Score leaderboards — needs `all_time_scores`.
- Cumulative Salary Cap — needs `cumulative`. *(Never built — dropped; not part of any Records
  panel that shipped. Revisit if this is still wanted.)*
- Career-scoped H2H — needs `h2h`.
- Manager profiles — needs `career`.

**Final nav structure**: one "LEAGUE" entry in the left rail (`TimelineRail.tsx`, plain "LEAGUE"
label, no expand indicator), expanding to 5 sub-pages — Hall of Fame, Manager Profiles, Records,
Head-to-Head, How Our League Works. All 5 have real content; nothing left as a placeholder.

**Hall of Fame** (`HallOfFame.tsx`) — trophy cabinet + hero essay only (narrowed from the original
5-section plan). Trophy cabinet (`TrophyCabinet.tsx`/`computeTrophyCabinet.ts`) replaces the old
`.hof-rings-grid` entirely: one card per championship YEAR, most-recent-first, album art is the
champion's career trophy pile as of that year. Final locked spec after several rounds of visual
iteration: 561px total card, coverflow offsets 225px immediate/375px far, neighbor scale
0.625×/0.25× (250px/100px), opacity 0.25/0.1, lens-flare burst on every transition (one flare per
trophy, random size/position), caption shows year + champion + "N title(s): every year won so far".
Hero essay (`HeroEssay.tsx`) ported from the old hub with 2 real corrections: a stale "eleven of
fifteen" stat fixed to "ten of fourteen", and an unrequested `max-width` removed.

**Manager Profiles** (`ManagerProfiles.tsx`/`ManagerProfileCard.tsx`/`ManagerAvatar.tsx`) —
`career`/`streaks_at_1` typed; URL-driven manager selection (`/league/profiles/:manager`); 18
confirmed 2-paragraph bios (`managerBios.ts`, drafted from real data — caught 3 factual errors
during drafting, not a verbatim port of the old hub's 1-paragraph ARCS); full profile card (bio,
rings, 5 stat tiles, 5+ week streaks, best/worst week, rival, full year table).

**Records** (`Records.tsx`) — locked 3×3 League Records stat grid; Cumulative Competence Chart
(a genuinely new all-time metric — season-ending rank run through the same points-per-finish scale
as the existing per-season `CompetenceChart.tsx`, NOT a sum of that component's own field, which
was checked and gives different numbers); All-Time Highest/Lowest Single Week Score (21 each,
Lowest computed client-side from raw weekly scores since no premade field existed); All-Time
Longest Drought and All-Time Season Totals (both reuse the exact `AtdrCard.tsx`/`SeasonTotalsCard.tsx`
already shipped on every season page — not new components, just repointed at all-time data). The
Cumulative Salary Cap idea from the original scoping bullets was never revisited or built.

**Head-to-Head** (`HeadToHead.tsx`/`H2HMatrix.tsx`/`H2HDuelPicker.tsx`) — `h2h` typed and
cross-checked against `career[m].rival` before trusting the key format. This is the FIRST H2H
component in this app (ROADMAP previously implied a Milestone 12 season-scoped matrix already
existed; checked and found no such component anywhere). Two sub-tabs: All-vs-All Matrix
(active managers, sorted by career net, win-dominance coloring) and Duel Picker (two-manager
comparison with a shared-seasons table).

**How Our League Works** (`HowLeagueWorks.tsx`) — 4-section accordion (HMOTW, DHMOTW, Drought
System, Payout Structure), every concrete numeric claim verified against real data before porting
(buy-in amounts by era, Randy's full 2024 earnings breakdown).

**Sandbox parity**: `league-sandbox.html` (delivered separately, not in the project zip) fully
mirrors Hall of Fame, Records, and the LeagueComingSoon-era stubs. Manager Profiles and
Head-to-Head/How Our League Works were NOT mirrored — confirmed fine with the user given their
scope, offered but not yet requested.

---

## Milestone 18 — PWA + deploy pipeline

- 🎓 **`vite-plugin-pwa`** — Wanderlog already uses this exact package for its installable-app
  behavior; the manifest/service-worker concepts carry over directly, just pointed at the new app.
- Update the GitHub Pages deploy flow for a build step (see the "Technical approach" consequences
  already noted in `SKILL.md`) — this is new relative to the old hub's copy-files-straight-over
  deploy, but not new relative to Wanderlog, which already has a `.github/workflows/deploy.yml` you
  can use as a reference.

---

## Milestone 19 — Polish pass

Performance (route-based code splitting so visiting `/season/2011` doesn't load all 15 seasons'
components at once), a real mobile QA pass across the swipeable season-chapter flow, and a final
accessibility check (reduced motion, color contrast, keyboard navigation of the timeline rail).

---

## Milestone 20 — Nugget system rebuilt: `cells`/`stack`/`stackWidth` retired, replaced with authored pixel positions — DONE (2026-09-08)

Not a planned milestone — surfaced mid-session out of the column-height mismatch flagged at the end
of Milestone 16/Entry 60, and grew into a full architectural replacement once a standalone
authoring tool (see below) made the limits of the row-letter/stack system clear enough that the
user chose to retire it outright rather than extend it further.

**A standalone nugget-panel sandbox tool was built first** (`nugget-panel/index.html` — no React,
no npm, no server, opens directly in a browser) so layouts could be hand-tuned interactively
instead of iterating blind through `cells` edits and rebuilds with no headless-browser access to
close the loop quickly. Full drag/resize/snap/no-overlap/cascade-push engine, three sections per
year (Established/New/Final Layout), `localStorage` persistence with a reconciliation pass so newly
added candidate nuggets merge into an already-visited year without disturbing anything already
positioned, and JSON export/import to hand a finished layout back to Claude. See SESSION_LEDGER
Entry 61 for the full build history, including two genuine collision-detection bugs found and
fixed (zero-gap flush stacking; a multi-column-spanning card's auto-stretch not checking every
column it actually covered) and two DOM-staleness bugs (double-click breaking because an
unconditional re-render on every mouseup destroys and rebuilds the clicked element between the two
clicks; a "will-push" warning class applied to an already-removed element during live drag for the
same underlying reason).

**Content pass, all 15 years, using the sandbox's New section as staging** (SESSION_LEDGER Entry
62): a new "Chances of a Champion" nugget added for every year — a real mathematical-clinch
analysis using that season's own scoring average as the ceiling for what a trailing manager could
plausibly still post. 5 of 15 champions were genuinely clinched before the season ended (2012,
2014, 2021, 2023, 2025 — all with exactly 1 week to spare); the other 10 get a fallback stat
(trailing manager's needed score as a % of what the leader actually posted). Every year's "By the
Numbers" champion-recap card brought to one consistent template (11 of 15 years needed a new one
built from scratch; the other 4 already had one). Various other verified fact-finds added where
genuinely new (full payout breakdowns, undocumented exact-score ties found via a full 15-year scan,
the single tightest non-tied HMOTW margin in league history) — explicitly checked against what
each year's existing nuggets already said before adding anything, to avoid restating facts already
on the page.

**The architecture replacement itself** (SESSION_LEDGER Entry 63), confirmed directly against the
real `NuggetGrid.tsx`/`parseGridCells.ts` source (the user uploaded the actual project zip
specifically for this) rather than assumed from memory: `Nugget` type's `cells`/`stack`/
`stackWidth` fields replaced with `colStart`/`colSpan`/`top`/`ownHeight`, matching the sandbox
tool's own model exactly. `NuggetGrid.tsx` rewritten around absolute positioning instead of CSS
Grid; `parseGridCells.ts` deleted (confirmed via full-tree grep that nothing else imported it
first). Three explicit tradeoffs locked with the user before writing anything: fixed 1200px width
(not the old fluid/responsive grid — a real regression for other viewport widths, accepted
knowingly), no auto-stretch (every card renders at exactly its authored height now, matching how
precisely the user positions things in the sandbox), and fixed height rather than `min-height`
(accepts a real risk of clipped text if authored heights don't exactly match production font
rendering, in exchange for guaranteed pixel-exact positioning — paired with `overflow: hidden` so
any mismatch clips cleanly rather than spilling out).

`site_data.json`'s `nuggets` section fully replaced in both copies (root + `public/`), sourced
directly from the user's own hand-arranged Final Layout export — all 15 years, 169 total entries,
every one schema-checked programmatically. Confirmed via full-file diff that every other section of
both copies is byte-identical to what was uploaded; only `nuggets` changed.

**Verification:** first entry all session with the complete real codebase available — ran the
actual production build (`npm run build`, i.e. `tsc -b && vite build`) rather than a partial
type-check against isolated files. Zero errors, 501 modules transformed, clean build. Headless-
browser access was attempted again specifically to try to close the standing visual-verification
gap (`npx puppeteer browsers install chrome`) — confirmed still blocked (403 from the download
host), not just assumed unavailable. **The standing gap from every prior milestone this session
remains fully open: no season's real rendered output has ever been screenshotted this entire
project.** This is now the single most valuable next step for whoever picks this up next, more so
than before given how much changed in this milestone specifically (a full positioning-model
replacement with zero visual confirmation yet).

---

## Applying this elsewhere, once the Record Book is done

You asked to look at your other projects for where these same tools could go next. Two real
candidates, in order:

### 1. Hanh's Chord Book — the strongest fit

The Chord Book is architecturally the same *kind* of problem the old hub was: a single HTML file
(`chordbook.html`) assembled by a custom build script (`build-chordbook.js`) that inlines several
"engines" (chord kernel, lyric engine, diagram engine, piano engine) and a hand-written template
literal (`newBoot`) standing in for what would just be React components. Several of its locked
rules exist *only* because of that architecture and would likely disappear in a React rebuild:
- E26/E27 (newBoot can't contain backticks/`${}`/single quotes, and two functions escape
  differently) — an artifact of hand-writing HTML inside a JS template literal. Real JSX components
  don't have this problem.
- L13 (double-quoted strings misbehave inside the template literal) — same root cause.
- The `node --check` guard after every `newBoot` edit — a workaround for not having a compiler
  that would normally catch this class of error at build time, which TypeScript/Vite would.
A React+TypeScript rewrite would let the kernel/lyric/diagram/piano "engines" become real modules
with typed interfaces (similar to how Wanderlog's `types/index.ts` typed trips and pins), the piano
popup IIFE become a proper component instead of a DOM-manipulation escape hatch, and the six
hand-rolled test suites could target typed function signatures instead of string-templated output.
This is a natural second project once the RB curriculum above is finished — very comparable scope
and complexity to what you'll have just been through.

### 2. TNCFL 2026 Tracker — possible, but lower priority right now

Same vanilla/canvas pattern as the old hub, and it would benefit from the same kind of rebuild —
but it's a **live, in-season file** with a Cloudflare Worker and real weekly data flowing through it
right now (draft is Sep 7, kickoff Sep 9). Converting an actively-used tracker mid-season is much
higher risk than converting an already-static archive. Worth revisiting in the off-season once
2026 wraps, not before.
