import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth0({
      domain: `login.tekkenleaderboard.com`,
      clientId: environment.auth0_client_id,
      authorizationParams: {
        redirect_uri: window.location.origin,
        // Request this audience at user authentication time
        audience: `https://${environment.auth0_domain}/api/v2/`,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `https://${environment.auth0_domain}/api/v2/*`,
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: `https://${environment.auth0_domain}/api/v2/`,
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
