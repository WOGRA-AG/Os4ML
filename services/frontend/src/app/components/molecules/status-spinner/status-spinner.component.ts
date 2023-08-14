import { Component, Input } from '@angular/core';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';

@Component({
  selector: 'app-status-spinner',
  templateUrl: './status-spinner.component.html',
  styleUrls: ['./status-spinner.component.scss'],
  standalone: true,
  imports: [MaterialModule],
})
export class StatusSpinnerComponent {
  @Input() public status = '';
}
