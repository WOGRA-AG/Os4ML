import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { firstValueFrom } from 'rxjs';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { CreateDatabagComponent } from 'src/app/databags/components/create-databag/create-databag.component';

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
    public dialogRef: MatDialogRef<CreateDatabagStepperComponent>,
    private databagService: DatabagService
  ) {
    this.dialogRef.disableClose = true;
  }

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
    if (this.databag.id === undefined) {
      return;
    }
    await firstValueFrom(
      this.databagService.updateDatabagById(this.databag.id, this.databag)
    );
    this.dialogRef.close();
  }

  async clearProgress(): Promise<void> {
    if (this.databag.id) {
      await firstValueFrom(
        this.databagService.deleteDatabagById(this.databag.id)
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

  databagUpdate(databag: Databag): void {
    this.databag = databag;
  }
}
