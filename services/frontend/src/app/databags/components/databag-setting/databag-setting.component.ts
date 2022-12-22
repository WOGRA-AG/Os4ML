import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Databag, ModelmanagerService} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../components/dialog-dynamic/dialog-dynamic.component'; // TODO move
import {PopupDeleteComponent} from '../../../shared/components/organisms/popup-delete/popup-delete.component';
import {DatabagService} from '../../services/databag.service';

@Component({
  selector: 'app-databag-setting',
  templateUrl: './databag-setting.component.html',
  styleUrls: ['./databag-setting.component.scss']
})
export class DatabagSettingComponent {
  databag: Databag = {};
  obj: any = {databagId: 123};

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private databagService: DatabagService
  ) {
    this.databag = dialogRef.componentInstance.data.databag;
  }

  onSubmit(): void {
    this.databagService.updateDatabagById(String(this.databag.databagId), this.databag).subscribe(() => this.close());
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
