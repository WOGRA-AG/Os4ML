import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupPredictionsComponent} from '../popup-predictions/popup-predictions.component';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';
import {JobmanagerService, PipelineTemplate, Solution} from '../../../../../../build/openapi/jobmanager';
import {PipelineStep} from '../../../../models/pipeline-step';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-shared-popup-solver',
  templateUrl: './popup-solver.component.html',
  styleUrls: ['./popup-solver.component.scss']
})
export class PopupSolverComponent {
  solution: Solution;
  databag: Databag;
  solvers: PipelineTemplate[] = [];
  submitting = false;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>,
              private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.databag = dialogRef.componentInstance.data.databag;
    this.jobmanagerService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
        this.solvers = templates.filter(template => template.pipelineStep === PipelineStep.solver);
        if (this.solution.solver === undefined) {
          this.solution.solver = this.solvers[0].name;
        }
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  back(): void {
    this.dialogRef.componentInstance.data.component = PopupPredictionsComponent;
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

  selectSolver(solver: PipelineTemplate) {
    this.solution.solver = solver.name;
  }
}
