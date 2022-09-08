import {Component} from '@angular/core';
import {Databag} from '../../../../../../build/openapi/objectstore';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupSolverComponent} from '../../../shared/organisms/popup-solver/popup-solver.component';
import {Solution} from '../../../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-popup-predictions',
  templateUrl: './popup-predictions.component.html',
  styleUrls: ['./popup-predictions.component.scss']
})
export class PopupPredictionsComponent {
  databag: Databag = {};
  solution: Solution = {};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
    this.databag = dialogRef.componentInstance.data.databag;
    this.solution = dialogRef.componentInstance.data.solution ? dialogRef.componentInstance.data.solution : {};
  }

  close(): void {
    this.dialogRef.close();
  }

  nextPageClick() {
    this.solution.inputFields = this.getInputFields();
    this.dialogRef.componentInstance.data.solution = this.solution;
    this.dialogRef.componentInstance.data.component = PopupSolverComponent;
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

  isDisabled(columnName: string): boolean {
    if (!this.solution || !this.solution.outputFields || !columnName) {
      return false;
    }
    return this.solution.outputFields.length > 0
      && !this.solution.outputFields.includes(columnName);
  }

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
