import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subject, takeUntil } from 'rxjs';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import {
  Databag,
  Solution,
  Solver,
} from '../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-create-solution-stepper',
  templateUrl: './create-solution-stepper.component.html',
  styleUrls: ['./create-solution-stepper.component.scss'],
})
export class CreateSolutionStepperComponent implements OnDestroy {
  databag: Databag = {};
  solution: Solution = {};
  submitting = false;
  stepperStep = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreateSolutionStepperComponent>,
    private solutionService: SolutionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      databag: Databag;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.databag = data.databag;
  }

  onSubmit(): void {
    if (!this.databag || !this.databag.id || !this.databag.databagName) {
      this.close();
      return;
    }
    this.submitting = true;
    this.solutionService
      .createSolution(this.solution, this.databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe(solution => {
        this.submitting = false;
        this.dialogRef.close(solution);
      });
  }

  nextPageClick(stepper: MatStepper): void {
    this.stepperStep = 1;
    stepper.next();
  }

  selectOutputColumn(columnName: string): void {
    this.solution.outputFields = [columnName];
  }

  close(): void {
    this.dialogRef.close();
  }

  back(stepper: MatStepper): void {
    stepper.previous();
    this.stepperStep -= 1;
  }

  selectSolver(solver: Solver): void {
    this.solution.solver = solver.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}