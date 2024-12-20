import { Component, HostListener, ViewChild } from '@angular/core';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RankingService } from '../../Services/ranking.service';
import { MaterialModule } from '../../Shared/material.module';
import { Utilities } from '../../Shared/utilities';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Replay } from '../../Models/replay';
import { MatSort } from '@angular/material/sort';
import { PlayerData } from '../../Models/playerData';
import { ReplayData } from '../../Models/replayData';



@Component({
  selector: 'app-player-info',
  standalone: true,
  imports: [TopNavComponent, MaterialModule],
  templateUrl: './player-info.component.html',
  styleUrl: './player-info.component.css',
})

export class PlayerInfoComponent {
  screenHeight = 0;
  screenWidth = 0;
  lastUpdate: any;
  isPlayerLoading = true;
  isReplayLoading = true;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['when', 'char', 'score', 'rating', 'opponent', 'opponentChar', 'opponentrating'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  playerData!: PlayerData;
  battlesByChar: Map<number, number> = new Map();
  tekkenId: string = '';
  tekkenIdDashes: string = '';
  battleCount = 0;
  pageNum = 1;
  pageSize = 15;

  constructor(
    private rankingService: RankingService,
    public utilities: Utilities,
    private route: ActivatedRoute
  ) {
    this.tekkenId = this.route.snapshot.params['tekkenId'];
    this.tekkenIdDashes = this.route.snapshot.params['tekkenId'].match(new RegExp('.{1,4}', 'g')).join("-");
    this.rankingService.getReplaysById(this.tekkenId, this.pageNum,this.pageSize).subscribe((result) => {
      this.battleCount = result.metadata[0].totalCount
      this.dataSource = new MatTableDataSource<Replay>(result.replays.map((replay: any) => {

        // if (replay.p1_polaris_id == this.tekkenId) {
        //   if (this.battlesByChar.get(replay.p1_chara_id)) {
        //     let count: number = this.battlesByChar.get(replay.p1_chara_id) as number
        //     this.battlesByChar.set(replay.p1_chara_id, count + 1)
        //   } else {
        //     this.battlesByChar.set(replay.p1_chara_id, 1)
        //   }
        // } else if (replay.p2_polaris_id == this.tekkenId) {
        //   if (this.battlesByChar.get(replay.p2_chara_id)) {
        //     let count: number = this.battlesByChar.get(replay.p2_chara_id) as number
        //     this.battlesByChar.set(replay.p2_chara_id, count + 1)
        //   } else {
        //     this.battlesByChar.set(replay.p2_chara_id, 1)
        //   }
        // }

        let battleAtDate = new Date(replay.battle_at * 1000).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        replay.battle_at_date = battleAtDate;

        return replay
      })

      );

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isReplayLoading = false;
    });

    rankingService.getRankingsById(this.tekkenId).subscribe((result) => {
      result.rankings = result.rankings.map(data => {
        data.date = new Date(data.date).toLocaleDateString("en", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return data;
      }).filter(data => {
        return !data.qualified
      });

      result.qual_rankings = result.qual_rankings.map(data => {
        data.date = new Date(data.date).toLocaleDateString("en", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return data;
      });
      this.playerData = result
      this.isPlayerLoading = false;
    });
  }
  ngOnInit() {
    this.screenWidth = window.innerWidth;
    window.scrollTo(0, 0)
  }

  ngAfterViewInit() {
  }

  onPageChange(event: PageEvent) {
    this.pageNum = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.rankingService.getReplaysById(this.tekkenId, this.pageNum, this.pageSize).subscribe((result) => {
      this.dataSource = new MatTableDataSource<Replay>(result.replays.map((replay: any) => {

        // if (replay.p1_polaris_id == this.tekkenId) {
        //   if (this.battlesByChar.get(replay.p1_chara_id)) {
        //     let count: number = this.battlesByChar.get(replay.p1_chara_id) as number
        //     this.battlesByChar.set(replay.p1_chara_id, count + 1)
        //   } else {
        //     this.battlesByChar.set(replay.p1_chara_id, 1)
        //   }
        // } else if (replay.p2_polaris_id == this.tekkenId) {
        //   if (this.battlesByChar.get(replay.p2_chara_id)) {
        //     let count: number = this.battlesByChar.get(replay.p2_chara_id) as number
        //     this.battlesByChar.set(replay.p2_chara_id, count + 1)
        //   } else {
        //     this.battlesByChar.set(replay.p2_chara_id, 1)
        //   }
        // }

        let battleAtDate = new Date(replay.battle_at * 1000).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        replay.battle_at_date = battleAtDate;

        return replay
      }));
    });
  }
}
