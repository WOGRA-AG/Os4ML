import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';

@Component({
  selector: 'app-transfer-learning-models-detail-delete-model',
  templateUrl: './transfer-learning-models-detail-delete-model.component.html',
  styleUrls: ['./transfer-learning-models-detail-delete-model.component.scss'],
  standalone: true,
  imports: [TranslateModule, NewButtonComponent],
})
export class TransferLearningModelsDetailDeleteModelComponent {
  @Output() public deleteTransferLearningModel = new EventEmitter<void>();
}
