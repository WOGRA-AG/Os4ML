import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { CreateDatabagComponent } from 'src/app/databags/components/create-databag/create-databag.component';
import { Databag, Solution, Solver } from 'build/openapi/modelmanager';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { SolutionService } from 'src/app/solutions/services/solution.service';

@Component({
  selector: 'app-getting-started-stepper',
  templateUrl: './getting-started-stepper.component.html',
  styleUrls: ['./getting-started-stepper.component.scss'],
})
export class GettingStartedStepperComponent implements OnDestroy {
  databag: Databag = {};
  solution: Solution = {};

  runningSpinner = false;
  submitting = false;
  stepperStep = 0;

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
        if (
          !this.databag ||
          !this.databag.databagId ||
          !this.databag.databagName
        ) {
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
    if (this.databag.databagId === undefined) {
      return of(undefined);
    }
    return this.databagService.deleteDatabagById(this.databag.databagId);
  }

  selectOutputColumn(columnName: string): void {
    this.solution.outputFields = [columnName];
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
