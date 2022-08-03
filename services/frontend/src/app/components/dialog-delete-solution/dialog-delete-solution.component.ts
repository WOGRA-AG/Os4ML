import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {JobmanagerService, Solution} from '../../../../build/openapi/jobmanager';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dialog-delete-solution',
  templateUrl: './dialog-delete-solution.component.html',
  styleUrls: ['./dialog-delete-solution.component.scss']
})
export class DialogDeleteSolutionComponent {
  solution: Solution;
  deleting = false;

  constructor(private dialogRef: MatDialogRef<DialogDynamicComponent>, private jobmanagerService: JobmanagerService) {
    this.solution = dialogRef.componentInstance.data.solution;
  }

  onBack(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.deleting = true;
    if (!this.solution || !this.solution.name) {
      this.deleting = false;
      return;
    }
    this.jobmanagerService.deleteSolution(this.solution.name).pipe(
      catchError(err => {
        this.deleting = false;
        return of({});
      })
    ).subscribe(() => {
        this.deleting = false;
        this.dialogRef.close();
      });
  }

  invalidSolution(): boolean {
    return !this.solution || !this.solution.name;
  }

}