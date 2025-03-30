import { Component, Inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { MaterialModule } from '../../Shared/material.module';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user/user.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css',
})
export class AuthButtonComponent {
  user: User
  currentUser: any
  tekkenId : string = "";
  tekkenIdWithDases : string = "";

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService, public router: Router, private userService: UserService
  ) {
    this.user = auth.user$.subscribe((user) => {
      if (user) {
        this.user = user
        this.auth.getAccessTokenSilently().subscribe((token) => {
          this.userService.getUserById(user.sub as string, token).subscribe(
            (result) => {
              this.currentUser = result.playerData;
              this.tekkenId = this.currentUser._id;
              this.tekkenIdWithDases = this.currentUser._id.match(new RegExp('.{1,4}', 'g')).join("-");
            },
          );
        });
      }

    })
  }

  navigateToPlayer(tekkenId:string) {
    this.router.navigate(['/playerInfo/'+ tekkenId])
  }

  login() {
    this.auth.loginWithPopup().subscribe(() => {
      //this.router.navigate(["/user"])
    })
  }
}
