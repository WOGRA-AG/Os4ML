import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent {
  submitting = false;

  constructor(
    private dialog: MatDialogRef<PopupConfirmComponent, boolean>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleKey: string;
      messageKey: string;
      onConfirm: () => Promise<void>;
    }
  ) {
    this.dialog.disableClose = true;
  }

  close(): void {
    this.dialog.close(false);
  }

  submit(): void {
    this.submitting = true;
    this.data.onConfirm().then(() => {
      this.submitting = false;
      this.dialog.close(true);
    });
  }
}
