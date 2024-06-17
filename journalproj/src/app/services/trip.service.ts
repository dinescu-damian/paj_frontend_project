import { Injectable } from '@angular/core';
import { Trip } from '../interfaces/trip.interface';
import { Subject } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root',
})
export class TripService {
  private listOfTripsData: Trip[] = [];
  listOfTripsSubject = new Subject<Trip[]>();

  private edited: Trip = this.emptyTrip();
  editedTripsubject = new Subject<Trip>();

  constructor(private authService: AuthenticationService, private configService: ConfigService) {}

  //getter
  get editedTrip() {
    return this.edited;
  }
  get listOfTrips(): Trip[] {
    return this.listOfTripsData;
  }

  //setter
  set editedTrip(trip: Trip) {
    this.edited = trip;
    this.editedTripsubject.next(trip);
  }
  set listOfTrips(newListOfTrips: any) {
    this.listOfTripsData = newListOfTrips;
    this.listOfTripsSubject.next(newListOfTrips);
  }

  //empty trip
  emptyTrip(): any {
    return {
      tripID: null,
      city: '',
      country: '',
      date: '',
      spending: '',
      rating: '',
      description: '',
    };
  }

  //request trips for user from backend
  async requestTrips() {
    const response = await fetch(`${this.configService.baseURL}/trips/my-trips`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    });

    this.listOfTrips = (await response.json()).map((trip: any) => {
      return {
        userID: trip.userId,
        tripID: trip.tripId,
        city: trip.city,
        country: trip.country,
        date: this.formatDate(trip.date),
        spending: trip.spending,
        rating: trip.rating,
        likes: trip.likes,
        description: trip.description
      };
    });

    console.log(this.listOfTrips);
  }

  //delete trip from db
  async deleteTrip(tripId: string) {
    const response = await fetch(`${this.configService.baseURL}/trips/delete/${tripId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('Trip deleted successfully');
      
      this.listOfTrips.splice(
        this.listOfTrips.findIndex((item) => item.tripID === tripId),
        1
      );
      this.listOfTripsSubject.next(this.listOfTrips);

      console.log(this.listOfTrips)
    }
  }

  // Save trip to the database
  async saveTrip(trip: Trip) {
    const response = await fetch(`${this.configService.baseURL}/trips/save`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripId: trip.tripID,
        userId: this.authService.user?.id,
        city: trip.city,
        country: trip.country,
        date: trip.date,
        spending: trip.spending,
        rating: trip.rating,
        description: trip.description,
        likes: 0
      }),
    });

    if (response.status === 200) {
      console.log('Trip added successfully');

      //get the added trip from backedn in order to add it in list of trips
      const trip = await response.json();

      const newAddedTrip= {
        userID: trip.userId,
        tripID: trip.tripId,
        city: trip.city,
        country: trip.country,
        date: this.formatDate(trip.date),
        spending: trip.spending,
        rating: trip.rating,
        likes: trip.likes,
        description: trip.description,
      };

      const existing = this.listOfTrips.filter(currentTrip => currentTrip.tripID == trip.tripId);
      if(existing.length == 0) {
        this.listOfTrips.push(newAddedTrip);
        console.log(this.listOfTrips);
        this.listOfTripsSubject.next(this.listOfTrips);
      }
    }
  }

  //get trip by id
  async getTripById(tripId: string): Promise<Trip | null> {
    const response = await fetch(`${this.configService.baseURL}/trips/getById/${tripId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    });

    if (response.status === 200) {
      const trip = await response.json();

      return {
        userID: trip.userId,
        tripID: trip.tripId,
        city: trip.name,
        country: trip.country,
        date: this.formatDate(trip.date),
        spending: trip.spending,
        rating: trip.rating,
        likes: trip.likes,
        description: trip.description,
      };
    }
    return null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }
}
