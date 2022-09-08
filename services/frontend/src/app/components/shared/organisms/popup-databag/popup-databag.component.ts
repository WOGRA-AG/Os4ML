import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupUploadComponent} from '../popup-upload/popup-upload.component';
import {MlTypes} from '../../../../models/ml-types';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';

@Component({
  selector: 'app-dialog-define-databag',
  templateUrl: './popup-databag.component.html',
  styleUrls: ['./popup-databag.component.scss']
})
export class PopupDatabagComponent {
  mlTypesArray = Object.keys(MlTypes);
  uuid = '';
  databag: Databag = {};

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private objectstoreService: ObjectstoreService) {
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

  back(): void {
    this.objectstoreService.deleteDatabag(this.uuid).pipe().subscribe(() => {
      this.dialogRef.componentInstance.data.component = PopupUploadComponent;
    });
  }

  close(): void {
    this.objectstoreService.deleteDatabag(this.uuid).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
