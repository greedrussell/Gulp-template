import { FormGroup } from './interface';
import { ValidationService } from './validation.service';

export class App {
  private phone: HTMLElement;
  private password: HTMLElement;

  private formGroup: FormGroup[];

  constructor(
    private validationService: ValidationService
  ) {
    this.phone =  document.querySelector('[data-name="phone"]');
    this.password = document.querySelector('[data-name="password"]');

    this.formGroup = [
      {
        elem: this.phone,
        validators: ['required', 'phone']
      },
      {
        elem: this.password,
        validators: ['required', 'minSize(4)']
      }
    ];
  }

  init() {
    this.setBaseStateField();
  }

  private setBaseStateField(): void {
    this.formGroup.forEach(({ elem, validators }) => {
      const field = elem.querySelector('input') || elem.querySelector('textarea');

      elem.classList.add('not-focus');

      field.addEventListener('focus', this.isFocus.bind(this, elem));
      field.addEventListener('blur', this.isBlur.bind(this, elem, validators));
      field.addEventListener('input', this.isInput.bind(this, elem, validators));
    });
  }

  private isFocus(elem) {
    elem.classList.add('focus');
  }

  private isBlur(elem, validators) {
    const field = elem.querySelector('input') || elem.querySelector('textarea');
    const isValid = this.validationService.validate(field, validators);
    
    this.isFieldEmpty(elem, field);
    this.isFieldValid(elem, isValid);
    
    elem.classList.remove('focus');
    elem.classList.remove('not-focus');
  }

  private isInput(elem, validators) {
    const field = elem.querySelector('input') || elem.querySelector('textarea');
    const isValid = this.validationService.validate(field, validators);

    if (field.value.length) {
      elem.classList.remove('not-focus');
    }
    
    if (!elem.classList.contains('not-focus')) {
      this.isFieldEmpty(elem, field);
      this.isFieldValid(elem, isValid);
    }
  }

  private isFieldValid(elem: HTMLElement, isValid: boolean): void {
    if (!isValid) {
      elem.classList.remove('valid');
      elem.classList.add('invalid');
    } else {
      elem.classList.remove('invalid');
      elem.classList.add('valid');
    }
  }

  private isFieldEmpty(elem: HTMLElement, field: HTMLInputElement): void {
    if (!field.value.length) {
      elem.classList.add('empty');
    } else {
      elem.classList.remove('empty');
    }
  }
}
