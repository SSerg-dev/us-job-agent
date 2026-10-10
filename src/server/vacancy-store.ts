import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Vacancy, VacancyInput } from '../domain/vacancy.js';
import { reviewFields } from '../domain/vacancy.js';
import { emptyEvidence, reviewedEvidence } from '../domain/normalize-vacancy.js';
export class RevisionConflict extends Error {}
export class VacancyStore {
  private database: DatabaseSync;
  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.database = new DatabaseSync(path);
    const version = this.database.prepare('PRAGMA user_version').get() as { user_version: number };
    if (version.user_version > 2) {
      this.database.close();
      throw new Error('Database version is newer than this application.');
    }
    if (version.user_version === 0)
      this.database.exec(
        'BEGIN; CREATE TABLE vacancies (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL); PRAGMA user_version = 1; COMMIT;',
      );
    if (version.user_version < 2) {
      this.database.exec('BEGIN');
      try {
        for (const row of this.database.prepare('SELECT id, payload FROM vacancies').all()) {
          const vacancy = JSON.parse(String(row['payload'])) as Vacancy;
          vacancy.fieldEvidence = emptyEvidence();
          for (const field of reviewFields) {
            if (vacancy[field] && vacancy[field] !== 'unknown')
              vacancy.fieldEvidence[field].status = 'manual';
          }
          this.database
            .prepare('UPDATE vacancies SET payload = ? WHERE id = ?')
            .run(JSON.stringify(vacancy), row['id'] as string);
        }
        this.database.exec('PRAGMA user_version = 2; COMMIT');
      } catch (error) {
        this.database.exec('ROLLBACK');
        this.database.close();
        throw error;
      }
    }
  }
  create(input: VacancyInput): Vacancy {
    const now = new Date().toISOString();
    const vacancy: Vacancy = {
      ...input,
      fieldEvidence: reviewedEvidence(input),
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
  update(id: string, input: VacancyInput, expectedRevision: number): Vacancy | null {
    const current = this.get(id);
    if (!current) return null;
    if (current.revision !== expectedRevision)
      throw new RevisionConflict(
        'Vacancy changed. Reopen it before saving; your edits are still here.',
      );
    const updated: Vacancy = {
      ...current,
      ...input,
      sourceText: current.sourceText,
      sourceUrl: current.sourceUrl,
      fieldEvidence: reviewedEvidence({ ...input, sourceText: current.sourceText }),
      revision: current.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    const result = this.database
      .prepare(
        "UPDATE vacancies SET payload = ? WHERE id = ? AND json_extract(payload, '$.revision') = ?",
      )
      .run(JSON.stringify(updated), id, expectedRevision);
    if (result.changes !== 1)
      throw new RevisionConflict('Vacancy changed. Your edits are still here.');
    return updated;
  }
}
