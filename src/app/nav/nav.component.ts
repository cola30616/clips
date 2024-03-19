import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(public modal: ModalService, public auth: AuthService) {
    // 引入是否登陸的程式碼，來確認是否修改
  }

  ngOnInit(): void {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModel('auth');
  }
}
