import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerData } from '../../Models/playerData';
import { ReturnedUserData, UserData } from '../../Models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log(environment.apiUrl);
  }

  getUsers(token: string): Observable<{ userData: ReturnedUserData }> {
    return this.http.get<{
      userData: ReturnedUserData;
    }>(this.api + `user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createUserData(userData: UserData, token: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `user/create`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateUserData(userData: UserData, token: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `user/update`, userData, {
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
