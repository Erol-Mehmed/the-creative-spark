import { AbstractControl } from '@angular/forms';

export function noWhiteSpaceValidator(control: AbstractControl) {
  if (control.value && control.value.trim().length === 0) {
    return { whitespace: true };
  }

  return null;
}
