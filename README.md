# US Job Agent

Local English vacancy intake, conservative field extraction and storage. Paste text and an optional source URL, review suggestions, correct fields, save and reopen. Candidate matching and cover letters are not implemented yet.

## Start on this Windows computer

In PowerShell:

```powershell
cd D:\projects-ai\_devin\us-job-agent
.\Start.ps1
```

Open http://127.0.0.1:4320/vacancies. Stop with Ctrl+C in that terminal. The launcher uses the available bundled Node 24 without changing system Node. If a port is occupied, it reports the conflict and does not stop another app. HH ports 4310/4311 are not used.

## Standard commands

With Node 24.15+ (tested with 24.19.0) selected in your shell:

```text
npm ci
npm run start
npm run typecheck
npm run build
npm run test:server
npm run test:ui
npm run test:e2e
```

Angular/CLI 22.2.2, Tailwind 4.3.3 and the dependency lockfile are included. Browser E2E tests currently use installed Microsoft Edge. On this computer you can also use `Start.ps1 -Mode build`, `-Mode test` or `-Mode serve`. Production serving requires a successful build and opens http://127.0.0.1:4321/vacancies. Development uses an API proxy; production UI/API are same-origin.

## Data and safety

Vacancies are stored in this project's `data/agent.sqlite`, independently of HH. The directory is created on first launch. Keep this database when restarting/updating; back it up with the app stopped. `US_JOB_DB` explicitly overrides its location for disposable tests. Original text and source URLs are stored, not fetched. No LinkedIn credentials, external AI, telemetry, applications or messages. Source text renders as text, not HTML. Unknown fields remain unknown; there is no salary filtering.

## Review fields

Click **Review fields** to suggest title, employer, location, work format and salary from explicitly labeled English lines. Supported labels include `Title:`, `Job title:`, `Company:`, `Employer:`, `Location:`, `City:`, `Work format:`, `Workplace type:` and `Salary:`. The evidence panel shows exact source excerpts and unknown/ambiguous status. Unlabeled headings and free-form descriptions are deliberately not guessed. Work-format phrases must be unambiguous; remote monitoring does not mean remote employment. `$` alone does not establish USD, and a US location does not establish an annual salary.

Correct suggestions before saving. Reviewing again asks before replacing nonempty fields; **Keep my fields** cancels without losing corrections. Saved cards support **Save changes** for metadata only. Original text and URL remain immutable. Revision checks reject outdated saves while retaining your edits. Evidence records distinguish reviewed suggestions from manual corrections. Test fixtures are synthetic and use temporary databases; no private candidate facts or HH database were copied.

## Development

Angular UI in `src/app`, independent rules in `src/domain`, local API and SQLite adapter in `src/server`. Database migrations through version 2 are transactional inside the adapter (no separate SQL-file deployment). Version-1 records retain their original fields and source; legacy fields are marked manual without fabricated excerpts. Built-in `node:sqlite` is release-candidate stability in Node 24.19.0, isolated behind the adapter. Locally installed GSD Core 1.15.0 in `.codex`; no automatic Git commits. Planning and acceptance status are in `.planning/STATE.md`.
