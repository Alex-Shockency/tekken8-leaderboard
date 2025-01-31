import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../Shared/material.module';
import { UserService } from '../../Services/user/user.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-new-entry-form',
  imports: [MaterialModule],
  templateUrl: './new-entry-form.component.html',
  styleUrls: ['./new-entry-form.component.css'],
  standalone: true,
})
export class NewEntryFormComponent {
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];
  entryForm: FormGroup;

  constructor(private userService: UserService, private auth: AuthService) {
    this.entryForm = new FormGroup({
      tekkenId: new FormControl(''),
      displayName: new FormControl(''),
      platform: new FormControl(''),
      state: new FormControl(''),
      platformId: new FormControl(''),
    });
  }

  // TODO: more form validation on id lengths
  onSubmit() {
    if (this.entryForm.valid) {
      this.auth.getAccessTokenSilently().subscribe((token) => {
        this.userService.createUserData(this.entryForm.value, token).subscribe(
          (response: any) => {
            console.log('User data created successfully', response);
          },
          (error: any) => {
            console.error('Error creating user data', error);
          }
        );
      });
     
    }
  }
}
