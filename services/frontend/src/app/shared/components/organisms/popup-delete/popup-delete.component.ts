import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import {
  Databag,
  Solution,
} from '../../../../../../build/openapi/modelmanager';
import { DialogDynamicComponent } from '../../dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from '../../../../databags/services/databag.service';
import { SolutionService } from '../../../../solutions/services/solution.service';

@Component({
  selector: 'app-popup-delete',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.scss'],
})
export class PopupDeleteComponent implements OnDestroy {
  solution: Solution;
  databag: Databag;
  deleting = false;

  destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private databagService: DatabagService,
    private solutionService: SolutionService
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
      this.deleteSolution(this.solution.id);
    } else {
      this.deleteDatabag(this.databag.databagId);
    }
  }

  invalidResource(): boolean {
    const isNotSolution: boolean = !this.solution || !this.solution?.name;
    const isNotDatabag: boolean = !this.databag || !this.databag?.databagId;
    return !(isNotSolution || isNotDatabag);
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  private deleteSolution(solutionId: string | undefined) {
    if (!solutionId) {
      this.deleting = false;
      return;
    }
    this.solutionService
      .deleteSolutionById(solutionId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.deleting = false;
          return of({});
        })
      )
      .subscribe(() => {
        this.deleting = false;
        this.dialogRef.close('deleted');
      });
  }

  private deleteDatabag(databagId: string | undefined) {
    if (!databagId) {
      this.deleting = false;
      return;
    }
    this.databagService
      .deleteDatabagById(databagId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.deleting = false;
          return of({});
        })
      )
      .subscribe(() => {
        this.deleting = false;
        this.dialogRef.close('deleted');
      });
  }
}
