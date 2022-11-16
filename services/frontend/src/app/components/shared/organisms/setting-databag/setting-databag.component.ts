import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupDeleteComponent} from '../popup-delete/popup-delete.component';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag, ModelmanagerService, User} from '../../../../../../build/openapi/modelmanager';

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
    private modelManager: ModelmanagerService,
    private dialog: MatDialog,
    private userFacade: UserFacade,
  ) {
    this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.databag = dialogRef.componentInstance.data.databag;
        this.modelManager.getDatabagById(String(this.databag.databagId), currentUser.rawToken).subscribe((databag: Databag) => {
          this.databag = databag;
        });
      }
    );
  }

  onSubmit(): void {
    this.modelManager.updateDatabagById(String(this.databag.databagId), this.user?.rawToken, this.databag).subscribe(() => {
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
