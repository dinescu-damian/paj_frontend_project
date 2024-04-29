import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TripComment } from 'src/app/interfaces/comment.interface';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrl: './comments-modal.component.scss'
})
export class CommentsModalComponent {
  @Input() isVisible: boolean = false;
  @Input() comments!: TripComment[];
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private tripService: TripService) {
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
