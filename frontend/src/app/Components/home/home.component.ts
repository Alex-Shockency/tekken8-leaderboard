import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../Shared/material.module';
import { RankingService } from '../../Services/ranking.service';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { Router } from '@angular/router';
import { PlayerData } from '../../Models/playerData';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, TopNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: any;
  isLoading = true;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  players: PlayerData[] = [];
  qualifiedPlayers: PlayerData[] = [];

  constructor(private rankingService: RankingService, private router: Router) {
    rankingService.getRankings().subscribe((result) => {
      this.players = result;
      this.qualifiedPlayers = result.filter(ranking => {
        return ranking.max_qual_chara > -1;
      }).sort((a,b)=>b.max_qual_rating-a.max_qual_rating)
      this.isLoading = false;
    });

  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  routeToPlayerInfo(tekkenId: string) {
    tekkenId = tekkenId.replaceAll('-', '')
    this.router.navigate([`/playerInfo/${tekkenId}`])
  }
}
