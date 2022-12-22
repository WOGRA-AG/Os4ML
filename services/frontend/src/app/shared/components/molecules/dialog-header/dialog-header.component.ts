import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
  @Output() closeDialog = new EventEmitter<boolean>();

  close() {
    this.closeDialog.emit(true);
  }
}
