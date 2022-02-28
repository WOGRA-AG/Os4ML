import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from "../dialog-dynamic/dialog-dynamic.component";
import {DialogAddDatabagComponent} from "../dialog-add-databag/dialog-add-databag.component";
import {FormControl, Validators} from "@angular/forms";
import {MlTypes} from "../../models/ml-types";

@Component({
  selector: 'app-dialog-define-databag',
  templateUrl: './dialog-define-databag.component.html',
  styleUrls: ['./dialog-define-databag.component.scss']
})
export class DialogDefineDatabagComponent {
  mlTypesArray = Object.keys(MlTypes);
  uuid: string = '';
  name = new FormControl('',
    [Validators.required, Validators.maxLength(20), Validators.minLength(3)]
  );
  columns: Array<any> = new Array<any>();

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
    this.uuid = dialogRef.componentInstance.data.uuid;
  }

  createBag(): void {
    if (!this.name.valid) {
      this.name.markAllAsTouched();
      return;
    }
    this.dialogRef.close();
  }

  back(): void {
    this.dialogRef.componentInstance.data.component = DialogAddDatabagComponent;
  }
}
