import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserData, ReturnedUserData } from '../../Models/user';
import { PlayerData } from '../../Models/playerData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log(environment.apiUrl);
  }

  upsertUserData(userData: UserData, token: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `user/upsert`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserById(
    userId: string,
    token: string
  ): Observable<{ userData: ReturnedUserData; playerData: PlayerData }> {
    return this.http.get<{
      userData: ReturnedUserData;
      playerData: PlayerData;
    }>(this.api + `user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
