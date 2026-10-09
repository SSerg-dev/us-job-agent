# Walking Skeleton — US Job Agent

**Phase:** 1
**Generated:** 2026-10-09
**Status:** Planned, not built.

## Capability Proven End-to-End
User pastes vacancy text, enters reviewed fields, saves through Angular to the local API/SQLite, and reopens identical data after restarting the application.

## Architectural Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Frontend | Angular standalone components, reactive forms, Tailwind | Approved stack and simple editable forms |
| Domain | Pure TypeScript in src/domain | Independent of UI and providers |
| API | node:http, loopback-only, same-origin | Small local application, minimal dependencies |
| Storage | node:sqlite adapter, pinned Node 24 runtime | Verified local availability; isolate release-candidate API |
| Access protection | Host/Origin validation, no permissive CORS | Prevent unrelated sites from writing local data |
| Data | data/agent.sqlite, explicit test-only overrides | Independent storage, no HH database reuse |
| Directory layout | src/app, src/domain, src/server, tests, e2e | One package, no shared package or workspace monorepo |
| Routes | /vacancies, /vacancies/new, /vacancies/:id | Real list, intake and saved details |

## Stack Touched in Phase 1
- [ ] Scaffold, dependency pinning, build and test commands.
- [ ] Real Angular routes and English form labels.
- [ ] File-backed SQLite read/write and restart.
- [ ] Save and reopen UI wired to real API, not mocks.
- [ ] Documented local startup/shutdown, separate from HH.

## Deferred
Phase 2 adds reviewed evidence and selection; phase 3 adds letters; phase 4 adds letter lifecycle; phase 5 accepts the complete MVP. No automatic site access or applications.
