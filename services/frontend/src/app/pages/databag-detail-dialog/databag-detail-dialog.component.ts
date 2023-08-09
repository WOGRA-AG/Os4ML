import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Databag } from '../../../../build/openapi/modelmanager';
import { DatabagService } from '../../databags/services/databag.service';
import { Subject, takeUntil } from 'rxjs';
import { PopupConfirmComponent } from 'src/app/shared/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../design/components/atoms/button/button.component';
import { DatabagFieldsComponent } from '../../shared/components/organisms/databag-fields/databag-fields.component';
import { NgClass } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogSectionComponent } from '../../shared/components/molecules/dialog-section/dialog-section.component';
import { FormsModule } from '@angular/forms';
import { DialogHeaderComponent } from '../../shared/components/molecules/dialog-header/dialog-header.component';

@Component({
  selector: 'app-databag-detail-dialog',
  templateUrl: './databag-detail-dialog.component.html',
  styleUrls: ['./databag-detail-dialog..component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MaterialModule,
    FormsModule,
    DialogSectionComponent,
    NgClass,
    DatabagFieldsComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class DatabagDetailDialogComponent implements OnDestroy {
  public databag: Databag = {};

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DatabagDetailDialogComponent, void>,
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
      .updateDatabagById(this.databag.id, this.databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteDatabag(databagId: string): void {
    const deleteDatabag = this.databagService.deleteDatabagById(databagId);
    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'solution.delete.title',
        messageKey: 'solution.delete.confirmation',
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
