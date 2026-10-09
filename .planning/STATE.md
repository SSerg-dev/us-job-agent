# Project State

Updated 2026-10-09. Development paused for today at the user's explicit request; server remains running. No new implementation until the user resumes.

## Current Position
Plan 01-01 complete: manual English vacancy intake, independent local storage and saved list/detail. User explicitly accepted the current scenario: "Сценарий меня вполне устраивает." See phases/01-saved-vacancy-workflow/01-01-SUMMARY.md. Phase 1 is 1/2 plans complete; plan 01-02 is not started.

## Verification
10 server/domain/storage tests, 5 Angular UI tests and 1 real browser/restart test passed. Strict frontend/server type checks and production build passed. Restart persistence has automated evidence; no separate manual restart session is claimed. Last unavailable-card fix passed regression, types and build.

## Git
Production snapshot: 741f2ba. User explicitly requested a closing acceptance documentation commit; inspect git log for its hash. No push requested. Source, lockfile, tests and planning are tracked; databases, secrets, generated .codex tools, dependencies and build output are excluded.

## Continuation
Read usage and check US server health after a new continuation request, then execute 01-02: conservative extraction/correction of title, employer, location, work format and salary. Do not ask again for the resolved manual-tracer acceptance. Matching and letters remain later phases. INT-01, INT-03 and LOCAL-01 complete; INT-02 pending.

## Running Application
Exec session 23915 owns US dev runner, UI http://127.0.0.1:4320/vacancies and API 4321. Recheck before assuming it survived a restart. Start.ps1 selects bundled Node 24.19.0 without changing system Node. Storage: this project's data/agent.sqlite. HH code and servers were not changed.

## Decisions and Reserve
Angular/Tailwind, local Node/SQLite, independent TypeScript domain. English product, manual intake first, no site automation, applications or external AI. Independent local GSD 1.15.0; sequential inline work with inherited model. No automatic commits or subagents.
Latest reading before closing commit: 48% five-hour and 66% weekly remaining. Warn at 40%, stop initiating implementation at 30%; recheck on resume. New folder is outside this chat's writable roots, so writes require scoped approval.
