import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-shared-close-button',
  templateUrl: './close-button.component.html'
})

export class CloseButtonComponent {
  @Output() clickClose = new EventEmitter<boolean>();

  onClick() {
    this.clickClose.emit(true);
  }
}
