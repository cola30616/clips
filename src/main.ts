import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from './environments/environment';

// 讓firebase 比 angular 先載入
firebase.initializeApp(environment.firebase);

let appInit = false;

// 確認有無初始化過，就不用重複載入
firebase.auth().onAuthStateChanged(() => {
  if (!appInit) {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }

  appInit = true;
});
