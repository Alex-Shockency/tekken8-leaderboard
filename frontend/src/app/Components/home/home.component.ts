import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../Shared/material.module';
import { RankingService } from '../../Services/ranking.service';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { Router } from '@angular/router';
import { PlayerData } from '../../Models/playerData';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { InteractiveMapComponent } from "../interactive-map/interactive-map.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, TopNavComponent, InteractiveMapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  myControl = new FormControl('');
  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: any;
  isLoading = true;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  players: any[] = [];
  filteredPlayers!: Observable<any[]>;
  qualifiedPlayers: any[] = [];
  filteredQualifiedPlayers!: Observable<any[]>;

  constructor(rankingService: RankingService, private router: Router) {
    rankingService.getRankings().subscribe((result) => {
     
      result.forEach(player => {
        if (player.rankings.length > 0) {
          //Rankings are ordered by rating so just get first
          let playerData = player.rankings[0]
          playerData.name = player.name
          playerData.tekken_id = player.tekken_id
          playerData.date = new Date(player.rankings[0].date).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          this.players.push(playerData);
          
        }

        if (player.qual_rankings.length > 0) {
          //Rankings are ordered by rating so just get first
          let playerData = player.qual_rankings[0]
          playerData.name = player.name
          playerData.tekken_id = player.tekken_id
          playerData.date = new Date(player.qual_rankings[0].date).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          this.qualifiedPlayers.push(playerData);
        }
      })
      let index= 0;
      this.players.sort((player1, player2) => {
        return player2.rating - player1.rating;
      }).map(player =>{
        player.ranking = index;
        index++;
      })
      let qualIndex= 0;
      this.qualifiedPlayers.sort((player1, player2) => {
        return player2.rating - player1.rating;
      }).map(player =>{
        player.ranking = qualIndex;
        qualIndex++;
      })

      this.isLoading = false;
    });

  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.filteredQualifiedPlayers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._qualFilter(value || ''))
    )
    this.filteredPlayers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )
  }

  routeToPlayerInfo(tekkenId: string) {
    tekkenId = tekkenId.replaceAll('-', '')
    this.router.navigate([`/playerInfo/${tekkenId}`])
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.players.filter(player => player.name.toLowerCase().includes(filterValue));
  }

  private _qualFilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.qualifiedPlayers.filter(player => player.name.toLowerCase().includes(filterValue));
  }
}
