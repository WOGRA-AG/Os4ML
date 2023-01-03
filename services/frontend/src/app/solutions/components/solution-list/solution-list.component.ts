import {Component, Input} from '@angular/core';
import {Solution} from '../../../../../build/openapi/modelmanager';
import {MatDialog} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../components/dialog-dynamic/dialog-dynamic.component';
import {
  SettingSolutionComponent
} from '../../../components/shared/organisms/setting-solution/setting-solution.component';

@Component({
  selector: 'app-solution-list',
  templateUrl: './solution-list.component.html',
  styleUrls: ['./solution-list.component.scss']
})
export class SolutionListComponent {
  @Input() solutions: Solution[] = [];
  constructor(
    public dialog: MatDialog) {
  }

  openSolutionSettingDialog(solution: Solution) {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: SettingSolutionComponent, solution},
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      }
    });
  }
}
