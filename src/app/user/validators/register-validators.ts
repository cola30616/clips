import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
export class RegisterValidators {
  // 密碼跟確認密碼一致
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    // factory function (一種設計模式，用於指定對應物件。)
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);
      // 確認是否為空
      if (!control || !matchingControl) {
        console.error('找不到表單控制');
        return { controlNotFound: false };
      }
      const error =
        control.value === matchingControl.value ? null : { noMatch: true };
      // 要將錯誤定義到form group 當中，讓表單能抓到錯誤
      matchingControl.setErrors(error);
      return error;
    };
  }
}
