import { Component } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';
import { TripService } from 'src/app/services/trip.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  listOfTrips: Trip[] = [];

  constructor(
    private tripService: TripService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    // Listen for any changes in the trips list
    this.tripService.listOfTripsSubject.subscribe((res) => {
      this.listOfTrips = [...res];
    });
  }

  ngOnInit(): void {
    //request list of trips 
    this.tripService.requestTrips();
  }

  logout() {
    // Log the user out
    this.authenticationService.logout();

    // Take the user back to the login page
    this.router.navigate(['/auth/login']);
  }
}
