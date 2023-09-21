import { Component, Input } from '@angular/core';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';

@Component({
  selector: 'app-solution-detail-pipeline-status',
  templateUrl: './solution-detail-pipeline-status.component.html',
  styleUrls: ['./solution-detail-pipeline-status.component.scss'],
  standalone: true,
  imports: [ProcessingStatusIndicatorComponent, ShortStatusPipe],
})
export class SolutionDetailPipelineStatusComponent {
  @Input() public status: string | null | undefined = null;
}
