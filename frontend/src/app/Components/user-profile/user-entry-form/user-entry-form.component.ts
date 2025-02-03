import { Component, input, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../../Shared/material.module';
import { UserService } from '../../../Services/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { states } from '../../../Shared/utilities';

@Component({
  selector: 'app-user-entry-form',
  imports: [MaterialModule],
  templateUrl: './user-entry-form.component.html',
  styleUrls: ['./user-entry-form.component.css'],
  standalone: true,
})
export class NewEntryFormComponent {
  states = states;
  entryForm: FormGroup;

  constructor(private userService: UserService, private auth: AuthService) {
    this.entryForm = new FormGroup({
      tekkenId: new FormControl(''),
      state: new FormControl(''),
    });
  }

  onSubmit() {
    // TODO: I don't think you're supposed to nest subscribes but I don't know how to do this better in Angular
    if (this.entryForm.valid) {
      this.auth.user$.subscribe((user) => {
        if (user && user.sub) {
          const userData = {
            ...this.entryForm.value,
            userId: user.sub,
          };

          this.auth.getAccessTokenSilently().subscribe((token) => {
            this.userService.upsertUserData(userData, token).subscribe(
              () => {
                window.location.reload();
              },
              (error: any) => {
                // TODO: Do something on user error
                console.error('Error creating user data', error);
              }
            );
          });
        } else {
          console.error('No user authenticated.');
          return;
        }
      });
    }
  }
}
