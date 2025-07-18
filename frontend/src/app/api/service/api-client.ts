import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Signal, signal } from '@angular/core';
import { AuthResponse } from '../../types/types';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private accessToken = signal<string | null>(null);
  private readonly BASE = `${environment.apiUrl}/auth`;
  private readonly PUBLIC_HEADERS = new HttpHeaders({
    'x-api-key': environment.publicApiKey,
  });

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this.accessToken();
  }

  logout() {
    this.accessToken.set(null);
  }

  setToken(token: string) {
    this.accessToken.set(token);
  }

  register(email: string, userName: string) {
    return this.http.post(
      `${this.BASE}/register`,
      { email, userName },
      { headers: this.PUBLIC_HEADERS }
    );
  }

  login(email: string) {
    return this.http.post(
      `${this.BASE}/login`,
      { email },
      { headers: this.PUBLIC_HEADERS }
    );
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post<AuthResponse>(
      `${this.BASE}/verify-otp`,
      { email, otp },
      { headers: this.PUBLIC_HEADERS }
    );
  }

  getMe() {
    const token = this.accessToken();
    if (!token) return;

    return this.http.get(`${this.BASE}/me`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
