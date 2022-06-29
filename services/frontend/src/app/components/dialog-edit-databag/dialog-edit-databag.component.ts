import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../dialog-dynamic/dialog-dynamic.component';
import {
  Databag,
  ObjectstoreService
} from '../../../../build/openapi/objectstore';
import {MlTypes} from '../../models/ml-types';

@Component({
  selector: 'app-dialog-edit-databag',
  templateUrl: './dialog-edit-databag.component.html',
  styleUrls: ['./dialog-edit-databag.component.scss']
})
export class DialogEditDatabagComponent {
  mlTypesArray = Object.keys(MlTypes);
  uuid = '';
  databag: Databag = {};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private objectstoreService: ObjectstoreService) {
    this.uuid = dialogRef.componentInstance.data.uuid;
    this.objectstoreService.getDatabagByBucketName(this.uuid).subscribe((databag: Databag) => {
      this.databag = databag;
    });
  }

  onSubmit(): void {
    this.objectstoreService.putDatabagByBucketName(this.uuid, this.databag).subscribe(() => {
      this.dialogRef.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
