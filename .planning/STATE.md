# Project State

## Project Reference
See PROJECT.md (updated 2026-10-09).
Core value: factual English letters connected to the tasks of each vacancy.

## Current Position
Development paused for today at the user's request after a small error-state fix. Server remains running. Do not resume implementation until the user asks.
Project, requirements and roadmap approved. Plan 01-01 implementation built; 10 server/domain/storage tests, 5 Angular UI tests and 1 real browser/restart test passed; strict type checks and production build passed. Awaiting human tracer checkpoint before plan 01-02. User explicitly authorized the final local commit on 2026-10-09; use git log to verify the resulting snapshot. No push requested. See phases/01-saved-vacancy-workflow/01-01-CHECKPOINT.md.

## Decisions
Separate project at D:/projects-ai/_devin/us-job-agent. Angular/Tailwind, local Node/SQLite, independent TypeScript domain. English product; manual intake first; no scraping, sending or external AI. Sequential inline GSD; no automatic commits.

## Continuation
1. User checks http://127.0.0.1:4320/vacancies: add, manually fill, save and reopen a vacancy. Restart only the US dev server if requested for manual persistence verification.
2. Record explicit tracer acceptance, then write 01-01-SUMMARY.md and consider 01-02. No automatic continuation past the human checkpoint.
3. Keep selection and letters for later phases. No phase or requirement marked accepted yet.
4. Independent local GSD installed from cached Core 1.15.0. Continue inline with the current model; no subagents or automatic commits.

## Running Application
Exec session 23915 owns US development runner, UI 4320 and API 4321. Start.ps1 is the user launcher (bundled Node 24.19.0); system Node is unchanged. SQLite defaults to the US project's data/agent.sqlite. HH application source and HH servers were not changed; implementation staging under HH .runtime is ignored and contains no private data.

## Usage Checkpoint
Last reading before end-of-day commit: 53% remaining in the five-hour window, 67% in the weekly window. Preserve 30% reserve; read usage again before the next substantial action.

## Final Small Step
Unavailable saved cards no longer display a false saved confirmation or an empty disabled form. Regression test added: Angular UI now 5/5 passed; strict Angular type check and production build passed. No plan 01-02 implementation started. End-of-day snapshot includes source, lockfile, tests and planning; databases, credentials, generated local .codex tooling, dependencies and build output are excluded. No automatic commits are authorized beyond the user's explicit final commit request.

## Blockers
No product blocker. New folder is outside the current chat's writable roots: publishing approved artifacts requires scoped filesystem approval.
