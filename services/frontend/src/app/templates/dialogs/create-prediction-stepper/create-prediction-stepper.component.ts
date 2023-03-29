import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Prediction, Solution } from 'build/openapi/modelmanager';
import { firstValueFrom } from 'rxjs';
import { CreatePredictionComponent } from 'src/app/predictions/components/create-prediction/create-prediction.component';
import { PredictionService } from 'src/app/predictions/services/prediction.service';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { StatusSpinnerComponent } from '../../../shared/components/molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { CreatePredictionComponent as CreatePredictionComponent_1 } from '../../../predictions/components/create-prediction/create-prediction.component';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-create-prediction-stepper',
  templateUrl: './create-prediction-stepper.component.html',
  styleUrls: ['./create-prediction-stepper.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    CreatePredictionComponent_1,
    NgIf,
    StatusSpinnerComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class CreatePredictionStepperComponent {
  public stepperStep = 0;
  public solution: Solution;
  public prediction: Prediction = {};
  public running = false;

  constructor(
    private dialogRef: MatDialogRef<CreatePredictionStepperComponent>,
    private predictionService: PredictionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      solution: Solution;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.solution = data.solution;
  }

  async predict(
    stepper: MatStepper,
    createPredictionComponent: CreatePredictionComponent
  ): Promise<void> {
    this.running = true;
    await createPredictionComponent.createPrediction();
    this.stepperStep = 1;
    stepper.next();
  }

  async clearProgress(): Promise<void> {
    await firstValueFrom(
      this.predictionService.deletePredictionById(this.prediction.id)
    );
    this.running = false;
  }

  async close(): Promise<void> {
    if (this.stepperStep === 0) {
      await this.clearProgress();
    }
    this.dialogRef.close();
  }

  async back(stepper: MatStepper): Promise<void> {
    await this.clearProgress();
    this.stepperStep -= 1;
    stepper.previous();
  }

  updatePrediction(prediction: Prediction): void {
    this.prediction = prediction;
  }
}
