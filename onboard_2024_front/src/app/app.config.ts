// src/app/app.config.ts

// Angular Core
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
// Angular Router
import { provideRouter } from '@angular/router';
// Application Routes
import { routes } from './app.routes';
// Angular Animations
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// HttpClient
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Transloco
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
// Auth Interceptor
import { authInterceptor } from './auth.interceptor';

/**
 * Application Configuration
 * @type {ApplicationConfig}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: { 
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
  ],
};