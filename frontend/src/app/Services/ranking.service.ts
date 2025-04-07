import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlayerData } from '../Models/playerData';
import { Replay } from '../Models/replay';

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

  getRankings(pageNum: number, pageSize: number): Observable<PlayerData[]> {
    return this.http.get<PlayerData[]>(this.api + `rankings?pageNum=${pageNum}&pageSize=${pageSize}`);
  }

  getRankingsByChar(charId: string): Observable<PlayerData[]> {
    return this.http.get<PlayerData[]>(this.api + `rankings/character/${charId}`);
  }

  getStateRankings(stateId: string): Observable<PlayerData[]> {
    return this.http.get<PlayerData[]>(this.api + `stateRankings/${stateId}`);
  }

  getRankingsById(tekkenId: any): Observable<PlayerData> {
    return this.http.get<PlayerData>(this.api + `rankings/${tekkenId}`);
  }

  getReplaysById(tekkenId: string, pageNum: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.api + `replays/${tekkenId}?pageNum=${pageNum}&pageSize=${pageSize}`);
  }

  getReplaysByIdCharaId(tekkenId: string, charaId: string): Observable<any> {
    return this.http.get<any>(this.api + `replays/${tekkenId}/${charaId}`);
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
