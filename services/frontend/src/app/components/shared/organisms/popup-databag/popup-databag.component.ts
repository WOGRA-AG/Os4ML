import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {CreateDatabagComponent} from '../../templates/create-databag/create-databag.component';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';

@Component({
  selector: 'app-dialog-define-databag',
  templateUrl: './popup-databag.component.html',
  styleUrls: ['./popup-databag.component.scss']
})
export class PopupDatabagComponent {
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
      this.dialogRef.componentInstance.data.component = CreateDatabagComponent;
    });
  }

  close(): void {
    this.objectstoreService.deleteDatabag(this.uuid).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
