import { HttpInterceptorFn } from '@angular/common/http';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the URL is relative (doesn't start with http/https)
  if (!req.url.startsWith('http')) {
    // Prepend the API URL and clone the request
    const apiReq = req.clone({
      url: `http://localhost:3000/api/${req.url}`
    });
    return next(apiReq);
  }

  // If the URL is already absolute, proceed without modification
  return next(req);
};