import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-spinner',
  templateUrl: './status-spinner.component.html',
  styleUrls: ['./status-spinner.component.scss'],
})
export class StatusSpinnerComponent {
  @Input() public status = '';
}
