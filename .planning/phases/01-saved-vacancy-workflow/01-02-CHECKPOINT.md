---
phase: 01-saved-vacancy-workflow
plan: 02
status: accepted
updated: 2026-10-10
---

# Field Review Acceptance

## Implemented
- Pure normalizeVacancy(sourceText), suggestions and exact supporting excerpts for title, employer, location, work format and salary, including explicit currency/period.
- Unknown and competing evidence stay distinct; no unlabeled title/employer guess, implicit office inference or USD/year default.
- Review fields -> manual corrections -> POST/save -> reopen. Repeated review requires confirmation before replacing nonempty metadata; cancellation preserves corrections.
- PUT metadata changes with required expectedRevision and complete reviewed fields; immutable source text/URL, 409 on missing/stale revision, retained UI edits on failure.
- Transactional version-2 migration preserves legacy records. Legacy filled fields are marked manual without fabricated evidence.
- Evidence is invalidated when source text changes; saved evidence distinguishes reviewed suggestions and manual corrections.

## Automated Evidence
25 server/domain/storage tests, 7 Angular UI tests, 3 real Edge E2E tests passed. Strict frontend/server type checks, production Angular build and git diff --check passed. E2E tests restart only their owned temporary server on port 4332 and dispose the test database. Metadata corrections survive real restart. No user database test fixtures or external vacancy retrieval were used.

## Layout Deviations
Version 2 remains a transactional migration inside vacancy-store.ts, consistent with the accepted version-1 adapter; no separate SQL file requiring deployment was introduced. Browser review/restart tests extend the existing vacancy-persistence.spec.ts harness, preventing duplicate server ownership and port conflicts. Extra server review/migration tests live in vacancy-review.test.ts. Existing API/domain tests remain intact. No independent subagent review or manual acceptance is claimed.

## User Acceptance — Resolved
User responded "it is OK" and requested "next wave" after the proposed field-review acceptance scenario. This resolves the phase-1 human gate on 2026-10-10. No separate manual execution of every synthetic case or manual process restart is claimed; those have automated evidence below.

### Retained Acceptance Scenarios
Open the running UI and add this synthetic vacancy:

```text
Title: Senior .NET Engineer
Employer: Example Systems
Location: Boston, MA
Work format: Hybrid
Salary: USD 120000–150000 per year
```

Click Review fields. Confirm the five fields and supporting excerpts, correct a field, try Review fields again and cancel with Keep my fields. Save, reopen, change employer/location/format/salary and Save changes; refresh and confirm corrections remain. Restart persistence is already automated; an optional manual restart must concern US only, never HH.

Then review a sparse/conflicting example:

```text
Title: Engineer
Title: Analyst
Build remote monitoring systems in Boston.
Salary: $100000
```

Title should remain blank with ambiguous evidence. Employer, location, currency and period stay unknown; remote monitoring must not produce remote work format. These scenarios are retained as reference; the acceptance gate above is resolved.
