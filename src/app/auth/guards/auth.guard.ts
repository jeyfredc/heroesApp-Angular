import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { tap, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
 
const isAuthenticated = (): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication().pipe(
      take(1),
      tap((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
              router.navigate(['./auth/login']);
          }
      }),
  );
}
 
export const AuthActivateGuard:CanActivateFn = isAuthenticated;
export const AuthMatchGuard:CanMatchFn = isAuthenticated;