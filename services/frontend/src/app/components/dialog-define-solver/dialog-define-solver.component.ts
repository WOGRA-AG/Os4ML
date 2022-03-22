import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {ObjectstoreService, PipelineTemplate, Solution} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-dialog-define-solver',
  templateUrl: './dialog-define-solver.component.html',
  styleUrls: ['./dialog-define-solver.component.scss']
})
export class DialogDefineSolverComponent {
  solution: Solution;
  solver: PipelineTemplate[] = [];

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private objectstoreService: ObjectstoreService) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.objectstoreService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
      this.solver = templates;
    });
  }

  back(): void {
    this.dialogRef.componentInstance.data.component = DialogDefineOutputComponent;
  };

  onSubmit(): void {
    this.dialogRef.close(this.solution);
  }

  selectSolver(tmp: PipelineTemplate) {
    this.solution.solver = tmp.name;
  }
}
