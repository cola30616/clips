import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  //providers: [ModalService],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';
  constructor(public modal: ModalService, public el: ElementRef) {}

  ngOnInit(): void {
    // 如果有父元素，透過content projection 傳入，避免父元素影響傳入的元素
    document.body.appendChild(this.el.nativeElement);
  }

  closeModal() {
    this.modal.toggleModel(this.modalID);
  }

  // 登入完後，將modal 從畫面中移除
  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement);
  }
}
