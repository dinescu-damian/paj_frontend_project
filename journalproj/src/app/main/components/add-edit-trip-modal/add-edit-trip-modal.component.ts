import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../../services/trip.service';
import { AddEditValidators } from '../../helpers/add-edit-trip-validators';

@Component({
  selector: 'app-add-edit-trip-modal',
  templateUrl: './add-edit-trip-modal.component.html',
  styleUrls: ['./add-edit-trip-modal.component.scss'],
})
export class AddEditTripModalComponent {
  @Input() isVisible: boolean = false;
  @Input() isEditingEnabled: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  tripEditForm!: FormGroup;

  constructor(private tripService: TripService) {
    tripService.editedTripsubject.subscribe(() => {
      this.initializeForm();
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.tripEditForm = new FormGroup({
      city: new FormControl(this.tripService.editedTrip.city, [
        Validators.required,
      ]),
      country: new FormControl(this.tripService.editedTrip.country, [
        Validators.required,
      ]),
      date: new FormControl(this.tripService.editedTrip.date, [
        Validators.required,
        AddEditValidators.dateValidator,
      ]),
      spending: new FormControl(this.tripService.editedTrip.spending, [
        Validators.required,
        AddEditValidators.spendingValidator,
      ]),
      rating: new FormControl(this.tripService.editedTrip.rating, [
        Validators.required,
        AddEditValidators.ratingValidator,
      ]),
      description: new FormControl(this.tripService.editedTrip.description, [
        Validators.required,
      ]),
    });
  }

  //click methods
  onOk(): void {
    this.closeModal.emit(true);
  }

  onCancel(): void {
    this.closeModal.emit(true);
  }

  onSubmitForm(): void {
    this.tripService.editedTrip.city = this.tripEditForm.value.city;
    this.tripService.editedTrip.country = this.tripEditForm.value.country;
    this.tripService.editedTrip.date = this.tripEditForm.value.date;
    this.tripService.editedTrip.spending = this.tripEditForm.value.spending;
    this.tripService.editedTrip.rating = this.tripEditForm.value.rating;
    this.tripService.editedTrip.description = this.tripEditForm.value.description;

    this.tripService.saveTrip(this.tripService.editedTrip);

    this.closeModal.emit(true);
  }

  // getters
  get city(): FormControl {
    return this.tripEditForm.get('city') as FormControl;
  }
  get country(): FormControl {
    return this.tripEditForm.get('country') as FormControl;
  }
  get date(): FormControl {
    return this.tripEditForm.get('date') as FormControl;
  }
  get spending(): FormControl {
    return this.tripEditForm.get('spending') as FormControl;
  }
  get rating(): FormControl {
    return this.tripEditForm.get('rating') as FormControl;
  }
  get description(): FormControl {
    return this.tripEditForm.get('description') as FormControl;
  }
}
