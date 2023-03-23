import { Component, EventEmitter, Output } from '@angular/core';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  standalone: true,
  imports: [MatDialogModule, IconButtonComponent],
})
export class DialogHeaderComponent {
  @Output() public closeDialog = new EventEmitter<boolean>();
}
