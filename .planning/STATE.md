# Project State

Updated 2026-10-10. User accepted field review with "it is OK" and requested "next wave". Phase 1 is complete with 2/2 accepted plans. Next: discuss candidate source/import for phase 2 before detailed planning or implementation.

## Current Position
Plans 01-01 and 01-02 accepted. Local Review fields, evidence excerpts, manual correction, replacement confirmation, saved-card metadata updates and revision conflicts are implemented. See phases/01-saved-vacancy-workflow/01-02-SUMMARY.md. INT-01, INT-02, INT-03 and LOCAL-01 complete; twelve requirements remain pending.

## Verification
25 server/domain/storage tests, 7 Angular UI tests and 3 real Edge browser tests passed during implementation on 2026-10-10. Strict frontend/server types, production build and git diff --check passed. Browser tests exercise corrected fields after page reload and actual restart of a disposable test server. Source CRLF preservation and schema-1 migration/reopen are covered by server tests; native browser textareas normalize newlines. User acceptance is recorded; a separate manual restart or manual execution of every synthetic case is not claimed. Tests were not rerun for documentation-only closure.

## Running Application
US dev runner launched in exec session 65617, UI http://127.0.0.1:4320/vacancies and API 4321. Recheck health before assuming it survives later sessions. Local storage remains data/agent.sqlite; startup migrates version-1 payloads transactionally to evidence schema version 2. HH servers were not stopped or changed.

## Decisions and Limits
English Angular/Tailwind, local Node/SQLite, independent TypeScript domain, local GSD 1.15.0 and inline sequential execution. Extraction intentionally requires supported explicit English labels; unlabeled headings and incidental prose are not guessed. Currency and period are never inferred from a US location or dollar sign. No fetching websites, external AI, matching, letters or applications were added.

Latest usage reading at start of acceptance closure: 69% five-hour and 60% weekly remaining. Five-hour resetsAt 1791630346, weekly resetsAt 1791970509 (Unix seconds). Preserve 30% in each window; recheck before substantial continuation. These shared limits are not exact token counts.

## Git and Continuation
Existing commits 741f2ba and 685f196 retained. Current implementation is uncommitted; no commit or push was requested today. User-approved project folder lies outside this chat's writable roots, so scoped writes and commands used escalation. Temporary patch staging is under the HH ignored .runtime directory; no HH source or private data was copied into US.

Next: clarify which English candidate documents/text may be explicitly imported and the initial import format. Do not assume current permission to reuse HH candidate files or invent skills from prior chat. Preserve approved US-wide relocation, office/hybrid, no Tech Lead, no salary filter and user-reported Green Card boundaries. Then create phase-2 context and research/plans for source-backed candidate facts and explainable selection. No phase-2 implementation yet; no automatic commits, branches, subagents or model changes.
