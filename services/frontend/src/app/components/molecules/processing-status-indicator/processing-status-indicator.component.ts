import { Component, Input } from '@angular/core';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { NgClass } from '@angular/common';
import { PipelineStatus } from '../../../models/pipeline-status';

@Component({
  selector: 'app-processing-status-indicator',
  templateUrl: './processing-status-indicator.component.html',
  styleUrls: ['./processing-status-indicator.component.scss'],
  standalone: true,
  imports: [ShortStatusPipe, NgClass],
})
export class ProcessingStatusIndicatorComponent {
  @Input() public shortStatus: PipelineStatus | null = null;
  public pipelineStatus = PipelineStatus;
}
