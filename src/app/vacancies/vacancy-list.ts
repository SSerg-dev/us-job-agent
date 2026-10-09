import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Vacancy } from '../../domain/vacancy';
import { VacancyApi } from './vacancy-api';
@Component({
  selector: 'app-vacancy-list',
  imports: [RouterLink],
  template: `<div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">Saved vacancies</h1>
        <p class="text-slate-600 mt-2">Your private local vacancy library.</p>
      </div>
      <a class="action" routerLink="/vacancies/new">Add vacancy</a>
    </div>
    @if (loading()) {
      <p role="status">Loading vacancies…</p>
    }
    @if (error()) {
      <p role="alert">{{ error() }}</p>
      <button (click)="load()">Retry</button>
    }
    @if (!loading() && !error() && !vacancies().length) {
      <section class="bg-white p-10 rounded-xl border border-slate-200">
        <h2 class="text-xl font-semibold">No vacancies yet</h2>
        <p class="mt-3">
          Paste a job description to get started. Nothing is fetched or sent automatically.
        </p>
      </section>
    }
    <ul class="grid gap-4">
      @for (vacancy of vacancies(); track vacancy.id) {
        <li class="bg-white p-6 rounded-xl border border-slate-200">
          <a
            class="text-xl font-semibold text-blue-800"
            [routerLink]="['/vacancies', vacancy.id]"
            >{{ vacancy.title || 'Untitled vacancy' }}</a
          >
          <p>
            {{ vacancy.employer || 'Unknown employer' }} ·
            {{ vacancy.location || 'Unknown location' }}
          </p>
          <p class="text-sm text-slate-500 mt-2">
            {{ vacancy.workFormat }} · {{ vacancy.salaryRaw || 'Salary unknown' }}
          </p>
        </li>
      }
    </ul>`,
})
export class VacancyList {
  private api = inject(VacancyApi);
  vacancies = signal<Vacancy[]>([]);
  loading = signal(true);
  error = signal('');
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.list().subscribe({
      next: (rows) => {
        this.vacancies.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load vacancies. Check the local server.');
        this.loading.set(false);
      },
    });
  }
}
