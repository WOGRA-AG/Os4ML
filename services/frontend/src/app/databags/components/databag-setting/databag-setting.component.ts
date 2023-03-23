import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../services/databag.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PopupConfirmComponent } from 'src/app/shared/components/organisms/popup-confirm/popup-confirm.component';
import { filter } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { DatabagFieldsComponent } from '../databag-fields/databag-fields.component';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogSectionComponent } from '../../../shared/components/molecules/dialog-section/dialog-section.component';
import { FormsModule } from '@angular/forms';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';

@Component({
  selector: 'app-databag-setting',
  templateUrl: './databag-setting.component.html',
  styleUrls: ['./databag-setting.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MatDialogModule,
    FormsModule,
    DialogSectionComponent,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    DatabagFieldsComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class DatabagSettingComponent implements OnDestroy {
  public databag: Databag = {};

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
      .updateDatabagById(this.databag.id, this.databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  close(): void {
    this.dialogRef.close();
  }

  delete(): void {
    const deleteDatabag = (): Promise<void> =>
      firstValueFrom(this.databagService.deleteDatabagById(this.databag.id));

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
