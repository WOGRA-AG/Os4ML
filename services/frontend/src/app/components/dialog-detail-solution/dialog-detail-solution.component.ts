import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {Solution} from '../../../../build/openapi/jobmanager';
import {FormControl} from '@angular/forms';
import {DialogDeleteSolutionComponent} from '../dialog-delete-solution/dialog-delete-solution.component';
import {SolutionService} from '../../../../build/openapi/jobmanager/api/solution.service';

@Component({
  selector: 'app-dialog-delete-solution',
  templateUrl: './dialog-detail-solution.component.html',
  styleUrls: ['./dialog-detail-solution.component.scss'],
})
export class DialogDetailSolutionComponent {
  solution: Solution;
  solutionName: string;
  deleting = false;
  solvers = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private solutionService: SolutionService,
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
    this.solutionService.putSolution(oldName, this.solution).subscribe(() => {
      this.dialogRef.close('updated');
    });
  }

  delete() {
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: DialogDeleteSolutionComponent, solution: this.solution}
    });
    deleteDialogRef.afterClosed().subscribe((msg) => {
      if (msg === 'deleted') {
        this.dialogRef.close();
      }
    });
  }
}
