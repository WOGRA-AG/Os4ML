import { Component, EventEmitter, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-detail-delete-databag',
  templateUrl: './databag-detail-delete-databag.component.html',
  styleUrls: ['./databag-detail-delete-databag.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule],
})
export class DatabagDetailDeleteDatabagComponent {
  @Output() public deleteDatabag = new EventEmitter<void>();
}
