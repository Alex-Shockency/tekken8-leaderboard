import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Replay } from '../Models/replay';
import { PlayerData } from '../Models/playerData';

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

  getRankingsById(tekkenId: any): Observable<PlayerData> {
    return this.http.get<PlayerData>(this.api + `rankings/${tekkenId}`);
  }

  getReplaysById(tekkenId: string): Observable<Replay[]> {
    return this.http.get<Replay[]>(this.api + `replays/${tekkenId}`);
  }

  getQualifiedReplays(): Observable<Replay[]> {
    return this.http.get<Replay[]>(this.api + `qualifiedReplays`);
  }
}
