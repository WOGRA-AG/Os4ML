import {Component, Input} from '@angular/core';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {MatDialog} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../components/dialog-dynamic/dialog-dynamic.component';
import {DatabagSettingComponent} from '../databag-setting/databag-setting.component';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent{

  @Input() databags: Databag[] = [];

  constructor(private dialog: MatDialog) {
  }

  openDatabagSettingDialog(databag: Databag) {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: DatabagSettingComponent, databag},
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      }
    });
  }

}
