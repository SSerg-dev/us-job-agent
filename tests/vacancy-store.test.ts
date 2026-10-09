import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateVacancy } from '../src/domain/vacancy.js';
import { VacancyStore } from '../src/server/vacancy-store.js';
test('exact text, fields and migration survive close and reopen', () => {
  const folder = mkdtempSync(join(tmpdir(), 'us-job-store-'));
  const file = join(folder, 'test.sqlite');
  let store = new VacancyStore(file);
  try {
    const input = validateVacancy({
      sourceText: "  Engineer's role\r\n<script>bad()</script>\nC# — 東京  ",
      sourceUrl: 'https://example.com/job?id=1',
      title: "Engineer's role",
      workFormat: 'hybrid',
      salaryRaw: '$60/hour',
      period: 'hour',
    });
    const saved = store.create(input);
    assert.equal(saved.revision, 1);
    store.close();
    store = new VacancyStore(file);
    assert.deepEqual(store.get(saved.id), saved);
    assert.deepEqual(store.list(), [saved]);
    assert.equal(store.get("' OR 1=1 --"), null);
  } finally {
    store.close();
    rmSync(folder, { recursive: true, force: true });
  }
});
test('missing metadata remains unknown without salary inference', () => {
  const input = validateVacancy({ sourceText: 'Develop C# applications in New York.' });
  assert.equal(input.title, null);
  assert.equal(input.currency, null);
  assert.equal(input.period, null);
  assert.equal(input.workFormat, 'unknown');
});
for (const [name, input] of Object.entries({
  blank: { sourceText: ' \r\n' },
  oversized: { sourceText: 'a'.repeat(100001) },
  scheme: { sourceText: 'Job', sourceUrl: 'javascript:alert(1)' },
  credentials: { sourceText: 'Job', sourceUrl: 'https://user:secret@example.com' },
  extra: { sourceText: 'Job', fetch: true },
  wrongFormat: { sourceText: 'Job', workFormat: 'any' },
  longField: { sourceText: 'Job', title: 'a'.repeat(501) },
})) {
  test(`validation rejects ${name}`, () => assert.throws(() => validateVacancy(input)));
}
