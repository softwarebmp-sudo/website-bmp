import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('admin_session') === 'true');
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  login() {
    localStorage.setItem('admin_session', 'true');
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('admin_session');
    this.isLoggedInSubject.next(false);
  }
}
