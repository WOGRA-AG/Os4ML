import {Component, Input} from '@angular/core';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {
  SettingSolutionComponent
} from '../setting-solution/setting-solution.component';
import {MatDialog} from '@angular/material/dialog';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Solution} from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-shared-solutions-list',
  templateUrl: './solutions-list.component.html',
  styleUrls: ['./solutions-list.component.scss']
})
export class SolutionsListComponent {
  @Input() solutions: Solution[] = [];
  constructor(
    public dialog: MatDialog,
    private userFacade: UserFacade) {
  }

  openSolutionSettingDialog(solution: Solution) {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: SettingSolutionComponent, solution},
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
