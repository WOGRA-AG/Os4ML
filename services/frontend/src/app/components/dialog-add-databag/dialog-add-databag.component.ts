import {Component} from '@angular/core';
import {ObjectstoreService} from '../../../../build/openapi/objectstore';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineDatabagComponent} from '../dialog-define-databag/dialog-define-databag.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-dialog-add-databag',
  templateUrl: './dialog-add-databag.component.html',
  styleUrls: ['./dialog-add-databag.component.scss']
})
export class DialogAddDatabagComponent {
  file: File = new File([], '');
  uploadProgress: number = 0;
  uuid: string = '';

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private _snackbar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService) {
  }

  uploadFile(file: File): void {
    this.uuid = uuidv4();
  }

  nextPageClick(): void {
    if (!this.uuid) {
      this.translate.get('error.no_dataset').subscribe((res: string) => {
        this.translate.get('error.confirm').subscribe((conf: string) => {
          this._snackbar.open(res, conf, {duration: 3000});
        });
      });
      return;
    }
    this.dialogRef.componentInstance.data.uuid = this.uuid;
    this.dialogRef.componentInstance.data.component = DialogDefineDatabagComponent;
  }
}
