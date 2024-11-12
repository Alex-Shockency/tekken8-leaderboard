import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  private api: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getLocationById(locationId: number): Observable<GameLocation> {
    return this.http.get<GameLocation>(this.api + `Locations/${locationId}`);
  }
}
