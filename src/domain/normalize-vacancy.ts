import {
  reviewFields,
  type FieldEvidence,
  type ReviewField,
  type VacancyInput,
} from './vacancy.js';

export interface NormalizedVacancy {
  fields: Omit<VacancyInput, 'sourceText' | 'sourceUrl'>;
  evidence: FieldEvidence;
}
export function emptyEvidence(): FieldEvidence {
  return {
    title: { status: 'unknown', excerpts: [] },
    employer: { status: 'unknown', excerpts: [] },
    location: { status: 'unknown', excerpts: [] },
    workFormat: { status: 'unknown', excerpts: [] },
    salaryRaw: { status: 'unknown', excerpts: [] },
    currency: { status: 'unknown', excerpts: [] },
    period: { status: 'unknown', excerpts: [] },
  };
}

export function normalizeVacancy(sourceText: string): NormalizedVacancy {
  const fields: NormalizedVacancy['fields'] = {
    title: null,
    employer: null,
    location: null,
    workFormat: 'unknown',
    salaryRaw: null,
    currency: null,
    period: null,
  };
  const evidence = emptyEvidence();
  const candidates: Record<ReviewField, { value: string; excerpt: string }[]> = {
    title: [],
    employer: [],
    location: [],
    workFormat: [],
    salaryRaw: [],
    currency: [],
    period: [],
  };
  const add = (field: ReviewField, value: string, excerpt: string) => {
    if (value) candidates[field].push({ value, excerpt });
  };
  for (const line of sourceText.split(/\r\n|\n|\r/)) {
    const match =
      /^\s*(job title|title|employer|company|location|city|work format|workplace type|work arrangement|salary|compensation|base salary|currency|pay period)\s*:\s*(.*?)\s*$/i.exec(
        line,
      );
    if (!match || !match[2] || /^(unknown|not specified|n\/a|tbd)$/i.test(match[2])) continue;
    const label = match[1].toLowerCase();
    const value = match[2];
    if (['job title', 'title'].includes(label)) add('title', value, line);
    else if (['employer', 'company'].includes(label)) add('employer', value, line);
    else if (['location', 'city'].includes(label)) add('location', value, line);
    else if (['work format', 'workplace type', 'work arrangement'].includes(label)) {
      if (/^hybrid$/i.test(value)) add('workFormat', 'hybrid', line);
      else if (/^(?:remote|fully remote|100% remote)$/i.test(value))
        add('workFormat', 'remote', line);
      else if (/^(?:office|on[ -]?site|in[ -]?office)$/i.test(value))
        add('workFormat', 'office', line);
      else {
        evidence.workFormat = { status: 'ambiguous', excerpts: [line] };
      }
    } else if (label === 'currency') {
      const codes = value.toUpperCase().match(/\b(?:USD|CAD|EUR|GBP|AUD)\b/g) ?? [];
      for (const code of codes) add('currency', code, line);
    } else if (label === 'pay period') {
      const periods =
        value
          .toLowerCase()
          .match(/\b(?:hourly|hour|annually|annual|yearly|year|monthly|month|weekly|week)\b/g) ??
        [];
      for (const period of periods) add('period', canonicalPeriod(period), line);
    } else {
      add('salaryRaw', value, line);
      for (const code of value.toUpperCase().match(/\b(?:USD|CAD|EUR|GBP|AUD)\b/g) ?? [])
        add('currency', code, line);
      for (const period of value
        .toLowerCase()
        .match(
          /\b(?:hourly|annually|annual|yearly|monthly|weekly)\b|(?:per\s+|\/\s*)(?:hour|year|month|week)\b/g,
        ) ?? []) {
        add('period', canonicalPeriod(period.replace(/^(?:per\s+|\/\s*)/, '')), line);
      }
    }
  }
  for (const field of reviewFields) {
    const entries = candidates[field];
    const values = [...new Set(entries.map((entry) => entry.value))];
    const excerpts = [...new Set(entries.map((entry) => entry.excerpt))];
    if (values.length > 1 || evidence[field].status === 'ambiguous') {
      evidence[field] = {
        status: 'ambiguous',
        excerpts: [...new Set([...evidence[field].excerpts, ...excerpts])],
      };
    } else if (values.length === 1) {
      if (field === 'workFormat') fields.workFormat = values[0] as VacancyInput['workFormat'];
      else fields[field] = values[0];
      evidence[field] = { status: 'suggested', excerpts };
    }
  }
  if (evidence.salaryRaw.status === 'ambiguous') {
    fields.currency = null;
    fields.period = null;
    evidence.currency = { status: 'ambiguous', excerpts: evidence.salaryRaw.excerpts };
    evidence.period = { status: 'ambiguous', excerpts: evidence.salaryRaw.excerpts };
  }
  return { fields, evidence };
}

function canonicalPeriod(value: string): string {
  if (value.startsWith('hour')) return 'hour';
  if (value.startsWith('annual') || value.startsWith('year')) return 'year';
  if (value.startsWith('month')) return 'month';
  return 'week';
}

export function reviewedEvidence(input: VacancyInput): FieldEvidence {
  const normalized = normalizeVacancy(input.sourceText);
  for (const field of reviewFields) {
    if (input[field] !== null && input[field] !== 'unknown') {
      normalized.evidence[field] = {
        status: input[field] === normalized.fields[field] ? 'reviewed' : 'manual',
        excerpts: normalized.evidence[field].excerpts,
      };
    } else if (normalized.evidence[field].status === 'suggested') {
      normalized.evidence[field].status = 'manual';
    }
  }
  return normalized.evidence;
}
