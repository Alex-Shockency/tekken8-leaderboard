import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../Shared/material.module';
import { UserService } from '../../Services/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-entry-form',
  imports: [MaterialModule],
  templateUrl: './new-entry-form.component.html',
  styleUrls: ['./new-entry-form.component.css'],
  standalone: true,
})
export class NewEntryFormComponent {
  states: { name: string; code: string }[] = [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Delaware', code: 'DE' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' },
    { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' },
    { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' },
  ];
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

          // TODO: Review - nesting subscribe like this kosher?
          this.auth.getAccessTokenSilently().subscribe((token) => {
            this.userService.createUserData(userData, token).subscribe(
              (response: any) => {
                console.log('User data created successfully', response);
              },
              (error: any) => {
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
