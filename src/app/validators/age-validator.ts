import { AbstractControl, ValidationErrors } from "@angular/forms";

export class AgeValidator {
  static minimumAge(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // Ignore empty values, required validator will handle them

      const dob = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      // Adjust age if birthday hasn’t occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }
}
