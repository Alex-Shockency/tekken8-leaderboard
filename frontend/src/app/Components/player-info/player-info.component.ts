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
  isMatchupLoading = true;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['when', 'char', 'score', 'rating', 'opponent', 'opponentChar', 'opponentrating'];

  replayChart!: Chart;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;
  Math = Math;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  playerData!: PlayerData;
  matchupMap: Map<number, { wins: number, losses: number }> = new Map();
  tekkenId: string = '';
  tekkenIdDashes: string = '';
  battleCount = 0;
  pageNum = 1;
  pageSize = 25;
  overallWinPercent = 0;


  constructor(
    private rankingService: RankingService,
    public utilities: Utilities,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(val => {
      this.tekkenId = val['tekkenId'];
      this.tekkenIdDashes = val['tekkenId'].match(new RegExp('.{1,4}', 'g')).join("-");
      let overallWins = 0;
      let overallLosses = 0;
  
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

        result.qual_rankings = result.qual_rankings.sort((a,b) => {
          if(a.rating > b.rating){
            return -1
          } else{
            return 1;
          }
        })
    
        result.rankings = result.rankings.sort((a,b) => {
          if(a.rating > b.rating){
            return -1
          }
          else{
            return 1;
          }
        })

        this.playerData = result
        this.isPlayerLoading = false;
      });
  
      rankingService.getAllReplaysById(this.tekkenId).subscribe((result) => {
        result.forEach((replay:any) => {
          if (replay.p1_polaris_id == this.tekkenId) {
            if (replay.p1_rounds > replay.p2_rounds) {
              if (this.matchupMap.has(replay.p2_chara_id)) {
                let winsLosses = this.matchupMap.get(replay.p2_chara_id) ?? { wins: 0, losses: 0 };
                this.matchupMap.set(replay.p2_chara_id, { wins: winsLosses.wins + 1, losses: winsLosses.losses })
                overallWins +=1
              } else {
                this.matchupMap.set(replay.p2_chara_id, { wins: 1, losses: 0 })
                overallWins +=1
              }
            } else {
              if (this.matchupMap.has(replay.p2_chara_id)) {
                let winsLosses = this.matchupMap.get(replay.p2_chara_id) ?? { wins: 0, losses: 0 };
                this.matchupMap.set(replay.p2_chara_id, { wins: winsLosses.wins, losses: winsLosses.losses + 1 })
                overallLosses+=1
              } else {
                this.matchupMap.set(replay.p2_chara_id, { wins: 0, losses: 1 })
                overallLosses+=1
              }
            }
          } 
          else {
            if (replay.p2_rounds > replay.p1_rounds) {
              if (this.matchupMap.has(replay.p1_chara_id)) {
                let winsLosses = this.matchupMap.get(replay.p1_chara_id) ?? { wins: 0, losses: 0 };
                this.matchupMap.set(replay.p1_chara_id, { wins: winsLosses.wins + 1, losses: winsLosses.losses })
                overallWins +=1
              } else {
                this.matchupMap.set(replay.p1_chara_id, { wins: 1, losses: 0 })
                overallWins +=1
              }
            } else {
              if (this.matchupMap.has(replay.p1_chara_id)) {
                let winsLosses = this.matchupMap.get(replay.p1_chara_id) ?? { wins: 0, losses: 0 };
                this.matchupMap.set(replay.p1_chara_id, { wins: winsLosses.wins, losses: winsLosses.losses + 1 })
                overallLosses+=1
              } else {
                this.matchupMap.set(replay.p1_chara_id, { wins: 0, losses: 1 })
                overallLosses+=1
              }
            }
          }
        })
        this.matchupMap = new Map([...this.matchupMap.entries()].sort((matchup1,matchup2)=>{
          return matchup2[1].wins/(matchup2[1].wins+matchup2[1].losses) - matchup1[1].wins/(matchup1[1].wins+matchup1[1].losses);
        }))
        this.overallWinPercent = Number.parseFloat((overallWins/(overallWins+overallLosses)*100).toFixed(2))
        this.isMatchupLoading = false;
      });
    });
  }

  private createChart(result: any) {
    if(this.replayChart){
      this.replayChart.destroy()
    }

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
    if (this.screenWidth < 800) {
      pointRadius = 3;
      pointHoverRadius = 4
    }

    let chartData: number[] = [];
    result.replays.forEach((replay: Replay) => {
      let rating = 0;
      
      if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
        currChar = replay.p1_chara_id;
        rating = replay.p1_rating_before + replay.p1_rating_change;
      } else if(replay.p2_rating_before){
        currChar = replay.p2_chara_id;
        rating = replay.p2_rating_before + replay.p2_rating_change;
      } else{
        chartData.push(NaN)
      }

      if (currChar !== prevChar && prevChar !== -1) {
        chartData.push(NaN)
      }

      if (replay.p1_rating_before && replay.p1_polaris_id == this.tekkenId) {
        prevChar = replay.p1_chara_id;
      } else if(replay.p2_rating_before){
        prevChar = replay.p2_chara_id;
      } else{
        chartData.push(NaN)
      }

      if(rating >0)
      chartData.push(rating)
    });

    this.replayChart = new Chart("ratings",
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
              })) - 50,
              max: Math.max(...chartData.filter(number => {
                return !isNaN(number)
              })) + 50
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
    });
  }
}
