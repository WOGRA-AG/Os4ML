import {Component} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineSolverComponent} from '../dialog-define-solver/dialog-define-solver.component';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-dialog-define-output',
  templateUrl: './dialog-define-output.component.html',
  styleUrls: ['./dialog-define-output.component.scss']
})
export class DialogDefineOutputComponent {
  databag: Databag = {};
  solution: Solution = {};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
  }

  nextPageClick() {
    this.solution.inputFields = this.getInputFields();
    this.dialogRef.componentInstance.data.solution = this.solution;
    this.dialogRef.componentInstance.data.component = DialogDefineSolverComponent;
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

  private getInputFields(): string[] | undefined{
    return this.databag.columns?.map(column => column.name).filter((colName): colName is string => !!colName).
    filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
