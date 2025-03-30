import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../Shared/material.module';
import { RankingService } from '../../Services/ranking.service';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { Utilities } from '../../Shared/utilities';

@Component({
  selector: 'app-state-leaderboard',
  standalone: true,
  imports: [MaterialModule, TopNavComponent, SearchBarComponent],
  templateUrl: './state-leaderboard.component.html',
  styleUrl: './state-leaderboard.component.css'
})
export class StateLeaderboardComponent {
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

  constructor(rankingService: RankingService, private router: Router, private route: ActivatedRoute, public utilities: Utilities) {
    let stateId = route.snapshot.params['stateId']
    rankingService.getStateRankings(stateId).subscribe((result) => {
      result.forEach(player => {
        if (player.rankings.length > 0) {
          //Rankings are ordered by rating so just get first
          let leaderboardRank = player.rankings[0] as any
          leaderboardRank.name = player.name
          leaderboardRank.tekken_id = player.tekken_id
          leaderboardRank.date = new Date(player.rankings[0].date).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          this.players.push(leaderboardRank);
        }

        if (player.qual_rankings.length > 0) {
          //Rankings are ordered by rating so just get first
          let leaderboardRank = player.qual_rankings[0] as any
          leaderboardRank.name = player.name
          leaderboardRank.tekken_id = player.tekken_id
          leaderboardRank.date = new Date(player.qual_rankings[0].date).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          this.qualifiedPlayers.push(leaderboardRank);
        }
      })
      let index = 0;
      this.players.sort((player1, player2) => {
        return player2.rating - player1.rating;
      }).map(player => {
        player.ranking = index;
        index++;
      })
      let qualIndex = 0;
      this.qualifiedPlayers.sort((player1, player2) => {
        return player2.rating - player1.rating;
      }).map(player => {
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
