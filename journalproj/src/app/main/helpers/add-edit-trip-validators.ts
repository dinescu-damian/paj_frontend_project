import { FormControl, ValidationErrors } from '@angular/forms';

export class AddEditValidators {
  public static spendingValidator(
    spending: FormControl
  ): ValidationErrors | null {
    if (!Number.isInteger(spending?.value)) {
      return { invalidSpending: true };
    }
    if (spending?.value <= 0) {
      return { invalidSpending: true };
    }
    return null;
  }

  public static ratingValidator(rating: FormControl): ValidationErrors | null {
    //check for rating to be an integer and between 0 and 5
    if (!Number.isInteger(rating?.value)) {
      return { invalidRating: true };
    }
    if (rating?.value <= 0) {
      return { invalidRating: true };
    }
    if (rating?.value > 5) {
      return { invalidRating: true };
    }
    return null;
  }

  public static dateValidator(date: FormControl): ValidationErrors | null {
    // Regular expression to match the date format
    const DATE_REGEXP = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if (date && !DATE_REGEXP.test(date.value)) {
      return { invalidDate: true };
    }

    const [day, month, year] = date.value.split('/').map(Number);

    // Check if the month is valid
    if (month < 1 || month > 12) {
      return { invalidDate: true };
    }

    // Check if the day is valid for the given month and year
    const maxDays = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDays) {
      return { invalidDate: true };
    }

    return null;
  }
}
