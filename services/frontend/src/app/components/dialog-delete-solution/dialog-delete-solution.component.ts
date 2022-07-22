import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {JobmanagerService, Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-dialog-delete-solution',
  templateUrl: './dialog-delete-solution.component.html',
  styleUrls: ['./dialog-delete-solution.component.scss']
})
export class DialogDeleteSolutionComponent {
  solution: Solution;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private jobmanagerService: JobmanagerService) {
    this.solution = dialogRef.componentInstance.data.solution;
  }

  obSubmit(): void {
    if (this.solution.name !== undefined) {
      this.jobmanagerService.deleteSolution(this.solution.name).subscribe(() => {
          this.dialogRef.close();
        }
      );
    }
  }

}
