import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server/app.js';
import { VacancyStore } from '../src/server/vacancy-store.js';
import type { AddressInfo } from 'node:net';
import { request } from 'node:http';
test('API validates, persists and rejects untrusted requests', async () => {
  const store = new VacancyStore(':memory:');
  const server = createApp(store);
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const create = (body: string, headers: Record<string, string> = {}) =>
    fetch(`${base}/api/vacancies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
    });
  try {
    assert.equal((await fetch(`${base}/api/vacancies`)).status, 200);
    const original = {
      sourceText: "Engineer\r\nO'Reilly — .NET",
      sourceUrl: 'https://example.com/vacancy',
      title: 'Engineer',
    };
    const response = await create(JSON.stringify(original));
    assert.equal(response.status, 201);
    const saved = (await response.json()) as { id: string; sourceText: string };
    assert.equal(saved.sourceText, original.sourceText);
    assert.deepEqual(await (await fetch(`${base}/api/vacancies/${saved.id}`)).json(), saved);
    assert.equal((await fetch(`${base}/api/vacancies/missing`)).status, 404);
    assert.equal((await create('{')).status, 400);
    assert.equal((await create(JSON.stringify({ sourceText: ' ' }))).status, 400);
    assert.equal(
      (await create(JSON.stringify(original), { Origin: 'https://evil.example' })).status,
      403,
    );
    const foreignHost = await new Promise<number>((done) => {
      const call = request(
        `${base}/api/vacancies`,
        { headers: { Host: 'evil.example' } },
        (response) => {
          response.resume();
          done(response.statusCode ?? 0);
        },
      );
      call.end();
    });
    assert.equal(foreignHost, 403);
    assert.equal(
      (await create(JSON.stringify(original), { 'Content-Type': 'text/plain' })).status,
      415,
    );
    assert.equal((await create(JSON.stringify({ sourceText: 'a'.repeat(1048577) }))).status, 400);
    assert.equal(((await (await fetch(`${base}/api/vacancies`)).json()) as unknown[]).length, 1);
  } finally {
    await new Promise<void>((done) => server.close(() => done()));
    store.close();
  }
});
