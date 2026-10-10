import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';
import { createApp } from '../src/server/app.js';
import { VacancyStore } from '../src/server/vacancy-store.js';
import { validateVacancy, type Vacancy } from '../src/domain/vacancy.js';

test('version 1 migration preserves legacy fields and original source after reopen', () => {
  const folder = mkdtempSync(join(tmpdir(), 'us-review-'));
  const path = join(folder, 'test.sqlite');
  const legacy = {
    ...validateVacancy({ sourceText: 'Title: Engineer\r\n東京', title: 'Manual title' }),
    id: 'legacy',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    revision: 1,
  };
  const database = new DatabaseSync(path);
  database.exec(
    'CREATE TABLE vacancies (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL); PRAGMA user_version = 1',
  );
  database
    .prepare('INSERT INTO vacancies VALUES (?, ?, ?)')
    .run(legacy.id, legacy.createdAt, JSON.stringify(legacy));
  database.close();
  let store = new VacancyStore(path);
  try {
    const migrated = store.get('legacy')!;
    assert.equal(migrated.title, legacy.title);
    assert.equal(migrated.sourceText, legacy.sourceText);
    assert.equal(migrated.fieldEvidence.title.status, 'manual');
    const updated = store.update(
      'legacy',
      validateVacancy({
        sourceText: legacy.sourceText,
        sourceUrl: legacy.sourceUrl,
        title: 'Reviewed title',
      }),
      1,
    )!;
    store.close();
    store = new VacancyStore(path);
    assert.deepEqual(store.get('legacy'), updated);
    assert.equal(updated.sourceText, legacy.sourceText);
  } finally {
    store.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('API updates reviewed fields only, checks revisions and preserves immutable source', async () => {
  const store = new VacancyStore(':memory:');
  const server = createApp(store);
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const saved = store.create(
    validateVacancy({
      sourceText: 'Title: Engineer\r\nSalary: USD 80/hour',
      sourceUrl: 'https://example.com/job',
      title: 'Engineer',
    }),
  );
  const url = `${base}/api/vacancies/${saved.id}`;
  const put = (payload: object) =>
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: null,
        employer: null,
        location: null,
        workFormat: 'unknown',
        salaryRaw: null,
        currency: null,
        period: null,
        ...payload,
      }),
    });
  try {
    assert.equal((await put({ title: 'Changed' })).status, 409);
    assert.equal(
      (await put({ title: 'Changed', expectedRevision: 1, sourceText: 'Replacement' })).status,
      400,
    );
    assert.equal(
      (await put({ expectedRevision: 1, sourceUrl: 'https://other.example' })).status,
      400,
    );
    const response = await put({ title: 'Senior Engineer', expectedRevision: 1 });
    assert.equal(response.status, 200);
    const updated = (await response.json()) as Vacancy;
    assert.equal(updated.revision, 2);
    assert.equal(updated.title, 'Senior Engineer');
    assert.equal(updated.sourceText, saved.sourceText);
    assert.equal(updated.sourceUrl, saved.sourceUrl);
    assert.equal(updated.fieldEvidence.title.status, 'manual');
    assert.equal((await put({ title: 'Stale', expectedRevision: 1 })).status, 409);
    assert.equal(store.get(saved.id)!.title, 'Senior Engineer');
  } finally {
    await new Promise<void>((done) => server.close(() => done()));
    store.close();
  }
});
