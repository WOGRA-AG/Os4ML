import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../services/databag.service';
import { PopupConfirmComponent } from 'src/app/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../molecules/button/button.component';
import { DatabagFieldsComponent } from '../../organisms/databag-fields/databag-fields.component';
import { NgClass } from '@angular/common';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';
import { DialogSectionComponent } from '../../molecules/dialog-section/dialog-section.component';
import { FormsModule } from '@angular/forms';
import { DialogHeaderComponent } from '../../molecules/dialog-header/dialog-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-databag-detail-dialog',
  templateUrl: './databag-detail-dialog.component.html',
  styleUrls: ['./databag-detail-dialog.component.scss'],
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
export class DatabagDetailDialogComponent {
  public databag: Databag = {};
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
      .pipe(takeUntilDestroyed())
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
        filter(confirm => !!confirm),
        takeUntilDestroyed()
      )
      .subscribe(() => this.dialogRef.close());
  }
}
