import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransferLearningModel } from '../../../../../build/openapi/modelmanager';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TransferLearningModelContextMenuComponent } from '../transfer-learning-model-context-menu/transfer-learning-model-context-menu.component';
import { SolutionContextMenuComponent } from '../solution-context-menu/solution-context-menu.component';

@Component({
  selector: 'app-transfer-learning-models-table',
  templateUrl: './transfer-learning-models-table.component.html',
  styleUrls: ['./transfer-learning-models-table.component.scss'],
  imports: [
    IconButtonComponent,
    MatTableModule,
    TranslateModule,
    TransferLearningModelContextMenuComponent,
    SolutionContextMenuComponent,
  ],
  standalone: true,
})
export class TransferLearningModelsTableComponent {
  @Output() public deleteTransferLearningModelButton =
    new EventEmitter<string>();
  @Input() public transferLearningModels: TransferLearningModel[] = [];
  public dataSource: MatTableDataSource<TransferLearningModel>;

  public displayedColumns: string[] = ['label', 'type', 'origin', 'actions'];
  constructor() {
    this.dataSource = new MatTableDataSource<TransferLearningModel>(
      this.transferLearningModels
    );
  }
}
