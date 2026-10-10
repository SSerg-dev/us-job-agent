export const workFormats = ['office', 'hybrid', 'remote', 'unknown'] as const;
export interface VacancyInput {
  sourceText: string;
  sourceUrl: string | null;
  title: string | null;
  employer: string | null;
  location: string | null;
  workFormat: (typeof workFormats)[number];
  salaryRaw: string | null;
  currency: string | null;
  period: string | null;
}
export interface Vacancy extends VacancyInput {
  fieldEvidence: FieldEvidence;
  id: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
}
export const reviewFields = [
  'title',
  'employer',
  'location',
  'workFormat',
  'salaryRaw',
  'currency',
  'period',
] as const;
export type ReviewField = (typeof reviewFields)[number];
export interface Evidence {
  status: 'unknown' | 'ambiguous' | 'suggested' | 'reviewed' | 'manual';
  excerpts: string[];
}
export type FieldEvidence = Record<ReviewField, Evidence>;
export type VacancyUpdate = Omit<VacancyInput, 'sourceText' | 'sourceUrl'> & {
  expectedRevision: number;
};
export class ValidationError extends Error {}
export function validateVacancy(value: unknown): VacancyInput {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ValidationError('Expected vacancy fields.');
  const fields = value as Record<string, unknown>;
  const allowed = [
    'sourceText',
    'sourceUrl',
    'title',
    'employer',
    'location',
    'workFormat',
    'salaryRaw',
    'currency',
    'period',
  ];
  if (Object.keys(fields).some((key) => !allowed.includes(key)))
    throw new ValidationError('Unknown vacancy field.');
  if (
    typeof fields['sourceText'] !== 'string' ||
    !fields['sourceText'].trim() ||
    fields['sourceText'].length > 100000
  )
    throw new ValidationError('Vacancy text is required (maximum 100,000 characters).');
  const nullable = (name: string, limit = 500): string | null => {
    const entry = fields[name];
    if (entry === undefined || entry === null || entry === '') return null;
    if (typeof entry !== 'string' || entry.length > limit)
      throw new ValidationError(`Invalid ${name}.`);
    return entry.trim() ? entry : null;
  };
  const sourceUrl = nullable('sourceUrl', 2048);
  if (sourceUrl) {
    let parsed: URL;
    try {
      parsed = new URL(sourceUrl);
    } catch {
      throw new ValidationError('Source URL must be an HTTP or HTTPS link.');
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password)
      throw new ValidationError('Source URL must be HTTP/HTTPS without credentials.');
  }
  const format = fields['workFormat'] ?? 'unknown';
  if (!workFormats.includes(format as (typeof workFormats)[number]))
    throw new ValidationError('Invalid work format.');
  return {
    sourceText: fields['sourceText'],
    sourceUrl,
    title: nullable('title'),
    employer: nullable('employer'),
    location: nullable('location'),
    workFormat: format as (typeof workFormats)[number],
    salaryRaw: nullable('salaryRaw', 2000),
    currency: nullable('currency', 30),
    period: nullable('period', 80),
  };
}
