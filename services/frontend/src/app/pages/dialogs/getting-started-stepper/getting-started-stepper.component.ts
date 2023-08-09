import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { CreateDatabagComponent } from 'src/app/databags/components/create-databag/create-databag.component';
import { Databag, Solution, Solver } from 'build/openapi/modelmanager';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import { TranslateModule } from '@ngx-translate/core';
import { StatusSpinnerComponent } from '../../../shared/components/molecules/status-spinner/status-spinner.component';
import { ButtonComponent } from '../../../shared/components/molecules/button/button.component';
import { ChooseSolverComponent } from '../../../solutions/components/choose-solver/choose-solver.component';
import { MaterialModule } from 'src/app/shared/components/atoms/material/material.module';
import { FormsModule } from '@angular/forms';
import { ChooseDatabagColumnComponent } from '../../../solutions/components/choose-databag-column/choose-databag-column.component';
import { NgIf, NgClass } from '@angular/common';
import { DialogSectionComponent } from '../../../shared/components/molecules/dialog-section/dialog-section.component';
import { CreateDatabagComponent as CreateDatabagComponent_1 } from '../../../databags/components/create-databag/create-databag.component';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';

@Component({
  selector: 'app-getting-started-stepper',
  templateUrl: './getting-started-stepper.component.html',
  styleUrls: ['./getting-started-stepper.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    CreateDatabagComponent_1,
    DialogSectionComponent,
    NgIf,
    ChooseDatabagColumnComponent,
    FormsModule,
    NgClass,
    ChooseSolverComponent,
    ButtonComponent,
    StatusSpinnerComponent,
    TranslateModule,
  ],
})
export class GettingStartedStepperComponent implements OnDestroy {
  public databag: Databag = {};
  public solution: Solution = {};

  public runningSpinner = false;
  public submitting = false;
  public stepperStep = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<GettingStartedStepperComponent, void>,
    private databagService: DatabagService,
    private solutionService: SolutionService
  ) {
    this.dialogRef.disableClose = true;
  }

  async next(
    stepper: MatStepper,
    createDatabagComponent: CreateDatabagComponent
  ): Promise<void> {
    this.submitting = true;

    switch (this.stepperStep) {
      case 0:
        this.runningSpinner = true;
        await createDatabagComponent.createDatabag();
        this.runningSpinner = false;
        break;
      case 1:
        break;
      case 2:
        if (!this.databag || !this.databag.id || !this.databag.name) {
          this.dialogRef.close();
          return;
        }
        await firstValueFrom(
          this.solutionService.createSolution(this.solution, this.databag)
        );
        this.dialogRef.close();
        break;
    }
    stepper.next();
    this.stepperStep += 1;
    this.submitting = false;
  }

  isDisabled(
    createDatabagComponent: CreateDatabagComponent,
    validSolutionName: boolean | null
  ): boolean {
    if (this.submitting) {
      return true;
    }
    switch (this.stepperStep) {
      case 0:
        return !createDatabagComponent.valid();
      case 1:
        return !this.solution.outputFields;
      case 2:
        return !this.solution.solver || !validSolutionName;
      default:
        return false;
    }
  }

  async back(stepper: MatStepper): Promise<void> {
    if (this.stepperStep === 1) {
      await firstValueFrom(this.deleteDatabag());
      this.solution = {};
    }
    stepper.previous();
    this.stepperStep -= 1;
  }

  close(): void {
    this.deleteDatabag()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  deleteDatabag(): Observable<void> {
    if (this.databag.id === undefined) {
      return of(undefined);
    }
    return this.databagService.deleteDatabagById(this.databag.id);
  }

  selectOutputColumn(columnNames: string[]): void {
    this.solution.outputFields = columnNames;
  }

  selectSolver(solver: Solver): void {
    this.solution.solver = solver.name;
  }

  databagUpdate(databag: Databag): void {
    this.databag = databag;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
