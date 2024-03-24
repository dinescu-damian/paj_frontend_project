import { Injectable } from '@angular/core';
import { Trip } from '../interfaces/trip.interface';
import { Subject } from 'rxjs';
import {v4 as uuidv4} from 'uuid';

import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class TripService {
  private baseURL = 'http://localhost:5000/api/Trips';

  private listOfTripsData!: Trip[];
  listOfTripsSubject = new Subject<Trip[]>();

  private edited: Trip = this.emptyTrip();
  editedTripsubject = new Subject<Trip>();

  constructor(private authService: AuthenticationService) {}

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
      userID: '1',
      tripID: uuidv4(),
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
    const response = await fetch(`${this.baseURL}/getAllForUser`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    });

    this.listOfTrips = (await response.json()).map((trip: any) => {
      return {
        userID: trip.userId,
        tripID: trip.tripId,
        city: trip.name,
        country: trip.country,
        date: trip.date,
        spending: trip.spending,
        rating: trip.rating,
        description: '',
      };
    });
  }

  //delete trip from db
  async deleteTrip(tripId: string) {
    const response = await fetch(`${this.baseURL}/delete`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripId: tripId,
      }),
    });

    if (response.status === 200) {
      console.log('Trip deleted successfully');
      
      this.listOfTrips.splice(
        this.listOfTrips.findIndex((item) => item.tripID === tripId),
        1
      );
      this.listOfTripsSubject.next(this.listOfTrips);
    }
  }

  //add a new trip into db
  async addNewTrip(newTrip: Trip) {
    const response = await fetch(`${this.baseURL}/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.authService.user?.id,
        name: newTrip.city,
        country: newTrip.country,
        date: newTrip.date,
        spending: newTrip.spending,
        rating: newTrip.rating,
        description: newTrip.description,
      }),
    });

    if (response.status === 200) {
      console.log('Trip added successfully');

      //get the added trip from backedn in order to add it in list of trips
      const trip = await response.json();

      const newAddedTrip= {
        userID: trip.userId,
        tripID: trip.tripId,
        city: trip.name,
        country: trip.country,
        date: trip.date,
        spending: trip.spending,
        rating: trip.rating,
        description: trip.description,
      };

      this.listOfTrips.push(newAddedTrip);
      this.listOfTripsSubject.next(this.listOfTrips);
    }
  }

  //update trip in db
  async updateTrip(editedTrip: Trip) {
    const response = await fetch(`${this.baseURL}/edit`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripId: editedTrip.tripID,
        userId: this.authService.user?.id,
        name: editedTrip.city,
        country: editedTrip.country,
        date: editedTrip.date,
        spending: editedTrip.spending,
        rating: editedTrip.rating,
        description: editedTrip.description,
      }),
    });

    if (response.status === 200) {
      console.log('Trip updated successfully');

      this.listOfTrips.splice(
        this.listOfTrips.findIndex((item) => item.tripID === editedTrip.tripID),
        1,
        editedTrip
      );

      this.listOfTripsSubject.next(this.listOfTrips);
    }
  }

  //get trip by id
  async getTripById(tripId: string): Promise<Trip | null> {
    const response = await fetch(`${this.baseURL}/getById/?tripId=${tripId}`, {
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
        date: trip.date,
        spending: trip.spending,
        rating: trip.rating,
        description: trip.description,
      };
    }
    return null;
  }

  //main function used for adding/editing a trip
  async updateOrCreateTrip(tripToBeUpdated: Trip) {
    //if trip doesn't exist, we add it into database
    if ((await this.getTripById(tripToBeUpdated.tripID)) == null) {
      this.addNewTrip(tripToBeUpdated);
    } else {
      //else, we update it
      this.updateTrip(tripToBeUpdated);
    }
  }
}
