import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {JobmanagerService, Solution} from '../../../../../../build/openapi/jobmanager';
import { catchError, of } from 'rxjs';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';

@Component({
  selector: 'app-shared-popup-delete',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.scss']
})
export class PopupDeleteComponent {
  solution: Solution;
  databag: Databag;
  deleting = false;

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private jobmanagerService: JobmanagerService,
    private objectstoreService: ObjectstoreService,
  ) {
    this.solution = dialogRef.componentInstance.data.solution;
    this.databag = dialogRef.componentInstance.data.databag;
  }

  close(): void {
    this.dialogRef.close('cancel');
  }

  onSubmit(): void {
    this.deleting = true;
    if (!(this.solution || this.databag)) {
      this.deleting = false;
      return;
    }
    if (this.solution) {
      this.deleteSolution(this.solution.name);
    } else {
      this.deleteDatabag(this.databag.databagId);
    }
  }

  invalidResource(): boolean {
    const isNotSolution: boolean = !this.solution || !this.solution?.name;
    const isNotDatabag: boolean = !this.databag || !this.databag?.databagId;
    return !(isNotSolution || isNotDatabag);
  }

  private deleteSolution(solutionName: string | undefined) {
    if (!solutionName) {
      this.deleting = false;
      return;
    }
    this.jobmanagerService.deleteSolution(solutionName).pipe(
      catchError(err => {
        this.deleting = false;
        return of({});
      })
    ).subscribe(() => {
      this.deleting = false;
      this.dialogRef.close('deleted');
    });
  }

  private deleteDatabag(databagId: string | undefined) {
    if (!databagId) {
      this.deleting = false;
      return;
    }
    this.objectstoreService.deleteDatabag(databagId).pipe(
      catchError(err => {
        this.deleting = false;
        return of({});
      })
    ).subscribe(() => {
      this.deleting = false;
      this.dialogRef.close('deleted');
    });
  }
}
