import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransferLearningModel } from '../../../../../build/openapi/modelmanager';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TransferLearningModelContextMenuComponent } from '../transfer-learning-model-context-menu/transfer-learning-model-context-menu.component';
import { TransferLearningModelOrigins } from '../../../models/transfer-learning-model-origins';
import { NgIf } from '@angular/common';
import { StringToTLMOriginPipe } from '../../../pipes/string-to-tlmorigin.pipe';

@Component({
  selector: 'app-transfer-learning-models-table',
  templateUrl: './transfer-learning-models-table.component.html',
  styleUrls: ['./transfer-learning-models-table.component.scss'],
  imports: [
    IconButtonComponent,
    MatTableModule,
    TranslateModule,
    TransferLearningModelContextMenuComponent,
    NgIf,
    StringToTLMOriginPipe,
  ],
  standalone: true,
})
export class TransferLearningModelsTableComponent {
  @Output() public deleteTransferLearningModelButton =
    new EventEmitter<string>();
  @Input() public transferLearningModels: TransferLearningModel[] = [];
  public displayedColumns: string[] = ['label', 'type', 'origin', 'actions'];
  protected readonly TransferLearningModelOrigins =
    TransferLearningModelOrigins;
}
