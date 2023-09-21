import { Component, EventEmitter, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';

@Component({
  selector: 'app-solution-detail-delete-solution',
  templateUrl: './solution-detail-delete-solution.component.html',
  styleUrls: ['./solution-detail-delete-solution.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule, IconButtonComponent],
})
export class SolutionDetailDeleteSolutionComponent {
  @Output() public deleteSolution = new EventEmitter<void>();
}
