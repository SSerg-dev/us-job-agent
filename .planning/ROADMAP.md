# Roadmap: US Job Agent

## Overview
Milestone v1.0 delivers a local English workflow from manually pasted US vacancy text to a saved, factual cover letter ready for manual copying. Five sequential vertical slices use Angular/Tailwind, a local Node.js/SQLite API and framework-independent TypeScript rules. Each phase includes relevant tests; phase 5 integrates acceptance, not the first testing effort.

**Status:** Phase 1 accepted on 2026-10-10 after the user reported "it is OK" and requested the next wave. Phase 2 requires candidate-source discussion before detailed planning.

## Phases
- [x] **Phase 1: Saved Vacancy Workflow** - Enter, review, save and reopen vacancies locally.
- [ ] **Phase 2: Evidence-Based Selection** - Review candidate evidence and understand vacancy fit.
- [ ] **Phase 3: Factual English Letters** - Generate task-specific letters from supported evidence.
- [ ] **Phase 4: Simple Letter Lifecycle** - Regenerate, edit, preserve and copy letters safely.
- [ ] **Phase 5: Local MVP Acceptance** - Verify the full workflow and document reliable local operation.

## Phase Details

### Phase 1: Saved Vacancy Workflow
**Goal:** User can maintain a local vacancy library through the English Angular interface.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** INT-01, INT-02, INT-03, LOCAL-01
**Success Criteria:**
1. User can paste English text and optionally supply a source URL; saving triggers no source-site retrieval.
2. User can review and correct title, employer, location, work format and salary while absent or ambiguous fields remain unknown; original text and URL remain accessible.
3. User can save and reopen a vacancy with identical content after page refresh and application restart.
4. User operates an English Angular UI with a loopback-only API and local SQLite storage, without account credentials, telemetry or external AI calls.
**Plans:** 2 sequential plans, implemented and accepted.

Plans:
- [x] 01-01: Manual intake, local persistence and restart tracer (accepted 2026-10-09).
- [x] 01-02: Conservative extraction, corrections and acceptance (2026-10-10).

### Phase 2: Evidence-Based Selection
**Goal:** User can review candidate evidence and understand why each vacancy fits, fails or needs review.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** FACT-01, MATCH-01, MATCH-02, MATCH-03, MATCH-04
**Success Criteria:**
1. User can explicitly import and review candidate facts with source documents and supporting excerpts; no HH private database is copied implicitly.
2. User sees reasons for the approved Senior .NET/C#, .NET Full Stack Angular/Vue and AI/LLM Integration role families, US-wide locations, office/hybrid and exclusion of explicit Tech Lead positions. Unknown work formats and ambiguous leadership titles require review rather than invented certainty.
3. User can distinguish matched, missing and uncertain skills, including required versus optional and AND versus OR alternatives.
4. User sees source salary currency and period without conversion guesses or a salary threshold; missing salary does not reject a vacancy.
5. User sees eligibility requirements separately from user-reported Green Card status; the application never infers citizenship, clearance or guaranteed eligibility.
**Plans:** TBD.

### Phase 3: Factual English Letters
**Goal:** User can generate and save an English letter that addresses this vacancy using verified candidate facts.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** FACT-02, LET-01, LET-02
**Success Criteria:**
1. User can distinguish usable evidence from missing or changed source evidence; unsupported facts are excluded from asserted experience in the letter.
2. Generated letters connect concrete vacancy tasks to supported candidate experience instead of merely repeating skills; no invented tools, achievements, metrics or tenure are added.
3. User sees the vacancy tasks and candidate evidence behind the letter, plus important tasks lacking support. With insufficient evidence, the UI identifies the gap instead of fabricating experience.
4. User can generate, save and reopen a letter using deterministic local rules with no external LLM calls. Overwrite protection is required from the first regeneration capability, not deferred until phase 4.
**Plans:** TBD.

### Phase 4: Simple Letter Lifecycle
**Goal:** User can regenerate, edit and copy letters without losing manual changes or overwriting newer content.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** LET-03, LET-04, LET-05
**Success Criteria:**
1. User can regenerate and save in one action; replacing a manually edited letter requires a short confirmation, and cancellation preserves the exact existing text.
2. User can manually edit and save a letter, with exact text surviving refresh and application restart.
3. A stale save or regeneration cannot silently overwrite a newer letter; the user receives a clear conflict message and retains their attempted text.
4. User can copy the saved letter for manual use; no application or message is sent, and no version history or restore feature is added.
**Plans:** TBD.

### Phase 5: Local MVP Acceptance
**Goal:** User can reliably start and use the complete local intake-to-copy workflow.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** LOCAL-02
**Success Criteria:**
1. User can follow documented installation, startup, shutdown and storage-location instructions with pinned compatible dependencies.
2. Automated regression checks cover normalization uncertainty, matching alternatives, evidence validity, factual letters, confirmation/cancellation, exact persistence and stale-write protection; type checking and production build pass.
3. User acceptance verifies a complete manual intake, field correction, evidence review, selection, generation, regeneration, manual edit, copy and restart scenario using agreed examples. Tests never submit applications or access an account.
4. User can distinguish verified behavior, known limitations and deferred discovery features; v1 is not marked accepted until acceptance evidence is recorded.
**Plans:** TBD.

## Review Notes
- Scope pass: all 16 approved requirements are mapped to exactly one phase; no discovery, sending, external AI, salary filtering or history feature added.
- Dependency pass: each phase delivers a user-visible capability; initial tooling, safe rendering, loopback API and relevant tests belong to the slices that need them. Fact validity and overwrite protection must not wait until final acceptance.
- Implementation prerequisites: establish independent local GSD workflows without copying private configuration; verify latest stable Angular and compatible TypeScript/Node/Tailwind before installing; review candidate import format and allowed source documents during phase 2 planning.
- Source hashes detect changes, not truth. Existing HH test results are reuse references, not proof this application works.

## Progress
Execution order: 1 -> 2 -> 3 -> 4 -> 5. Phase execution requires the interactive planning gates to be satisfied.

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. Saved Vacancy Workflow | 2/2 | Complete | 2026-10-10 |
| 2. Evidence-Based Selection | 0/TBD | Awaiting candidate-source discussion | - |
| 3. Factual English Letters | 0/TBD | Not started | - |
| 4. Simple Letter Lifecycle | 0/TBD | Not started | - |
| 5. Local MVP Acceptance | 0/TBD | Not started | - |
