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
