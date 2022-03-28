import {Component} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineInputComponent} from '../dialog-define-input/dialog-define-input.component';
import {DialogDefineSolverComponent} from '../dialog-define-solver/dialog-define-solver.component';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-dialog-define-output',
  templateUrl: './dialog-define-output.component.html',
  styleUrls: ['./dialog-define-output.component.scss']
})
export class DialogDefineOutputComponent {
  databag: Databag = {};
  solution: Solution;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution;
  }

  nextPageClick() {
    this.dialogRef.componentInstance.data.solution = this.solution;
    this.dialogRef.componentInstance.data.component = DialogDefineSolverComponent;
  }

  back(): void {
    this.dialogRef.componentInstance.data.component = DialogDefineInputComponent;
  }

  selectionChanged(columnName: string | undefined) {
    if (!columnName) {
      return;
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
}
