import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-shared-dialog-header',
  templateUrl: './dialog-header.component.html'
})

export class DialogHeaderComponent {
  @Output() closeDialog = new EventEmitter<boolean>();

  onClickClose() {
    this.closeDialog.emit(true);
  }
}
