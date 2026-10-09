# Requirements: US Job Agent

Status: scope and roadmap mapping approved; manual tracer accepted by user on 2026-10-09. Three requirements complete; remaining scope pending.

## Version 1
### Local intake
- [x] **INT-01**: User can enter English vacancy text and an optional source URL without any automatic retrieval.
- [ ] **INT-02**: User can review and correct extracted title, employer, location, work format and salary; absent or ambiguous values remain unknown.
- [x] **INT-03**: User can save and reopen vacancies after page refresh and application restart, retaining the original text and source URL.
### Candidate evidence
- [ ] **FACT-01**: User can review explicitly imported candidate facts with their document source and supporting excerpt before using them in letters.
- [ ] **FACT-02**: User can distinguish valid source evidence from missing or changed evidence; unsupported facts cannot appear as asserted experience in generated letters.
### Selection
- [ ] **MATCH-01**: User can see fit and reasons for the approved role families, US locations, office/hybrid and exclusion of Tech Lead jobs.
- [ ] **MATCH-02**: User sees missing and ambiguous requirements as review items, with required/optional skills and AND/OR alternatives distinguished.
- [ ] **MATCH-03**: User is not filtered by salary; supplied salary retains its source currency and period without guessed conversion.
- [ ] **MATCH-04**: User can review eligibility language against user-reported Green Card status without inferred citizenship, clearance or guaranteed eligibility.
### Letters
- [ ] **LET-01**: User can generate an English letter connecting concrete vacancy tasks to supported candidate facts, without claiming unsupported tools, achievements or experience.
- [ ] **LET-02**: User can see which vacancy tasks and candidate evidence support the generated letter, including uncovered important tasks.
- [ ] **LET-03**: User can regenerate and save in one action; replacing manually edited text requires a short confirmation and cancelling preserves it. No version history.
- [ ] **LET-04**: User can manually edit and save a letter; the exact text survives refresh and restart, and stale saves cannot silently overwrite newer content.
- [ ] **LET-05**: User can copy the saved letter for manual use; the application never sends an application or message.
### Local operation
- [x] **LOCAL-01**: User has an English Angular interface served locally with local SQLite storage, without external AI calls, account credentials or telemetry.
- [ ] **LOCAL-02**: User receives clear startup and storage instructions, and the complete intake-to-copy workflow passes automated regression checks and user acceptance.

## Deferred
Permitted job discovery, user-controlled alert import, additional source adapters and optional AI-assisted drafting require separate research and approval. No assumed LinkedIn search API access.

## Out of Scope
LinkedIn scraping/browser automation; auto applications/messages; external LLM; email access; salary thresholds; remote-only jobs; Tech Lead roles; cloud hosting; letter history/restore.

## Traceability
| Requirement | Phase | Status |
|---|---|---|
| INT-01 | 1 | Complete (01-01) |
| INT-02 | 1 | Pending |
| INT-03 | 1 | Complete (01-01) |
| FACT-01 | 2 | Pending |
| FACT-02 | 3 | Pending |
| MATCH-01 | 2 | Pending |
| MATCH-02 | 2 | Pending |
| MATCH-03 | 2 | Pending |
| MATCH-04 | 2 | Pending |
| LET-01 | 3 | Pending |
| LET-02 | 3 | Pending |
| LET-03 | 4 | Pending |
| LET-04 | 4 | Pending |
| LET-05 | 4 | Pending |
| LOCAL-01 | 1 | Complete (01-01) |
| LOCAL-02 | 5 | Pending |

Coverage: 16/16 requirements mapped once; three complete in accepted plan 01-01, thirteen pending. Evidence: 01-01-SUMMARY.md. Phase 1 is not complete.
