import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { StatusSpinnerComponent } from '../../molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { DialogSectionComponent } from '../../molecules/dialog-section/dialog-section.component';
import { DialogHeaderComponent } from '../../molecules/dialog-header/dialog-header.component';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    DialogSectionComponent,
    MaterialModule,
    NgIf,
    StatusSpinnerComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class PopupConfirmComponent implements OnDestroy {
  public submitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialogRef<PopupConfirmComponent, boolean>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleKey: string;
      messageKey: string;
      onConfirm: Observable<void>;
    }
  ) {
    this.dialog.disableClose = true;
  }

  close(): void {
    this.dialog.close();
  }

  submit(): void {
    this.submitting = true;
    this.data.onConfirm.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.submitting = false;
      this.dialog.close(true);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
