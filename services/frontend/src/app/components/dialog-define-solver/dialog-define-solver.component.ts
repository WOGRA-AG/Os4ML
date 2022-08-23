import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {Databag, ObjectstoreService} from '../../../../build/openapi/objectstore';
import {JobmanagerService, PipelineTemplate, Solution} from '../../../../build/openapi/jobmanager';
import {PipelineStep} from '../../models/pipeline-step';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dialog-define-solver',
  templateUrl: './dialog-define-solver.component.html',
  styleUrls: ['./dialog-define-solver.component.scss']
})
export class DialogDefineSolverComponent {
  solution: Solution;
  databag: Databag;
  solver: PipelineTemplate[] = [];
  submitting = false;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.databag = dialogRef.componentInstance.data.databag;
    this.jobmanagerService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
      this.solver = templates.filter(template => template.pipelineStep === PipelineStep.solver);
    });
  }

  back(): void {
    this.dialogRef.componentInstance.data.component = DialogDefineOutputComponent;
  };

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

  selectSolver(tmp: PipelineTemplate) {
    this.solution.solver = tmp.name;
  }
}
