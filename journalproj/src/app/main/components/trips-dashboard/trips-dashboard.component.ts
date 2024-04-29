import { Component, Input } from '@angular/core';
import { TripComment } from 'src/app/interfaces/comment.interface';
import { Trip } from 'src/app/interfaces/trip.interface';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trips-dashboard',
  templateUrl: './trips-dashboard.component.html',
  styleUrls: ['./trips-dashboard.component.scss'],
})
export class TripsDashboardComponent {
  @Input()
  listOfTrips!: Trip[];

  currentPageTrips!: Trip[];
  currentPageStartIndex: number = 0;
  pageLength: number = 6;
  visible = true;
  searchText!: string;

  isAddEditTripModalOpen: boolean = false;
  isEditingEnabled: boolean = false;

  // Flag for opening and closing the comments modal
  isCommentsModalOpen: boolean = false;
  displayedComments: TripComment[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
  }

  ngOnChanges(): void {
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
  }

  //******************************* Pagination methods **********************************
  //////////////////////////////////////////////////////////////////////////////////////
  previous() {
    if (this.currentPageStartIndex - this.pageLength < 0) {
      return;
    }

    const lastCityIndexOfCurrentPage = this.currentPageStartIndex;
    this.currentPageStartIndex -= this.pageLength;

    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      lastCityIndexOfCurrentPage
    );
  }

  next() {
    if (this.currentPageStartIndex + this.pageLength >= this.listOfTrips.length)
      return;

    this.currentPageStartIndex += this.pageLength;
    let lastCityIndexOfCurrentPage;

    if (this.currentPageStartIndex + this.pageLength < this.listOfTrips.length)
      lastCityIndexOfCurrentPage = this.currentPageStartIndex + this.pageLength;
    else lastCityIndexOfCurrentPage = this.listOfTrips.length;

    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      lastCityIndexOfCurrentPage
    );
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //******************************* Sorting methods ************************************
  //////////////////////////////////////////////////////////////////////////////////////
  sortByCityAscending() {
    this.listOfTrips.sort((a, b) => a.city.localeCompare(b.city));
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCityDescending() {
    this.listOfTrips.sort((a, b) => b.city.localeCompare(a.city));
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCountryAscending() {
    this.listOfTrips.sort((a, b) => a.country.localeCompare(b.country));
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByCountryDescending() {
    this.listOfTrips.sort((a, b) => b.country.localeCompare(a.country));
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByDateAscending() {
    this.listOfTrips.sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      const dateB = b.date.split('/').reverse().join('-'); // rearrange to yyyy-mm-dd format
      return Date.parse(dateA) - Date.parse(dateB);
    });
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByDateDescending() {
    this.listOfTrips.sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return Date.parse(dateB) - Date.parse(dateA);
    });
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingAscending() {
    this.listOfTrips.sort((a, b) => a.rating - b.rating);
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortByRatingDescending() {
    this.listOfTrips.sort((a, b) => b.rating - a.rating);
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortBySpendingAscending() {
    this.listOfTrips.sort((a, b) => a.spending - b.spending);
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }

  sortBySpendingDescending() {
    this.listOfTrips.sort((a, b) => b.spending - a.spending);
    this.currentPageTrips = this.listOfTrips.slice(
      this.currentPageStartIndex,
      this.pageLength
    );
    this.visible = false;
  }
  //////////////////////////////////////////////////////////////////////////////////////

  //************************** Trip manipulation methods *******************************
  //this method is called when user deletes a trip in order to delete it from UI
  deleteTrip(id: string) {
    this.listOfTrips.splice(
      this.listOfTrips.findIndex((item) => item.tripID === id),
      1
    );
    this.currentPageTrips = this.listOfTrips.slice(
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

  onOpenCommentsModal(comments: TripComment[]) {
    this.displayedComments.length = 0;
    this.displayedComments.push(...comments);
    this.isCommentsModalOpen = true;
  }

  onAddTripClick() {
    this.isAddEditTripModalOpen = true;
    this.isEditingEnabled = true;

    this.tripService.editedTrip = this.tripService.emptyTrip();
  }
}
