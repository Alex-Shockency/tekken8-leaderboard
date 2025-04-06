import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MaterialModule } from '../../Shared/material.module';
import { NewEntryFormComponent } from './user-entry-form/user-entry-form.component';
import { UserService } from '../../Services/user/user.service';
import { ReturnedUserData, UserData } from '../../Models/user';
import { states } from '../../Shared/utilities';
import { PlayerData } from '../../Models/playerData';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-user-profile',
    imports: [ MaterialModule, NewEntryFormComponent],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  // Authenticated User Data
  currentUser: {
    userData: ReturnedUserData;
    playerData: PlayerData;
  } | null = null;

  // Unauthenticated User Data
  isError = false;
  isUnregisteredUser: boolean = false;
  states = states;
  stateForm: FormGroup;

  constructor(private userService: UserService, public auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (!user || !user.sub) {
        return;
      } else {
        this.auth.getAccessTokenSilently().subscribe((token) => {
          this.userService.getUserById(user.sub as string, token).subscribe(
            (result) => {
              this.currentUser = result;
            },
            (error) => {
              // User not found
              if (error.status === 404) {
                this.isUnregisteredUser = true;
              } else {
                this.isError = true;
              }
            }
          );
        });
      }
    });

    this.stateForm = new FormGroup({
      state: new FormControl(''),
    });
  }

  onSubmit() {
    if (this.stateForm.valid) {
      if (this.currentUser) {
        const userData = {
          ...this.stateForm.value,
          userId: this.currentUser.userData._id,
          tekkenId: this.currentUser.userData.tekkenId,
        };

        this.auth.getAccessTokenSilently().subscribe((token) => {
          this.userService.updateUserData(userData, token).subscribe(
            () => {
              window.location.reload();
            },
            (error: any) => {
              this.isError = true;
              console.error('Error creating user data', error);
            }
          );
        });
      } else {
        console.error('No user authenticated.');
        return;
      }
    }
  }
}
