import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Attaches the bearer token to every outgoing request (except login, which
 * doesn't need one) and, on a 401 response, clears the session and bounces
 * the user back to /login instead of leaving them staring at a broken page.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authorizedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
