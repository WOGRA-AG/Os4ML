import { Component, OnDestroy } from '@angular/core';
import { TransferLearningModelCreateFormComponent } from '../../organisms/transfer-learning-model-create-form/transfer-learning-model-create-form.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionService } from '../../../services/solution.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  NewTransferLearningModelDto,
  Solution,
} from '../../../../../build/openapi/modelmanager';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TransferLearningService } from '../../../services/transfer-learning.service';
import { SolutionCreateFormComponent } from '../../organisms/solution-create-form/solution-create-form.component';

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
    SolutionCreateFormComponent,
  ],
  standalone: true,
})
export class TransferLearningModelCreateDialogComponent implements OnDestroy {
  public solutions$: Observable<Solution[]>;
  public submitting = false;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private solutionService: SolutionService,
    private transferLearningService: TransferLearningService,
    public dialogRef: MatDialogRef<TransferLearningModelCreateDialogComponent>
  ) {
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
  }
  submit(newTransferLearningModelDto: NewTransferLearningModelDto): void {
    this.submitting = true;
    this.transferLearningService
      .createSolutionNew(newTransferLearningModelDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(solution => {
        this.submitting = false;
        this.dialogRef.close(solution);
        this.router.navigate(['transfer-learning']);
      });
  }
  close(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
