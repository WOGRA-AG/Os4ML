import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatabagSettingComponent } from '../databag-setting/databag-setting.component';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss'],
})
export class DatabagListComponent {
  @Input() databags: Databag[] = [];

  constructor(private dialog: MatDialog) {}

  openDatabagSettingDialog(databag: Databag): void {
    this.dialog.open(DatabagSettingComponent, {
      data: { databag },
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      },
    });
  }
}
