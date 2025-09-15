import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.html',
  // Add OnPush for better performance
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() recipeTitle = '';
  @Input() isDeleting = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    // Prevent multiple clicks while deleting
    if (!this.isDeleting) {
      this.confirm.emit();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  // Prevent clicks inside the modal from closing it
  onModalClick(event: Event) {
    event.stopPropagation();
  }
}