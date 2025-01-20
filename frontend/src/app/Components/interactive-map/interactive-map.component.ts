import { Component } from '@angular/core';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [TopNavComponent, HomeComponent],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})
export class InteractiveMapComponent {

}
