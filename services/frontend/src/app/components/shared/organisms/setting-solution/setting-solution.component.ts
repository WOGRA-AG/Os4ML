import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {JobmanagerService, Solution} from '../../../../../../build/openapi/jobmanager';
import {PopupDeleteComponent} from '../popup-delete/popup-delete.component';

@Component({
  selector: 'app-shared-setting-solution',
  templateUrl: './setting-solution.component.html',
  styleUrls: ['./setting-solution.component.scss']
})
export class SettingSolutionComponent {
  solution: Solution;
  solutionName: string;
  deleting = false;

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private jobmanagerService: JobmanagerService,
    ) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.solutionName = this.trimSolutionName(this.solution.name);
  }

  trimSolutionName(name: string | undefined): string {
    if (!name) {
      return '';
    }
    const uuidIndex = name.indexOf('_');
    return name.substring(uuidIndex + 1);
  }

  close(): void {
    this.dialogRef.close();
  }

  update() {
    const oldName: string = this.solution.name || '';
    this.solution.name = oldName.replace(this.trimSolutionName(oldName), this.solutionName);
    this.jobmanagerService.putSolution(oldName, this.solution).subscribe(() => {
      this.dialogRef.close('updated');
    });
  }

  delete() {
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupDeleteComponent, solution: this.solution}
    });
    deleteDialogRef.afterClosed().subscribe((msg) => {
      if (msg === 'deleted') {
        this.dialogRef.close();
      }
    });
  }
}
