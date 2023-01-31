import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from '../../services/databag.service';
import { CreateDatabagComponent } from '../create-databag/create-databag.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-databag-stepper',
  templateUrl: './create-databag-stepper.component.html',
  styleUrls: ['./create-databag-stepper.component.scss'],
})
export class CreateDatabagStepperComponent {
  running = false;
  stepperStep = 0;
  databag: Databag = {};

  constructor(
    public dialogRef: MatDialogRef<DialogDynamicComponent>,
    private databagService: DatabagService
  ) {}

  async nextClick(
    stepper: MatStepper,
    createDatabagComponent: CreateDatabagComponent
  ): Promise<void> {
    this.running = true;
    await createDatabagComponent.createDatabag();
    this.running = false;
    this.stepperStep = 1;
    stepper.next();
  }

  async onSubmit(): Promise<void> {
    if (this.databag.databagId === undefined) {
      return;
    }
    await firstValueFrom(
      this.databagService.updateDatabagById(
        this.databag.databagId,
        this.databag
      )
    );
    this.dialogRef.close();
  }

  async clearProgress(): Promise<void> {
    if (this.databag.databagId) {
      await firstValueFrom(
        this.databagService.deleteDatabagById(this.databag.databagId)
      );
    }
    this.running = false;
  }

  async back(stepper: MatStepper): Promise<void> {
    await this.clearProgress();
    stepper.previous();
    this.stepperStep -= 1;
  }

  async close(): Promise<void> {
    await this.clearProgress();
    this.dialogRef.close();
  }

  databagUpdate(databag: Databag) {
    this.databag = databag;
  }
}
