import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserData } from '../../Models/user';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {
    console.log(environment.apiUrl);
  }

  createUserData(userData: UserData, token: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `userData`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  approveUser(userId: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `approveUser`, userId);
  }
}
