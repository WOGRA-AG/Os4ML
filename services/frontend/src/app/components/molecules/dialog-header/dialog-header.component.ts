import { Component, EventEmitter, Output } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  standalone: true,
  imports: [MaterialModule, IconButtonComponent],
})
export class DialogHeaderComponent {
  @Output() public closeDialog = new EventEmitter<boolean>();
}
