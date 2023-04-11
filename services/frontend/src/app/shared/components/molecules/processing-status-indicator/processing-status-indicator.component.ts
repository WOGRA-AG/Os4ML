import { Component, Input } from '@angular/core';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-processing-status-indicator',
  templateUrl: './processing-status-indicator.component.html',
  styleUrls: ['./processing-status-indicator.component.scss'],
  standalone: true,
  imports: [ShortStatusPipe, NgClass],
})
export class ProcessingStatusIndicatorComponent {
  @Input() public status: string | null | undefined = undefined;
}
