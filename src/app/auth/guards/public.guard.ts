
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { tap, Observable, take, map } from 'rxjs';
import { AuthService } from '../services/auth.service'; 
 
const isAuthenticated = (): Observable<boolean > => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication()
  .pipe(
      take(1),
      tap((isAuthenticated: boolean) => {
        if (isAuthenticated) {
            router.navigate(['./']);
          }
        }),
        map(isAuthenticated => !isAuthenticated)
      )
    }
 
export const publicActivateGuard:CanActivateFn = isAuthenticated;
export const publicMatchGuard:CanMatchFn = isAuthenticated;