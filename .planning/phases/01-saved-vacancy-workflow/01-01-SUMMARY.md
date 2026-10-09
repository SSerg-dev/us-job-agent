---
phase: 01-saved-vacancy-workflow
plan: 01
subsystem: local-vacancy-intake
tags: [angular, sqlite, persistence]
requires: []
provides: [English manual intake, independent local persistence, saved list and detail]
affects: [01-02]
requirements-completed: [INT-01, INT-03, LOCAL-01]
---

# Plan 01-01 Complete

Delivered Angular 22.2.2/Tailwind 4.3.3 English intake, manual fields, exact source text/URL storage, loopback Node/SQLite API and saved list/detail. Unknown fields remain unknown. Unavailable cards no longer show a false saved confirmation. Windows launcher uses Node 24 without changing system Node.

## Evidence
- 10 server/domain/storage tests passed, including validation, Host/Origin checks and exact text preservation after reopen.
- 5 Angular UI tests passed, including unavailable-card behavior and draft preservation on failed save.
- 1 real Edge browser test passed: refresh, actual server-process restart on a temporary file-backed database, safe text rendering and no external requests.
- Strict frontend/server type checks and production build passed.
- User explicitly accepted the current manual scenario on 2026-10-09: "Сценарий меня вполне устраивает." Do not imply a separate manual restart session or acceptance of unimplemented extraction.

## Commits and Decisions
Production snapshot 741f2ba; this summary and acceptance are in the user-requested closing documentation commit (see git log). No push requested. Transactional schema version 1 lives in the storage adapter instead of a separately deployed SQL file. node:sqlite is release-candidate in Node 24.19.0 and isolated behind the adapter. Work/review was inline, not independent subagent verification.

## Next
Plan 01-02: conservative field extraction and correction; not started. Phase 1 remains incomplete. Development paused for today; server remains running. No source URL retrieval, LinkedIn credentials, private HH data copy, external AI or automatic applications.
