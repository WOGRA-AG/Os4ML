import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-detail-download-databag-preview',
  templateUrl: './databag-detail-download-databag-preview.component.html',
  styleUrls: ['./databag-detail-download-databag-preview.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule],
})
export class DatabagDetailDownloadDatabagPreviewComponent {
  @Output() public downloadModel = new EventEmitter<void>();
  @Input() public disabled = true;
}
