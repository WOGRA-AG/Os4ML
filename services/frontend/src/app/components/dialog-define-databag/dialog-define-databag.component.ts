import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogAddDatabagComponent} from '../dialog-add-databag/dialog-add-databag.component';
import {MlTypes} from '../../models/ml-types';
import {Databag, ObjectstoreService} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-dialog-define-databag',
  templateUrl: './dialog-define-databag.component.html',
  styleUrls: ['./dialog-define-databag.component.scss']
})
export class DialogDefineDatabagComponent {
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

  back(): void {
    this.objectstoreService.deleteBucket(this.uuid).pipe().subscribe(() => {
      this.dialogRef.componentInstance.data.component = DialogAddDatabagComponent;
    });
  }

  close(): void {
    this.objectstoreService.deleteBucket(this.uuid).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
