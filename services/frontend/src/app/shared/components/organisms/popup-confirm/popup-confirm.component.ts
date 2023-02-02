import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent implements OnDestroy {
  submitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialogRef<PopupConfirmComponent, boolean>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleKey: string;
      messageKey: string;
      callback: () => Observable<void>;
    }
  ) {
    this.dialog.disableClose = true;
  }

  close(): void {
    this.dialog.close(false);
  }

  submit(): void {
    this.submitting = true;
    this.data
      .callback()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.submitting = false;
        this.dialog.close(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
