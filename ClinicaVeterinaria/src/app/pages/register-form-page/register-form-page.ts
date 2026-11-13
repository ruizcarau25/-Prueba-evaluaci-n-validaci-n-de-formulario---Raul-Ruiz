import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const namedPattern = (name: string, pattern: string): ValidatorFn => {
  const validator = Validators.pattern(pattern);
  return (control) => (validator(control) ? { [name]: true } : null);
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register-form-page',
  templateUrl: './register-form-page.html',
})
export class RegisterFormPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly species = ['Perro', 'Gato', 'Ave', 'Otro'];
  submitted = false;

  private readonly validationMessages: Record<string, Record<string, string>> = {
    'owner.name': {
      required: 'El nombre es obligatorio',
      minlength: 'Mínimo 2 caracteres',
      maxlength: 'Máximo 30 caracteres',
      lettersOnly: 'Solo se permiten letras',
    },
    'owner.surname': {
      required: 'Los apellidos son obligatorios',
      minlength: 'Mínimo 2 caracteres',
      maxlength: 'Máximo 50 caracteres',
      lettersOnly: 'Solo se permiten letras',
    },
    'owner.phone': {
      required: 'El teléfono es obligatorio',
      pattern: 'Introduce un teléfono español válido',
    },
    'owner.email': {
      required: 'El email es obligatorio',
      email: 'Formato de email no válido',
    },
    'pet.name': {
      required: 'El nombre de la mascota es obligatorio',
      minlength: 'Entre 2 y 20 caracteres',
      maxlength: 'Entre 2 y 20 caracteres',
      petNamePattern: 'Solo letras, espacios y guiones',
    },
    'pet.species': { required: 'Selecciona una especie' },
    'pet.sex': { required: 'Indica el sexo de la mascota' },
    'pet.breed': { maxlength: 'Máximo 40 caracteres' },
    'pet.age': {
      required: 'La edad es obligatoria',
      min: 'La edad debe estar entre 0 y 30 años',
      max: 'La edad debe estar entre 0 y 30 años',
    },
    'pet.weight': {
      required: 'El peso es obligatorio',
      min: 'El peso debe estar entre 0,1 y 90 kg',
      max: 'El peso debe estar entre 0,1 y 90 kg',
    },
    'pet.microchip': {
      required: 'El microchip es obligatorio',
      pattern: 'El microchip debe tener exactamente 15 dígitos numéricos',
    },
    'account.password': {
      required: 'La contraseña es obligatoria',
      minlength: 'Debe tener al menos 10 caracteres',
      maxlength: 'No puede superar los 24 caracteres',
      uppercase: 'Incluye al menos una mayúscula',
      lowercase: 'Incluye al menos una minúscula',
      number: 'Incluye al menos un número',
      noSpaces: 'No incluyas espacios',
    },
    'visit.reason': {
      required: 'Describe el motivo de la visita',
      minlength: 'Entre 10 y 300 caracteres',
      maxlength: 'Entre 10 y 300 caracteres',
    },
    'visit.privacy': { required: 'Debes aceptar la política de privacidad' },
  };

  readonly form = this.formBuilder.nonNullable.group({
    owner: this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          namedPattern('lettersOnly', '^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$'),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          namedPattern('lettersOnly', '^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$'),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern('^(?:\\+34\\s?)?[6789]\\d{8}$')]],
      email: ['', [Validators.required, Validators.email]],
    }),
    pet: this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          namedPattern('petNamePattern', '^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ -]+$'),
        ],
      ],
      species: ['', Validators.required],
      sex: ['', Validators.required],
      breed: ['', Validators.maxLength(40)],
      age: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      weight: ['', [Validators.required, Validators.min(0.1), Validators.max(90)]],
      microchip: ['', [Validators.required, Validators.pattern('^\\d{15}$')]],
    }),
    account: this.formBuilder.nonNullable.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(24),
          namedPattern('uppercase', '.*[A-Z].*'),
          namedPattern('lowercase', '.*[a-z].*'),
          namedPattern('number', '.*[0-9].*'),
          namedPattern('noSpaces', '^\\S+$'),
        ],
      ],
    }),
    visit: this.formBuilder.nonNullable.group({
      reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      privacy: [false, Validators.requiredTrue],
      vaccineReminders: [false],
    }),
  });

  shouldShowError(path: string): boolean {
    const control = this.form.get(path);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  errorMessages(path: string): string[] {
    const control = this.form.get(path);
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return [];
    }

    return Object.entries(this.validationMessages[path] ?? {})
      .filter(([error]) => control.hasError(error))
      .map(([, message]) => message);
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted = true;
  }
}