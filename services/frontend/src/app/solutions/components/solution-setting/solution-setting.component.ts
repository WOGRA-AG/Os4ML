import { Component, OnDestroy, Renderer2, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { SolutionService } from '../../services/solution.service';
import { PipelineStatus } from '../../../core/models/pipeline-status';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PopupConfirmComponent } from 'src/app/shared/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-solution-setting',
  templateUrl: './solution-setting.component.html',
  styleUrls: ['./solution-setting.component.scss'],
})
export class SolutionSettingComponent implements OnDestroy {
  solution: Solution;
  deleting = false;
  readonly pipelineStatus = PipelineStatus;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SolutionSettingComponent>,
    private dialog: MatDialog,
    private solutionService: SolutionService,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      solution: Solution;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.solution = this.data.solution;
  }

  close(): void {
    this.dialogRef.close();
  }

  update(): void {
    if (!this.solution.id) {
      this.dialogRef.close('aborted');
      return;
    }
    this.solutionService
      .updateSolutionById(this.solution.id, this.solution)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dialogRef.close('updated');
      });
  }

  delete(): void {
    const deleteSolution = (): Observable<void> =>
      this.solutionService.deleteSolutionById(this.solution.id);

    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'solution.delete.title',
        messageKey: 'solution.delete.confirmation',
        callback: deleteSolution,
      },
    });
    deleteDialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter(confirm => !!confirm)
      )
      .subscribe(() => this.dialogRef.close());
  }

  download(): void {
    if (this.solution.id) {
      this.solutionService
        .downloadModel(this.solution.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(url => {
          const link = this.renderer.createElement('a');
          link.target = '_blank';
          link.href = url;
          link.dowload = 'model.zip';
          link.click();
          link.remove();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
