import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}
  inSubmission = false;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailTaken.validate]
  );
  age = new FormControl<number | null>(null, [
    Validators.required,
    // min() max()指定數字填寫範圍
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    // 加入正規表達式
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    // 這裡一定要寫12 因為要把mask 的值加進去
    Validators.maxLength(12),
  ]);

  showAlert = false;
  alertMsg = '請稍等，您的帳號正在創立';
  alertColor = 'blue';

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirm_password: this.confirm_password,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

  async register() {
    this.showAlert = true;
    this.alertMsg = '請稍等，您的帳號正在創立';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.CreateUser(this.registerForm.value as IUser);
    } catch (e) {
      console.log(e);
      this.alertMsg = '發生未預期錯誤，請稍後再試';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = '恭喜，帳號新增成功';
    this.alertColor = 'green';
  }
}
