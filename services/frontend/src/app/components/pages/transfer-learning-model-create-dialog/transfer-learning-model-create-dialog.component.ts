import { Component } from '@angular/core';
import { TransferLearningModelCreateFormComponent } from '../../organisms/transfer-learning-model-create-form/transfer-learning-model-create-form.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionService } from '../../../services/solution.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-transfer-learning-model-create-dialog',
  templateUrl: './transfer-learning-model-create-dialog.component.html',
  styleUrls: ['./transfer-learning-model-create-dialog.component.scss'],
  imports: [
    TransferLearningModelCreateFormComponent,
    IconButtonComponent,
    Os4mlDialogTemplateComponent,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class TransferLearningModelCreateDialogComponent {
  public solutions$: Observable<Solution[]>;
  constructor(
    private solutionService: SolutionService,
    public dialogRef: MatDialogRef<TransferLearningModelCreateDialogComponent>
  ) {
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
  }
  close(): void {
    this.dialogRef.close();
  }
}
