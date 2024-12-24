// Angular Core
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Angular HTTP Client
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';

// RxJS
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Services
import { AuthService } from './services/auth.service';

/**
 * AuthInterceptor is responsible for adding the user's token to the request headers.
 * The interceptor also handles 401 errors by logging the user out and redirecting to the login page.
 * @param {HttpRequest<unknown>} request - The HTTP request.
 * @param {HttpHandlerFn} next - The HTTP handler function.
 * @returns {Observable<HttpEvent<unknown>>} The HTTP event observable.
 */
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clone the request and add the token to the headers
  let clonedRequest = request;
  if (token) {
    clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request and response errors
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};