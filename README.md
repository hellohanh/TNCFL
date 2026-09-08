# TNCFL Record Book — Resume Reference

> **How to start a session:** Upload this project's zip, say "read the .md files and get caught
> up." Claude will read `SKILL.md`, `SESSION_LEDGER.md`, and this file in order.

This is the **TNCFL Record Book (RB)** project — the all-time archive site (2011–present) for the
Thursday Night Curse Fantasy League, split off from the original combined TNCFL project on
2026-09-04 so the archive redesign and the live 2026 season tracker no longer share files. The
2026 Tracker, its rule doc, and the Cloudflare Worker stay in the original TNCFL project — this
project never touches them.

---

## Current State (as of 2026-09-08, Part 4 of the Record Book project)

**Since the last zip (S030, same day):** Small real bug fix — the LEAGUE nav button had a visible
3-sided default `<button>` border (browser UA stylesheet, `2px outset black` on top/right/bottom)
that none of the year links below it have, caught from a user screenshot. Fixed surgically in
`TimelineRail.tsx` — explicit `borderTop`/`borderRight`/`borderBottom: 'none'` on the inline style,
leaving `border-left` to the `.timeline-year` CSS class (used for the active-route accent) rather
than a blanket `border: 'none'` that would have wiped that out too. Confirmed via computed-style
comparison. See `SESSION_LEDGER.md` Entry 81.

**Since the last zip (S029, same day):** Football scroll-transition update (`FootballTransition.tsx`,
unrelated to the LEAGUE section) — added 3 new images to the rotation (`football-3.png` through
`football-5.png`; checked first that 2 of the 5 uploaded images were byte-identical to what was
already there, so only 3 were genuinely new), and changed the random target zoom range from
150%-250% to 100%-200% per explicit request, worked out via a live interactive walkthrough of the
component's actual zoom/position/justify math. Verified with real headless-Chromium sweeps both
times: all 5 images confirmed appearing in rotation with zero load errors, and 15 fresh page loads
sampled afterward to confirm the new zoom range. See `SESSION_LEDGER.md` Entry 80.

