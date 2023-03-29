import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { DatabagSettingComponent } from '../databag-setting/databag-setting.component';
import { DatabagListItemComponent } from '../databag-list-item/databag-list-item.component';
import { NgFor } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss'],
  standalone: true,
  imports: [MaterialModule, NgFor, DatabagListItemComponent],
})
export class DatabagListComponent {
  @Input() public databags: Databag[] = [];

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
