import { Component } from '@angular/core';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { MaterialModule } from '../../Shared/material.module';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [TopNavComponent,MaterialModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

}
