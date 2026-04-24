import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router); // Inject the router to use for redirect
  const isAuthRequest = req.url.includes('/auth-service/auth/');

  let authReq = req;

  // Add the token if it exists and it's not a login/register request
  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.clear();
        const confirmed = window.confirm("Session expired. Please login again.");
        
        if (confirmed || !confirmed) {
          
          router.navigate(['/']);
        }
      }
      return throwError(() => error);
    })
  );
};