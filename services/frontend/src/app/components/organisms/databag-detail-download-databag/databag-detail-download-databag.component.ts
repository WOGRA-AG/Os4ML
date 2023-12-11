import { Component, EventEmitter, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-detail-download-databag',
  templateUrl: './databag-detail-download-databag.component.html',
  styleUrls: ['./databag-detail-download-databag.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule],
})
export class DatabagDetailDownloadDatabagComponent {
  @Output() public downloadDatabag = new EventEmitter<void>();
}
