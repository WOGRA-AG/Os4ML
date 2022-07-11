import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {Databag, ObjectstoreService} from '../../../../build/openapi/objectstore';
import {JobmanagerService, PipelineTemplate, Solution} from '../../../../build/openapi/jobmanager';
import {PipelineStep} from '../../models/pipeline-step';

@Component({
  selector: 'app-dialog-define-solver',
  templateUrl: './dialog-define-solver.component.html',
  styleUrls: ['./dialog-define-solver.component.scss']
})
export class DialogDefineSolverComponent {
  solution: Solution;
  databag: Databag;
  solver: PipelineTemplate[] = [];

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
    this.solution.status = 'Created';
    this.solution.bucketName = this.databag.bucketName;
    this.solution.databagName = this.databag.databagName;
    this.jobmanagerService.postSolution(this.solution).subscribe(runId => {
      this.solution.runId = runId;
      this.dialogRef.close(this.solution);
    });
  }

  selectSolver(tmp: PipelineTemplate) {
    this.solution.solver = tmp.name;
  }
}
