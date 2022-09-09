import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {
  Databag,
  ObjectstoreService
} from '../../../../../../build/openapi/objectstore';
import {PopupDeleteComponent} from '../popup-delete/popup-delete.component';

@Component({
  selector: 'app-shared-setting-databag',
  templateUrl: './setting-databag.component.html',
  styleUrls: ['./setting-databag.component.scss']
})
export class SettingDatabagComponent {
  uuid = '';
  databag: Databag = {};

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private objectstoreService: ObjectstoreService,
    private dialog: MatDialog,
  ) {
    this.uuid = dialogRef.componentInstance.data.uuid;
    this.objectstoreService.getDatabagById(this.uuid).subscribe((databag: Databag) => {
      this.databag = databag;
    });
  }

  onSubmit(): void {
    this.objectstoreService.putDatabagById(this.uuid, this.databag).subscribe(() => {
      this.dialogRef.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  delete(): void {
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupDeleteComponent, databag: this.databag}
    });
    deleteDialogRef.afterClosed().subscribe((msg) => {
      if (msg === 'deleted') {
        this.dialogRef.close();
      }
    });
  }
}
