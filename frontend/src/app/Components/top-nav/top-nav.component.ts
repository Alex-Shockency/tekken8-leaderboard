import { Component, HostListener } from '@angular/core';
import { RankingService } from '../../Services/ranking.service';
import { MaterialModule } from '../../Shared/material.module';
import { RouterModule } from '@angular/router';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
    selector: 'app-top-nav',
    imports: [MaterialModule, RouterModule, AuthButtonComponent, SearchBarComponent],
    templateUrl: './top-nav.component.html',
    styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
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
