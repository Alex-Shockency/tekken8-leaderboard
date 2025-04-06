import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../Shared/material.module';
import { RankingService } from '../../Services/ranking.service';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { Router } from '@angular/router';
import { PlayerData } from '../../Models/playerData';
import { FormControl } from '@angular/forms';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { InteractiveMapComponent } from "../interactive-map/interactive-map.component";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { Utilities } from '../../Shared/utilities';
import {forwardRef} from '@angular/core';

@Component({
    selector: 'app-home',
    imports: [MaterialModule, InteractiveMapComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  filterControl = new FormControl('');
  charControl = new FormControl('All');

  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: any;
  isLoading = true;
  headerText = "Top 500 Leaderboard America";

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  players: any[] = [];
  filteredPlayers!: Observable<any[]>;
  qualifiedPlayers: any[] = [];
  filteredQualifiedPlayers!: Observable<any[]>;
  charArray: string[] = [];
  filteredChars!: Observable<string[]>;
  pageNum = 1;
  pageSize = 100;

  constructor(private rankingService: RankingService, private router: Router, public utilities: Utilities) {
    this.charArray = utilities.charArray;
    let rank = 0;
    let observables = [];
    for (let i = 0; i < (500 / this.pageSize); i++) {
      observables.push(rankingService.getRankings(this.pageNum, this.pageSize))
      this.pageNum += 1
    }

    forkJoin(observables).pipe(map(result => {
      result.forEach(playerArr => {
        playerArr.forEach(player => {
          if (player.max_qual_chara) {
            //Rankings are ordered by rating so just get first
            let leaderboardRank = player.max_qual_chara as any
            leaderboardRank.name = player.name
            leaderboardRank.tekken_id = player.tekken_id
            leaderboardRank.date = new Date(player.max_qual_chara.date).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            leaderboardRank.ranking = rank
            this.qualifiedPlayers.push(leaderboardRank);
            rank++;
          }
          this.isLoading = false;
        })
      })
    })).subscribe()
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.filteredQualifiedPlayers = this.filterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._qualFilter(value || ''))
    )
    this.filteredChars = this.charControl.valueChanges.pipe(
      startWith(''),
      map(value => this._charFilter(value || ''))
    )
  }

  charSelected(event: MatAutocompleteSelectedEvent) {
    this.isLoading = true;
    let charId = this.utilities.charaNameMap.get(event.option.value);
    this.pageNum = 1;
    if (event.option.value == "All") {
      this.headerText = "Top 500 Leaderboard America";
      let rank = 0;
      let observables = [];
      this.qualifiedPlayers = [];
      for (let i = 0; i < (500 / this.pageSize); i++) {
        observables.push(this.rankingService.getRankings(this.pageNum, this.pageSize))
        this.pageNum += 1
      }

      forkJoin(observables).pipe(map(result => {
        result.forEach(playerArr => {
          playerArr.forEach(player => {
            if (player.max_qual_chara) {
              //Rankings are ordered by rating so just get first
              let leaderboardRank = player.max_qual_chara as any
              leaderboardRank.name = player.name
              leaderboardRank.tekken_id = player.tekken_id
              leaderboardRank.date = new Date(player.max_qual_chara.date).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              leaderboardRank.ranking = rank
              this.qualifiedPlayers.push(leaderboardRank);
              rank++;
            }
            this.isLoading = false;
          })
        })
      })).subscribe()

    } else {
      this.headerText = `Top 100 ${this.utilities.charaIdMap.get(charId)} America`
      let rank = 0;
      this.qualifiedPlayers = [];
      this.rankingService.getRankingsByChar(charId).subscribe((result) => {
        this.filteredQualifiedPlayers = this.filterControl.valueChanges.pipe(
          startWith(''),
          map(value => this._qualFilter(value || ''))
        )

        result.forEach(player => {
          if (player.max_qual_chara) {
            //Rankings are ordered by rating so just get first
            let leaderboardRank = player.max_qual_chara as any
            leaderboardRank.name = player.name
            leaderboardRank.tekken_id = player.tekken_id
            leaderboardRank.date = new Date(player.max_qual_chara.date).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            leaderboardRank.ranking = rank
            this.qualifiedPlayers.push(leaderboardRank);
            rank++;
          }
        })

        this.isLoading = false;
      });
    }
  }

  routeToPlayerInfo(tekkenId: string) {
    tekkenId = tekkenId.replaceAll('-', '')
    this.router.navigate([`/playerInfo/${tekkenId}`])
  }

  private _qualFilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.qualifiedPlayers.filter(player => player.name.toLowerCase().includes(filterValue));
  }

  private _charFilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.charArray.filter(char => char.toLowerCase().includes(filterValue))
  }
}
