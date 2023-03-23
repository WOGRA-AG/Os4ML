import { Component, Input } from '@angular/core';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { SolutionSettingComponent } from '../solution-setting/solution-setting.component';
import { SolutionListItemComponent } from '../solution-list-item/solution-list-item.component';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-solution-list',
  templateUrl: './solution-list.component.html',
  styleUrls: ['./solution-list.component.scss'],
  standalone: true,
  imports: [MatListModule, NgFor, SolutionListItemComponent],
})
export class SolutionListComponent {
  @Input() public solutions: Solution[] = [];
  constructor(private dialog: MatDialog) {}

  openSolutionSettingDialog(solution: Solution): void {
    this.dialog.open(SolutionSettingComponent, {
      data: { solution },
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      },
    });
  }
}