**Since the last zip (S028, same day):** Records page polish — 40/30/30 panel split; Highest/Lowest
Single Week Score converted from fixed top-21 lists to real thresholds (>=200 / <=99.999,
73/199 real entries, both scrollable); All-Time Season Totals now colors manager names, fixed
site-wide since that card is shared with every Season page, not Records-only. Hanh's bio first
paragraph rewritten per explicit dictation (one ambiguity flagged and resolved before applying).
Two real font-styling bugs fixed on the LEAGUE nav button (an inline `font: 'inherit'` was silently
overriding the shared `.timeline-year` class's size/weight; fixing that surfaced a second,
narrower `font-family` mismatch from the browser's own default button styling) — confirmed via
direct computed-style measurement, not just visual inspection. "TNCFL Record Book" label removed
from above the LEAGUE/year nav list. `ROADMAP.md`'s Milestone 16 header corrected from a stale
"IN PROGRESS" to "DONE" (the body already said complete; the header was never updated). See
`SESSION_LEDGER.md` Entries 75-79.

**Since the last zip (S027, same day):** Polish pass across the LEAGUE sub-pages, both catches from
the user against real references. League Records grid colors corrected to match the old hub's real
`data-color` scheme exactly (4 cards had never had color applied; the other 5 had it on the wrong
element — the sub-line instead of the big number). And a repeat of the hero-essay `max-width` bug
from Entry 68: 3 more components (`H2HDuelPicker`, `ManagerProfileCard`'s bio,
`HowLeagueWorks`) had unrequested inner width caps not present in the old hub's real CSS; removed,
confirmed all 5 LEAGUE pages now share the same ~1192px inner content width. See
`SESSION_LEDGER.md` Entry 74.

**Since the last zip (S026, same day): Milestone 17 is DONE.** All 5 LEAGUE sub-pages now have real
content — Records gained a locked 3×3 stat grid plus 5 new panels (Cumulative Competence Chart,
All-Time Highest/Lowest Single Week Score, All-Time Longest Drought, All-Time Season Totals — the
last two just reuse the existing `AtdrCard.tsx`/`SeasonTotalsCard.tsx` from season pages, not new
builds), and Head-to-Head + How Our League Works were built from scratch (`h2h` typed and
cross-verified; the H2H matrix/duel picker are the first H2H components in this app; the How League
Works accordion had every numeric claim checked against real data before porting). `LeagueComingSoon.tsx`
is deleted — nothing left as a placeholder. One real correction mid-build: my first pass at the
Cumulative Competence Chart drifted from the real per-season `CompetenceChart.tsx` (wrong emoji,
missing legend, placeholder medal icons in the sandbox) — user caught it, fixed to match exactly.
See `SESSION_LEDGER.md` Entries 70-73 for full detail.

**Since the last zip (S025, same day):** Milestone 17 grew substantially — a new standalone
`league-sandbox.html` dev tool (delivered separately, same precedent as `nugget-panel/index.html`,
not part of this zip) was used for fast trophy-cabinet iteration: several rounds of spacing/sizing
tuning (final: 561px card, 225px/375px coverflow offsets, 250px/100px tiered neighbor sizes,
0.25/0.1 opacity), a new lens-flare transition animation, and a caption format change to "N
title(s): every year won so far". The Hall of Fame page was narrowed to trophy cabinet + hero essay
only (`HeroEssay.tsx`, ported with 2 real fixes — a stale stat and an unrequested width cap); the
other old-hub sections split into a new **Records** sub-page (`Records.tsx`, stub only), and the
LEAGUE nav grew to 5 links. Manager Profiles was built in full: `career`/`streaks_at_1` typed, 18
confirmed 2-paragraph bios (`managerBios.ts` — drafting them against real data caught 3 factual
errors before lock-in), a ported avatar generator (`ManagerAvatar.tsx`), and a complete profile
card with URL-driven manager selection (`/league/profiles/:manager`). Everything re-verified with
the real headless Chromium at each step — see `SESSION_LEDGER.md` Entries 67-69 for full detail.

**Since the last zip (S023, same day):** Milestone 17 (League/Hall of Fame) started for real —
first with design-only decisions (trophy cabinet spec, LEAGUE nav shape, scope), then actual code.
Built: `computeTrophyCabinet.ts`, `TrophyCabinet.tsx`/`.module.css` (400px card, framer-motion
coverflow, real `payouts`-derived data), `HallOfFame.tsx` (landing page), `LeagueComingSoon.tsx`
(stub for the 3 undesigned League sub-pages), plus `/league/*` routes in `App.tsx` and an
expandable "LEAGUE" entry in `TimelineRail.tsx`. Full production build verified clean, AND — new
this session — actually rendered and screenshotted with a real headless Chromium (see below):
card measures exactly 400px, nav expand/collapse and year-stepping all confirmed against real
data. Also discovered `ROADMAP.md`'s Milestone 17 bullets were incomplete: the old hub's Hall of
Fame page has 5 sections (trophy cabinet + a 9-card animated stat grid + a hero essay + a
Season-by-Season timeline + All-Time Top Scores/Reigns at #1), and only some of those were ever
written into the roadmap. Only the trophy cabinet is built; the other 4 are explicit
not-yet-built placeholders, not fabricated content. See `SESSION_LEDGER.md` Entry 65.

**Since the last zip (S022, same day):** `NuggetGrid.tsx` gained auto-stretch — panels now fill dead
space below them (capped by the nearest overlapping panel in every column they span), ported
directly from the `nugget-panel-sandbox` tool. This **supersedes** Milestone 20's own
"no auto-stretch, dead space accepted" tradeoff note from earlier the same day — the sandbox had
been applying this stretch the whole time during Final Layout authoring, so that earlier note
didn't reflect what was actually being authored against. Confirmed with the user before applying.
Full production build re-verified clean (zero errors, 501 modules) after the swap; no other file
touched. See `SESSION_LEDGER.md` Entry 64.

**Since the last zip (2026-09-06):** the nugget layout system was rebuilt entirely. A standalone
authoring tool (`nugget-panel/index.html` — not part of the shipped site) was built for hand-tuning
nugget layouts outside the dev-server loop, which led to the user's explicit decision to retire the
old `cells`/`stack`/`stackWidth` CSS-grid model for good, replacing it with a flat authored-pixel-
position model (`colStart`/`colSpan`/`top`/`ownHeight`) matching that tool exactly.
`NuggetGrid.tsx` was rewritten around absolute positioning, `parseGridCells.ts` was deleted, and
`site_data.json`'s `nuggets` section was fully replaced (both copies) from the user's own
hand-arranged layout — all 15 years, 169 entries. Along the way, a full content pass added a new
"Chances of a Champion" mathematical-clinch nugget to every year (5 of 15 champions were genuinely
locked in before the season ended) and brought every year's champion "By the Numbers" recap to one
consistent template. Full production build verified clean. **Because the positioning model changed
completely, every season's nugget section now needs the same kind of fresh visual review 2011 got
under Milestone 15** — this is new, unreviewed territory on top of the standing no-screenshot gap,
not just unreviewed content on an already-proven template. See `ROADMAP.md` Milestone 20 and
`SESSION_LEDGER.md` Entries 61-63 for full detail.



- **Project folders (user's machine):**
  - **Local working copy (actual dev happens here):** `D:\Websites\TNCFL Record Book` — this is
    where `npm install` / `npm run dev` / editing happens. Network shares are unreliable for
    `node_modules` and for Vite's file-watching (HMR), so local disk is the working copy.
  - **Network archive (official/backup copy, not for active dev):**
    `\\10.0.0.198\UG_Websites\Websites\TNcFL Record Book` — periodically synced from session zips;
    never run `npm install`/`npm run dev` from here directly.
- **Status:** 🟢 **The template is locked and Milestone 16 (rollout) is COMPLETE.** 2011
  (Milestones 0-15) is the confirmed, formally-reviewed template — every component, layout
  position, and behavioral decision from that build is reusable as-is for every other season; only
  a season's own recap/dance/nugget prose needs fresh authoring (already present in
  `site_data.json` for all 15 years). **All 15 seasons (2011-2025) are now live** in the sidebar,
  rolled out across 5 batches, each independently verified against the engine (see
  `SESSION_LEDGER.md` Entries 46-55) — zero code changes were needed for any of the 14 seasons
  rolled out after 2011, including real-data edge cases (exact-score HMOTW ties in
  2012/2013/2014/2016/2019/2020; DHMOTW's 2.0 tally credit activating for real in 2018,
  hand-verified against every eligible week; a manager returning after 5 years inactive in 2019;
  18-week seasons starting 2021 vs 17 every prior year; a manager name with an apostrophe (D'lyn,
  2020); decimal/non-integer scores starting 2021 — all confirmed handled correctly by existing
  code with zero fixes needed). **2025's nuggets turned out to contain the real hub's own complete
  "All-Time Season Totals" leaderboard (146 real entries, authored as a collapsed HTML block) —
  cross-checked all 146 against `computeSeasonTotals`'s own client-side derivation for the full
  15-season range: zero mismatches**, the strongest verification any feature got this session.
  Along the way, a handful of real, already-shipped bugs were caught from the user's own
  screenshots and fixed: ATDR/Season Totals had no row cap at all (2014-2016 rendered 37-60 rows
  unbounded) — now both cap to a shared height (ATDR's own 15-entry height is the reference;
  Season Totals just consumes it), scrollable to the real top 50; Drought Bars was scaling each
  active manager's bar against the max drought across ALL managers ever (including long-departed
  ones), not just active managers, understating bars for years with a big gap between an active
  and a departed manager's drought (2015, 2016) — now scales against active managers only, matching
  the real hub exactly. The ≥200 score-cell pill was meant to gate to 2017+ only but never did —
  user's locked call was to keep it ungated for consistency across every season (not a bug; see
  `ROADMAP.md`'s Milestone 4 note). Milestone 9 (simplified — a 2-state All Managers/Money Circle
  toggle plus a separate click-to-pin system, not the hub's full filter bar) and Milestone 12 (H2H
  matrix — CANCELLED, "doesn't provide meaningful context") are both resolved. `lib/lockedYears.ts`
  lists all 15 seasons (drives `SeasonHero`'s per-season "reviewed" badge); `Layout.tsx`'s
  temporary rollout-staging filter has been removed, now renders `data.meta.years_desc` directly.
  Full per-milestone build/verification detail lives in `ROADMAP.md` and `SESSION_LEDGER.md` — this
  section intentionally stays a summary, not a duplicate log.
- **Next concrete step:** Milestone 16 (season rollout) and Milestone 20 (nugget system rebuild)
  are both done — there's no next batch, but the nugget positioning model changed completely under
  Milestone 20 with zero visual confirmation yet. The single most valuable thing left to do is a
  **real screenshot-based visual pass**, now covering both the standing 2014-2025 gap AND every
  season's brand-new nugget layout (including 2011, since even the locked-template season now
  renders through the new positioning system). That should be the first thing done in any future
  session on this project, before any further nugget content work. Beyond that, whatever the user
  wants to tackle next — polish passes, new features, or the post-RB plan (Hanh's Chord Book
  rebuild).
