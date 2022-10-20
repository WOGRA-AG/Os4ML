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
import {User} from '../../../../../../build/openapi/jobmanager';
import {UserFacade} from '../../../../user/services/user-facade.service';

@Component({
  selector: 'app-shared-setting-databag',
  templateUrl: './setting-databag.component.html',
  styleUrls: ['./setting-databag.component.scss']
})
export class SettingDatabagComponent {
  databag: Databag = {};
  user: User = {id: '', email: '', rawToken: ''};

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private objectstoreService: ObjectstoreService,
    private dialog: MatDialog,
    private userFacade: UserFacade,
  ) {
    this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.databag = dialogRef.componentInstance.data.databag;
        this.objectstoreService.getDatabagById(String(this.databag.databagId), currentUser.rawToken).subscribe((databag: Databag) => {
          this.databag = databag;
        });
      }
    );
  }

  onSubmit(): void {
    this.objectstoreService.putDatabagById(String(this.databag.databagId), this.user?.rawToken, this.databag).subscribe(() => {
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
