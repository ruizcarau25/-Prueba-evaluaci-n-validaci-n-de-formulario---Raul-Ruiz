import { TestBed } from '@angular/core/testing';
import { RegisterFormPage } from './pages/register-form-page/register-form-page';

describe('RegisterFormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormPage],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RegisterFormPage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the registration form and disables submit while invalid', async () => {
    const fixture = TestBed.createComponent(RegisterFormPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Registro de mascota');
    expect(compiled.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('shows field errors only after interaction', () => {
    const fixture = TestBed.createComponent(RegisterFormPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('El nombre es obligatorio');
    fixture.componentInstance.form.get('owner.name')?.markAsTouched();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('El nombre es obligatorio');
  });

  it('validates Spanish contact and pet identifiers', () => {
    const app = TestBed.createComponent(RegisterFormPage).componentInstance;
    const name = app.form.get('owner.name');
    const phone = app.form.get('owner.phone');
    const microchip = app.form.get('pet.microchip');

    name?.setValue('Lucía');
    phone?.setValue('+34 612345678');
    microchip?.setValue('123456789012345');

    expect(name?.valid).toBe(true);
    expect(phone?.valid).toBe(true);
    expect(microchip?.valid).toBe(true);

    phone?.setValue('512345678');
    microchip?.setValue('12345678901234');
    expect(phone?.hasError('pattern')).toBe(true);
    expect(microchip?.hasError('pattern')).toBe(true);
  });

  it('accepts a password with all required character types', () => {
    const password = TestBed.createComponent(RegisterFormPage).componentInstance.form.get('account.password');

    password?.setValue('BuenasMascota7');
    expect(password?.valid).toBe(true);

    password?.setValue('buenasmascota7');
    expect(password?.hasError('uppercase')).toBe(true);
    expect(password?.hasError('lowercase')).toBe(false);
    expect(password?.hasError('number')).toBe(false);
  });
});
