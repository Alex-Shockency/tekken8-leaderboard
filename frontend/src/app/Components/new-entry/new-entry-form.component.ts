import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../Shared/material.module';

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

  constructor(private fb: FormBuilder) {
    this.entryForm = this.fb.group({
      tekkenId: ['', Validators.required],
      displayName: ['', [Validators.required, Validators.min(0)]],
      platform: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.entryForm.valid) {
      console.log('Form Submitted!', this.entryForm.value);
      // Handle form submission logic here
    }
  }
}
