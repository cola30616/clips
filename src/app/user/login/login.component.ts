import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isValid = false;
  credentials = {
    email: '',
    password: '',
  };
  showAlert = false;
  alertMessage = '登入中，請稍後';
  alertColor = 'blue';
  inSubmission = false;
  constructor(private auth: AngularFireAuth) {}
  async login() {
    this.showAlert = true;
    this.alertMessage = '請稍等，正在登入中';
    this.alertColor = 'blue';
    this.inSubmission = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (e) {
      this.inSubmission = false;
      this.alertMessage = '發生未預期錯誤，請稍後再試';
      this.alertColor = 'red';
      return;
    }
    this.alertMessage = '登入成功';
    this.alertColor = 'green';
  }
}
