import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './Shared/material.module';
import { TopNavComponent } from "./Components/top-nav/top-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tekken8-leaderboard';
  currentYear = (new Date()).getFullYear();
}
