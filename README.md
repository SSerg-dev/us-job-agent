# US Job Agent

Local English vacancy intake and storage. First tracer implementation: paste text and source URL, enter reviewed fields, save and reopen. Automatic extraction, candidate matching and cover letters are not implemented yet.

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

Saved cards are read-only in this first tracer. Field extraction and saved-card editing belong to plan 01-02, after acceptance of this tracer. Test fixtures are synthetic and use temporary databases. No private candidate facts or HH database were copied.

## Development
Angular UI in `src/app`, independent rules in `src/domain`, local API and SQLite adapter in `src/server`. Database migration version 1 is transactional inside the adapter (no separate SQL-file deployment). Built-in `node:sqlite` is release-candidate stability in Node 24.19.0, isolated behind the adapter. Locally installed GSD Core 1.15.0 in `.codex`; no automatic Git commits. Planning and acceptance status are in `.planning/STATE.md`.
