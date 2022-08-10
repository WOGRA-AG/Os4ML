import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-shared-close-button',
  templateUrl: './close-button.component.html'
})

export class CloseButtonComponent {
  @Output() closeEvent = new EventEmitter<boolean>();

  onClose() {
    this.closeEvent.emit(true);
  }
}
