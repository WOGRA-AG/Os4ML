import { Component } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-solution-detail-delete-solution',
  templateUrl: './solution-detail-delete-solution.component.html',
  styleUrls: ['./solution-detail-delete-solution.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule],
})
export class SolutionDetailDeleteSolutionComponent {}
