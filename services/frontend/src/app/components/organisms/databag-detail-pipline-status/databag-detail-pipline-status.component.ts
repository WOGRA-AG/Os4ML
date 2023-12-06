import { Component, Input } from '@angular/core';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-detail-pipline-status',
  templateUrl: './databag-detail-pipline-status.component.html',
  styleUrls: ['./databag-detail-pipline-status.component.scss'],
  standalone: true,
  imports: [
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    TranslateModule,
  ],
})
export class DatabagDetailPiplineStatusComponent {
  @Input() public status: string | null | undefined = null;
}
