import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { StatusSpinnerComponent } from '../../molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
  standalone: true,
  imports: [
    Os4mlDialogTemplateComponent,
    IconButtonComponent,
    MaterialModule,
    NgIf,
    StatusSpinnerComponent,
    NewButtonComponent,
    TranslateModule,
  ],
})
export class PopupConfirmComponent {
  public submitting = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialogRef<PopupConfirmComponent, boolean>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleKey: string;
      messageKey: string;
      onConfirm: Observable<void>;
    }
  ) {}

  close(): void {
    this.dialog.close();
  }

  submit(): void {
    this.submitting = true;
    this.data.onConfirm
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.submitting = false;
        this.dialog.close(true);
      });
  }
}
