import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';

@Component({
  selector: 'app-no-solutions-placeholder',
  templateUrl: './no-solutions-placeholder.component.html',
  styleUrls: ['./no-solutions-placeholder.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class NoSolutionsPlaceholderComponent {
  @Output() public addSolutionButton: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
}
