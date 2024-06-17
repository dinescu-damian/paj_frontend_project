import { Component, Input } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trips-dashboard',
  templateUrl: './trips-dashboard.component.html',
  styleUrls: ['./trips-dashboard.component.scss'],
})
export class TripsDashboardComponent {
  currentPageTrips!: Trip[];
  currentPageStartIndex: number = 0;
  pageLength: number = 6;
  visible = true;
  searchText!: string;

  isAddEditTripModalOpen: boolean = false;
  isEditingEnabled: boolean = false;

  constructor(public tripService: TripService) {
    // Listen for any changes in the trips list
    this.tripService.listOfTripsSubject.subscribe(() => {
      this.currentPageTrips = this.tripService.listOfTrips.slice(
        this.currentPageStartIndex,
        this.pageLength
      );
    });
  }

  ngOnInit(): void {
    this.tripService.requestTrips();
  }

  //******************************* Pagination methods **********************************
  //////////////////////////////////////////////////////////////////////////////////////
  previous() {
    if (this.currentPageStartIndex - this.pageLength < 0) {
      return;
    }

    const lastCityIndexOfCurrentPage = this.currentPageStartIndex;
    this.currentPageStartIndex -= this.pageLength;

    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      lastCityIndexOfCurrentPage
    );
  }

  next() {
    if (this.currentPageStartIndex + this.pageLength >= this.tripService.listOfTrips.length)
      return;

    this.currentPageStartIndex += this.pageLength;
    let lastCityIndexOfCurrentPage;

    if (this.currentPageStartIndex + this.pageLength < this.tripService.listOfTrips.length)
      lastCityIndexOfCurrentPage = this.currentPageStartIndex + this.pageLength;
    else lastCityIndexOfCurrentPage = this.tripService.listOfTrips.length;

    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      lastCityIndexOfCurrentPage
    );
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //******************************* Sorting methods ************************************
  //////////////////////////////////////////////////////////////////////////////////////
  sortByCityAscending() {
    this.tripService.listOfTrips.sort((a, b) => a.city.localeCompare(b.city));
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCityDescending() {
    this.tripService.listOfTrips.sort((a, b) => b.city.localeCompare(a.city));
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCountryAscending() {
    this.tripService.listOfTrips.sort((a, b) => a.country.localeCompare(b.country));
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCountryDescending() {
    this.tripService.listOfTrips.sort((a, b) => b.country.localeCompare(a.country));
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByDateAscending() {
    this.tripService.listOfTrips.sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      const dateB = b.date.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      return Date.parse(dateA) - Date.parse(dateB);
    });
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByDateDescending() {
    this.tripService.listOfTrips.sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return Date.parse(dateB) - Date.parse(dateA);
    });
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingAscending() {
    this.tripService.listOfTrips.sort((a, b) => a.rating - b.rating);
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingDescending() {
    this.tripService.listOfTrips.sort((a, b) => b.rating - a.rating);
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortBySpendingAscending() {
    this.tripService.listOfTrips.sort((a, b) => a.spending - b.spending);
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortBySpendingDescending() {
    this.tripService.listOfTrips.sort((a, b) => b.spending - a.spending);
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //************************** Trip manipulation methods *******************************
  //this method is called when user deletes a trip in order to delete it from UI
  deleteTrip(id: string) {
    this.currentPageTrips = this.tripService.listOfTrips.slice(
      this.currentPageStartIndex,
      this.currentPageStartIndex + this.pageLength
    );

    // If the last trip on this page was just deleted, go to the previous page
    if (this.currentPageTrips.length === 0) this.previous();
  }
  //////////////////////////////////////////////////////////////////////////////////////

  onOpenViewDetailsModal() {
    this.isAddEditTripModalOpen = true;
    this.isEditingEnabled = false;
  }

  onAddTripClick() {
    this.isAddEditTripModalOpen = true;
    this.isEditingEnabled = true;

    this.tripService.editedTrip = this.tripService.emptyTrip();
  }
}
