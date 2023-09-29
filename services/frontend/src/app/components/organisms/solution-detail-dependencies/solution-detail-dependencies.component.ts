import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Prediction } from '../../../../../build/openapi/modelmanager';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-solution-detail-dependencies',
  templateUrl: './solution-detail-dependencies.component.html',
  styleUrls: ['./solution-detail-dependencies.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule, NgForOf, NgIf],
})
export class SolutionDetailDependenciesComponent {
  @Input() public predictions?: Prediction[] | null;
}
