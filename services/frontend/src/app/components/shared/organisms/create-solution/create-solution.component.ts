import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PipelineStep} from '../../../../models/pipeline-step';
import { catchError, of } from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag, ModelmanagerService, Solution, Solver, User} from '../../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

@Component({
  selector: 'app-shared-popup-predictions',
  templateUrl: './create-solution.component.html',
  styleUrls: ['./create-solution.component.scss']
})
export class CreateSolutionComponent {
  databag: Databag = {};
  solution: Solution = {};
  solvers: Solver[] = [];
  submitting = false;
  stepperStep = 0;
  user: User = {id: '', email: '', rawToken: ''};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>,
              private modelManager: ModelmanagerService,
              private userFacade: UserFacade) {
    this.userFacade.currentUser$.pipe().subscribe(
      currentUser => this.user = currentUser
    );
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
    this.modelManager.getSolvers(this.user?.rawToken).subscribe((templates: Solver[]) => {
        this.solvers = templates.filter(template => template.pipelineStep === PipelineStep.solver);
        if (this.solution.solver === undefined) {
          this.solution.solver = this.solvers[0].name;
        }
      }
    );
  }

  nextPageClick(stepper: MatStepper) {
    this.solution.inputFields = this.getInputFields();
    this.dialogRef.componentInstance.data.solution = this.solution;
    this.stepperStep = 1;
    stepper.next();
  }

  selectDatabag(columnName: string | undefined) {
    if (!columnName) {
      return;
    }
    else {
      this.solution = {};
    }

    const outputFields = this.solution.outputFields || [];
    const columnIndex = outputFields.indexOf(columnName);
    if (columnIndex === -1) {
      outputFields.push(columnName);
    } else {
      outputFields.splice(columnIndex, 1);
    }
    this.solution.outputFields = outputFields;
  }

  isDisabled(columnName: string): boolean {
    if (!this.solution || !this.solution.outputFields || !columnName) {
      return false;
    }
    return this.solution.outputFields.length > 0
      && !this.solution.outputFields.includes(columnName);
  }

  close(): void {
    this.dialogRef.close();
  }

  back(stepper: MatStepper): void {
    stepper.previous();
    this.stepperStep -= 1;
  }

  onSubmit(): void {
    if (!this.databag || !this.databag.databagId || !this.databag.databagName) {
      return;
    }
    this.submitting = true;
    this.solution.status = 'Created';
    this.solution.databagId = this.databag.databagId;
    this.solution.databagName = this.databag.databagName;
    this.solution.metrics = [];
    this.modelManager.createSolution(this.user?.rawToken, this.solution)
      .pipe(
        catchError(() => {
          this.submitting = false;
          return of({runId: ''});
        })
      ).subscribe( solution => {
        this.solution = solution;
        this.submitting = false;
        this.dialogRef.close(this.solution);
    });
  }

  selectSolver(solver: Solver) {
    this.solution.solver = solver.name;
  }

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
