// src/app/api/service/authState.service.ts
import { signal, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // initialize from storage (or null)
  private _token = signal<string | null>(
    localStorage.getItem('access_token')
  );

  // expose the raw signal if you ever need synchronous reads
  readonly tokenSignal = this._token;
  // expose an Observable for your guard
  readonly token = toObservable(this._token);

  setToken(token: string) {
    localStorage.setItem('access_token', token);
    this._token.set(token);
  }

  get tokenValue(): string | null {
    return this._token();
  }

  clear() {
    localStorage.removeItem('access_token');
    this._token.set(null);
  }
}
