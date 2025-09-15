// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes)
//   ]
// };

import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),


    importProvidersFrom(
      LoggerModule.forRoot({
        // During development, log everything to the console.
        level: isDevMode() ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR,
        
        // In production, you can send critical errors to your backend.
        serverLoggingUrl: '/api/logs', // The API endpoint on your Node.js server
        serverLogLevel: NgxLoggerLevel.ERROR,
      })
    ),
  ],
};

