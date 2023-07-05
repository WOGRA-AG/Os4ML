import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Databag, Solution } from '../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { SolutionService } from '../../solutions/services/solution.service';
import { DatabagService } from '../../databags/services/databag.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { SolutionCreateFormComponent } from '../../shared/components/organisms/solution-create-form/solution-create-form.component';
import { MaterialModule } from '../../material/material.module';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Os4mlDialogTemplateComponent } from '../../shared/components/templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { PredictionCreateFormComponent } from '../../shared/components/organisms/prediction-create-form/prediction-create-form.component';

@Component({
  selector: 'app-predictions-create-dialog',
  templateUrl: './predictions-create-dialog.component.html',
  styleUrls: ['./predictions-create-dialog.component.scss'],
  standalone: true,

  imports: [
    IconButtonComponent,
    SolutionCreateFormComponent,
    MaterialModule,
    AsyncPipe,
    TranslateModule,
    Os4mlDialogTemplateComponent,
    NgIf,
    PredictionCreateFormComponent,
    JsonPipe,
  ],
})
export class PredictionsCreateDialogComponent implements OnDestroy {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;

  public submitting = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    private databagService: DatabagService,
    public dialogRef: MatDialogRef<PredictionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { databagId: string; solutionId: string }
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
