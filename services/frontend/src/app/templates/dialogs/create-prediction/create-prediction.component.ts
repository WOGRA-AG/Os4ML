import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prediction, Solution } from 'build/openapi/modelmanager';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PredictionService } from 'src/app/predictions/services/prediction.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { StatusSpinnerComponent } from '../../../shared/components/molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DatasetUploadComponent } from 'src/app/shared/components/organisms/dataset-upload/dataset-upload.component';
import { urlRegex } from 'src/app/shared/lib/regex/regex';
import { ErrorService } from 'src/app/core/services/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-prediction',
  templateUrl: './create-prediction.component.html',
  styleUrls: ['./create-prediction.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    NgIf,
    StatusSpinnerComponent,
    ButtonComponent,
    TranslateModule,
    DatasetUploadComponent,
  ],
})
export class CreatePredictionComponent implements OnDestroy {
  public stepperStep = 0;
  public solution: Solution;
  public prediction: Prediction = {};
  public running = false;
  public file: File = new File([], '');
  public url = '';
  public urlRegex = urlRegex;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreatePredictionComponent>,
    private predictionService: PredictionService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      solution: Solution;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.solution = data.solution;
  }

  close(): void {
    this.dialogRef.close();
  }

  async createPrediction(): Promise<void> {
    if (!this.solution.id) {
      return;
    }
    this.running = true;
    this.prediction.solutionId = this.solution.id;

    if (this.file.name) {
      this.prediction.status = 'message.pipeline.running.uploading_file';
      this.prediction = await firstValueFrom(
        this.predictionService.uploadData(this.file, this.prediction)
      );
    } else if (this.url) {
      this.prediction.dataUrl = this.url;
    } else {
      const res = this.translate.instant('message_no_dataset');
      const conf = this.translate.instant('action.confirm');
      this.errorService.reportError(res, conf);
      this.running = false;
      return;
    }

    await firstValueFrom(
      this.predictionService
        .createPrediction(this.prediction)
        .pipe(takeUntil(this.destroy$))
    );
    this.running = false;
    this.dialogRef.close();
    this.router.navigate(['solutions', this.solution.id, 'predictions']);
  }

  valid(): boolean {
    if (!this.prediction.name || this.prediction.name.length === 0) {
      return false;
    }
    if (this.url) {
      return !!this.url.match(this.urlRegex);
    }
    return !!this.file.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
