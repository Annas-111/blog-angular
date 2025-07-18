import { signal, Injectable } from '@angular/core';
import { UserInfo } from '../../types/types';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  // seed from localStorage or null
  private _user = signal<UserInfo | null>(
    JSON.parse(localStorage.getItem('user_info') || 'null')
  );

  readonly userSignal = this._user;

  setUser(user: UserInfo) {
    localStorage.setItem('user_info', JSON.stringify(user));
    this._user.set(user);
  }

  clear() {
    localStorage.removeItem('user_info');
    this._user.set(null);
  }

  get user(): UserInfo | null {
    return this._user();
  }
}
