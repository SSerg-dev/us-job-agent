import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Vacancy, VacancyInput, VacancyUpdate } from '../../domain/vacancy';
@Injectable({ providedIn: 'root' })
export class VacancyApi {
  private http = inject(HttpClient);
  list() {
    return this.http.get<Vacancy[]>('/api/vacancies');
  }
  get(id: string) {
    return this.http.get<Vacancy>(`/api/vacancies/${encodeURIComponent(id)}`);
  }
  create(input: VacancyInput) {
    return this.http.post<Vacancy>('/api/vacancies', input);
  }
  update(id: string, input: VacancyUpdate) {
    return this.http.put<Vacancy>(`/api/vacancies/${encodeURIComponent(id)}`, input);
  }
}
