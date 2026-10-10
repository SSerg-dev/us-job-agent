import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  reviewFields,
  validateVacancy,
  type FieldEvidence,
  type Vacancy,
} from '../../domain/vacancy';
import { normalizeVacancy } from '../../domain/normalize-vacancy';
import { VacancyApi } from './vacancy-api';
@Component({
  selector: 'app-vacancy-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `<a routerLink="/vacancies" class="text-blue-800">← Saved vacancies</a>
    <h1 class="text-3xl font-bold my-5">{{ saved() ? 'Saved vacancy' : 'Add vacancy' }}</h1>
    <p class="mb-5 text-slate-600">
      Paste the original text, review supported suggestions and correct fields before saving.
    </p>
    @if (loading()) {
      <p role="status">Loading vacancy…</p>
    }
    @if (error()) {
      <p role="alert" class="bg-red-50 text-red-800 p-4 mb-4">{{ error() }}</p>
    }
    @if (!loading() && !unavailable()) {
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="bg-white rounded-xl p-6 border border-slate-200"
      >
        <label
          >Original vacancy text<textarea
            rows="10"
            formControlName="sourceText"
            maxlength="100000"
            [readOnly]="saved()"
          ></textarea>
        </label>
        <label
          >Source URL (optional)<input
            type="url"
            formControlName="sourceUrl"
            maxlength="2048"
            [readOnly]="saved()"
        /></label>
        <button type="button" (click)="review()" [disabled]="saving()">Review fields</button>
        @if (replacementPending()) {
          <p role="alert">
            Replace current fields with new suggestions? Unsaved corrections will be replaced.
          </p>
          <button type="button" (click)="applyReview()">Replace fields</button>
          <button type="button" (click)="replacementPending.set(false)">Keep my fields</button>
        }
        <div class="grid md:grid-cols-2 gap-x-6">
          <label>Job title<input formControlName="title" /></label
          ><label>Employer<input formControlName="employer" /></label
          ><label>Location<input formControlName="location" /></label
          ><label
            >Work format<select formControlName="workFormat">
              <option value="unknown">Unknown</option>
              <option value="office">Office</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select></label
          ><label>Salary as stated<input formControlName="salaryRaw" /></label
          ><label>Currency (only if stated)<input formControlName="currency" /></label
          ><label>Pay period (only if stated)<input formControlName="period" /></label>
        </div>
        @if (evidence()) {
          <section aria-label="Field evidence" class="my-4 text-sm">
            <p>Evidence from the last review or save. Manual corrections update it when saved.</p>
            @for (field of fields; track field) {
              <p>
                <strong>{{ field }}:</strong> {{ evidence()![field].status }}
              </p>
              @for (excerpt of evidence()![field].excerpts; track excerpt) {
                <blockquote class="ml-4 whitespace-pre-wrap">{{ excerpt }}</blockquote>
              }
            }
          </section>
        }
        <button type="submit" [disabled]="saving()">
          {{ saving() ? 'Saving…' : saved() ? 'Save changes' : 'Save vacancy' }}
        </button>
        @if (saved()) {
          <p role="status" class="text-green-800">
            Saved locally. Save changes to keep any new corrections.
          </p>
        }
      </form>
    }`,
})
export class VacancyForm {
  private api = inject(VacancyApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  form = inject(FormBuilder).nonNullable.group({
    sourceText: '',
    sourceUrl: '',
    title: '',
    employer: '',
    location: '',
    workFormat: 'unknown',
    salaryRaw: '',
    currency: '',
    period: '',
  });
  saved = signal(false);
  saving = signal(false);
  loading = signal(false);
  error = signal('');
  unavailable = signal(false);
  evidence = signal<FieldEvidence | null>(null);
  replacementPending = signal(false);
  fields = reviewFields;
  private current: Vacancy | null = null;
  constructor() {
    this.form.controls.sourceText.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.evidence.set(null);
      this.replacementPending.set(false);
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.saved.set(true);
      this.loading.set(true);
      this.api.get(id).subscribe({
        next: (vacancy) => {
          this.current = vacancy;
          this.form.patchValue({
            sourceText: vacancy.sourceText,
            sourceUrl: vacancy.sourceUrl ?? '',
            title: vacancy.title ?? '',
            employer: vacancy.employer ?? '',
            location: vacancy.location ?? '',
            workFormat: vacancy.workFormat,
            salaryRaw: vacancy.salaryRaw ?? '',
            currency: vacancy.currency ?? '',
            period: vacancy.period ?? '',
          });
          this.evidence.set(vacancy.fieldEvidence);
          this.loading.set(false);
        },
        error: () => {
          this.unavailable.set(true);
          this.error.set('Vacancy unavailable. Return to the saved list and try again.');
          this.form.disable();
          this.loading.set(false);
        },
      });
    }
  }
  review() {
    if (this.saving() || this.unavailable()) return;
    this.error.set('');
    if (!this.form.controls.sourceText.value.trim()) {
      this.error.set('Vacancy text is required before reviewing fields.');
      return;
    }
    const values = this.form.getRawValue();
    if (reviewFields.some((field) => values[field] !== '' && values[field] !== 'unknown')) {
      this.replacementPending.set(true);
      return;
    }
    this.applyReview();
  }
  applyReview() {
    if (this.saving() || this.unavailable()) return;
    const normalized = normalizeVacancy(this.form.controls.sourceText.value);
    this.form.patchValue(
      Object.fromEntries(
        Object.entries(normalized.fields).map(([field, value]) => [field, value ?? '']),
      ),
    );
    this.evidence.set(normalized.evidence);
    this.replacementPending.set(false);
  }
  save() {
    if (this.saving() || this.unavailable() || this.replacementPending()) return;
    this.error.set('');
    try {
      const input = validateVacancy(this.form.getRawValue());
      this.saving.set(true);
      const { sourceText, sourceUrl, ...reviewed } = input;
      const request = this.current
        ? this.api.update(this.current.id, { ...reviewed, expectedRevision: this.current.revision })
        : this.api.create(input);
      request.subscribe({
        next: (vacancy) => {
          this.saving.set(false);
          this.evidence.set(vacancy.fieldEvidence);
          if (this.current) this.current = vacancy;
          else void this.router.navigate(['/vacancies', vacancy.id]);
        },
        error: (response) => {
          this.saving.set(false);
          this.error.set(
            response.error?.error ??
              'Save failed. Your text is still here; check the local server.',
          );
        },
      });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Check the vacancy fields.');
    }
  }
}
