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
import Chart from 'chart.js/auto';
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
  pageSize = 25;

  constructor(
    private rankingService: RankingService,
    public utilities: Utilities,
    private route: ActivatedRoute
  ) {
    this.tekkenId = this.route.snapshot.params['tekkenId'];
    this.tekkenIdDashes = this.route.snapshot.params['tekkenId'].match(new RegExp('.{1,4}', 'g')).join("-");
    this.rankingService.getReplaysById(this.tekkenId, this.pageNum, this.pageSize).subscribe((result) => {
      this.battleCount = result.metadata[0].totalCount
      this.dataSource = new MatTableDataSource<Replay>(result.replays.map((replay: any) => {
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

      this.createChart(result);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isReplayLoading = false;
      window.scrollTo(0, 0)
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
  private createChart(result: any) {
    let colorIndex = 0;
    let prevChar = 0;
    let currChar = 0;
    let prevOppColor = "";
    let currOppColor = "";
    let colorArray = ['rgb(255, 99, 133)',
      'rgb(255, 160, 64)',
      'rgb(255, 204, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 163, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)',
      'rgb(35, 150, 0)'
    ];
    let pointRadius = 6;
    let pointHoverRadius = 7;
    if(this.screenWidth < 800){
      pointRadius = 3;
      pointHoverRadius = 4
    }

    let chartData: number[] = [];
    result.replays.forEach((replay:Replay) => {
      let rating = 0;
      if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
        currChar = replay.p1_chara_id;
        rating = replay.p1_rating_before + replay.p1_rating_change;
      } else {
        currChar = replay.p2_chara_id;
        rating = replay.p2_rating_before + replay.p2_rating_change;
      }

      if (currChar !== prevChar && prevChar !== 0) {
        chartData.push(NaN)
      }

      if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
        prevChar = replay.p1_chara_id;
      } else {
        prevChar = replay.p2_chara_id;
      }

      chartData.push(rating)
    });

    new Chart("ratings",
      {
        type: 'line',
        options: {
          scales: {
            x: {
              reverse: true,
              ticks: {
                display: false // This hides the x-axis labels
              }
            },
            y: {
              min: Math.min(...chartData.filter(number => {
                return !isNaN(number)
              }))-50,
              max: Math.max(...chartData.filter(number => {
                return !isNaN(number)
              }))+50
            }
          },
          plugins: {
            legend: {
              display: false
            },
          }
        },
        data: {
          labels: result.replays.map((replay: any) => {
            if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
              return "Opponent: " + replay.p2_name;
            } else {
              return "Opponent: " + replay.p1_name;
            }

          }),
          datasets: [
            {
              label: 'Your Rating',
              pointRadius: pointRadius,
              pointHoverRadius: pointHoverRadius,
              data: chartData,
              borderColor: "rgba(255, 99, 133, 0.4)",
              backgroundColor: result.replays.map((replay: any) => {
                if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
                  currOppColor = replay.p2_polaris_id;
                } else {
                  currOppColor = replay.p1_polaris_id;
                }

                if (currOppColor !== prevOppColor && prevOppColor !== "") {
                  if (colorIndex >= colorArray.length - 1) {
                    colorIndex = 0;
                  } else {
                    colorIndex++;
                  }
                }

                if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
                  prevOppColor = replay.p2_polaris_id;
                } else {
                  prevOppColor = replay.p1_polaris_id;
                }

                return colorArray[colorIndex];
              }),
            }
          ],
        }
      }
    );
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
    this.isReplayLoading = true;
    this.rankingService.getReplaysById(this.tekkenId, this.pageNum, this.pageSize).subscribe((result) => {
      this.dataSource = new MatTableDataSource<Replay>(result.replays.map((replay: any) => {
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
      this.isReplayLoading = false;
    });
  }
}
