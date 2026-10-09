import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Vacancy, VacancyInput } from '../domain/vacancy.js';
export class VacancyStore {
  private database: DatabaseSync;
  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.database = new DatabaseSync(path);
    const version = this.database.prepare('PRAGMA user_version').get() as { user_version: number };
    if (version.user_version > 1) {
      this.database.close();
      throw new Error('Database version is newer than this application.');
    }
    if (version.user_version === 0)
      this.database.exec(
        'BEGIN; CREATE TABLE vacancies (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL); PRAGMA user_version = 1; COMMIT;',
      );
  }
  create(input: VacancyInput): Vacancy {
    const now = new Date().toISOString();
    const vacancy: Vacancy = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    this.database
      .prepare('INSERT INTO vacancies (id, created_at, payload) VALUES (?, ?, ?)')
      .run(vacancy.id, now, JSON.stringify(vacancy));
    return vacancy;
  }
  list(): Vacancy[] {
    return this.database
      .prepare('SELECT payload FROM vacancies ORDER BY created_at DESC, id DESC')
      .all()
      .map((row) => JSON.parse(String(row['payload'])) as Vacancy);
  }
  get(id: string): Vacancy | null {
    const row = this.database.prepare('SELECT payload FROM vacancies WHERE id = ?').get(id);
    return row ? (JSON.parse(String(row['payload'])) as Vacancy) : null;
  }
  close(): void {
    this.database.close();
  }
}
