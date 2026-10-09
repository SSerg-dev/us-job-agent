# Phase 1 Research: Saved Vacancy Workflow

2026-10-09. Inline research, planning and review as explicitly requested; no independent subagent verdict. User chose requirements/research-only planning, without a separate CONTEXT.md discussion.

## Findings
- Use Angular standalone components and reactive forms for explicit editable inputs. Framework-independent domain functions own validation and normalization, not component code. [Angular forms](https://angular.dev/guide/forms/reactive-forms).
- Integrate Tailwind through the documented Angular/PostCSS setup; do not reuse HH configuration. [Tailwind Angular guide](https://tailwindcss.com/docs/installation/framework-guides/angular).
- Resolve latest stable Angular/CLI together at execution, then pin compatible TypeScript, RxJS, Node and Tailwind dependencies. Do not claim a latest patch now. [Angular compatibility](https://angular.dev/reference/versions).
- Available bundled Node 24.19.0 successfully created, inserted and read an in-memory SQLite table in a planning probe. This proves runtime availability only, not application persistence. Built-in node:sqlite is documented as release-candidate stability in this Node version; isolate DatabaseSync behind a storage adapter and pin the runtime. [Node 24.19 SQLite](https://nodejs.org/download/release/v24.19.0/docs/api/sqlite.html).

## Recommended Design
Single package: src/app Angular UI, src/domain pure TypeScript, src/server API/storage, tests and e2e. Use node:http and node:sqlite without an ORM or backend framework for this small local slice. Same-origin production serving; development /api proxy. Proposed ports: UI 4320, API 4321; never touch HH 4310/4311. Check availability and report conflicts, never kill unrelated processes.

Keep sourceText verbatim, nullable sourceUrl, reviewed fields and field evidence separate. Work format: office, hybrid, remote or unknown; remote is a valid imported value, not a phase-1 filter. Salary retains raw text and explicit currency/period only. No implied USD or annual period. Unknown values must be clear, not synthesized.

## Risk Controls
Parameter-bound SQL; safe Angular text interpolation; http/https-only optional URLs without credentials; no fetch of source links. API checks Host/Origin and rejects cross-origin writes, malformed JSON and oversized requests. Loopback alone is not authorization. Default data path is inside this project, never HH data. Fresh schema migration must run on temporary database tests and reopen without data loss.

## Verification Strategy
Node test runner for pure domain and API/storage tests, generated Angular-compatible component test setup, Playwright for the actual UI/API/file-backed database workflow. Define and verify test scripts during scaffolding; proposed commands in plans do not exist yet. Use disposable temp databases, no candidate/private data. Test LF/CRLF, Unicode, apostrophes, HTML-like strings, missing fields, competing evidence, invalid URLs and API errors. Add tests in the slice that introduces the behavior.

## Boundaries
No candidate import, matching, letters, scraping, site credentials, SSR, NgRx or telemetry in this phase. Local independent GSD installation is an execution prerequisite; do not copy private Codex settings or retain HH absolute references in copied workflows.
