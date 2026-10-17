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

## Current State (as of 2026-10-17, S042 → Entry 118)

- **Live:** https://hellohanh.github.io/TNCFL/ — React 19 + Vite + TypeScript, deployed by GitHub
  Actions on every push to `main` (~1 min). Installable as a PWA. **Push only when Hanh says "push."**
- **Seasons:** all 15 (2011–2025) on the locked 2011 template. **LEAGUE:** all 5 sub-pages built.
- **Mobile (≤820px, Galaxy S25 is the reference phone) — done 2026-10-16/17 (Entries 86–113):**
  - Left-edge yellow handle drawer replaces the rail (Tracker's drawer, mirrored); tapped tab
    highlights instantly; header shrinks to fit; no bottom dead space on any tab.
  - Every tab tuned: Hall of Fame trophy cabinet (one trophy, glide, swipe), Manager Profiles stats
    (2 + 3), Records (3×3 grid, top-15 lists, legend handle), Head-to-Head (matrix flipped, duel
    table fits), How Our League Works (two-line titles).
  - Season pages: Hanh's per-section Keep / Flip / Stack choices, Records-tab treatment for the
    records panels. **Flip** = drawn sideways (`RotateOnPhone`), every flipped panel the same
    turned height, no dead space. FleaFlicker animation off on phones.
  - Speed: sections build as you scroll near them; tab taps respond in ~0.4s (Records ~1.4s at
    4× slowdown — open issue).
- **Desktop:** FleaFlicker plays on the latest season only (2025). Duel Picker win counts in
  manager colours and avatars in the Finish header; H2H name column = longest name + 20px.
- **Milestones:** 0–18, 20, 21 done; 12 cancelled; 19 (polish) in progress. See `ROADMAP.md`.

**Open issues:** the Entry 114 catalog was worked through with Hanh in Entries 115–117 — the only
item still open is Milestone 19 polish (code splitting, reduced-motion, contrast/keyboard), deferred.

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
| `TNCFL_Scope.html` / `TNCFL_TechRef.html` | Living docs (rewritten 2026-10-17, Entry 117): product scope, and developer reference for the current React app — update when a change materially affects their facts |
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
locally, and push ONLY when I say "push" (every push deploys live via GitHub Actions to
https://hellohanh.github.io/TNCFL/). Optional local copy: D:\Websites\TNCFL Record Book.

Status as of 2026-10-17 (Entry 118): all 15 seasons + all 5 LEAGUE pages built; full mobile pass
done (Galaxy S25 is the reference phone — emulate 360x780, 3x, touch): left-edge handle drawer,
every tab tuned, season pages per my Keep/Flip/Stack choices with equal-height flipped panels, and a
speed fix for tab taps. Open-items pass done (Entries 114–117); only Milestone 19 polish
(code splitting, reduced-motion, contrast/keyboard) remains, deferred.

Ways of working: show me a rendered preview (S25 screenshots, turned views for flipped panels)
before I lock anything; ask questions as tappable choices, one at a time.

Data rule: every number on the site is derived from the verified engine (tncfl-hmotw-engine) —
never hand-typed. Only prose is hand-written.

This project does NOT include the 2026 season tracker (TNCFL_TRACKER repo), its rules doc, or the
Cloudflare Worker.
```

---

## Stop Protocol (run at end of every Record Book session)

1. Append new entries to `SESSION_LEDGER.md` (next number after the last one; use lettered
   entries like `81a` only for after-the-fact backfills).
2. Update this file's Current State and resume prompt if anything materially changed.
3. Update `ROADMAP.md`'s status table and any milestone headers that changed.
4. Update `SKILL.md` with any newly locked rules or template decisions.
5. Verify a clean build and commit. **Push to `main` only after Hanh says "push"** (every push
   deploys live). After an approved push, confirm the Actions deploy succeeded.
6. Also build a snapshot zip of the repo (excluding `.git` and `node_modules`) for the next
   session's upload: `S0XX_YYYY-MM-DD_TNCFL_RecordBook.zip`. `XX` continues this project's own
   sequence (last: **S042**, 2026-10-17 → next is **S043**). Never share the counter with the
   original TNCFL project's `…_TNCFL_Tracker.zip` sequence.
