import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {catchError, of} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {Databag, Solution, Solver} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {SolutionService} from '../../services/solution.service';

@Component({
  selector: 'app-create-solution',
  templateUrl: './create-solution.component.html',
  styleUrls: ['./create-solution.component.scss']
})
export class CreateSolutionComponent {
  databag: Databag = {};
  solution: Solution = {};
  submitting = false;
  stepperStep = 0;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>,
              private solutionService: SolutionService) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
    this.solution.databagId = this.databag.databagId;
    this.solution.databagName = this.databag.databagName;
  }

  nextPageClick(stepper: MatStepper) {
    this.stepperStep = 1;
    stepper.next();
  }

  onSubmit(): void {
    if (!this.databag || !this.databag.databagId || !this.databag.databagName) {
      return;
    }
    this.submitting = true;
    this.solutionService.createSolution(this.solution, this.databag)
      .subscribe(solution => {
        this.submitting = false;
        this.dialogRef.close(solution);
    });
  }

  selectOutputColumn(columnName: string) {
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
}
