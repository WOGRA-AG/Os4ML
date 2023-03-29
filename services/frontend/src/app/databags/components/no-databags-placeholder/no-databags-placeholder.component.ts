import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';

@Component({
  selector: 'app-no-databags-placeholder',
  templateUrl: './no-databags-placeholder.component.html',
  styleUrls: ['./no-databags-placeholder.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class NoDatabagsPlaceholderComponent {
  @Output() public addDatabagButton: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
}
