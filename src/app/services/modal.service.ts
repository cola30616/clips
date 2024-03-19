import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];
  constructor() {}

  //解決memory leak 的問題
  unregister(id: string) {
    this.modals = this.modals.filter((element) => element.id !== id);
  }

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  isModelOpen(id: string): boolean {
    //使用singleton 來找到需要使用service 的元件
    // 這邊使用optional chaining ，?. == 如果前面找不到，來避免 return undefined 發生錯誤
    // *!!* 將expression 轉成boolean
    return !!this.modals.find((element) => element.id === id)?.visible;
  }

  toggleModel(id: string) {
    const modal = this.modals.find((element) => element.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
    //this.visible = !this.visible;
  }
}
