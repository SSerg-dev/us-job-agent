# Research Summary

Researched inline on 2026-10-09; no subagents. These are planning recommendations, not implemented or tested capabilities.

## Stack
Angular + Tailwind frontend, independent TypeScript domain and Node.js/SQLite local API are the approved direction. Angular publishes compatibility ranges; the observed Angular 22.0.x row requires TypeScript >=6.0.0 <6.1.0 and Node ^22.22.3, ^24.15.0 or ^26.0.0. The available Node 24.19.0 meets that row, but exact latest stable package compatibility must be checked at installation. Do not import HH's dependency lockfile. SQLite driver selection remains an implementation decision; Node documents a built-in SQLite API.

Sources: [Angular compatibility](https://angular.dev/reference/versions), [Angular releases](https://angular.dev/reference/releases), [Node SQLite](https://nodejs.org/api/sqlite.html).

## Features
Manual intake, understandable selection reasons and task-specific factual letters deliver the first useful workflow without relying on LinkedIn automation. Missing values and eligibility uncertainties must remain visible, not guessed. Discovery and sending are separate future decisions.

## Architecture
One repository with Angular UI, local API, domain logic and storage adapter; no shared package or distributed services. Persist vacancy source text, normalized fields, reviewed fact provenance and exact saved letter text. Keep UI independent of matching/generation logic. Test pure rules, API persistence and the full user workflow separately.

## Pitfalls
LinkedIn restricts prohibited automation and scraping; pasting user-provided text avoids building those mechanisms, but does not establish permission for future automated discovery. No LinkedIn search API access is assumed. Do not port HH RUB/monthly conventions, UI HTML-string rendering, unreviewed facts, credentials or private databases. Source hashes identify changes, not factual truth. Guard manual edits and stale writes; render vacancy text safely and keep local data local.

Source: [LinkedIn prohibited software](https://www.linkedin.com/help/linkedin/answer/a1341387/prohibited-software-and-extensions).

## Recommended Sequence
Five vertical phases: saved vacancy workflow; reviewed evidence and selection; factual letters; simple editing/copying; full-cycle acceptance and startup documentation. This is a proposal only; confirm requirements before writing the roadmap.
