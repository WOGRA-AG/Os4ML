import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { PopupDeleteComponent } from '../../../shared/components/organisms/popup-delete/popup-delete.component';
import { DatabagService } from '../../services/databag.service';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-databag-setting',
  templateUrl: './databag-setting.component.html',
  styleUrls: ['./databag-setting.component.scss'],
})
export class DatabagSettingComponent implements OnDestroy {
  databag: Databag = {};
  obj: any = { databagId: 123 };

  destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DialogDynamicComponent>,
    private dialog: MatDialog,
    private databagService: DatabagService
  ) {
    this.databag = dialogRef.componentInstance.data.databag;
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
    const deleteDialogRef = this.dialog.open(DialogDynamicComponent, {
      data: { component: PopupDeleteComponent, databag: this.databag },
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

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
