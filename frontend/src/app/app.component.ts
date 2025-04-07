import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from "./Components/top-nav/top-nav.component";
import { RankingService } from './Services/ranking.service';
import { MaterialModule } from './Shared/material.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tekken8-leaderboard';
  currentYear = (new Date()).getFullYear();
  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: string = new Date().toLocaleString('en-US');

  options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.rankingService.getLastUpdate().subscribe((result) => {
      this.lastUpdate = new Date(result.date).toLocaleString('en-US');
    });
  }
}


