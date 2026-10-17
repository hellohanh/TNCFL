# TNCFL Record Book — Resume Reference

> **How to start a session:** upload the latest `S0XX_…_TNCFL_RecordBook.zip` (or just name the
> repo) and say "read the .md files and get caught up." Claude reads `SKILL.md`,
> `SESSION_LEDGER.md` (newest entries first), this file, and `ROADMAP.md`'s status table — then
> attaches `hellohanh/TNCFL` with push access before changing anything.

This is the **TNCFL Record Book (RB)** project — the all-time archive site (2011–present) for the
Thursday Night Curse Fantasy League, split off from the original combined TNCFL project on
2026-09-04 so the archive redesign and the live 2026 season tracker no longer share files. The
2026 Tracker, its rule doc, and the Cloudflare Worker stay in the original TNCFL project (the
tracker is published separately from the `TNCFL_TRACKER` repo) — this project never touches them.

---

## Current State (as of 2026-10-16, S040 → Entry 86)

- **Live site:** https://hellohanh.github.io/TNCFL/ — React 19 + Vite + TypeScript, deployed by
  GitHub Actions on every push to `main` (~1–2 min to live). Installable as a PWA.
- **Seasons:** all 15 (2011–2025) live on the template locked on 2011, each verified against the
  engine. Zero code changes were needed for any season after 2011.
- **LEAGUE section:** all 5 sub-pages built with real data — Hall of Fame (trophy cabinet + hero
  essay), Manager Profiles (18 confirmed bios, avatars, `/league/profiles/:manager`), Records,
  Head-to-Head (matrix + duel picker), How Our League Works.
- **Scroll animation:** FleaFlicker (FF2, 18-frame flea-flicker play diagram with fireworks on the
  TD) plays between the recap and scoreboard of the **latest season only** (2025 today). The old
  `FootballTransition` was deleted 2026-10-16.
- **Mobile (≤820px):** the rail is replaced by a yellow handle on the left edge that opens a tab
  drawer — the Tracker's mobile treatment, mirrored left.
- **Nav rail (desktop):** LEAGUE (expandable) → "2026 ↗" external tracker link → years 2025…2011.
- **Milestones:** 0–18, 20 and 21 done; 12 cancelled; **19 (polish pass) started** (mobile drawer done). See the
  status table at the top of `ROADMAP.md`.
- **Most recent work:** direct GitHub push workflow set up (Entry 82); `FootballTransition` deleted
  (Entry 83); 200+-point streak analysis (Entry 84); docs brought current and a stray duplicate
  lockfile removed (Entry 85); mobile left-handle drawer + FleaFlicker on latest season only (Entry 86).

**Next concrete step:** the **screenshot-based visual review of every season's nugget section**
under the Milestone 20 pixel-position model (2011 included). Headless Chromium has been available
since Entry 65, so nothing blocks it — it has just never been done. Do this before any further
nugget content work. After that: Milestone 19 polish, new features, or the post-RB plan (Hanh's
Chord Book rebuild).

