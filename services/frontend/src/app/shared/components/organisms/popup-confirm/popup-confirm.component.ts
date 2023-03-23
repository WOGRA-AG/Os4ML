import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { StatusSpinnerComponent } from '../../molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { DialogSectionComponent } from '../../molecules/dialog-section/dialog-section.component';
import { DialogHeaderComponent } from '../../molecules/dialog-header/dialog-header.component';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    DialogSectionComponent,
    MatDialogModule,
    NgIf,
    StatusSpinnerComponent,
    ButtonComponent,
    TranslateModule,
  ],
})
export class PopupConfirmComponent {
  public submitting = false;

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
