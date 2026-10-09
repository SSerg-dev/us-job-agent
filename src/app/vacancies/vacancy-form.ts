import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { validateVacancy } from '../../domain/vacancy';
import { VacancyApi } from './vacancy-api';
@Component({
  selector: 'app-vacancy-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `<a routerLink="/vacancies" class="text-blue-800">← Saved vacancies</a>
    <h1 class="text-3xl font-bold my-5">{{ saved() ? 'Saved vacancy' : 'Add vacancy' }}</h1>
    <p class="mb-5 text-slate-600">
      Paste the original text. Fields are manual for now; leave anything unknown blank.
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
        <div class="grid md:grid-cols-2 gap-x-6">
          <label>Job title<input formControlName="title" [readOnly]="saved()" /></label
          ><label>Employer<input formControlName="employer" [readOnly]="saved()" /></label
          ><label>Location<input formControlName="location" [readOnly]="saved()" /></label
          ><label
            >Work format<select formControlName="workFormat">
              <option value="unknown">Unknown</option>
              <option value="office">Office</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select></label
          ><label>Salary as stated<input formControlName="salaryRaw" [readOnly]="saved()" /></label
          ><label
            >Currency (only if stated)<input
              formControlName="currency"
              [readOnly]="saved()" /></label
          ><label
            >Pay period (only if stated)<input formControlName="period" [readOnly]="saved()"
          /></label>
        </div>
        @if (!saved()) {
          <button type="submit" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save vacancy' }}
          </button>
        } @else {
          <p role="status" class="text-green-800">
            Saved locally. Automatic extraction and editing come in the next step.
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
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.saved.set(true);
      this.loading.set(true);
      this.api.get(id).subscribe({
        next: (vacancy) => {
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
          this.form.disable();
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
  save() {
    if (this.saved() || this.saving() || this.unavailable()) return;
    this.error.set('');
    try {
      const input = validateVacancy(this.form.getRawValue());
      this.saving.set(true);
      this.api.create(input).subscribe({
        next: (vacancy) => {
          this.saving.set(false);
          void this.router.navigate(['/vacancies', vacancy.id]);
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
