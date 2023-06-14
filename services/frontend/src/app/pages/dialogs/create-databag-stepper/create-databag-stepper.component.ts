import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { firstValueFrom } from 'rxjs';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { CreateDatabagComponent } from 'src/app/databags/components/create-databag/create-databag.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { StatusSpinnerComponent } from '../../../shared/components/molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { DatabagFieldsComponent } from '../../../databags/components/databag-fields/databag-fields.component';
import { DialogSectionComponent } from '../../../shared/components/molecules/dialog-section/dialog-section.component';
import { FormsModule } from '@angular/forms';
import { CreateDatabagComponent as CreateDatabagComponent_1 } from '../../../databags/components/create-databag/create-databag.component';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-create-databag-stepper',
  templateUrl: './create-databag-stepper.component.html',
  styleUrls: ['./create-databag-stepper.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    CreateDatabagComponent_1,
    FormsModule,
    DialogSectionComponent,
    DatabagFieldsComponent,
    NgIf,
    StatusSpinnerComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class CreateDatabagStepperComponent {
  public running = false;
  public stepperStep = 0;
  public databag: Databag = {};

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
    if (this.running) {
      return;
    }
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
