import { Component } from '@angular/core';
import { TopNavComponent } from "../top-nav/top-nav.component";
import { HomeComponent } from "../home/home.component";
import { UserService } from '../../Services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-interactive-map',
    imports: [TopNavComponent, HomeComponent],
    templateUrl: './interactive-map.component.html',
    styleUrl: './interactive-map.component.css'
})
export class InteractiveMapComponent {
  constructor(userService: UserService, public router: Router, public auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (!user || !user.sub) {
        return;
      } else {
        this.auth.getAccessTokenSilently().subscribe((token) => {
          userService.getUsers(token).subscribe(users =>{
            console.log(users);
          })
        })
      }
    })}
}
