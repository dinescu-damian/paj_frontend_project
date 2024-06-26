import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  user: any;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    // Save the user's name into a variable
    this.user = this.authenticationService.user;
    console.log(this.user);
    
  }

  logout() {
    // Log the user out
    this.authenticationService.logout();

    // Take the user back to the login page
    this.router.navigate(['/auth/login']);
  }
}
