import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TransferLearningModelOrigins } from '../../../models/transfer-learning-model-origins';
import { MlTypes } from '../../../models/ml-types';

@Component({
  selector: 'app-transfer-learning-models-detail-settings',
  templateUrl: './transfer-learning-models-detail-settings.component.html',
  styleUrls: ['./transfer-learning-models-detail-settings.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class TransferLearningModelsDetailSettingsComponent {
  @Input() public type?: MlTypes;
  @Input() public origin?: TransferLearningModelOrigins;
}
