import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVacancy, reviewedEvidence } from '../src/domain/normalize-vacancy.js';
import { validateVacancy } from '../src/domain/vacancy.js';

test('explicit English fields have exact supporting excerpts, including Unicode and CRLF', () => {
  const source =
    "  Job title: Senior .NET Engineer\r\nCompany: O'Reilly — 東京\r\nLocation: Boston, MA\r\nWorkplace type: Hybrid\r\nSalary: USD 120,000–150,000 per year\r\n";
  const result = normalizeVacancy(source);
  assert.deepEqual(result.fields, {
    title: 'Senior .NET Engineer',
    employer: "O'Reilly — 東京",
    location: 'Boston, MA',
    workFormat: 'hybrid',
    salaryRaw: 'USD 120,000–150,000 per year',
    currency: 'USD',
    period: 'year',
  });
  assert.deepEqual(result.evidence.title, {
    status: 'suggested',
    excerpts: ['  Job title: Senior .NET Engineer'],
  });
  for (const evidence of Object.values(result.evidence))
    for (const excerpt of evidence.excerpts) assert.ok(source.includes(excerpt));
});
test('incidental employer, city and remote monitoring do not invent fields', () => {
  const result = normalizeVacancy(
    'Senior Engineer\nPreviously worked at Acme in Boston.\nBuild remote monitoring systems.',
  );
  assert.equal(result.fields.title, null);
  assert.equal(result.fields.employer, null);
  assert.equal(result.fields.location, null);
  assert.equal(result.fields.workFormat, 'unknown');
});
test('conflicting metadata stays ambiguous, including unsupported arrangements', () => {
  const result = normalizeVacancy(
    'Title: Engineer\nTitle: Analyst\nEmployer: Acme\nCompany: Other\nLocation: Boston\nCity: Denver\nWork format: remote or office\nSalary: USD 80/hour\nSalary: USD 120000/year',
  );
  for (const field of [
    'title',
    'employer',
    'location',
    'workFormat',
    'salaryRaw',
    'currency',
    'period',
  ] as const)
    assert.equal(result.evidence[field].status, 'ambiguous');
  assert.equal(result.fields.workFormat, 'unknown');
  assert.equal(result.fields.salaryRaw, null);
});
test('dollars do not imply USD and missing period remains missing', () => {
  const result = normalizeVacancy('Location: New York, NY\nSalary: $100,000–140,000');
  assert.equal(result.fields.currency, null);
  assert.equal(result.fields.period, null);
  assert.equal(result.fields.workFormat, 'unknown');
});
for (const format of ['office', 'hybrid', 'remote'] as const)
  test(`explicit ${format} is recognized`, () => {
    assert.equal(normalizeVacancy(`Work format: ${format}`).fields.workFormat, format);
  });
test('hourly, annual and duplicate supporting labels are handled conservatively', () => {
  assert.equal(normalizeVacancy('Salary: CAD 80/hour').fields.period, 'hour');
  assert.equal(normalizeVacancy('Salary: USD 100000 annually').fields.period, 'year');
  assert.equal(
    normalizeVacancy('Title: Engineer\nJob title: Engineer').evidence.title.status,
    'suggested',
  );
  assert.equal(normalizeVacancy('Work format: on-site').fields.workFormat, 'office');
});
test('manual correction retains source evidence without pretending it was extracted', () => {
  const evidence = reviewedEvidence(
    validateVacancy({ sourceText: 'Title: Engineer', title: 'Senior Engineer' }),
  );
  assert.equal(evidence.title.status, 'manual');
  assert.deepEqual(evidence.title.excerpts, ['Title: Engineer']);
});
for (const value of [
  'not remote',
  'remote monitoring',
  'hybrid or remote',
  'office work may be optional',
]) {
  test(`uncertain work-format phrase stays unknown: ${value}`, () => {
    const result = normalizeVacancy(`Work format: ${value}`);
    assert.equal(result.fields.workFormat, 'unknown');
    assert.equal(result.evidence.workFormat.status, 'ambiguous');
  });
}
