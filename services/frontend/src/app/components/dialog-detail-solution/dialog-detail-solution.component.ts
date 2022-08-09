import {Component, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {Solution} from '../../../../build/openapi/jobmanager';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialog-delete-solution',
  templateUrl: './dialog-detail-solution.component.html',
  styleUrls: ['./dialog-detail-solution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogDetailSolutionComponent {
  solution: Solution;
  solutionName: string;
  deleting = false;
  solvers = new FormControl('');

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>) {
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
}
