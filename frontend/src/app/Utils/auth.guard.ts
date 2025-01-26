import { Injectable } from '@angular/core';
import { AuthGuard } from '@auth0/auth0-angular';

@Injectable({ providedIn: 'root' })
export class AppAuthGuard extends AuthGuard {}
