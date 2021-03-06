import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {Databag} from '../../../../build/openapi/objectstore';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-dialog-define-input',
  templateUrl: './dialog-define-input.component.html',
  styleUrls: ['./dialog-define-input.component.scss']
})
export class DialogDefineInputComponent {
  databag: Databag = {};
  solution: Solution = {};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
  }

  nextPageClick() {
    this.dialogRef.componentInstance.data.solution = this.solution;
    this.dialogRef.componentInstance.data.component = DialogDefineOutputComponent;
  }

  selectionChanged(columnName: string | undefined) {
    if (!columnName) {
      return;
    }

    const inputFields = this.solution.inputFields || [];
    const columnIndex = inputFields.indexOf(columnName);
    if (columnIndex === -1) {
      inputFields.push(columnName);
    } else {
      inputFields.splice(columnIndex, 1);
    }
    this.solution.inputFields = inputFields;
  }
}
