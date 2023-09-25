import { Component } from '@angular/core';
import { TransferLearningModelsTableComponent } from '../../organisms/transfer-learning-models-table/transfer-learning-models-table.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  Databag,
  TransferLearningModel,
} from '../../../../../build/openapi/modelmanager';
import { TransferLearningService } from '../../../services/transfer-learning.service';
import { SolutionCreateButtonComponent } from '../../organisms/solution-create-button/solution-create-button.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatabagService } from '../../../services/databag.service';
import { TransferLearningModelCreateButtonComponent } from '../../organisms/transfer-learning-model-create-button/transfer-learning-model-create-button.component';
import { PlaceholderComponent } from '../../molecules/placeholder/placeholder.component';
import { TransferLearningModelCreateDialogComponent } from '../transfer-learning-model-create-dialog/transfer-learning-model-create-dialog.component';

@Component({
  selector: 'app-transfer-learning-page',
  templateUrl: './transfer-learning-page.component.html',
  styleUrls: ['./transfer-learning-page.component.scss'],
  standalone: true,
  imports: [
    TransferLearningModelsTableComponent,
    AsyncPipe,
    HasElementsPipe,
    NgIf,
    Os4mlDefaultTemplateComponent,
    TranslateModule,
    SolutionCreateButtonComponent,
    TransferLearningModelCreateButtonComponent,
    PlaceholderComponent,
  ],
})
export class TransferLearningPageComponent {
  public databags$: Observable<Databag[]>;
  public transferLearningModels$: Observable<TransferLearningModel[]>;

  constructor(
    private databagService: DatabagService,
    private transferLearningService: TransferLearningService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.transferLearningModels$ =
      this.transferLearningService.transferLearningModels$;
  }
  openCreateSolutionDialog(): void {
    this.dialog.open(SolutionCreateDialogComponent);
  }

  openCreateTransferLearningModelDialog(): void {
    this.dialog.open(TransferLearningModelCreateDialogComponent);
  }
}
