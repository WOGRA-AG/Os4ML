import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'app-databag-list-item',
  templateUrl: './databag-list-item.component.html',
  styleUrls: ['./databag-list-item.component.scss'],
  standalone: true,
  imports: [LocalizedDatePipe, TranslateModule],
})
export class DatabagListItemComponent {
  @Input() public databag: Databag = {};
}
