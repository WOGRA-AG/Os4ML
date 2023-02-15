import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../services/databag.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PopupConfirmComponent } from 'src/app/shared/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-databag-setting',
  templateUrl: './databag-setting.component.html',
  styleUrls: ['./databag-setting.component.scss'],
})
export class DatabagSettingComponent implements OnDestroy {
  databag: Databag = {};
  obj: any = { databagId: 123 };

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DatabagSettingComponent, void>,
    private dialog: MatDialog,
    private databagService: DatabagService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      databag: Databag;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.databag = this.data.databag;
  }

  onSubmit(): void {
    this.databagService
      .updateDatabagById(String(this.databag.databagId), this.databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  close(): void {
    this.dialogRef.close();
  }

  delete(): void {
    const deleteDatabag = (): Promise<void> =>
      firstValueFrom(
        this.databagService.deleteDatabagById(this.databag.databagId)
      );

    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'databag.delete.title',
        messageKey: 'databag.delete.confirmation',
        onConfirm: deleteDatabag,
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

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
