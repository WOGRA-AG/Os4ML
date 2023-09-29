import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../molecules/button/button.component';
import { StatusSpinnerComponent } from '../../molecules/status-spinner/status-spinner.component';
import { NgIf } from '@angular/common';
import { DialogSectionComponent } from '../../molecules/dialog-section/dialog-section.component';
import { DialogHeaderComponent } from '../../molecules/dialog-header/dialog-header.component';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
