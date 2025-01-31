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

  // createUserData(userData: UserData): Observable<UserData> {
  //   console.log('createUserData', userData);
  //   return this.http.post<UserData>(this.api + `userData`, userData);
  // }

  createUserData(userData: UserData): Observable<UserData> {
    return new Observable((observer) => {
      this.auth.getAccessTokenSilently().subscribe((token) => {
        console.log(userData);
        const body = {
          tekkenId: userData.tekkenId,
          displayName: userData.displayName,
          platform: userData.platform,
          state: userData.state,
          platformId: userData.platformId,
        };
        this.http
          .post<UserData>(this.api + `userData`, body, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      });
    });
  }

  approveUser(userId: string): Observable<UserData> {
    return this.http.post<UserData>(this.api + `approveUser`, userId);
  }
}
