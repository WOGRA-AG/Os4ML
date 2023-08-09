import { Component, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Prediction, Solution } from '../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { SolutionService } from '../../solutions/services/solution.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { SolutionCreateFormComponent } from '../../shared/components/organisms/solution-create-form/solution-create-form.component';
import { MaterialModule } from '../../material/material.module';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Os4mlDialogTemplateComponent } from '../../shared/components/templates/os4ml-dialog-template/os4ml-dialog-template.component';
import {
  PredictionCreateFormComponent,
  PredictionFormOutput,
} from '../../shared/components/organisms/prediction-create-form/prediction-create-form.component';
import { PredictionService } from '../../predictions/services/prediction.service';
import { GetSolutionByIdPipe } from '../../shared/pipes/get-solution-by-id.pipe';
import { UploadingFilesComponent } from '../../shared/components/organisms/uploading-files/uploading-files.component';

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
    UploadingFilesComponent,
  ],
  providers: [GetSolutionByIdPipe],
})
export class PredictionsCreateDialogComponent implements OnDestroy {
  public solutions$: Observable<Solution[]>;
  public predictionUploadProgress$: BehaviorSubject<number>;
  public submitting = false;
  public uploadingFileName = '';
  public selectedSolutionId?: string;
  private destroy$: Subject<void> = new Subject<void>();
  private cancelUpload$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    public predictionService: PredictionService,
    public dialogRef: MatDialogRef<PredictionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { solutionId: string }
  ) {
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
    this.predictionUploadProgress$ =
      this.predictionService.getPredictionUploadProgress();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }

  close(): void {
    if (
      this.submitting &&
      !(this.predictionUploadProgress$.getValue() === 100)
    ) {
      this.cancelUpload();
    }
    this.dialogRef.close();
  }

  public downloadPredictionTemplate(
    downloadLink: HTMLAnchorElement,
    solutionId: string
  ): void {
    this.predictionService
      .getPredictionTemplateGetUrl(solutionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }

  public submitPrediction(predictionFormOutput: PredictionFormOutput): void {
    this.submitting = true;
    this.selectedSolutionId = predictionFormOutput.solutionId;
    this.createPrediction(predictionFormOutput);
  }

  public finishUpload(): void {
    this.dialogRef.close();
    this.router.navigate(['predictions'], {
      queryParams: { selectedSolution: this.selectedSolutionId },
    });
  }

  public cancelUpload(): void {
    this.cancelUpload$.next();
    this.dialogRef.close();
  }

  private createPrediction(predictionFormOutput: PredictionFormOutput): void {
    const solution = this.solutionService.getSolutionById(
      predictionFormOutput.solutionId
    );

    const prediction: Prediction = {
      name: predictionFormOutput.predictionName,
      solutionId: predictionFormOutput.solutionId,
      databagId: solution?.databagId,
    };

    if (predictionFormOutput.predictionDataFile) {
      this.createLocalFilePrediction(predictionFormOutput, prediction);
      return;
    }

    if (predictionFormOutput.predictionDataUrl) {
      this.createUrlPrediction(predictionFormOutput, prediction);
      return;
    }
    console.error('Both predictionDataFile and predictionDataUrl are null.');
  }

  private createLocalFilePrediction(
    predictionFormOutput: PredictionFormOutput,
    prediction: Prediction
  ): void {
    prediction.dataFileName = predictionFormOutput.predictionDataFile!.name;
    this.predictionService
      .createLocalFilePrediction(
        predictionFormOutput.predictionDataFile!,
        prediction,
        this.cancelUpload$
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private createUrlPrediction(
    predictionFormOutput: PredictionFormOutput,
    prediction: Prediction
  ): void {
    this.predictionService
      .createUrlPrediction(
        predictionFormOutput.predictionDataUrl!,
        prediction,
        this.cancelUpload$
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
