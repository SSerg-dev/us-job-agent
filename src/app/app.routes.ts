import { Routes } from '@angular/router';

import { VacancyList } from './vacancies/vacancy-list';
import { VacancyForm } from './vacancies/vacancy-form';
export const routes: Routes = [
  { path: '', redirectTo: 'vacancies', pathMatch: 'full' },
  { path: 'vacancies', component: VacancyList },
  { path: 'vacancies/new', component: VacancyForm },
  { path: 'vacancies/:id', component: VacancyForm },
  { path: '**', redirectTo: 'vacancies' },
];