**Open housekeeping calls (Hanh's decision):**
- `public/football/football-1…5.png` (~2.8 MB) are unused since `FootballTransition` was deleted but
  still ship in every build.
- `TNCFL_Scope.html` / `TNCFL_TechRef.html` (living docs about the old hub) aren't in the repo —
  find or retire them.

---

## Working setup

- **Source of truth:** GitHub repo `hellohanh/TNCFL` (alias `hellohanh/tncfl`), branch `main`.
  Claude clones it into the cloud session (`/home/claude/tncfl`), commits and pushes directly;
  GitHub Actions builds and deploys. No manual git or zip placement needed on Hanh's end.
  Commit identity: `Hanh <hello.meetho@gmail.com>`.
- **Local copy (optional, Hanh's machine):** `D:\Websites\TNCFL Record Book` — `git pull` to sync
  before running `npm install` / `npm run dev` locally. Hanh uses Windows PowerShell for this.
- **Network archive (backup only):** `\\10.0.0.198\UG_Websites\Websites\TNcFL Record Book` — never
  run npm from here.
- **Before pushing:** `npx tsc --noEmit` (or `tsc -b`) + `npm run build` must be clean. CI uses
  `npm ci`, which fails on any lockfile mismatch that a local `npm install` would quietly repair.

---

## File Map (repo root)

| Path | Purpose |
|------|---------|
| `SKILL.md` | Record Book working method, locked rules, current status |
| `SESSION_LEDGER.md` | Locked change log — every session's entries, this project only |
| `README.md` | This file — orientation, resume prompt, stop protocol |
| `ROADMAP.md` | Milestone-by-milestone build plan with a status table at the top and 🎓 React/Vite learning notes |
| `.github/workflows/deploy.yml` | Push to `main` → `npm ci` + `npm run build` → deploy `tncfl-record-book/dist` to GitHub Pages |
| `tncfl-record-book/` | **The real app.** React + Vite + TypeScript source. `src/components/` holds every page/panel; `public/` holds `site_data.json`, logos, fonts, trophies, icons, `404.html` (deep-link redirect) |
| `tncfl-record-book/public/site_data.json` | **The only data file the app reads.** Numbers come from the engine pipeline (`tncfl-hmotw-engine`); only prose (recaps, nuggets, dance) is hand-authored |
| `docs/` | Old hub copy (`TNCFL_hub.html`, `site_data.json`, logos, PWA files, plus a copy of the 2026 tracker). No longer served — Pages deploys from the Actions build. Reference only |
| `tncfl/` | Old hub source copy (`TNCFL_hub.html`, `site_data.json`, logos, PWA files, `server.py`). Reference only — still the thing to check the React app's numbers against. Its `site_data.json` (same as `docs/`) is a frozen pre-Milestone-20 snapshot; don't sync new data into it |

---

## Resume Prompt

Paste this to start the next session:

```
Continuing work on the TNCFL Record Book (the standalone archive site, split off from the main
TNCFL project on 2026-09-04). Read all .md files to get caught up.

Repo: hellohanh/TNCFL (branch main) — attach it with push access, work from a cloud clone, commit
and push directly. GitHub Actions builds and deploys to https://hellohanh.github.io/TNCFL/.
Optional local copy on my machine: D:\Websites\TNCFL Record Book (git pull before npm run dev).

Status as of 2026-10-16 (Entry 85): all 15 seasons (2011-2025) live on the locked 2011 template;
all 5 LEAGUE sub-pages built; deploy pipeline + PWA done (Milestone 18); FleaFlicker FF2 scroll
animation live (Milestone 21), old FootballTransition deleted. Milestone 19 (polish) not started.

Top priority: screenshot-based visual review of every season's nugget section under the
Milestone 20 pixel-position model — headless Chromium is available, it just hasn't been done.

Data rule: every number on the site is derived from the verified engine (tncfl-hmotw-engine) —
never hand-typed. Only prose is hand-written.

Post-RB plan: Hanh's Chord Book is the next React/Vite rebuild candidate.

This project does NOT include the 2026 season tracker, its rules doc, or the Cloudflare Worker.
```

---

## Stop Protocol (run at end of every Record Book session)

1. Append new entries to `SESSION_LEDGER.md` (next number after the last one; use lettered
   entries like `81a` only for after-the-fact backfills).
2. Update this file's Current State and resume prompt if anything materially changed.
3. Update `ROADMAP.md`'s status table and any milestone headers that changed.
4. Update `SKILL.md` with any newly locked rules or template decisions.
5. Verify a clean build, then commit and push to `main` (docs and code together). Confirm the
   Actions deploy succeeded.
6. Also build a snapshot zip of the repo (excluding `.git` and `node_modules`) for the next
   session's upload: `S0XX_YYYY-MM-DD_TNCFL_RecordBook.zip`. `XX` continues this project's own
   sequence (last: **S040**, 2026-10-16 → next is **S041**). Never share the counter with the
   original TNCFL project's `…_TNCFL_Tracker.zip` sequence.
