import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 類似EFcore中的DI注入寫法
  private userCollection: AngularFirestoreCollection<IUser>;
  // $ 標示這是一個可觀察物件
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userCollection = db.collection('users');
    // 這邊要偵測是否登入，需要 return boolean
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }
  public async CreateUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('未提供密碼');
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );
    //return object  collection 就像資料表，add資料新增到db
    if (!userCred.user) {
      throw new Error('找不到該用戶');
    }
    // 因為要改成取得UID，所以要用doc ，後面改成set。這是為了要讓
    await this.userCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    // 這個類似viewmodel，顯示使用者名稱
    await userCred.user.updateProfile({
      displayName: userData.name,
    });
  }

  public async logOut($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    // 避免刷新

    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
