// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthStateService } from './api/service/authState.service';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router    = inject(Router);

  return authState.token.pipe(
    take(1),  // only need the current value
    map(token => {
      const isAuth = token !== null;
      console.log('authGuard → isAuthenticated:', isAuth);
      return isAuth
        ? true
        : router.createUrlTree(['/auth/login']);
    })
  );
};
