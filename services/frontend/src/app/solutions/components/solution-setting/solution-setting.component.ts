import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { PopupDeleteComponent } from '../../../shared/components/organisms/popup-delete/popup-delete.component';
import { SolutionService } from '../../services/solution.service';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { PipelineStatus } from '../../../core/models/pipeline-status';
import { Subject, takeUntil } from 'rxjs';

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
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private solutionService: SolutionService,
    private renderer: Renderer2
  ) {
    this.solution = dialogRef.componentInstance.data.solution;
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
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: { component: PopupDeleteComponent, solution: this.solution },
    });
    deleteDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        if (msg === 'deleted') {
          this.dialogRef.close();
        }
      });
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
