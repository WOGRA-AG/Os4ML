import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
  @Output() public closeDialog = new EventEmitter<boolean>();
}
