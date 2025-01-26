import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NgIf, AsyncPipe } from '@angular/common';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { MaterialModule } from '../../Shared/material.module';
import { NewEntryFormComponent } from '../new-entry/new-entry-form.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgIf,
    AsyncPipe,
    TopNavComponent,
    MaterialModule,
    NewEntryFormComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  standalone: true,
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}
