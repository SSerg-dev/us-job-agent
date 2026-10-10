---
phase: 01-saved-vacancy-workflow
plan: 02
status: complete
completed: 2026-10-10
requirements-completed: [INT-02]
key-files:
  created:
    - src/domain/normalize-vacancy.ts
    - tests/normalize-vacancy.test.ts
    - tests/vacancy-review.test.ts
  modified:
    - src/domain/vacancy.ts
    - src/app/vacancies/vacancy-form.ts
    - src/app/vacancies/vacancy-api.ts
    - src/server/app.ts
    - src/server/vacancy-store.ts
    - e2e/vacancy-persistence.spec.ts
---

# Plan 01-02: Conservative Field Review

## Delivered
Pure local English field extraction for explicitly labeled title, employer, location, work format and salary, with exact excerpts and unknown/ambiguous evidence. Explicit currency and pay period are preserved without default USD/year assumptions. Manual corrections can be saved on new and existing cards. Repeated review requires confirmation before replacing nonempty metadata; cancellation retains edits. Source changes invalidate displayed analysis.

Version-2 SQLite migration preserves existing source and reviewed values, marking legacy populated fields manual with no fabricated source excerpts. PUT accepts complete reviewed metadata and an expected revision only; original text and URL remain immutable. Missing or stale revisions yield 409, and UI errors retain attempted edits.

## Verification Evidence
During implementation on 2026-10-10: 25 server/domain/storage tests, 7 Angular UI tests and 3 Edge browser tests passed. Strict frontend/server type checks, production build and diff whitespace checks passed. Browser evidence includes corrected fields across page reload and actual owned test-server restart; migration and exact CRLF source preservation are tested server-side. Browsers normalize textarea newlines; browser comparisons use actual textarea input. Tests were not rerun for this documentation-only acceptance closure.

Human gate resolved by the user's "it is OK" followed by "next wave". This confirms acceptance of the current field-review scenario; no additional manual restart or explicit execution of every retained synthetic case is claimed.

## Deviations and Decisions
The migration remains inside the existing adapter instead of a separate SQL deployment asset. Browser coverage extends the existing test-server harness; server review/migration coverage uses a focused extra test file. No live LinkedIn retrieval, candidate data import, matching, letters, external AI or HH private data reuse was added.

## Git and Next Phase
Source and documentation remain uncommitted because no new commit was authorized. No branch, push or model change. Work performed sequentially inline; no independent subagent review is claimed. Phase 1 is 2/2 complete. Next: phase 2 candidate-source discussion, then research/planning for evidence-backed selection.