- **React project:** `tncfl-record-book/` (in this project's zip) — the real, current source. Run
  `npm install && npm run dev` from the LOCAL working copy above, not from this zip's extracted
  location directly (though that works too, it's just not where you should keep developing).
- **Carried-over live site:** `TNCFL_hub.html` + `site_data.json` + logos + PWA files — this is
  the OLD (pre-facelift) site, still data-complete for all 15 seasons (2011–2025) and still the
  thing to check the React rebuild's numbers against. Its filename and visual design are NOT the
  new target.
- **Rebuild plan:** see `ROADMAP.md`. Template locked on 2011 (Milestones 0–15), now rolling out
  forward one batch of seasons at a time (Milestone 16) — never all remaining seasons at once.

---

## File Map

| File | Purpose |
|------|---------|
| `SKILL.md` | Record Book working method + rebuild mandate + status |
| `SESSION_LEDGER.md` | Locked change log — every session's entries, this project only |
| `README.md` | This file — resume prompt and orientation |
| `tncfl-record-book/` | The REAL React+Vite+TypeScript project — current source, template locked through Milestone 15, rolling out 2012+ under Milestone 16. `npm install && npm run dev` to run it. |
| `TNCFL_hub.html` | Carried-over OLD site (18 modules, 15 seasons, engine-verified) — reference/current live version until replaced season-by-season |
| `site_data.json` | Generated data feed both the old site and the new React app read — never hand-edit; regenerated by the pipeline described in `tncfl-hmotw-engine` |
| `header_logo.png`, `salary_logo.png`, `h2h_logo.png` | Logo assets used by the old site (and likely reusable in the redesign) |
| `manifest.json`, `sw.js`, `icon192.png`, `icon512.png`, `icon_generator.py` | PWA install support carried over from the old site |
| `server.py` | Local server that serves the hub + its `/api/data` endpoint (ESPN-proxy parts of this file belong to the 2026 Tracker project, not this one) |
| `ROADMAP.md` | Milestone-by-milestone build plan for the React/Vite rebuild, with React/Vite learning tips per milestone |
| `TNCFL_Scope.html` | Living product-overview doc — describes the OLD hub; needs a rebrand/update pass once the new template is locked |
| `TNCFL_TechRef.html` | Living dev-reference doc — describes the OLD hub's architecture; same update-pending note |

---

## Resume Prompt

Paste this to start the next session:

```
Continuing work on the TNCFL Record Book (the standalone archive redesign, split off from the
main TNCFL project on 2026-09-04). Read all .md files to get caught up.

Project folder on my machine (LOCAL working copy, do all npm install/dev/editing here):
D:\Websites\TNCFL Record Book
Network archive copy (backup/official only, never run npm from here):
\\10.0.0.198\UG_Websites\Websites\TNcFL Record Book

Status: the template is LOCKED (Milestones 0-15, proven and formally reviewed on 2011 only) and
Milestone 16 (rollout) is COMPLETE — all 15 seasons (2011-2025) are live in the sidebar as of this
zip (batches 1-5), each independently verified against the engine with zero code changes needed.
Batch 3 (2017-2019) exercised DHMOTW activating for real (hand-verified) and a manager (Bao)
returning after 5 years inactive. Batch 4 (2020-2022) exercised 18-week seasons (vs 17 every prior
year), a manager name with an apostrophe (D'lyn), and decimal/non-integer scores for the first
time. Batch 5 (2023-2025) found the real hub's own complete "All-Time Season Totals" leaderboard
(146 real entries) hidden in 2025's nuggets and cross-checked it against computeSeasonTotals's own
derivation for the full 15-season range — zero mismatches, the strongest verification any feature
got. All confirmed handled correctly by existing code with zero fixes needed. A few real,
already-shipped bugs were also caught from the user's own screenshots along the way and fixed:
ATDR/Season Totals had no row cap at all, now both cap to one shared height with a scroll to the
real top 50; Drought Bars was scaling bars against the max drought across ALL managers ever (not
just active ones), understating some seasons' bars — now matches the real hub exactly. The ≥200
score-cell pill's pre-2017 gate was never implemented — user's locked call: keep it ungated across
every season. All of this session's verification was data-level/build-level only, no
headless-browser access — a real screenshot pass across 2014-2025 is the top priority for whoever
picks this up next, before new feature work. Milestone 9
(simplified — a 2-state All Managers/Money Circle toggle, plus a separate click-to-pin system) and
Milestone 12 (H2H matrix, CANCELLED) are both resolved. See SESSION_LEDGER.md for full per-entry
build/verification detail,
ROADMAP.md for the milestone-by-milestone plan, and SKILL.md's Status
section + Design direction section for the locked template spec (what's template vs. what must
come from each season's own real data).

Rebuild sequencing rule: template locked first (Milestones 0-15, proven on 2011 only), then
forward a few seasons per session (Milestone 16) — never all remaining seasons at once. Watch for
real edge cases the template hasn't seen yet (a manager who only played part of a season, three+
managers tied in one week, etc.) and stop to ask about those rather than silently handling them.

Data rule: every number on the site must be derived from the verified engine
(hmotw_engine_aidf / tncfl-hmotw-engine) — never hand-typed. Only prose is hand-written (and
already exists in site_data.json for all 15 seasons — Milestone 16 is "plug the data through the
locked template," not new content authoring).

Post-RB plan: Hanh's Chord Book is the next candidate for a React/Vite rebuild (same single-file/
custom-build-script architecture as the old hub had). 2026 Tracker is architecturally similar but
lower priority — it's live mid-season right now.

This project does NOT include the 2026 season tracker, its rules doc, or the Cloudflare Worker —
those stay in the original TNCFL project.

UPDATE as of 2026-09-08 (Milestone 20, DONE): the nugget layout system was rebuilt entirely. The
old `cells`/`stack`/`stackWidth` CSS-grid model is retired for good — replaced by a flat authored-
pixel-position model (colStart/colSpan/top/ownHeight) matching a new standalone authoring tool
(nugget-panel/index.html, not part of the shipped site) built specifically for hand-tuning layouts.
NuggetGrid.tsx rewritten around absolute positioning; parseGridCells.ts deleted; Nugget type
changed accordingly. Three explicit tradeoffs confirmed with the user: fixed 1200px width (was
fluid/responsive), no auto-stretch (exact authored heights, dead space now possible), fixed height
not min-height (clipping risk accepted, paired with overflow:hidden). site_data.json's nuggets
section fully replaced both copies, all 15 years, 169 entries, from the user's own hand-arranged
layout. A full content pass also added a "Chances of a Champion" mathematical-clinch nugget to
every year (5 of 15 champions were genuinely locked in before the season ended, all with exactly 1
week to spare) and brought every year's champion recap to one consistent template. Full production
build (npm run build) verified clean.

Because the positioning model changed completely, every season's nugget section needs the same
kind of fresh visual review 2011 originally got under Milestone 15 — this is new, unreviewed
territory now, not just unreviewed content on an already-proven template. **Headless-browser access
resolved (see SESSION_LEDGER.md Entry 65)** — a real Chromium is now available in-session, confirmed
working (used to measure the old hub and to verify the new Milestone 17 trophy cabinet render). No
season has still ever been visually screenshotted under the new nugget model, though — that
review pass is no longer tooling-blocked, but is still not done. This should be the first thing
done next session, before any further nugget content work.
```

---

## Stop Protocol (run at end of every Record Book session)

1. Append new entries to `SESSION_LEDGER.md`.
2. Update the resume prompt above and the "Current State" section if anything materially changed.
3. Update `SKILL.md` with any newly locked rules or template decisions.
4. Build ONE combined zip, freshly, containing the current set of Record Book project files
   (`SKILL.md`, `SESSION_LEDGER.md`, `README.md`, the site file(s), `site_data.json`, logos, PWA
   files, `TNCFL_Scope.html`, `TNCFL_TechRef.html`).
5. Filename convention: `S0XX_YYYY-MM-DD_TNCFL_RecordBook.zip` — same pattern as the original
   TNCFL project's zips (`S0XX_YYYY-MM-DD_TNCFL_Tracker.zip`), just with `RecordBook` as the
   trailing label instead of `Tracker`. No extra prefix before `S0XX`. `XX` increments from the
   last Record Book zip seen (this is a NEW, separate numbering sequence from the original TNCFL
   project's `S0XX` zips — don't share the counter; this project started at `S001`).
6. Always provide the zip at every stop.
7. If a full site rebuild file exists by then, also deliver it standalone alongside the zip.
