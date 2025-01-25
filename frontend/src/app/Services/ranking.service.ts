import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Replay } from '../Models/replay';
import { PlayerData } from '../Models/playerData';
import { ReplayData } from '../Models/replayData';

@Injectable({
  providedIn: 'root'
})


export class RankingService {
  private api: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log(environment.apiUrl);
  }

  getLastUpdate(): Observable<any> {
    return this.http.get<any>(this.api + `lastUpdate`);
  }

  getRankings(): Observable<PlayerData[]> {
    return this.http.get<PlayerData[]>(this.api + `rankings`);
  }

  getStateRankings(stateId:string): Observable<PlayerData[]> {
    return this.http.get<PlayerData[]>(this.api + `stateRankings/${stateId}`);
  }

  getRankingsById(tekkenId: any): Observable<PlayerData> {
    return this.http.get<PlayerData>(this.api + `rankings/${tekkenId}`);
  }

  getReplaysById(tekkenId: string,pageNum: number,pageSize: number): Observable<any> {
    return this.http.get<any>(this.api + `replays/${tekkenId}?pageNum=${pageNum}&pageSize=${pageSize}`);
  }

  getAllReplaysById(tekkenId: string): Observable<any> {
    return this.http.get<any>(this.api + `allReplays/${tekkenId}`);
  }

  getQualifiedReplays(): Observable<Replay[]> {
    return this.http.get<Replay[]>(this.api + `qualifiedReplays`);
  }

  searchPlayers(searchQuery: string): Observable<any[]> {
    return this.http.get<any[]>(this.api + `players/${searchQuery}`);
  }
}
