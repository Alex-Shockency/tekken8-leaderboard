import { ApplicationConfig } from '@angular/core';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth0({
      domain: 'dev-6qq2es4t3n3j10sm.us.auth0.com',
      clientId: 'iS8dUd5AHoeUyqMdH8hecdHkyBFeaOCP',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
