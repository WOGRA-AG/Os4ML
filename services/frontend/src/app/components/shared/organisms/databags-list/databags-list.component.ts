import {Component, Input} from '@angular/core';
import {
  SettingDatabagComponent
} from '../setting-databag/setting-databag.component';
import {MatDialog} from '@angular/material/dialog';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag} from '../../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

@Component({
  selector: 'app-shared-databags-list',
  templateUrl: './databags-list.component.html',
  styleUrls: ['./databags-list.component.scss']
})
export class DatabagsListComponent {
  @Input() databags: Databag[] = [];

  constructor(
    public dialog: MatDialog,
    private userFacade: UserFacade,
  ) {
  }

  openDatabagSettingDialog(databag: Databag) {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: SettingDatabagComponent, databag},
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      }
    });
    dialogRef.afterClosed().subscribe(() => {
        this.userFacade.refresh();
      }
    );
  }
}
