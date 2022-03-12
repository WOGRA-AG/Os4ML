import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineOutputComponent} from '../dialog-define-output/dialog-define-output.component';
import {Column} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-dialog-define-input',
  templateUrl: './dialog-define-input.component.html',
  styleUrls: ['./dialog-define-input.component.scss']
})
export class DialogDefineInputComponent {
  columns: Array<Column> = [{name: 'Column1', type: 'Number', numEntries: 981, usage: 'Feature'},
    {name: 'Column2', type: 'Text', numEntries: 981, usage: 'Feature'},
    {name: 'Column3', type: 'Image', numEntries: 981, usage: 'Feature'},
    {name: 'Column4', type: 'Date', numEntries: 981, usage: 'Feature'},
    {name: 'Column5', type: 'Date', numEntries: 981, usage: 'Feature'},
    {name: 'Column6', type: 'Date', numEntries: 981, usage: 'Feature'}];

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
  }

  nextPageClick() {
    this.dialogRef.componentInstance.data.component = DialogDefineOutputComponent;
  }
}
