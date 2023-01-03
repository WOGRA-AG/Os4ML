import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Databag, Solution} from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-dialog-dynamic',
  templateUrl: './dialog-dynamic.component.html',
})
export class DialogDynamicComponent {

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      component: any;
      uuid: string;
      solution: Solution;
      databag: Databag;
    }) {
    this.dialogRef.disableClose = true;
  }

}
