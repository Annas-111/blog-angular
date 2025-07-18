// src/app/api/auth.api.ts
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

const http = inject(HttpClient);
const BASE = environment.apiUrl + '/auth';

export const authApi = {
  sendOtp: (email: string) => http.post(`${BASE}/register`, { email }),
  verifyOtp: (email: string, otp: string) =>
    http.post<{ access_token: string }>(`${BASE}/login`, { email, otp }),
};
