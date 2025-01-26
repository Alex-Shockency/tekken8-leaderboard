import { ApplicationConfig } from '@angular/core';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth0({
      domain: 'dev-1u3mkawux2yfhfx8.us.auth0.com',
      clientId: 'PDg2CWhSMfKPyYP87RNCGHYpoTB8KMPB',
      authorizationParams: {
        redirect_uri: window.location.origin,
        // Request this audience at user authentication time
        audience: 'https://dev-1u3mkawux2yfhfx8.us.auth0.com/api/v2/',
        // Request this scope at user authentication time
        scope: 'read:current_user',
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: 'https://dev-1u3mkawux2yfhfx8.us.auth0.com/api/v2/*',
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: 'https://dev-1u3mkawux2yfhfx8.us.auth0.com/api/v2/',
                // The attached token should have these scopes
                scope: 'read:current_user',
              },
            },
          },
        ],
      },
    }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
  ],
};
