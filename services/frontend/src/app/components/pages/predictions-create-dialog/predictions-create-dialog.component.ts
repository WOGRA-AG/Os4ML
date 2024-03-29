import {
  Component,
  DestroyRef,
  inject,
  Inject,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Prediction,
  Solution,
} from '../../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { SolutionService } from '../../../services/solution.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { SolutionCreateFormComponent } from '../../organisms/solution-create-form/solution-create-form.component';
import { MaterialModule } from '../../atoms/material/material.module';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import {
  PredictionCreateFormComponent,
  PredictionFormOutput,
} from '../../organisms/prediction-create-form/prediction-create-form.component';
import { PredictionService } from '../../../services/prediction.service';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
import { UploadingFilesComponent } from '../../organisms/uploading-files/uploading-files.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatabagsCreateFormComponent } from '../../organisms/databags-create-form/databags-create-form.component';
enum PredictionCreateStatus {
  Input = 'input',
  Uploading = 'uploading',
  Done = 'done',
}

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
    DatabagsCreateFormComponent,
  ],
  providers: [GetSolutionByIdPipe],
})
export class PredictionsCreateDialogComponent implements OnDestroy {
  public PredictionCreateStatusEnum = PredictionCreateStatus;
  public predictionCreateStatus: PredictionCreateStatus =
    PredictionCreateStatus.Input;
  public solutions$: Observable<Solution[]>;
  public predictionUploadProgress$: BehaviorSubject<number>;
  public submitting = false;
  public uploadingFileName = '';
  public selectedSolutionId?: string;
  private cancelUpload$: Subject<void> = new Subject<void>();
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    public predictionService: PredictionService,
    public dialogRef: MatDialogRef<PredictionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { solutionId?: string }
  ) {
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
    this.predictionUploadProgress$ =
      this.predictionService.getPredictionUploadProgress();
  }

  ngOnDestroy(): void {
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }

  close(): void {
    if (this.predictionCreateStatus !== PredictionCreateStatus.Done) {
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }

  public submitPrediction(predictionFormOutput: PredictionFormOutput): void {
    this.predictionCreateStatus = PredictionCreateStatus.Uploading;
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
      this.uploadingFileName = predictionFormOutput.predictionDataFile.name;
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.predictionCreateStatus = PredictionCreateStatus.Done;
      });
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.predictionCreateStatus = PredictionCreateStatus.Done;
      });
  }
}
