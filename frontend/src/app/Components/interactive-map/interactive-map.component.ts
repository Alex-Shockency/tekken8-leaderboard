import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../Services/user/user.service';

@Component({
  selector: 'app-interactive-map',
  imports: [],
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
          userService.getUsers(token).subscribe(users => {
            console.log(users);
          })
        })
      }
    })
  }
}
