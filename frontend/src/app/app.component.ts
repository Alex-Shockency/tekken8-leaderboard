import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './Shared/material.module';
import { RankingService } from './Services/ranking.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule],
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
  
    constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.rankingService.getLastUpdate().subscribe((result) => {
      this.lastUpdate = new Date(result.date).toLocaleString('en-US');
    });
  }
}


