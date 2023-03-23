import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-status-spinner',
  templateUrl: './status-spinner.component.html',
  styleUrls: ['./status-spinner.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class StatusSpinnerComponent {
  @Input() public status = '';
}
