import { Component, Input } from '@angular/core';
import { TransferLearningModel } from '../../../../../build/openapi/modelmanager';
import { JsonPipe } from '@angular/common';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer-learning-models-table',
  templateUrl: './transfer-learning-models-table.component.html',
  styleUrls: ['./transfer-learning-models-table.component.scss'],
  imports: [JsonPipe, IconButtonComponent, MatTableModule, TranslateModule],
  standalone: true,
})
export class TransferLearningModelsTableComponent {
  @Input() public transferLearningModels: TransferLearningModel[] = [];

  public displayedColumns: string[] = ['label', 'type', 'origin', 'actions'];
}
