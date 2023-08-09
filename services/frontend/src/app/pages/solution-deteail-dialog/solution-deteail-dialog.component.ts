import { Component, OnDestroy, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Solution } from '../../../../build/openapi/modelmanager';
import { SolutionService } from '../../solutions/services/solution.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PopupConfirmComponent } from 'src/app/shared/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../design/components/atoms/button/button.component';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { NgFor, NgIf } from '@angular/common';
import { DialogSectionComponent } from '../../shared/components/molecules/dialog-section/dialog-section.component';
import { FormsModule } from '@angular/forms';
import { DialogHeaderComponent } from '../../shared/components/molecules/dialog-header/dialog-header.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CreatePredictionComponent } from '../dialogs/create-prediction/create-prediction.component';
import { IsSolutionDonePipe } from 'src/app/shared/pipes/is-solution-done.pipe';

@Component({
  selector: 'app-solution-setting',
  templateUrl: './solution-deteail-dialog.component.html',
  styleUrls: ['./solution-deteail-dialog.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    FormsModule,
    DialogSectionComponent,
    NgFor,
    NgIf,
    IconButtonComponent,
    ButtonComponent,
    RouterLink,
    TranslateModule,
    IsSolutionDonePipe,
  ],
})
export class SolutionDeteailDialogComponent implements OnDestroy {
  public solution: Solution;
  public deleting = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SolutionDeteailDialogComponent>,
    private dialog: MatDialog,
    private solutionService: SolutionService,
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

  deleteSolution(solutionId: string): void {
    const deleteSolution = this.solutionService.deleteSolutionById(solutionId);
    const deleteSolutionRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'solution.delete.title',
        messageKey: 'solution.delete.confirmation',
        onConfirm: deleteSolution,
      },
    });
    deleteSolutionRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter(confirm => !!confirm)
      )
      .subscribe(() => this.dialogRef.close());
  }

  delete(): void {
    const deleteSolution = (): Promise<void> =>
      firstValueFrom(this.solutionService.deleteSolutionById(this.solution.id));

    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'solution.delete.title',
        messageKey: 'solution.delete.confirmation',
        onConfirm: deleteSolution,
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

  createPrediction(): void {
    this.dialog.open(CreatePredictionComponent, {
      data: {
        solution: this.solution,
      },
    });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  downloadModel(downloadLink: HTMLAnchorElement): void {
    this.solutionService
      .getModelGetUlr(this.solution.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }
}
