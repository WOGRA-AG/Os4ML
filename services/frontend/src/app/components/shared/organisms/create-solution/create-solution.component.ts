import {Component} from '@angular/core';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {JobmanagerService, PipelineTemplate, Solution} from '../../../../../../build/openapi/jobmanager';
import {PipelineStep} from '../../../../models/pipeline-step';
import { catchError, of } from 'rxjs';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-shared-popup-predictions',
  templateUrl: './create-solution.component.html',
  styleUrls: ['./create-solution.component.scss']
})
export class CreateSolutionComponent {
  databag: Databag = {};
  solution: Solution = {};
  solvers: PipelineTemplate[] = [];
  submitting = false;
  stepperStep = 0;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>,
              private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
    this.jobmanagerService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
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
    this.jobmanagerService.postSolution(this.solution)
      .pipe(
        catchError(err => {
          this.submitting = false;
          return of('');
        })
      ).subscribe( runId => {
        this.solution.runId = runId;
        this.submitting = false;
        this.dialogRef.close(this.solution);
    });
  }

  selectSolver(solver: PipelineTemplate) {
    this.solution.solver = solver.name;
  }

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
