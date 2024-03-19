import { TabComponent } from './../tab/tab.component';
import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  // 為了要讓tab 能動態生成，使用content children(一種project content)，參數傳入tab
  // 這會產生QueryList<要指定> 的物件
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  constructor() {}
  // 使用AfterContentInit 等到content children初始化後才執行，不然程式無法順利執行。

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active);
    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach((tab) => {
      tab.active = false;
    });

    tab.active = true;

    //這段是為了阻止anchor 元素，預設行為，避免導向其他頁面
    return false;
  }
}
