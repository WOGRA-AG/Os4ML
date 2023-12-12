import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Solution } from '../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-transfer-learning-models-detail-dependencies',
  templateUrl: './transfer-learning-models-detail-dependencies.component.html',
  styleUrls: ['./transfer-learning-models-detail-dependencies.component.scss'],
  standalone: true,
  imports: [TranslateModule, NgIf, NgForOf, RouterLink],
})
export class TransferLearningModelsDetailDependenciesComponent {
  @Input() public solutions?: Solution[] | null;
}
