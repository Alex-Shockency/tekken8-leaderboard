import { Component, Inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { MaterialModule } from '../../Shared/material.module';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css',
})
export class AuthButtonComponent {
  user:User
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,public router: Router
  ) {
    this.user = auth.user$.subscribe((user) =>{
      if(user){
        this.user = user
      }
      
    })
  }

  login() {
    this.auth.loginWithPopup().subscribe( () => {
      this.router.navigate(["/user"])
    })
  }
}
