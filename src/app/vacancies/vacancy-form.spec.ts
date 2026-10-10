import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { VacancyForm } from './vacancy-form';
describe('Vacancy intake', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [VacancyForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('does not show a saved confirmation or editable form for an unavailable card', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { paramMap: convertToParamMap({ id: 'missing' }) } },
    });
    const fixture = TestBed.createComponent(VacancyForm);
    TestBed.inject(HttpTestingController)
      .expectOne('/api/vacancies/missing')
      .flush({ error: 'Not found.' }, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'unavailable',
    );
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Saved locally.');
    fixture.componentInstance.save();
    TestBed.inject(HttpTestingController).expectNone('/api/vacancies');
  });
  it('rejects empty intake without any network call', () => {
    const fixture = TestBed.createComponent(VacancyForm);
    fixture.componentInstance.save();
    expect(fixture.componentInstance.error()).toContain('required');
    TestBed.inject(HttpTestingController).expectNone('/api/vacancies');
  });
  it('reviews all fields locally and cancellation preserves exact manual corrections', () => {
    const component = TestBed.createComponent(VacancyForm).componentInstance;
    component.form.controls.sourceText.setValue(
      'Title: Engineer\nCompany: Acme\nCity: Boston\nWork format: Hybrid\nSalary: USD 80/hour',
    );
    component.review();
    expect(component.form.controls.title.value).toBe('Engineer');
    expect(component.form.controls.employer.value).toBe('Acme');
    expect(component.form.controls.workFormat.value).toBe('hybrid');
    expect(component.form.controls.period.value).toBe('hour');
    component.form.controls.title.setValue('  My correction  ');
    component.review();
    expect(component.replacementPending()).toBe(true);
    component.replacementPending.set(false);
    expect(component.form.controls.title.value).toBe('  My correction  ');
    component.review();
    component.applyReview();
    expect(component.form.controls.title.value).toBe('Engineer');
    TestBed.inject(HttpTestingController).expectNone('/api/vacancies');
  });
  it('retains edits after a stale saved-card update', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { paramMap: convertToParamMap({ id: 'saved' }) } },
    });
    const component = TestBed.createComponent(VacancyForm).componentInstance;
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne('/api/vacancies/saved')
      .flush({
        id: 'saved',
        sourceText: 'Title: Engineer',
        sourceUrl: null,
        title: 'Engineer',
        employer: null,
        location: null,
        workFormat: 'unknown',
        salaryRaw: null,
        currency: null,
        period: null,
        revision: 1,
      });
    component.form.controls.title.setValue('My correction');
    component.save();
    const request = http.expectOne('/api/vacancies/saved');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.expectedRevision).toBe(1);
    expect(request.request.body.sourceText).toBeUndefined();
    request.flush({ error: 'Vacancy changed.' }, { status: 409, statusText: 'Conflict' });
    expect(component.form.controls.title.value).toBe('My correction');
    expect(component.error()).toBe('Vacancy changed.');
    expect(component.saving()).toBe(false);
  });
  it('keeps the exact draft after server failure and prevents double-save', () => {
    const fixture = TestBed.createComponent(VacancyForm);
    const component = fixture.componentInstance;
    component.form.patchValue({ sourceText: '  C#\nEngineer  ', title: 'Engineer' });
    component.save();
    component.save();
    const request = TestBed.inject(HttpTestingController).expectOne('/api/vacancies');
    expect(request.request.body.sourceText).toBe('  C#\nEngineer  ');
    request.flush({ error: 'Unable to save.' }, { status: 500, statusText: 'Error' });
    expect(component.form.controls.sourceText.value).toBe('  C#\nEngineer  ');
    expect(component.saving()).toBe(false);
    expect(component.error()).toBe('Unable to save.');
  });
});
