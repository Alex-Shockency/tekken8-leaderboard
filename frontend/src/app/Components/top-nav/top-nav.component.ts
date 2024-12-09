import { Component, HostListener } from '@angular/core';
import { RankingService } from '../../Services/ranking.service';
import { MaterialModule } from '../../Shared/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [MaterialModule,RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  
  constructor(private rankingService: RankingService) {
    
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.rankingService.getLastUpdate().subscribe((result) =>{
      this.lastUpdate = result;
    });
  }
}
