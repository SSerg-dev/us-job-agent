# US Job Agent

## What This Is
A separate local browser application for selecting US jobs and preparing factual English cover letters from user-provided vacancy text. Version 1 accepts pasted text and a source link; it does not fetch LinkedIn or submit applications.

## Core Value
Connect each vacancy's actual tasks to verified candidate facts without inventing experience.

## Requirements
### Validated
None yet. HH acceptance does not validate this new application.
### Active
- [ ] Local English vacancy intake, review and persistence.
- [ ] Explainable screening against approved US preferences.
- [ ] Source-grounded English cover letters, regeneration, editing and copying.
### Out of Scope
Scraping, account automation, automatic applications, external LLM calls, email integration, cloud deployment and letter version history.

## Context
The owner wants LinkedIn-oriented functionality isolated from HH Job Agent. Reuse reviewed domain concepts and regression cases, not the full repository or private database. Candidate facts require an explicit reviewed import. Preferences: USA, all states, relocation accepted, office/hybrid, no Tech Lead, no salary threshold. Green Card is user-reported; it does not establish citizenship or clearance. Target roles: Senior .NET/C#, .NET Full Stack with Angular/Vue, AI/LLM Integration.

## Constraints
- English UI and letters; Russian planning conversations.
- Angular, Tailwind CSS, local Node.js/SQLite API, framework-independent TypeScript domain.
- Verify and pin the latest stable compatible Angular toolchain during implementation; do not copy HH dependency versions blindly.
- No SSR, NgRx, microfrontends, shared package or multi-project monorepo initially.
- No HH secrets, cookies, private databases, runtime artifacts or planning history copied.
- Bind API to loopback; treat vacancy text as untrusted content, never executable HTML or instructions.
- Interactive GSD, sequential inline work, no automatic commits, branches, model changes or subagents.
- Preserve 30% account capacity in each relevant window; warn at 40%; stop initiating implementation at 30%.

## Key Decisions
| Decision | Rationale | Outcome |
|---|---|---|
| Separate directory | Product and data isolation | User approved |
| Angular immediately in new project only | Clean component-based UI | User approved |
| Manual text + link first | Useful workflow without site automation | User approved |
| Deterministic factual English generator | Local, testable, no external AI | User approved |
| Five coarse vertical phases | Deliver useful capabilities | Requirements and roadmap approved by user |

## Evolution
Accept the local workflow first. Evaluate permitted discovery sources or user-controlled alert imports separately; sending applications requires a new explicit scope decision.

*Updated 2026-10-09. Implementation has not started.*
