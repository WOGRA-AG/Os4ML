import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {Databag, ObjectstoreService, PipelineTemplate} from '../../../../build/openapi/objectstore';
import {JobmanagerService, Solution} from '../../../../build/openapi/jobmanager';

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
    this.objectstoreService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
      this.solver = templates;
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
