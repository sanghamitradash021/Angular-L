// src/app/interceptors/error.interceptor.ts

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger'; // <-- 1. Import NGXLogger

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const logger = inject(NGXLogger); // <-- 2. Inject the logger

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `A client-side error occurred: ${error.error.message}`;
      } else {
        if (error.status === 0) {
          errorMessage = 'Could not connect to the server. Please check your network connection.';
        } else if (error.error && typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server returned HTTP ${error.status}: ${error.message}`;
        }
      }

      // --- 3. Use the logger instead of console.error ---
      logger.error(errorMessage, { requestUrl: req.url, error });
      
      return throwError(() => error);
    }),
  );
};