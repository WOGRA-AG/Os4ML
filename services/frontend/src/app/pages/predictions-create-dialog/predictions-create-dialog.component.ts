import { Component, Inject, OnDestroy } from '@angular/core';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { Prediction, Solution } from '../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { SolutionService } from '../../solutions/services/solution.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { SolutionCreateFormComponent } from '../../shared/components/organisms/solution-create-form/solution-create-form.component';
import { MaterialModule } from '../../material/material.module';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
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
    JsonPipe,
    UploadingFilesComponent,
  ],
  providers: [GetSolutionByIdPipe],
})
export class PredictionsCreateDialogComponent implements OnDestroy {
  public solutions$: Observable<Solution[]>;
  public predictionUploadProgress$: Observable<number>;
  public submitting = false;
  public uploadingFileName = '';
  public selectedSolutionId?: string;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    public predictionService: PredictionService,
    private getSolutionByIdPipe: GetSolutionByIdPipe,
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
  }

  close(): void {
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
    this.solutions$
      .pipe(takeUntil(this.destroy$), first())
      .subscribe(solutions =>
        this.createPrediction(solutions, predictionFormOutput)
      );
  }

  public finishUpload(): void {
    this.dialogRef.close();
    this.router.navigate(['predictions'], {
      queryParams: { selectedSolution: this.selectedSolutionId },
    });
  }

  private createPrediction(
    solutions: Solution[],
    predictionFormOutput: PredictionFormOutput
  ): void {
    const solution = this.getSolutionByIdPipe.getSolutionById(
      solutions,
      predictionFormOutput.solutionId
    );
    const prediction: Prediction = {
      name: predictionFormOutput.predictionName,
      solutionId: predictionFormOutput.solutionId,
      databagId: solution?.databagId,
    };

    if (predictionFormOutput.predictionDataFile) {
      this.uploadingFileName = predictionFormOutput.predictionDataFile.name;
      this.createPredictionFromLocalFile(prediction, predictionFormOutput);
      return;
    }
    if (predictionFormOutput.predictionDataUrl) {
      this.createPredictionFromFileUrl(prediction, predictionFormOutput);
      return;
    }
    console.error('Both predictionDataFile and predictionDataUrl are null.');
  }

  private createPredictionFromLocalFile(
    prediction: Prediction,
    predictionFormOutput: PredictionFormOutput
  ): void {
    prediction.dataFileName = predictionFormOutput.predictionDataFile!.name;
    this.predictionService
      .createLocalFilePrediction(
        predictionFormOutput.predictionDataFile!,
        prediction
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private createPredictionFromFileUrl(
    prediction: Prediction,
    predictionFormOutput: PredictionFormOutput
  ): void {
    prediction.dataUrl = predictionFormOutput.predictionDataUrl;
    this.predictionService
      .createFileUrlPrediction(
        predictionFormOutput.predictionDataUrl!,
        prediction
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
