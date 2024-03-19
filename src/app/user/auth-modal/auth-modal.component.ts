import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(public modal: ModalService) {}
  ngOnInit(): void {
    this.modal.register('auth');
    //this.modal.register('test');
  }

  // 為了解決重複生成id 陣列的問題，使用onDestroy 解決 memory leak
  ngOnDestroy(): void {
    this.modal.unregister('auth');
  }
}
