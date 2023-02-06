import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subject, takeUntil } from 'rxjs';
import {
  Databag,
  Solution,
  Solver,
} from '../../../../../build/openapi/modelmanager';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { SolutionService } from '../../services/solution.service';

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

  destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private solutionService: SolutionService
  ) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution
      ? dialogRef.componentInstance.data.solution
      : {};
  }

  onSubmit(): void {
    if (!this.databag || !this.databag.databagId || !this.databag.databagName) {
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

  nextPageClick(stepper: MatStepper) {
    this.dialogRef.componentInstance.data.solution = this.solution;
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

  selectSolver(solver: Solver) {
    this.solution.solver = solver.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
